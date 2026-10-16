import React, { useState, useMemo } from 'react';
import { 
  QubitsDiseaseEntry, 
  DepthLevel 
} from '../types/disease';
import { 
  Layers, 
  Search, 
  Filter, 
  Bookmark, 
  Activity, 
  Stethoscope, 
  Microscope, 
  BookOpen, 
  Pill, 
  ShieldCheck, 
  Flame, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Gauge, 
  TrendingUp, 
  Sliders,
  CheckCircle2,
  FileText,
  Clock,
  Compass
} from 'lucide-react';

interface TriDomainClassificationStudioProps {
  entry: QubitsDiseaseEntry;
  depthLevel?: DepthLevel;
}

type DomainTab = 'all' | 'disease' | 'pathology' | 'general_medicine';

export const TriDomainClassificationStudio: React.FC<TriDomainClassificationStudioProps> = ({
  entry,
  depthLevel = 'ms2_3'
}) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<'all' | 'mild' | 'moderate' | 'high'>('all');
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string>>(new Set());

  // "How it reacts towards the range": dynamic severity / progression slider (0 to 100%)
  const [rangePercent, setRangePercent] = useState<number>(35);

  const toggleBookmark = (key: string) => {
    setBookmarkedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Derive dynamic range reaction metrics based on rangePercent
  const rangeStage = useMemo(() => {
    if (rangePercent < 33) return { stage: 'Early / Mild Stage', color: 'emerald', urgency: 'Elective / Outpatient Review (< 24-48h)', tier: 'Mild' };
    if (rangePercent < 67) return { stage: 'Progressing / Moderate Stage', color: 'amber', urgency: 'Urgent Ambulatory or Inpatient Observation (< 4-6h)', tier: 'Moderate' };
    return { stage: 'Fulminant / Severe Decompensation', color: 'rose', urgency: 'Immediate Resuscitation & ICU Protocol (STAT < 15m)', tier: 'High' };
  }, [rangePercent]);

  // Physiological reaction across range
  const vitalsReaction = useMemo(() => {
    const factor = rangePercent / 100;
    return {
      heartRate: Math.round(72 + factor * 55), // 72 -> 127 bpm
      systolicBP: Math.round(120 - factor * 45), // 120 -> 75 mmHg or compensatory spike
      respRate: Math.round(14 + factor * 22), // 14 -> 36 bpm
      o2Sat: Math.round(99 - factor * 14), // 99% -> 85%
      lactate: (0.8 + factor * 4.6).toFixed(1), // 0.8 -> 5.4 mmol/L
      crp: Math.round(3 + factor * 140), // 3 -> 143 mg/L
      cellularReaction: factor < 0.33 
        ? 'Localized hyperemic capillary response, minor cytokine release (IL-1, TNF-alpha), preserved cellular ATP stores.'
        : factor < 0.67
        ? 'Neutrophil/macrophage parenchymal infiltration, interstitial edema, microvascular thrombosis, rising anaerobic glycolysis.'
        : 'Diffuse ischemic hypoperfusion, severe mitochondrial uncoupling, endothelial glycocalyx disruption, multiorgan microvascular shunt.'
    };
  }, [rangePercent]);

  // Tri-Domain Sections Data
  const domainData = useMemo(() => {
    return {
      disease: [
        {
          id: 'dis-def',
          title: 'Definition & Core Taxonomy',
          icon: <BookOpen className="w-4 h-4 text-teal-600" />,
          summary: entry.scope_note || (entry.depth_content && entry.depth_content['MS2-3']?.summary) || 'Comprehensive clinical entity overview',
          keyPoints: [
            `ICD Code: ${entry.codes?.icd10 || 'ICD-10/11 Grounded'}`,
            `MeSH Descriptor: ${entry.codes?.mesh || 'MeSH Descriptor'}`,
            `Primary Anatomical Regions: ${entry.regions?.join(', ') || 'Systemic'}`
          ],
          severityRelevance: 'mild' as const,
          tags: ['Nosology', 'Taxonomy', 'Epidemiology']
        },
        {
          id: 'dis-etio',
          title: 'Etiology & Risk Factors',
          icon: <Flame className="w-4 h-4 text-amber-600" />,
          summary: `Multifactorial triggering matrix spanning ${entry.regions?.[0] || 'target organ'} vulnerability and predisposing genetic or environmental stress.`,
          keyPoints: [
            'Major predisposing comorbidities and vascular/infectious risk factors',
            'Precipitating triggers: cold exposure, physical exertion, metabolic crisis, medication non-adherence',
            'Demographic stratification and age-adjusted incidence curves'
          ],
          severityRelevance: 'moderate' as const,
          tags: ['Etiology', 'Risk Factors', 'Prevention']
        },
        {
          id: 'dis-clin',
          title: 'Clinical Features & Presentation',
          icon: <Stethoscope className="w-4 h-4 text-blue-600" />,
          summary: entry.presentation.classic,
          keyPoints: [
            ...(entry.presentation.cardinal_symptoms || []).map(s => `Cardinal Symptom: ${s}`),
            ...(entry.presentation.physical_signs || []).map(s => `Physical Bedside Sign: ${s.sign} (${s.maneuver})`)
          ],
          severityRelevance: 'high' as const,
          tags: ['Semiology', 'Physical Exam', 'Cardinal Signs']
        },
        {
          id: 'dis-diff',
          title: 'Differential Diagnosis Matrix',
          icon: <Compass className="w-4 h-4 text-purple-600" />,
          summary: 'Rule-out critical mimickers and life-threatening conditions sharing overlapping semiology.',
          keyPoints: (entry.vindicate || []).flatMap(v => v.topDifferentials || []).slice(0, 5).map(d => `Differentiate from: ${d}`),
          severityRelevance: 'moderate' as const,
          tags: ['Differentials', 'VINDICATE', 'Rule-outs']
        },
        {
          id: 'dis-tx',
          title: 'Treatment & Evidence-Based Protocols',
          icon: <Pill className="w-4 h-4 text-emerald-600" />,
          summary: `Tiered management strategy starting with emergent stabilization followed by targeted disease-modifying therapy.`,
          keyPoints: [
            'Immediate first-line interventions: airway, oxygenation, vascular access, and targeted pharmacotherapy',
            'Subacute hospital or clinic management and titration protocols',
            'Secondary prevention: lifestyle modification, biomarker surveillance, and rehabilitation'
          ],
          severityRelevance: 'high' as const,
          tags: ['Therapeutics', 'Pharmacology', 'Guidelines']
        }
      ],
      pathology: [
        {
          id: 'path-mech',
          title: 'Pathogenesis & Microscopic Mechanisms',
          icon: <Microscope className="w-4 h-4 text-indigo-600" />,
          summary: 'Stepwise progression of tissue insult from molecular perturbation to macroscopic parenchymal failure.',
          keyPoints: (entry.pathway || []).slice(0, 3).map(p => `${p.title}: ${p.mechanism?.['MS2-3'] || p.mechanism?.MS1 || 'Progressive parenchymal lesion'}`),
          severityRelevance: 'moderate' as const,
          tags: ['Pathogenesis', 'Histopathology', 'Molecular']
        },
        {
          id: 'path-gross',
          title: 'Gross & Microscopic Tissue Changes',
          icon: <Layers className="w-4 h-4 text-rose-600" />,
          summary: 'Histological hallmarks distinguishing early reversible cellular injury from irreversible coagulative necrosis or fibrosis.',
          keyPoints: [
            'Early: microvascular engorgement, localized cellular hydropic swelling, glycogen depletion',
            'Intermediate: neutrophilic or lymphocytic infiltrate, contraction bands or localized parenchymal disruption',
            'Late / End-stage: macrophage scavenging, granulation tissue remodeling, collagen scar deposition'
          ],
          severityRelevance: 'high' as const,
          tags: ['Gross Pathology', 'Microscopy', 'Biopsy']
        },
        {
          id: 'path-labs',
          title: 'Laboratory & Biomarker Correlation',
          icon: <Activity className="w-4 h-4 text-teal-600" />,
          summary: 'Quantifiable biomarkers reflecting organ cell death, acute phase reactants, and clearance kinetics.',
          keyPoints: [
            'Troponin / Creatinine / LFTs: quantitative organ damage indicators',
            'Inflammatory markers: CRP, ESR, Procalcitonin, Leukocytosis with left shift',
            'Perfusion markers: serum lactate, base deficit, venous oxygen saturation (SvO2)'
          ],
          severityRelevance: 'high' as const,
          tags: ['Biomarkers', 'Serology', 'Quantification']
        }
      ],
      general_medicine: [
        {
          id: 'gen-approach',
          title: 'Systematic Clinical Approach & History Taking',
          icon: <Stethoscope className="w-4 h-4 text-emerald-600" />,
          summary: 'Framework for history taking using SOCRATES / OPQRST to characterize pain, timeline, triggers, and functional impact.',
          keyPoints: [
            'Onset & Duration: sudden catastrophic onset vs insidious progressive decline',
            'Associated autonomic features: diaphoresis, presyncope, nausea, palpitations',
            'Pre-morbid functional status and medication review (anticoagulants, NSAIDs, biologics)'
          ],
          severityRelevance: 'mild' as const,
          tags: ['History Taking', 'SOCRATES', 'Communication']
        },
        {
          id: 'gen-exam',
          title: 'General Physical & Targeted System Examination',
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
          summary: 'Structured bedside physical examination adhering to inspection, palpation, percussion, and auscultation.',
          keyPoints: [
            'General survey: posture, respiratory effort, skin turgor, peripheral perfusion, cyanosis',
            'Vital signs trend analysis: pulse pressure narrowing, tachypnea, orthostatic delta',
            'Targeted organ maneuvers and bedside provocative testing'
          ],
          severityRelevance: 'moderate' as const,
          tags: ['Physical Exam', 'Semiology', 'Signs']
        },
        {
          id: 'gen-guidelines',
          title: 'National & Global Clinical Practice Guidelines',
          icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
          summary: 'Consensus algorithms published by WHO, NICE, AHA/ACC, ESC, and IDSA for high-reliability clinical practice.',
          keyPoints: [
            'Initial triage risk stratification using validated clinical scoring systems',
            'Diagnostic threshold cutoff values for advanced imaging and angiography',
            'Discharge readiness criteria, ambulatory follow-up scheduling, and safety netting'
          ],
          severityRelevance: 'high' as const,
          tags: ['Guidelines', 'WHO/NICE', 'Patient Safety']
        }
      ]
    };
  }, [entry]);

  // Filtered Items
  const displayedItems = useMemo(() => {
    let items: Array<{
      domain: 'Disease' | 'Pathology' | 'General Medicine';
      id: string;
      title: string;
      icon: React.ReactNode;
      summary: string;
      keyPoints: string[];
      severityRelevance: 'mild' | 'moderate' | 'high';
      tags: string[];
    }> = [];

    if (selectedDomain === 'all' || selectedDomain === 'disease') {
      items.push(...domainData.disease.map(d => ({ ...d, domain: 'Disease' as const })));
    }
    if (selectedDomain === 'all' || selectedDomain === 'pathology') {
      items.push(...domainData.pathology.map(d => ({ ...d, domain: 'Pathology' as const })));
    }
    if (selectedDomain === 'all' || selectedDomain === 'general_medicine') {
      items.push(...domainData.general_medicine.map(d => ({ ...d, domain: 'General Medicine' as const })));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(it => 
        it.title.toLowerCase().includes(q) ||
        it.summary.toLowerCase().includes(q) ||
        it.tags.some(t => t.toLowerCase().includes(q)) ||
        it.keyPoints.some(p => p.toLowerCase().includes(q))
      );
    }

    // Filter by severity
    if (selectedSeverityFilter !== 'all') {
      items = items.filter(it => it.severityRelevance === selectedSeverityFilter);
    }

    return items;
  }, [domainData, selectedDomain, searchQuery, selectedSeverityFilter]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8 transition-colors space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wide">
              Tri-Domain Knowledge Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Disease • Pathology • General Medicine
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
            Knowledge Classification & Physiological Range Dynamics
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Explore interconnected clinical concepts across three foundational domains, and observe how physiological parameters, tissue morphology, and urgency react across the disease progression range.
          </p>
        </div>

        {/* Quick Domain Counts */}
        <div className="flex items-center gap-2">
          <div className="text-center px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
            <span className="block text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase">Disease</span>
            <span className="text-xs font-mono font-bold text-teal-900 dark:text-teal-100">{domainData.disease.length} Modules</span>
          </div>
          <div className="text-center px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <span className="block text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase">Pathology</span>
            <span className="text-xs font-mono font-bold text-indigo-900 dark:text-indigo-100">{domainData.pathology.length} Modules</span>
          </div>
          <div className="text-center px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="block text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">Gen. Medicine</span>
            <span className="text-xs font-mono font-bold text-blue-900 dark:text-blue-100">{domainData.general_medicine.length} Modules</span>
          </div>
        </div>
      </div>

      {/* 2. "HOW IT REACTS TOWARDS THE RANGE" DYNAMIC SIMULATOR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-teal-50/20 to-indigo-50/20 dark:from-slate-900/90 dark:via-teal-950/20 dark:to-indigo-950/20 border border-teal-200 dark:border-teal-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200 block">
                How It Reacts Towards The Severity Range ({rangePercent}%)
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Drag the interactive slider to view continuous physiological and biomarker escalation.
              </span>
            </div>
          </div>

          {/* Current Stage Indicator */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              rangeStage.tier === 'Mild'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                : rangeStage.tier === 'Moderate'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
            }`}>
              ● {rangeStage.stage}
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {rangeStage.urgency}
            </span>
          </div>
        </div>

        {/* Interactive Range Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold px-1">
            <span className="text-emerald-600 dark:text-emerald-400">0% (Incipient / Subclinical)</span>
            <span className="text-amber-600 dark:text-amber-400">50% (Symptomatic Decompensation)</span>
            <span className="text-rose-600 dark:text-rose-400">100% (Critical Emergency)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rangePercent}
            onChange={(e) => setRangePercent(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>

        {/* Live Reaction Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Heart Rate</span>
            <span className={`text-base font-bold font-mono ${vitalsReaction.heartRate > 100 ? 'text-rose-600 dark:text-rose-400' : 'text-teal-700 dark:text-teal-300'}`}>
              {vitalsReaction.heartRate} <span className="text-[10px]">bpm</span>
            </span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Norm: 60-100</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Systolic BP</span>
            <span className={`text-base font-bold font-mono ${vitalsReaction.systolicBP < 90 ? 'text-rose-600 dark:text-rose-400' : 'text-teal-700 dark:text-teal-300'}`}>
              {vitalsReaction.systolicBP} <span className="text-[10px]">mmHg</span>
            </span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Norm: 100-130</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Resp. Rate</span>
            <span className={`text-base font-bold font-mono ${vitalsReaction.respRate > 22 ? 'text-amber-600 dark:text-amber-400' : 'text-teal-700 dark:text-teal-300'}`}>
              {vitalsReaction.respRate} <span className="text-[10px]">/min</span>
            </span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Norm: 12-20</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">SpO2 (Pulse Ox)</span>
            <span className={`text-base font-bold font-mono ${vitalsReaction.o2Sat < 92 ? 'text-rose-600 dark:text-rose-400' : 'text-teal-700 dark:text-teal-300'}`}>
              {vitalsReaction.o2Sat}%
            </span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Norm: &gt; 95%</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Serum Lactate</span>
            <span className={`text-base font-bold font-mono ${Number(vitalsReaction.lactate) > 2.0 ? 'text-rose-600 dark:text-rose-400' : 'text-teal-700 dark:text-teal-300'}`}>
              {vitalsReaction.lactate} <span className="text-[10px]">mmol/L</span>
            </span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Norm: &lt; 2.0</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">hs-CRP Marker</span>
            <span className={`text-base font-bold font-mono ${vitalsReaction.crp > 10 ? 'text-amber-600 dark:text-amber-400' : 'text-teal-700 dark:text-teal-300'}`}>
              {vitalsReaction.crp} <span className="text-[10px]">mg/L</span>
            </span>
            <span className="block text-[9px] text-slate-400 mt-0.5">Norm: &lt; 5.0</span>
          </div>
        </div>

        {/* Tissue / Cellular Reaction Summary */}
        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-teal-100 dark:border-teal-900 text-xs flex items-start gap-2.5">
          <Microscope className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white mr-1.5">
              Pathophysiological & Cellular Reaction at {rangePercent}% Range:
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {vitalsReaction.cellularReaction}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Domain Filter Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Domain Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Domains', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'disease', label: 'A. Disease Domain', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'pathology', label: 'B. Pathology Domain', icon: <Microscope className="w-3.5 h-3.5" /> },
            { id: 'general_medicine', label: 'C. General Medicine', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isSelected = selectedDomain === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedDomain(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Severity Filter & Search Input */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSeverityFilter}
            onChange={(e) => setSelectedSeverityFilter(e.target.value as any)}
            className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="all">Severity: All</option>
            <option value="mild">Severity: Mild</option>
            <option value="moderate">Severity: Moderate</option>
            <option value="high">Severity: Severe/High</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter topics, mechanisms, signs..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* 4. Display Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedItems.map((item) => {
          const isBookmarked = bookmarkedKeys.has(item.id);
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/40 hover:border-teal-400/60 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    {item.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {item.domain}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.severityRelevance === 'mild'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.severityRelevance === 'moderate'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {item.severityRelevance}
                    </span>
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-amber-500 cursor-pointer"
                      title="Bookmark topic"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif-medical leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Points */}
                <div className="mt-3 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                  {item.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5">
                      <span className="text-teal-600 font-bold shrink-0 mt-0.5">•</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tag Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                <div className="flex items-center gap-1 flex-wrap">
                  {item.tags.map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
                <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-0.5">
                  Verified <CheckCircle2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
