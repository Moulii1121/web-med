import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, 
  Sliders, 
  HelpCircle, 
  RefreshCw, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface FlexibleNumericInputProps {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  className?: string;
  textColorClass?: string;
}

const FlexibleNumericInput: React.FC<FlexibleNumericInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  className = "w-16 px-1.5 py-0.5 rounded text-right font-mono text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500",
  textColorClass = "text-teal-600 dark:text-teal-400"
}) => {
  const [text, setText] = useState<string>(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && raw.trim() !== '') {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    let parsed = parseFloat(text);
    if (isNaN(parsed)) {
      parsed = value;
    } else {
      parsed = Math.max(min, Math.min(max, parsed));
    }
    setText(String(parsed));
    onChange(parsed);
  };

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`${className} ${textColorClass}`}
      />
      <span className="text-[11px] text-slate-500 font-mono">{unit}</span>
    </div>
  );
};

export const SimulationLab: React.FC = () => {
  const [activeSim, setActiveSim] = useState<'cardiac' | 'ppv'>('cardiac');

  // --- 1. Cardiac Output / PV Loop State ---
  const [preload, setPreload] = useState<number>(120); // EDV in mL (50 - 200)
  const [afterload, setAfterload] = useState<number>(1200); // SVR in dynes*s/cm5 (600 - 2400)
  const [contractility, setContractility] = useState<number>(1.0); // Inotropy (0.5 - 2.2)
  const [heartRate, setHeartRate] = useState<number>(75); // bpm (40 - 180)

  // Pure physiology calculations
  const cardiacCalculations = useMemo(() => {
    // ESV depends on afterload and contractility (Ees slope)
    // Higher contractility lowers ESV; higher afterload raises ESV
    const baselineEes = 2.0; // mmHg/mL
    const effectiveEes = baselineEes * contractility;
    const estAorticPressure = (afterload / 1200) * 80;
    
    // ESV approx
    const esv = Math.max(20, Math.min(preload - 15, Math.round(estAorticPressure / effectiveEes + 25)));
    const strokeVolume = Math.max(10, preload - esv);
    const ejectionFraction = Math.min(95, Math.max(10, Math.round((strokeVolume / preload) * 100)));
    const cardiacOutput = ((strokeVolume * heartRate) / 1000).toFixed(2);
    const map = Math.round((parseFloat(cardiacOutput) * (afterload / 80)) / 10);

    return {
      edv: preload,
      esv,
      strokeVolume,
      ejectionFraction,
      cardiacOutput,
      map
    };
  }, [preload, afterload, contractility, heartRate]);

  // --- 2. Sensitivity / Specificity / PPV State ---
  const [prevalence, setPrevalence] = useState<number>(2.0); // % prevalence (0.1 - 40)
  const [sensitivity, setSensitivity] = useState<number>(95); // % (60 - 99.9)
  const [specificity, setSpecificity] = useState<number>(95); // % (60 - 99.9)
  const totalPopulation = 10000;

  const ppvCalculations = useMemo(() => {
    const diseased = Math.round((prevalence / 100) * totalPopulation);
    const nonDiseased = totalPopulation - diseased;

    const truePositives = Math.round((sensitivity / 100) * diseased);
    const falseNegatives = diseased - truePositives;

    const trueNegatives = Math.round((specificity / 100) * nonDiseased);
    const falsePositives = nonDiseased - trueNegatives;

    const totalTestPositive = truePositives + falsePositives;
    const totalTestNegative = trueNegatives + falseNegatives;

    const ppv = totalTestPositive > 0 
      ? ((truePositives / totalTestPositive) * 100).toFixed(1)
      : '0.0';
    const npv = totalTestNegative > 0
      ? ((trueNegatives / totalTestNegative) * 100).toFixed(1)
      : '0.0';

    return {
      diseased,
      nonDiseased,
      truePositives,
      falsePositives,
      falseNegatives,
      trueNegatives,
      totalTestPositive,
      totalTestNegative,
      ppv,
      npv
    };
  }, [prevalence, sensitivity, specificity]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8 transition-colors">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wide">
              Module C: Simulation Lab
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Pure Functional Physiology Models
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
            Biomedical Parameter Sandbox
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Push physiological variables to their extremes to observe clinical compensation and failure modes.
          </p>
        </div>

        {/* Sim Selector Tabs */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveSim('cardiac')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSim === 'cardiac'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-teal-500" />
            <span>1. Hemodynamics & PV Loop</span>
          </button>
          
          <button
            onClick={() => setActiveSim('ppv')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSim === 'ppv'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            <span>2. Diagnostic PPV & Prevalence</span>
          </button>
        </div>
      </div>

      {/* --- SIMULATION 1: CARDIAC PV LOOP & HEMODYNAMICS --- */}
      {activeSim === 'cardiac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-teal-600" />
                Hemodynamic Parameters
              </h3>
              <button
                onClick={() => {
                  setPreload(120);
                  setAfterload(1200);
                  setContractility(1.0);
                  setHeartRate(75);
                }}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Normal
              </button>
            </div>

            {/* Preload Input & Slider */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Preload (End-Diastolic Volume - EDV)
                </span>
                <FlexibleNumericInput
                  value={preload}
                  onChange={setPreload}
                  min={40}
                  max={250}
                  step={5}
                  unit="mL"
                />
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={preload}
                onChange={(e) => setPreload(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50 mL (Hypovolemia)</span>
                <span>120 mL (Normal)</span>
                <span>200 mL (Fluid Overload)</span>
              </div>
            </div>

            {/* Afterload Input & Slider */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Afterload (Systemic Vascular Resistance - SVR)
                </span>
                <FlexibleNumericInput
                  value={afterload}
                  onChange={setAfterload}
                  min={400}
                  max={3000}
                  step={50}
                  unit="dyn"
                  className="w-20 px-1.5 py-0.5 rounded text-right font-mono text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <input
                type="range"
                min="600"
                max="2400"
                step="50"
                value={afterload}
                onChange={(e) => setAfterload(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>600 (Distributive Shock)</span>
                <span>1200 (Normal)</span>
                <span>2400 (Hypertensive Crisis)</span>
              </div>
            </div>

            {/* Contractility Input & Slider */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Inotropy (Contractility factor)
                </span>
                <FlexibleNumericInput
                  value={contractility}
                  onChange={setContractility}
                  min={0.3}
                  max={3.0}
                  step={0.1}
                  unit="x"
                />
              </div>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.1"
                value={contractility}
                onChange={(e) => setContractility(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.5x (Cardiogenic Shock)</span>
                <span>1.0x (Normal)</span>
                <span>2.2x (Dobutamine / Stress)</span>
              </div>
            </div>

            {/* Heart Rate Input & Slider */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Heart Rate (HR)
                </span>
                <FlexibleNumericInput
                  value={heartRate}
                  onChange={setHeartRate}
                  min={30}
                  max={220}
                  step={1}
                  unit="bpm"
                />
              </div>
              <input
                type="range"
                min="40"
                max="180"
                step="5"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>40 bpm (Bradycardia)</span>
                <span>75 bpm (Normal)</span>
                <span>180 bpm (Tachycardia / SVT)</span>
              </div>
            </div>
          </div>

          {/* Visualization & Live Output (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Live Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded-xl border border-teal-200 dark:border-teal-800">
                <div className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase">
                  Stroke Volume (SV)
                </div>
                <div className="text-xl font-bold font-mono text-teal-700 dark:text-teal-200">
                  {cardiacCalculations.strokeVolume} <span className="text-xs font-normal">mL</span>
                </div>
                <div className="text-[10px] text-teal-600 dark:text-teal-400">EDV - ESV</div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                  Cardiac Output (CO)
                </div>
                <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-200">
                  {cardiacCalculations.cardiacOutput} <span className="text-xs font-normal">L/min</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">SV × HR / 1000</div>
              </div>

              <div className="bg-cyan-50 dark:bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <div className="text-[10px] font-bold text-cyan-800 dark:text-cyan-300 uppercase">
                  Ejection Fraction (EF)
                </div>
                <div className="text-xl font-bold font-mono text-cyan-700 dark:text-cyan-200">
                  {cardiacCalculations.ejectionFraction}%
                </div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400">
                  {cardiacCalculations.ejectionFraction < 50 ? 'Reduced (<50%)' : 'Preserved (≥50%)'}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                  Est. MAP
                </div>
                <div className="text-xl font-bold font-mono text-amber-700 dark:text-amber-200">
                  {cardiacCalculations.map} <span className="text-xs font-normal">mmHg</span>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400">CO × SVR / 80</div>
              </div>
            </div>

            {/* SVG Interactive Pressure-Volume Loop Diagram */}
            <div className="bg-slate-900 text-white p-4 rounded-xl relative overflow-hidden border border-slate-700 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-semibold text-teal-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  Left Ventricular Pressure-Volume (PV) Loop
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Area inside loop = Stroke Work
                </span>
              </div>

              {/* Dynamic SVG Loop */}
              <div className="h-48 w-full flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="40" y2="170" stroke="#334155" strokeWidth="1" />
                  <line x1="40" y1="170" x2="380" y2="170" stroke="#334155" strokeWidth="1" />

                  {/* Y Axis Labels (Pressure mmHg) */}
                  <text x="5" y="30" fill="#94a3b8" fontSize="10">160</text>
                  <text x="15" y="90" fill="#94a3b8" fontSize="10">80</text>
                  <text x="25" y="170" fill="#94a3b8" fontSize="10">0</text>
                  <text x="5" y="105" fill="#64748b" fontSize="8" transform="rotate(-90 15,105)">LV Pressure (mmHg)</text>

                  {/* X Axis Labels (Volume mL) */}
                  <text x="40" y="185" fill="#94a3b8" fontSize="10">0</text>
                  <text x="190" y="185" fill="#94a3b8" fontSize="10">100</text>
                  <text x="350" y="185" fill="#94a3b8" fontSize="10">200</text>
                  <text x="180" y="198" fill="#64748b" fontSize="8">LV Volume (mL)</text>

                  {/* Dynamic PV Loop coordinates */}
                  {/* Mapping: x = 40 + (vol / 200) * 330 */}
                  {/* Mapping: y = 170 - (press / 180) * 140 */}
                  {(() => {
                    const xESV = 40 + (cardiacCalculations.esv / 200) * 330;
                    const xEDV = 40 + (cardiacCalculations.edv / 200) * 330;
                    const yDiastolic = 170 - (10 / 180) * 140; // 10 mmHg
                    const yPeak = 170 - (Math.min(170, cardiacCalculations.map * 1.3) / 180) * 140;
                    const yOpening = 170 - (Math.min(150, (afterload / 1200) * 75) / 180) * 140;

                    return (
                      <g>
                        {/* Shaded Area (Stroke Work) */}
                        <path
                          d={`M ${xEDV} ${yDiastolic} 
                             L ${xEDV} ${yOpening} 
                             Q ${xEDV * 0.9} ${yPeak} ${(xEDV + xESV) / 2} ${yPeak} 
                             L ${xESV} ${yOpening + 15} 
                             L ${xESV} ${yDiastolic} 
                             Z`}
                          fill="rgba(15, 163, 163, 0.25)"
                          stroke="#3DD6D0"
                          strokeWidth="2.5"
                        />

                        {/* Four Valve Points */}
                        {/* Point A: Mitral Valve Closes (End Diastole) */}
                        <circle cx={xEDV} cy={yDiastolic} r="4" fill="#3DD6D0" />
                        <text x={xEDV - 15} y={yDiastolic + 15} fill="#3DD6D0" fontSize="8">EDV ({cardiacCalculations.edv})</text>

                        {/* Point B: Aortic Valve Opens */}
                        <circle cx={xEDV} cy={yOpening} r="3" fill="#F2C14E" />

                        {/* Point C: Aortic Valve Closes (End Systole) */}
                        <circle cx={xESV} cy={yOpening + 15} r="4" fill="#FF8A7D" />
                        <text x={xESV - 25} y={yOpening + 8} fill="#FF8A7D" fontSize="8">ESV ({cardiacCalculations.esv})</text>

                        {/* Point D: Mitral Valve Opens */}
                        <circle cx={xESV} cy={yDiastolic} r="3" fill="#9FB2C9" />

                        {/* Stroke volume double-ended arrow */}
                        <line x1={xESV} y1="155" x2={xEDV} y2="155" stroke="#F2C14E" strokeWidth="1.5" strokeDasharray="2" />
                        <text x={(xESV + xEDV) / 2 - 25} y="150" fill="#F2C14E" fontSize="9" fontWeight="bold">
                          SV: {cardiacCalculations.strokeVolume} mL
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Explanatory Clinical Insight */}
              <div className="mt-3 text-xs text-slate-300 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <span className="font-bold text-teal-400">Physiology Correlate: </span>
                {preload > 160 && 'High preload stretches myocytes, increasing stroke volume via the Frank-Starling mechanism until sarcomere overstretching occurs.'}
                {afterload > 1800 && 'High afterload impedes ejection, shifting the left border to the right (higher ESV) and diminishing stroke volume.'}
                {contractility < 0.8 && 'Decreased inotropy flattens the ESPVR slope, lowering ejection fraction and precipitating congestive backup.'}
                {preload <= 160 && afterload <= 1800 && contractility >= 0.8 && 'Balanced hemodynamics maintain optimal stroke work and stable cardiac output with physiological ejection fraction.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SIMULATION 2: DIAGNOSTIC PPV & BASE RATE FALLACY --- */}
      {activeSim === 'ppv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-600" />
                Bayesian Epidemic Parameters
              </h3>
              <span className="text-xs font-mono text-slate-500">Cohort: 10,000</span>
            </div>

            {/* Prevalence Input & Slider */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-800/50">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-amber-900 dark:text-amber-300">
                  Prevalence in Cohort (10,000)
                </span>
                <FlexibleNumericInput
                  value={prevalence}
                  onChange={setPrevalence}
                  min={0.01}
                  max={50.0}
                  step={0.1}
                  unit="%"
                  textColorClass="text-amber-700 dark:text-amber-400"
                />
              </div>
              <input
                type="range"
                min="0.1"
                max="25.0"
                step="0.1"
                value={prevalence}
                onChange={(e) => setPrevalence(Number(e.target.value))}
                className="w-full accent-amber-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.1% (Rare Disease)</span>
                <span>2.0% (Screening)</span>
                <span>25% (High-Risk Clinic)</span>
              </div>
            </div>

            {/* Sensitivity Input & Slider */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Sensitivity (True Positive Rate)
                </span>
                <FlexibleNumericInput
                  value={sensitivity}
                  onChange={setSensitivity}
                  min={30}
                  max={99.9}
                  step={0.1}
                  unit="%"
                />
              </div>
              <input
                type="range"
                min="60"
                max="99.9"
                step="0.5"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>60% (Poor SnNOut)</span>
                <span>95% (High Quality)</span>
                <span>99.9% (Near Perfect)</span>
              </div>
            </div>

            {/* Specificity Input & Slider */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Specificity (True Negative Rate)
                </span>
                <FlexibleNumericInput
                  value={specificity}
                  onChange={setSpecificity}
                  min={30}
                  max={99.9}
                  step={0.1}
                  unit="%"
                  textColorClass="text-cyan-600 dark:text-cyan-400"
                />
              </div>
              <input
                type="range"
                min="60"
                max="99.9"
                step="0.5"
                value={specificity}
                onChange={(e) => setSpecificity(Number(e.target.value))}
                className="w-full accent-cyan-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>60% (High False +)</span>
                <span>95% (Standard)</span>
                <span>99.9% (Minimal False +)</span>
              </div>
            </div>

            {/* Clinical Rule Formula Callout */}
            <div className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono">
              <div className="text-slate-700 dark:text-slate-300 font-bold">Equations:</div>
              <div>PPV = TP / (TP + FP) = {ppvCalculations.truePositives} / {ppvCalculations.totalTestPositive}</div>
              <div>NPV = TN / (TN + FN) = {ppvCalculations.trueNegatives} / {ppvCalculations.totalTestNegative}</div>
            </div>
          </div>

          {/* 2x2 Contingency Table & Live Outcome */}
          <div className="lg:col-span-7 space-y-4">
            {/* Key Findings Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-xl">
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">
                  Positive Predictive Value (PPV)
                </div>
                <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-200 mt-0.5">
                  {ppvCalculations.ppv}%
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  Probability a positive patient truly has the disease.
                </p>
              </div>

              <div className="bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 p-3.5 rounded-xl">
                <div className="text-xs font-semibold text-cyan-800 dark:text-cyan-300 uppercase">
                  Negative Predictive Value (NPV)
                </div>
                <div className="text-2xl font-black font-mono text-cyan-700 dark:text-cyan-200 mt-0.5">
                  {ppvCalculations.npv}%
                </div>
                <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1">
                  Probability a negative test truly excludes the disease.
                </p>
              </div>
            </div>

            {/* 2x2 Contingency Matrix */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <th className="p-2 border border-slate-200 dark:border-slate-700 text-left">Test \ Disease</th>
                    <th className="p-2 border border-slate-200 dark:border-slate-700 text-center text-rose-600 dark:text-rose-400">
                      Disease Present ({ppvCalculations.diseased})
                    </th>
                    <th className="p-2 border border-slate-200 dark:border-slate-700 text-center text-teal-600 dark:text-teal-400">
                      Disease Absent ({ppvCalculations.nonDiseased})
                    </th>
                    <th className="p-2 border border-slate-200 dark:border-slate-700 text-center font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr>
                    <td className="p-2 font-semibold bg-slate-50 dark:bg-slate-850">Test Positive (+)</td>
                    <td className="p-2 text-center bg-emerald-50 dark:bg-emerald-950/30 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      TP: {ppvCalculations.truePositives}
                    </td>
                    <td className="p-2 text-center bg-rose-50 dark:bg-rose-950/30 font-mono font-bold text-rose-600 dark:text-rose-300">
                      FP: {ppvCalculations.falsePositives}
                    </td>
                    <td className="p-2 text-center font-mono font-bold">{ppvCalculations.totalTestPositive}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold bg-slate-50 dark:bg-slate-850">Test Negative (-)</td>
                    <td className="p-2 text-center bg-rose-50 dark:bg-rose-950/30 font-mono font-bold text-rose-600 dark:text-rose-300">
                      FN: {ppvCalculations.falseNegatives}
                    </td>
                    <td className="p-2 text-center bg-emerald-50 dark:bg-emerald-950/30 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      TN: {ppvCalculations.trueNegatives}
                    </td>
                    <td className="p-2 text-center font-mono font-bold">{ppvCalculations.totalTestNegative}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* High-Yield Teaching Box: Base Rate Fallacy */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold">USMLE Step 1 / Biostatistics High-Yield Rule: </span>
                Even with a 95% sensitive and 95% specific test, when disease prevalence is low (e.g. 1%), the vast majority of positive tests are FALSE POSITIVES (PPV ≈ 16%). 
                <span className="font-semibold block mt-1">
                  Takeaway: Sensitivity and Specificity are fixed test properties, but PPV rises directly with Prevalence!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
