import React, { useState } from 'react';
import { 
  QubitsDiseaseEntry, 
  DepthLevel, 
  SourceCitation,
  DepthSummary
} from '../types/disease';
import { RedFlagRibbon } from './RedFlagRibbon';
import { DepthDial } from './DepthDial';
import { PathwayChainEngine } from './PathwayChainEngine';
import { VindicateAtlas } from './VindicateAtlas';
import { ExamLensView } from './ExamLensView';
import { EvidenceShelf } from './EvidenceShelf';
import { SeverityTriggerStudio } from './SeverityTriggerStudio';
import { HonestyMeter } from './HonestyMeter';
import { ReceiptDrawer } from './ReceiptDrawer';
import { 
  Stethoscope, 
  CheckCircle2, 
  Bookmark, 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  Layers,
  Activity,
  Award,
  BookOpen,
  Pill,
  Microscope,
  FileText,
  Flame,
  Calculator,
  Compass,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Lightbulb,
  FileDown
} from 'lucide-react';

export type ConditionSubTab = 
  | 'overview'
  | 'pathway'
  | 'vindicate'
  | 'presentation'
  | 'diagnosis'
  | 'management'
  | 'evidence'
  | 'exam';

interface DiseaseDetailViewProps {
  entry: QubitsDiseaseEntry;
  depthLevel: DepthLevel;
  onChangeDepth: (level: DepthLevel) => void;
  isBookmarked: boolean;
  isCompleted: boolean;
  onToggleBookmark: () => void;
  onToggleComplete: () => void;
  onMakeFlashcard: (text: string, title: string) => void;
  onOpenCaseForge: () => void;
  onExportPdf?: () => void;
}

export function getActiveDepthSummary(entry: QubitsDiseaseEntry, depth: DepthLevel): DepthSummary {
  if (entry.depth_content) {
    if (entry.depth_content[depth]) {
      return entry.depth_content[depth]!;
    }
    if ((depth === 'MS2' || depth === 'MS3') && entry.depth_content['MS2-3']) {
      return entry.depth_content['MS2-3']!;
    }
    if (entry.depth_content.MS1) return entry.depth_content.MS1;
    const values = Object.values(entry.depth_content);
    if (values.length > 0 && values[0]) return values[0];
  }
  return {
    summary: 'Evidence-based clinical synthesis calibrated for medical trainees and healthcare practitioners.',
    cellular_depth: 'Biochemical pathways, cellular injury mechanisms, and histological hallmarks.',
    clinical_focus: 'Evidence-based differential diagnosis, bedside examination signs, and structured clinical decision making.',
    exam_pearl: 'High-yield board examination and clinical practice key concept.'
  };
}

export function getCurricularLearningMode(depth: DepthLevel) {
  switch (depth) {
    case 'MS1':
      return {
        tier: 'MS1',
        tierName: 'MS1 — Pre-Clinical Foundations',
        methodName: 'Molecular & Structural First Principles',
        cognitiveGoal: 'Deconstruct macroscopic symptoms into molecular receptors, microvascular biomechanics, and gross anatomical topography.',
        targetBoards: 'USMLE Step 1 • NMC CBME Foundations • UK MLA',
        recommendedTab: 'pathway' as ConditionSubTab,
        recommendedTabLabel: 'Pathway Chain',
        activeChallenge: 'Trace how cellular membrane alterations lead directly to physical symptoms without skipping steps.'
      };
    case 'MS2':
    case 'MS2-3':
      return {
        tier: depth === 'MS2-3' ? 'MS2' : depth,
        tierName: 'MS2 — Organ Systems & Pathology',
        methodName: 'Systemic Pathophysiology & VINDICATE Differential Mapping',
        cognitiveGoal: 'Classify etiologies into Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Traumatic, and Endocrine categories.',
        targetBoards: 'USMLE Step 1 • Pathology Shelf Exam • NMC CBME',
        recommendedTab: 'vindicate' as ConditionSubTab,
        recommendedTabLabel: 'VINDICATE Matrix',
        activeChallenge: 'Map presenting clinical features against at least 4 VINDICATE differential categories before reaching diagnostic closure.'
      };
    case 'MS3':
      return {
        tier: 'MS3',
        tierName: 'MS3 — Core Clinical Clerkships',
        methodName: 'Bedside Semiology & Physical Examination Yield',
        cognitiveGoal: 'Master targeted bedside physical exam maneuvers, cardinal sign sensitivities/specificities, and pre-test diagnostic probability.',
        targetBoards: 'USMLE Step 2 CK • Core Clerkship Shelf Exams • OSCE',
        recommendedTab: 'presentation' as ConditionSubTab,
        recommendedTabLabel: 'Clinical Signs',
        activeChallenge: 'Identify high-yield physical maneuvers with known positive likelihood ratios (LR+ > 5) to verify bedside suspicions.'
      };
    case 'MS4':
      return {
        tier: 'MS4',
        tierName: 'MS4 — Sub-Internship & Acute Triage',
        methodName: 'Emergency Red Flags, Bedside Scoring & Initial Resuscitation',
        cognitiveGoal: 'Perform rapid acute inpatient triage: time-critical red flags (< 15-60 min), validated clinical calculators, and initial IV stabilization protocols.',
        targetBoards: 'USMLE Step 2 CK • Emergency & ICU Sub-I',
        recommendedTab: 'diagnosis' as ConditionSubTab,
        recommendedTabLabel: 'Diagnostic Protocol',
        activeChallenge: 'Stabilize this patient immediately: isolate emergency red flags, compute risk scores, and initiate resuscitation within 30 minutes.'
      };
    case 'Resident':
    default:
      return {
        tier: 'Resident',
        tierName: 'Resident / Fellow — Postgraduate Practice',
        methodName: 'Evidence-Based Therapeutics & Advanced Multidisciplinary Care',
        cognitiveGoal: 'Formulate definitive management with guideline-directed drug classes, monitor toxicities, and critically appraise peer-reviewed open literature.',
        targetBoards: 'USMLE Step 3 • Specialty Board Certification',
        recommendedTab: 'management' as ConditionSubTab,
        recommendedTabLabel: 'Management & Rx',
        activeChallenge: 'Establish definitive inpatient and outpatient care plans with guideline dosing, toxicity monitoring, and multi-source literature appraisal.'
      };
  }
}

export const DiseaseDetailView: React.FC<DiseaseDetailViewProps> = ({
  entry,
  depthLevel,
  onChangeDepth,
  isBookmarked,
  isCompleted,
  onToggleBookmark,
  onToggleComplete,
  onMakeFlashcard,
  onOpenCaseForge,
  onExportPdf
}) => {
  const [activeTab, setActiveTab] = useState<ConditionSubTab>('overview');
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation | null>(null);
  const [isReceiptDrawerOpen, setIsReceiptDrawerOpen] = useState<boolean>(false);
  
  const depthSummary = getActiveDepthSummary(entry, depthLevel);
  const curricularMode = getCurricularLearningMode(depthLevel);

  const handleOpenCitation = (sourceId: string) => {
    const found = entry.evidence.find(c => c.source_id === sourceId) || entry.evidence[0];
    if (found) {
      setSelectedCitation(found);
      setIsReceiptDrawerOpen(true);
    }
  };

  const tabs: { id: ConditionSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'pathway', label: 'Pathway', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'vindicate', label: 'VINDICATE', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'presentation', label: 'Presentation', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'diagnosis', label: 'Diagnosis', icon: <Microscope className="w-3.5 h-3.5" /> },
    { id: 'management', label: 'Management', icon: <Pill className="w-3.5 h-3.5" /> },
    { id: 'evidence', label: 'Evidence', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'exam', label: 'Exam', icon: <Award className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. STICKY / TOP CONDITION HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                ICD-10: {entry.codes.icd10}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                SNOMED: {entry.codes.snomed_ct}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                {entry.system}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {entry.regions[0]}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-medical text-slate-900 dark:text-white tracking-tight">
              {entry.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              {entry.scope_note}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {onExportPdf && (
              <button
                onClick={onExportPdf}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Download formatted Clinical Summary PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            )}

            <button
              onClick={onOpenCaseForge}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Simulate Case</span>
            </button>

            <button
              onClick={onToggleBookmark}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title="Bookmark for exam revision"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            <button
              onClick={onToggleComplete}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : ''}`} />
              <span>{isCompleted ? 'Mastered' : 'Mark Studied'}</span>
            </button>
          </div>
        </div>

        {/* Honesty Meter Component */}
        <div className="mt-5">
          <HonestyMeter entry={entry} />
        </div>
      </div>

      {/* 2. Red Flag Ribbon (Emergency Strip) */}
      <RedFlagRibbon redFlags={entry.red_flags} />

      {/* 3. Clean 8-Tab Condition Sub-Menu Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isRecommended = curricularMode.recommendedTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs'
                  : isRecommended
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-2 border-teal-500 text-teal-800 dark:text-teal-200'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {isRecommended && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 font-extrabold ml-1">
                  {depthLevel} Focus
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Active Tab Content Rendering */}
      <div>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Curricular Learning Mode Callout */}
            <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 dark:text-teal-200 text-xs flex items-center gap-1.5">
                  <Microscope className="w-4 h-4 text-teal-600" />
                  Depth Dial Focus: {depthLevel} Level
                </span>
                <span className="text-[11px] font-mono text-teal-700 dark:text-teal-300">
                  Method: {curricularMode.methodName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {depthSummary.summary}
              </p>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-200/60 dark:border-teal-800 text-xs">
                <strong className="text-teal-800 dark:text-teal-300">Exam High-Yield Pearl: </strong>
                <span className="text-slate-700 dark:text-slate-300">{depthSummary.exam_pearl}</span>
              </div>
            </div>

            {/* Etiology & Epidemiology Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Etiological Triggers & Root Causes
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {entry.etiology.triggers.slice(0, 5).map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Global Health & Resource Setting
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>High-Resource: </strong>{entry.global_health_note.high_income}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                  <strong>Low-Resource / WHO: </strong>{entry.global_health_note.low_middle_income}
                </p>
                <div className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300 pt-1">
                  WHO Essential Medicines: {entry.global_health_note.who_essential_medicines.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PATHWAY */}
        {activeTab === 'pathway' && (
          <PathwayChainEngine
            nodes={entry.pathway}
            depthLevel={depthLevel}
            onOpenCitation={handleOpenCitation}
            onMakeFlashcard={onMakeFlashcard}
          />
        )}

        {/* TAB 3: VINDICATE */}
        {activeTab === 'vindicate' && (
          <VindicateAtlas
            vindicateList={entry.vindicate}
            depthLevel={depthLevel}
            selectedRegion={entry.regions[0]}
            diseaseTitle={entry.title}
            cardinalSymptoms={entry.presentation.cardinal_symptoms}
            physicalSigns={entry.presentation.physical_signs}
            redFlags={entry.red_flags}
          />
        )}

        {/* TAB 4: PRESENTATION */}
        {activeTab === 'presentation' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                Bedside Semiology
              </span>
              <h3 className="text-lg font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
                Clinical Signs & Physical Examination Maneuvers
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-xs">
              <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                Classic Clinical Presentation:
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {entry.presentation.classic}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Physical Examination Signs & Bedside Maneuvers
              </h4>
              <div className="space-y-2.5">
                {entry.presentation.physical_signs.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.sign}</span>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{item.maneuver}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono text-[11px] font-bold self-start sm:self-auto shrink-0 border border-teal-200 dark:border-teal-800">
                      {item.diagnostic_yield}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DIAGNOSIS */}
        {activeTab === 'diagnosis' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                Investigation Strategy
              </span>
              <h3 className="text-lg font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
                Diagnostic Pathway & Imaging Algorithms
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-teal-600 block">First-Line Investigation</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {entry.diagnostics.first_line}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-indigo-600 block">Gold Standard Diagnostic</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {entry.diagnostics.gold_standard}
                </p>
              </div>
            </div>

            {/* Severity Trigger Studio Integration */}
            <SeverityTriggerStudio entry={entry} />
          </div>
        )}

        {/* TAB 6: MANAGEMENT */}
        {activeTab === 'management' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                Therapeutic Protocol
              </span>
              <h3 className="text-lg font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
                Evidence-Based Treatment & Pharmacology
              </h3>
            </div>

            {/* Acute Stabilization */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide block mb-2">
                Emergency Inpatient Stabilization (&lt; 60 mins)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                {entry.management.acute_stabilization.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Definitive Management */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide block mb-1">
                Definitive Management & Resolution
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {entry.management.definitive}
              </p>
            </div>

            {/* Pharmacology Matrix */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Key Pharmacotherapy & Essential Monitoring
              </h4>
              <div className="space-y-3">
                {entry.management.pharmacology.map((rx, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{rx.representative_agent}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {rx.drug_class}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Mechanism: </strong>{rx.mechanism}
                    </p>
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                      <strong>Safety & Monitoring: </strong>{rx.essential_monitoring}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EVIDENCE */}
        {activeTab === 'evidence' && (
          <EvidenceShelf 
            evidenceList={entry.evidence} 
            diseaseTitle={entry.title} 
          />
        )}

        {/* TAB 8: EXAM */}
        {activeTab === 'exam' && (
          <ExamLensView examData={entry.exam_lens} />
        )}
      </div>

      {/* Slide-over Receipt Drawer for clicking source chips */}
      <ReceiptDrawer
        isOpen={isReceiptDrawerOpen}
        onClose={() => setIsReceiptDrawerOpen(false)}
        citation={selectedCitation}
      />
    </div>
  );
};
