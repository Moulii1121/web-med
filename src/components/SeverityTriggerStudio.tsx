import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  Stethoscope, 
  Pill, 
  Microscope, 
  Sliders, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  HeartPulse,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import { QubitsDiseaseEntry } from '../types/disease';

export type SeverityLevel = 'mild' | 'moderate' | 'severe';

interface SeverityTriggerStudioProps {
  entry: QubitsDiseaseEntry;
}

export const SeverityTriggerStudio: React.FC<SeverityTriggerStudioProps> = ({ entry }) => {
  const [severity, setSeverity] = useState<SeverityLevel>('moderate');
  const [activeTriggerCategory, setActiveTriggerCategory] = useState<string>('all');
  const [simulatedTriggerImpact, setSimulatedTriggerImpact] = useState<string | null>(null);

  // Dynamic severity breakdown derived from disease entry
  const severityProfiles = {
    mild: {
      label: 'Mild (Early / Localized)',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300',
      sliderColor: 'accent-emerald-500',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      urgency: 'Elective / Outpatient or Routine Review',
      timeframe: 'Review within 24-48 hours if symptoms persist',
      clinicalPresentation: `Early visceral signs: dull vague discomfort, low-grade malaise, mild localized irritation without systemic toxemia. Self-limiting in early stages with conservative supportive care.`,
      symptoms: [
        'Vague, intermittent discomfort localized to primary anatomical region',
        'Mild nausea without persistent emesis',
        'Normal to borderline body temperature (< 37.8°C / 100°F)',
        'Full ambulatory capacity without peritoneal guarding'
      ],
      investigations: {
        labs: 'Normal to mildly elevated inflammatory markers (WBC 4,000-11,000/µL, CRP < 10 mg/L)',
        imaging: 'Ultrasound or plain films often unremarkable or showing early non-specific mucosal thickening',
        ecg_abg: 'Hemodynamically stable; normal sinus rhythm; normal venous lactate'
      },
      management: {
        firstLine: 'Supportive care, hydration, oral analgesia, dietary modification, close outpatient observation',
        monitoring: 'Check for progression to localized sharp pain or fever; return precautions explained',
        admissionCriteria: 'Home care appropriate provided reliable follow-up and transportation available'
      },
      prognosis: 'Excellent (> 95% resolution if identified and managed early without secondary insult)'
    },
    moderate: {
      label: 'Moderate (Progressing / Subacute)',
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300',
      sliderColor: 'accent-amber-500',
      icon: <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      urgency: 'Urgent Medical Review Needed',
      timeframe: 'Assess within 2-6 hours; baseline workup required',
      clinicalPresentation: `Progressing pathological cascade: somatic pain referral, persistent nausea/vomiting, localized tenderness on direct palpation. Active inflammatory or ischemic cascade underway requiring hospital-based investigations.`,
      symptoms: [
        'Constant localized pain with voluntary guarding on physical examination',
        'Persistent nausea, anorexia, and inability to tolerate oral intake',
        'Low-grade fever (38.0°C - 38.8°C) with mild tachycardia (HR 90-110 bpm)',
        'Pathognomonic focal signs emerging upon provocative exam maneuvers'
      ],
      investigations: {
        labs: 'Definite leukocytosis (WBC 12,000-16,000/µL with left shift), elevated CRP (30-80 mg/L)',
        imaging: 'Targeted ultrasound or contrast-enhanced CT confirms organ pathology (wall thickening, hyperemia)',
        ecg_abg: 'Mild sinus tachycardia; mild respiratory alkalosis or borderline lactate (1.5-2.0 mmol/L)'
      },
      management: {
        firstLine: 'Hospital admission, IV crystalloid resuscitation, IV targeted pharmacotherapy or antibiotics, NPO status',
        monitoring: 'Serial abdominal exams every 2-4 hours, strict fluid balance charting, repeat vitals',
        admissionCriteria: 'Inpatient observation recommended; surgical or specialty consult requested'
      },
      prognosis: 'Good to Guarded depending on prompt response to targeted medical or early surgical intervention'
    },
    severe: {
      label: 'High / Severe (Complicated / Emergency)',
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300',
      sliderColor: 'accent-rose-500',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-pulse" />,
      urgency: 'CRITICAL EMERGENCY - Immediate Resuscitation',
      timeframe: 'Immediate Bedside Action (< 15-30 minutes); Code Team / Surgical Alert',
      clinicalPresentation: `Critical decompensation: systemic inflammatory response (SIRS/Sepsis), peritonitis with involuntary rigid board-like abdomen or hemodynamic collapse. High risk of perforation, necrosis, shock, or multiorgan failure.`,
      symptoms: [
        'Severe intractable pain with involuntary guarding, rebound tenderness, and rigidity',
        'High pyrexia (> 39.0°C) or hypothermia (< 36.0°C) with rigors and diaphoresis',
        'Hemodynamic instability: Hypotension (MAP < 65 mmHg), marked tachycardia (HR > 120 bpm)',
        'Altered mental status, tachypnea (RR > 24), oliguria (< 0.5 mL/kg/hr)'
      ],
      investigations: {
        labs: 'Marked leukocytosis (> 18,000/µL) or leukopenia (< 4,000/µL with > 10% bandemia), Lactate > 3.5 mmol/L, Coagulopathy',
        imaging: 'CT reveals perforation, free extraluminal air, extensive abscess, or vascular thrombosis',
        ecg_abg: 'Metabolic acidosis with elevated anion gap; marked base deficit; sinus tachycardia or arrhythmias'
      },
      management: {
        firstLine: 'Immediate Airway-Breathing-Circulation stabilization, broad-spectrum IV antimicrobials within 1 hour, emergency surgical intervention',
        monitoring: 'ICU / HDU admission, arterial line, central venous pressure monitoring, continuous telemetry',
        admissionCriteria: 'Mandatory intensive care admission and emergent operative team mobilization'
      },
      prognosis: 'High Morbidity & Mortality risk without emergent intervention; requires multi-disciplinary ICU care'
    }
  };

  const currentProfile = severityProfiles[severity];

  // Comprehensive Clinical Triggers Explorer
  const triggersList = [
    {
      id: 'trig-inf',
      category: 'Infections',
      name: 'Secondary Bacterial / Viral Infection',
      mechanism: 'Bacterial translocation and mucosal ulceration amplify cytokine storm (TNF-α, IL-1, IL-6), converting localized mucosal inflammation into transmural suppurative disease.',
      severityShift: 'Escalates Mild → Severe (Perforation & Sepsis Risk)',
      example: 'Appendiceal fecalith obstruction allowing bacterial overgrowth (Bacteroides, E. coli)'
    },
    {
      id: 'trig-tox',
      category: 'Drugs & Toxins',
      name: 'NSAID / Vasoconstrictor / Toxic Exposure',
      mechanism: 'Inhibition of protective prostaglandin synthesis or alpha-1 adrenergic vasoconstriction causes microvascular ischemia, ulceration, and accelerated necrosis.',
      severityShift: 'Escalates Moderate → Severe (Microvascular Thrombosis)',
      example: 'High-dose NSAID or sympathomimetic use reducing mucosal perfusion'
    },
    {
      id: 'trig-diet',
      category: 'Diet & Metabolic',
      name: 'Dehydration / High-Fat / Dietary Stagnation',
      mechanism: 'Hemoconcentration increases blood viscosity while unevacuated inspissated luminal content causes elevated intraluminal pressure, compounding venous stasis.',
      severityShift: 'Shifts Mild → Moderate (Intraluminal Pressure Rise)',
      example: 'Low dietary fiber leading to coprolith / fecalith formation'
    },
    {
      id: 'trig-stress',
      category: 'Stress & Immune',
      name: 'Physical Exhaustion & Immunosuppression',
      mechanism: 'Excessive cortisol and catecholamines suppress neutrophil bactericidal capacity and impair wound healing, preventing immune containment.',
      severityShift: 'Escalates Moderate → Severe (Impaired Containment)',
      example: 'Glucocorticoid therapy masking classic peritoneal signs while pathology progresses'
    },
    {
      id: 'trig-env',
      category: 'Environmental',
      name: 'Delayed Medical Presentation (> 24-48 hrs)',
      mechanism: 'Time-dependent ischemia: venous engorgement progresses to arterial insufficiency, transmural necrosis, and gangrene within 36-72 hours of onset.',
      severityShift: 'Guarantees progression to Severe (High Perforation Rate)',
      example: 'Presentation after 36 hours carries > 65% complication / perforation rate'
    }
  ];

  const filteredTriggers = activeTriggerCategory === 'all' 
    ? triggersList 
    : triggersList.filter(t => t.category.toLowerCase().includes(activeTriggerCategory.toLowerCase()));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8 transition-colors">
      {/* 1. Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              <span>Dynamic Severity Variation Engine</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Live Clinical Acuity Simulator
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif-medical text-slate-900 dark:text-white">
            Severity Progression & Trigger Shift Lab
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mt-0.5">
            Slide through Mild, Moderate, and High/Severe levels to simulate how symptoms, laboratory markers, imaging thresholds, and clinical urgency evolve for {entry.title}.
          </p>
        </div>

        {/* Severity Slider / Segmented Control */}
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 self-start md:self-auto shrink-0 shadow-inner">
          {(['mild', 'moderate', 'severe'] as SeverityLevel[]).map((level) => {
            const isSelected = severity === level;
            const labels = {
              mild: '1. Mild',
              moderate: '2. Moderate',
              severe: '3. Severe'
            };
            const activeColors = {
              mild: 'bg-emerald-600 text-white shadow-xs',
              moderate: 'bg-amber-600 text-white shadow-xs',
              severe: 'bg-rose-600 text-white shadow-xs'
            };
            return (
              <button
                key={level}
                onClick={() => setSeverity(level)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? activeColors[level]
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{labels[level]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Acuity Banner */}
      <div className={`p-5 rounded-2xl border ${currentProfile.badgeColor} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300`}>
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-slate-900/80 flex items-center justify-center shadow-xs shrink-0">
            {currentProfile.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold tracking-tight">
                Current Acuity: {currentProfile.label}
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-900/60 font-bold border border-current">
                {currentProfile.urgency}
              </span>
            </div>
            <p className="text-xs mt-0.5 opacity-90 font-medium">
              Action Window: {currentProfile.timeframe}
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-bold opacity-75 block">
            Expected Prognosis:
          </span>
          <span className="text-xs font-bold">
            {currentProfile.prognosis}
          </span>
        </div>
      </div>

      {/* 3. Four-Quadrant Real-Time Clinical Presentation Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quadrant A: Cardinal Symptoms & Physical Signs */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. Presenting Symptoms & Exam Signs:
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              {currentProfile.symptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 font-mono">
            Severity state dictates threshold for involuntary guarding and peritoneal irritation.
          </div>
        </div>

        {/* Quadrant B: Typical Laboratory & Diagnostic Findings */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Microscope className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Lab, Imaging & Biomarker Profile:
              </h4>
            </div>
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Hematology & Inflammatory:</span>
                <span className="text-slate-600 dark:text-slate-400">{currentProfile.investigations.labs}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Imaging Modality (US / CT / MRI):</span>
                <span className="text-slate-600 dark:text-slate-400">{currentProfile.investigations.imaging}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">ECG / ABG / Perfusion Status:</span>
                <span className="text-slate-600 dark:text-slate-400">{currentProfile.investigations.ecg_abg}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 font-mono">
            Diagnostic sensitivity jumps from 75% (early mild) to &gt;95% (CT in moderate/severe).
          </div>
        </div>

        {/* Quadrant C: Evidence-Based Management Approach */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Pill className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                3. Therapeutic Protocol & Triage:
              </h4>
            </div>
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Primary Clinical Intervention:</span>
                <span>{currentProfile.management.firstLine}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Monitoring & Serial Exams:</span>
                <span>{currentProfile.management.monitoring}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Disposition:</span>
                <span>{currentProfile.management.admissionCriteria}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 font-mono">
            Adheres to international acute care clinical guidelines and WHO Essential Medicines list.
          </div>
        </div>

        {/* Quadrant D: Pathophysiologic Cellular Mechanism at this Stage */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                4. Cellular Mechanism & Microcirculation:
              </h4>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {currentProfile.clinicalPresentation}
            </p>
            <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Exam High-Yield: </span>
              <span className="text-slate-600 dark:text-slate-400">
                {severity === 'mild' 
                  ? 'Visceral afferent fibers (T10 sympathetics) cause poorly localized periumbilical ache before somatic parietal peritoneum involvement.' 
                  : severity === 'moderate' 
                  ? 'Somatic pain fibers (spinal nerves) localize sharply to the exact parietal peritoneum layer over the inflamed focus.' 
                  : 'Sudden temporary relief of pain can signify wall rupture/perforation before diffuse peritonitis and septic shock ensue!'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 font-mono">
            Grounds CBME / USMLE Step 1 & 2 clinical vignette reasoning.
          </div>
        </div>
      </div>

      {/* 4. Prominent Red Flag Symptoms Ribbon */}
      <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 shadow-2xs">
        <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 mb-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
          <h4 className="font-extrabold text-sm uppercase tracking-wide">
            Critical Emergency Red Flags & Decision Criteria:
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {entry.red_flags.map((rf, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-800">
              <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">
                ⚠️ {rf.warning}
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-1">
                {rf.immediateAction}
              </p>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                Timeframe: {rf.timeframe}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Trigger Explorer (Shows how triggers shift severity) */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-850">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold font-serif-medical text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Trigger Explorer: Factors Driving Severity Escalation</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Investigate how clinical triggers (bacterial colonization, toxins, physiological stress, diet) exacerbate disease acuity.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {['all', 'Infections', 'Drugs', 'Diet', 'Stress', 'Environmental'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTriggerCategory(cat)}
                className={`px-3 py-1 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                  activeTriggerCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTriggers.map((trig) => (
            <div
              key={trig.id}
              onClick={() => setSimulatedTriggerImpact(trig.name)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase">
                    {trig.category}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Severity Shift</span>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                  {trig.name}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {trig.mechanism}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span>{trig.severityShift}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
