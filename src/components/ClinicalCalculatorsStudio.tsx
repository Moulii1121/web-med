import React, { useState } from 'react';
import { 
  Calculator, 
  Activity, 
  Heart, 
  ShieldAlert, 
  Brain, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Pill,
  Award
} from 'lucide-react';

export type CalculatorCategory = 'acute' | 'organ' | 'mental' | 'general';

export const ClinicalCalculatorsStudio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CalculatorCategory>('acute');
  const [selectedToolId, setSelectedToolId] = useState<string>('curb65');

  // CURB-65 State
  const [curbC, setCurbC] = useState<boolean>(false); // Confusion
  const [curbU, setCurbU] = useState<boolean>(false); // Urea > 7 mmol/L (BUN > 19)
  const [curbR, setCurbR] = useState<boolean>(false); // Resp Rate >= 30
  const [curbB, setCurbB] = useState<boolean>(false); // SBP < 90 or DBP <= 60
  const [curb65, setCurb65] = useState<boolean>(false); // Age >= 65

  // qSOFA State
  const [qsofaRR, setQsofaRR] = useState<boolean>(false); // RR >= 22
  const [qsofaAMS, setQsofaAMS] = useState<boolean>(false); // Altered mentation (GCS < 15)
  const [qsofaSBP, setQsofaSBP] = useState<boolean>(false); // SBP <= 100 mmHg

  // Wells DVT State
  const [wellsCancer, setWellsCancer] = useState<boolean>(false);
  const [wellsParesis, setWellsParesis] = useState<boolean>(false);
  const [wellsBedridden, setWellsBedridden] = useState<boolean>(false);
  const [wellsTenderness, setWellsTenderness] = useState<boolean>(false);
  const [wellsEntireLeg, setWellsEntireLeg] = useState<boolean>(false);
  const [wellsCalfSwelling, setWellsCalfSwelling] = useState<boolean>(false);
  const [wellsPittingEdema, setWellsPittingEdema] = useState<boolean>(false);
  const [wellsCollateralVeins, setWellsCollateralVeins] = useState<boolean>(false);
  const [wellsAlternativeLikely, setWellsAlternativeLikely] = useState<boolean>(false);

  // CHA2DS2-VASc State
  const [chaCHF, setChaCHF] = useState<boolean>(false);
  const [chaHTN, setChaHTN] = useState<boolean>(false);
  const [chaAge, setChaAge] = useState<number>(60);
  const [chaDM, setChaDM] = useState<boolean>(false);
  const [chaStroke, setChaStroke] = useState<boolean>(false);
  const [chaVascular, setChaVascular] = useState<boolean>(false);
  const [chaFemale, setChaFemale] = useState<boolean>(false);

  // eGFR CKD-EPI 2021 State
  const [egfrCr, setEgfrCr] = useState<number>(1.0);
  const [egfrAge, setEgfrAge] = useState<number>(55);
  const [egfrFemale, setEgfrFemale] = useState<boolean>(false);

  // Calculations
  const curbScore = (curbC ? 1 : 0) + (curbU ? 1 : 0) + (curbR ? 1 : 0) + (curbB ? 1 : 0) + (curb65 ? 1 : 0);
  const qsofaScore = (qsofaRR ? 1 : 0) + (qsofaAMS ? 1 : 0) + (qsofaSBP ? 1 : 0);

  const wellsScore = (wellsCancer ? 1 : 0) +
                     (wellsParesis ? 1 : 0) +
                     (wellsBedridden ? 1 : 0) +
                     (wellsTenderness ? 1 : 0) +
                     (wellsEntireLeg ? 1 : 0) +
                     (wellsCalfSwelling ? 1 : 0) +
                     (wellsPittingEdema ? 1 : 0) +
                     (wellsCollateralVeins ? 1 : 0) -
                     (wellsAlternativeLikely ? 2 : 0);

  let chaScore = (chaCHF ? 1 : 0) + (chaHTN ? 1 : 0) + (chaDM ? 1 : 0) + (chaVascular ? 1 : 0) + (chaFemale ? 1 : 0);
  if (chaAge >= 75) chaScore += 2;
  else if (chaAge >= 65) chaScore += 1;
  if (chaStroke) chaScore += 2;

  // CKD-EPI formula calculation (2021 ref)
  const calcEgfr = () => {
    const scr = egfrCr || 1.0;
    const kappa = egfrFemale ? 0.7 : 0.9;
    const alpha = egfrFemale ? -0.241 : -0.302;
    const minRatio = Math.min(scr / kappa, 1);
    const maxRatio = Math.max(scr / kappa, 1);
    const genderMult = egfrFemale ? 1.012 : 1.0;
    const val = 142 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.200) * Math.pow(0.9938, egfrAge) * genderMult;
    return Math.round(val);
  };

  const toolsList = [
    {
      id: 'curb65',
      name: 'CURB-65 Pneumonia Severity Score',
      category: 'acute',
      indication: 'Community-Acquired Pneumonia in Emergency or Ambulatory setting',
      whenToUse: 'Adults with radiologically confirmed community-acquired pneumonia to guide outpatient vs inpatient vs ICU admission.',
      whenNotToUse: 'Do not use for hospital-acquired pneumonia, aspiration pneumonia, or immunosuppressed patients (neutropenic/HIV).',
      evidenceRef: 'Lim WS et al. Thorax 2003;58:377-382 (BTS Guidelines) & NICE Guidelines CG191'
    },
    {
      id: 'qsofa',
      name: 'qSOFA (Quick SOFA) for Sepsis',
      category: 'acute',
      indication: 'Suspected bacterial or viral infection with risk of in-hospital deterioration',
      whenToUse: 'Bedside screening outside the ICU for adults with suspected infection at high risk of poor clinical outcome.',
      whenNotToUse: 'Not a definitive diagnostic criterion for sepsis; should prompt full SOFA evaluation and lactate testing.',
      evidenceRef: 'Singer M et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA 2016'
    },
    {
      id: 'wells',
      name: 'Wells Criteria for Deep Vein Thrombosis (DVT)',
      category: 'acute',
      indication: 'Adults with unilateral swollen, painful, or tender lower extremity',
      whenToUse: 'Calculate pre-test probability before ordering D-Dimer or duplex ultrasound.',
      whenNotToUse: 'Do not use in recurrent DVT without previous baseline duplex or in active pregnancy without modified protocols.',
      evidenceRef: 'Wells PS et al. Evaluation of D-dimer in the diagnosis of suspected deep-vein thrombosis. N Engl J Med 2003'
    },
    {
      id: 'cha2ds2',
      name: 'CHA₂DS₂-VASc Score for Atrial Fibrillation Stroke Risk',
      category: 'organ',
      indication: 'Non-valvular atrial fibrillation or atrial flutter',
      whenToUse: 'Stratify annual thromboembolic stroke risk and determine indications for oral anticoagulation (DOAC / Warfarin).',
      whenNotToUse: 'Not applicable to moderate-to-severe mitral stenosis or mechanical prosthetic heart valves (which mandate warfarin regardless).',
      evidenceRef: 'Lip GY et al. Refining clinical risk stratification in atrial fibrillation. Chest 2010; ESC 2020 Guidelines'
    },
    {
      id: 'egfr',
      name: 'eGFR (CKD-EPI 2021 Race-Free Creatinine Equation)',
      category: 'organ',
      indication: 'Kidney function assessment & CKD staging',
      whenToUse: 'Stable outpatients for staging Chronic Kidney Disease and adjusting renal-cleared drug dosages.',
      whenNotToUse: 'Inaccurate in acute kidney injury (rapidly fluctuating creatinine), extreme muscle mass (amputees, bodybuilders), or pregnancy.',
      evidenceRef: 'Inker LA et al. New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race. N Engl J Med 2021'
    }
  ];

  const activeTool = toolsList.find(t => t.id === selectedToolId) || toolsList[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-teal-600" />
              <span>Evidence-Based Clinical Calculators</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Open-Access Validated Scoring Systems
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif-medical text-slate-900 dark:text-white">
            Clinical Decision Support & Risk Stratification
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mt-0.5">
            Well-validated formulas with explicit "When to Use" and "When NOT to Use" guidance, live point calculation, interpretation tiers, and medical literature provenance.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {(['acute', 'organ'] as CalculatorCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat === 'acute' ? '1. Acute Care & Sepsis' : '2. Organ Function & Stroke'}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs no-scrollbar">
        {toolsList.filter(t => t.category === activeCategory).map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedToolId(tool.id)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 cursor-pointer border ${
              selectedToolId === tool.id
                ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-300 shadow-2xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400'
            }`}
          >
            {tool.name.split('(')[0]}
          </button>
        ))}
      </div>

      {/* Active Calculator Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Criteria Form */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-serif-medical">
              {activeTool.name}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold uppercase">
              Interactive Form
            </span>
          </div>

          {/* CURB-65 Inputs */}
          {selectedToolId === 'curb65' && (
            <div className="space-y-2.5 text-xs">
              {[
                { label: 'C - Confusion (AMTS <= 8 or new disorientation to person/place/time)', checked: curbC, setChecked: setCurbC },
                { label: 'U - Blood Urea Nitrogen > 19 mg/dL (> 7 mmol/L)', checked: curbU, setChecked: setCurbU },
                { label: 'R - Respiratory Rate >= 30 breaths/min', checked: curbR, setChecked: setCurbR },
                { label: 'B - Blood Pressure: SBP < 90 mmHg OR DBP <= 60 mmHg', checked: curbB, setChecked: setCurbB },
                { label: '65 - Age >= 65 years', checked: curb65, setChecked: setCurb65 }
              ].map((item, idx) => (
                <label key={idx} className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-teal-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.setChecked(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* qSOFA Inputs */}
          {selectedToolId === 'qsofa' && (
            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Tachypnea: Respiratory Rate >= 22 breaths/min', checked: qsofaRR, setChecked: setQsofaRR },
                { label: 'Altered Mentation: Glasgow Coma Scale (GCS) < 15', checked: qsofaAMS, setChecked: setQsofaAMS },
                { label: 'Hypotension: Systolic Blood Pressure <= 100 mmHg', checked: qsofaSBP, setChecked: setQsofaSBP }
              ].map((item, idx) => (
                <label key={idx} className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-teal-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.setChecked(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Wells DVT Inputs */}
          {selectedToolId === 'wells' && (
            <div className="space-y-2 text-xs">
              {[
                { label: 'Active cancer (treatment ongoing or within 6 mos, or palliative) (+1)', checked: wellsCancer, setChecked: setWellsCancer },
                { label: 'Paralysis, paresis, or recent plaster immobilization of lower extremity (+1)', checked: wellsParesis, setChecked: setWellsParesis },
                { label: 'Recently bedridden > 3 days or major surgery within 12 weeks (+1)', checked: wellsBedridden, setChecked: setWellsBedridden },
                { label: 'Localized tenderness along deep venous system (+1)', checked: wellsTenderness, setChecked: setWellsTenderness },
                { label: 'Entire leg swollen (+1)', checked: wellsEntireLeg, setChecked: setWellsEntireLeg },
                { label: 'Calf swelling > 3 cm compared to asymptomatic side (measured 10 cm below tibial tuberosity) (+1)', checked: wellsCalfSwelling, setChecked: setWellsCalfSwelling },
                { label: 'Pitting edema confined to symptomatic leg (+1)', checked: wellsPittingEdema, setChecked: setWellsPittingEdema },
                { label: 'Collateral non-varicose superficial veins (+1)', checked: wellsCollateralVeins, setChecked: setWellsCollateralVeins },
                { label: 'Alternative diagnosis at least as likely as DVT (-2)', checked: wellsAlternativeLikely, setChecked: setWellsAlternativeLikely }
              ].map((item, idx) => (
                <label key={idx} className="flex items-center space-x-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-teal-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.setChecked(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* CHA2DS2-VASc Inputs */}
          {selectedToolId === 'cha2ds2' && (
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Patient Age (years):</label>
                  <input
                    type="number"
                    value={chaAge}
                    onChange={(e) => setChaAge(Number(e.target.value))}
                    min={18}
                    max={110}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={chaFemale}
                      onChange={(e) => setChaFemale(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span>Female Sex (+1 point)</span>
                  </label>
                </div>
              </div>

              {[
                { label: 'C - Congestive Heart Failure / LV dysfunction (+1)', checked: chaCHF, setChecked: setChaCHF },
                { label: 'H - Hypertension (resting BP > 140/90 or on medication) (+1)', checked: chaHTN, setChecked: setChaHTN },
                { label: 'D - Diabetes Mellitus (fasting glucose > 126 or HbA1c >= 6.5%) (+1)', checked: chaDM, setChecked: setChaDM },
                { label: 'S2 - Prior Stroke, TIA, or Thromboembolism (+2)', checked: chaStroke, setChecked: setChaStroke },
                { label: 'V - Vascular Disease (prior MI, peripheral artery disease, or aortic plaque) (+1)', checked: chaVascular, setChecked: setChaVascular }
              ].map((item, idx) => (
                <label key={idx} className="flex items-center space-x-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-teal-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.setChecked(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* eGFR Inputs */}
          {selectedToolId === 'egfr' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Serum Creatinine (mg/dL):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={egfrCr}
                    onChange={(e) => setEgfrCr(Number(e.target.value))}
                    min={0.2}
                    max={15}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Age (years):</label>
                  <input
                    type="number"
                    value={egfrAge}
                    onChange={(e) => setEgfrAge(Number(e.target.value))}
                    min={18}
                    max={120}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={egfrFemale}
                  onChange={(e) => setEgfrFemale(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span>Female Sex (multiplier factor 1.012)</span>
              </label>
            </div>
          )}
        </div>

        {/* Right: Calculated Result & Clinical Action Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-slate-850 border border-teal-200 dark:border-teal-900/80">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-teal-700 dark:text-teal-300">
              Score Output & Triage
            </span>

            {/* CURB-65 Result */}
            {selectedToolId === 'curb65' && (
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                    {curbScore} / 5 points
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    curbScore >= 3 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                      : curbScore === 2 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {curbScore >= 3 ? 'High Risk (Severe CAP)' : curbScore === 2 ? 'Intermediate Risk' : 'Low Risk (Mild CAP)'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold">Recommendation:</p>
                  <p>
                    {curbScore === 0 || curbScore === 1 
                      ? 'Home treatment suitable. 30-day mortality < 1.5%. Oral antibiotic therapy.' 
                      : curbScore === 2 
                      ? 'Short in-hospital stay or supervised outpatient management. 30-day mortality ~9%.' 
                      : 'Hospital admission required. Score 4-5 warrants urgent Intensive Care Unit (ICU) assessment. Mortality 20-30%.'}
                  </p>
                </div>
              </div>
            )}

            {/* qSOFA Result */}
            {selectedToolId === 'qsofa' && (
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                    {qsofaScore} / 3 points
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    qsofaScore >= 2 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {qsofaScore >= 2 ? 'High Sepsis Risk (>= 2)' : 'Low Risk (< 2)'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold">Clinical Action:</p>
                  <p>
                    {qsofaScore >= 2 
                      ? 'High risk of poor outcome / in-hospital mortality (> 10%). Immediately obtain blood cultures, measure serum lactate, administer IV fluid resuscitation, and initiate broad-spectrum antimicrobials within 1 hour (Sepsis Six).' 
                      : 'Continue close vital sign monitoring; search for infection source; repeat score if clinical condition changes.'}
                  </p>
                </div>
              </div>
            )}

            {/* Wells DVT Result */}
            {selectedToolId === 'wells' && (
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                    {wellsScore} points
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    wellsScore >= 2 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {wellsScore >= 2 ? 'DVT Likely (>= 2)' : 'DVT Unlikely (< 2)'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold">Next Diagnostic Step:</p>
                  <p>
                    {wellsScore >= 2 
                      ? 'Proceed directly to compression duplex ultrasound of the lower extremity within 4 hours. If negative but D-Dimer is positive, repeat ultrasound in 1 week.' 
                      : 'Perform high-sensitivity D-dimer assay. If D-dimer is negative, DVT is safely ruled out without imaging.'}
                  </p>
                </div>
              </div>
            )}

            {/* CHA2DS2 Result */}
            {selectedToolId === 'cha2ds2' && (
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                    {chaScore} points
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    chaScore >= 2 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                      : chaScore === 1 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {chaScore >= 2 ? 'Anticoagulation Indicated' : chaScore === 1 ? 'Consider Anticoagulation' : 'Low Risk (No Anticoagulation)'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold">Annual Adjusted Stroke Risk:</p>
                  <p>
                    {chaScore === 0 ? '0.2% per year. Anticoagulation not recommended.' 
                     : chaScore === 1 ? '0.6-1.3% per year. Oral anticoagulation should be considered based on bleeding risk (HAS-BLED).' 
                     : '>= 2.2% - 15.2% per year. Oral anticoagulation (DOAC e.g. Apixaban, Rivaroxaban) strongly recommended (Class I guideline).'}
                  </p>
                </div>
              </div>
            )}

            {/* eGFR Result */}
            {selectedToolId === 'egfr' && (
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                    {calcEgfr()} mL/min/1.73m²
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    calcEgfr() >= 90 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    calcEgfr() >= 60 ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                    calcEgfr() >= 30 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {calcEgfr() >= 90 ? 'Stage 1 (Normal)' :
                     calcEgfr() >= 60 ? 'Stage 2 (Mildly Decreased)' :
                     calcEgfr() >= 30 ? 'Stage 3 (Moderate CKD)' :
                     calcEgfr() >= 15 ? 'Stage 4 (Severe CKD)' : 'Stage 5 (Kidney Failure)'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold">Interpretation & Drug Dosing:</p>
                  <p>
                    {calcEgfr() < 30 ? 'Review nephrotoxic drugs (NSAIDs, aminoglycosides). Check renally eliminated medications (Metformin, NOACs, Gabapentin). Refer to Nephrology.' :
                     'Adequate filtration for standard dosing of most medications. Monitor annually if risk factors present (diabetes, hypertension).'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* When to use / When NOT to use guidance notes */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>When to Use:</span>
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                {activeTool.whenToUse}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>When NOT to Use (Pitfalls):</span>
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                {activeTool.whenNotToUse}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              Citation: {activeTool.evidenceRef}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
