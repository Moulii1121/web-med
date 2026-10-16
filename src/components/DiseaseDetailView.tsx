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
import { MindMapStudio } from './MindMapStudio';
import { SimulationLab } from './SimulationLab';
import { EvidenceShelf } from './EvidenceShelf';
import { SeverityTriggerStudio } from './SeverityTriggerStudio';
import { BodySimulationStudio } from './BodySimulationStudio';
import { ClinicalCalculatorsStudio } from './ClinicalCalculatorsStudio';
import { TriDomainClassificationStudio } from './TriDomainClassificationStudio';
import { 
  Stethoscope, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  Info,
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
  Lightbulb
} from 'lucide-react';

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

export interface CurricularModeInfo {
  tier: DepthLevel;
  tierName: string;
  badge: string;
  methodName: string;
  cognitiveGoal: string;
  targetBoards: string;
  recommendedTab: 'pathway' | 'vindicate' | 'tridomain' | 'severity' | 'bodysim' | 'presentation' | 'treatment' | 'calculators' | 'exam' | 'mindmap' | 'sim' | 'evidence';
  recommendedTabLabel: string;
  highYieldTabs: string[];
  activeChallenge: string;
  colorTheme: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
}

export function getCurricularLearningMode(depth: DepthLevel): CurricularModeInfo {
  switch (depth) {
    case 'MS1':
      return {
        tier: 'MS1',
        tierName: 'MS1 — Pre-Clinical Foundations',
        badge: 'Pre-Clinical Stage',
        methodName: 'Molecular & Structural First Principles',
        cognitiveGoal: 'Deconstruct macroscopic symptoms into molecular receptors, microvascular biomechanics, and gross anatomical topography.',
        targetBoards: 'USMLE Step 1 • NMC CBME Anatomy/Physiology • UK MLA Foundations',
        recommendedTab: 'pathway',
        recommendedTabLabel: 'Pathway Chain',
        highYieldTabs: ['pathway', 'mindmap', 'exam', 'bodysim'],
        activeChallenge: 'Trace how cellular membrane alterations lead directly to physical symptoms without skipping steps.',
        colorTheme: {
          bg: 'from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30',
          border: 'border-blue-200 dark:border-blue-800/60',
          badgeBg: 'bg-blue-100 dark:bg-blue-950',
          badgeText: 'text-blue-800 dark:text-blue-300',
          accent: 'text-blue-600 dark:text-blue-400'
        }
      };
    case 'MS2':
    case 'MS2-3':
      return {
        tier: depth === 'MS2-3' ? 'MS2' : depth,
        tierName: 'MS2 — Organ Systems & Pathology',
        badge: 'Pathology Stage',
        methodName: 'Systemic Pathophysiology & VINDICATE Differential Mapping',
        cognitiveGoal: 'Classify etiologies into Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Traumatic, and Endocrine categories.',
        targetBoards: 'USMLE Step 1 • Pathology Shelf Exam • NMC CBME Pathology',
        recommendedTab: 'vindicate',
        recommendedTabLabel: 'VINDICATE Atlas',
        highYieldTabs: ['vindicate', 'tridomain', 'pathway', 'mindmap'],
        activeChallenge: 'Map presenting clinical features against at least 4 VINDICATE differential categories before reaching diagnostic closure.',
        colorTheme: {
          bg: 'from-teal-50/80 to-emerald-50/80 dark:from-teal-950/30 dark:to-emerald-950/30',
          border: 'border-teal-200 dark:border-teal-800/60',
          badgeBg: 'bg-teal-100 dark:bg-teal-950',
          badgeText: 'text-teal-800 dark:text-teal-300',
          accent: 'text-teal-600 dark:text-teal-400'
        }
      };
    case 'MS3':
      return {
        tier: 'MS3',
        tierName: 'MS3 — Core Clinical Clerkships',
        badge: 'Clerkship Stage',
        methodName: 'Bedside Semiology & Physical Examination Yield',
        cognitiveGoal: 'Master targeted bedside physical exam maneuvers, cardinal sign sensitivities/specificities, and pre-test diagnostic probability.',
        targetBoards: 'USMLE Step 2 CK • Core Clerkship Shelf Exams • OSCE Examination Stations',
        recommendedTab: 'presentation',
        recommendedTabLabel: 'Clinical Signs',
        highYieldTabs: ['presentation', 'tridomain', 'severity', 'calculators'],
        activeChallenge: 'Identify high-yield physical maneuvers with known positive likelihood ratios (LR+ > 5) to verify bedside suspicions.',
        colorTheme: {
          bg: 'from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30',
          border: 'border-amber-200 dark:border-amber-800/60',
          badgeBg: 'bg-amber-100 dark:bg-amber-950',
          badgeText: 'text-amber-800 dark:text-amber-300',
          accent: 'text-amber-600 dark:text-amber-400'
        }
      };
    case 'MS4':
      return {
        tier: 'MS4',
        tierName: 'MS4 — Sub-Internship & Acute Triage',
        badge: 'Sub-Intern Stage',
        methodName: 'Emergency Red Flags, Bedside Scoring & Initial Resuscitation',
        cognitiveGoal: 'Perform rapid acute inpatient triage: time-critical red flags (< 15-60 min), validated clinical calculators, and initial IV stabilization protocols.',
        targetBoards: 'USMLE Step 2 CK • Emergency & ICU Sub-I • UK MLA Clinical Practice',
        recommendedTab: 'calculators',
        recommendedTabLabel: 'Clinical Decision Tools',
        highYieldTabs: ['calculators', 'severity', 'evidence', 'presentation'],
        activeChallenge: 'Stabilize this patient immediately: isolate emergency red flags, compute risk scores, and initiate resuscitation within 30 minutes.',
        colorTheme: {
          bg: 'from-rose-50/80 to-red-50/80 dark:from-rose-950/30 dark:to-red-950/30',
          border: 'border-rose-200 dark:border-rose-800/60',
          badgeBg: 'bg-rose-100 dark:bg-rose-950',
          badgeText: 'text-rose-800 dark:text-rose-300',
          accent: 'text-rose-600 dark:text-rose-400'
        }
      };
    case 'Resident':
    default:
      return {
        tier: 'Resident',
        tierName: 'Resident / Fellow — Postgraduate Practice',
        badge: 'Postgraduate Practice',
        methodName: 'Evidence-Based Therapeutics & Advanced Multidisciplinary Care',
        cognitiveGoal: 'Formulate definitive management with guideline-directed drug classes, monitor toxicities, and critically appraise peer-reviewed open literature.',
        targetBoards: 'USMLE Step 3 • Specialty Board Certification • Royal College Licensing',
        recommendedTab: 'treatment',
        recommendedTabLabel: 'Treatment & Rx',
        highYieldTabs: ['treatment', 'evidence', 'calculators', 'severity'],
        activeChallenge: 'Establish definitive inpatient and outpatient care plans with guideline dosing, toxicity monitoring, and multi-source literature appraisal.',
        colorTheme: {
          bg: 'from-purple-50/80 to-indigo-50/80 dark:from-purple-950/30 dark:to-indigo-950/30',
          border: 'border-purple-200 dark:border-purple-800/60',
          badgeBg: 'bg-purple-100 dark:bg-purple-950',
          badgeText: 'text-purple-800 dark:text-purple-300',
          accent: 'text-purple-600 dark:text-purple-400'
        }
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
  onOpenCaseForge
}) => {
  const [activeTab, setActiveTab] = useState<'pathway' | 'vindicate' | 'tridomain' | 'severity' | 'bodysim' | 'presentation' | 'treatment' | 'calculators' | 'exam' | 'mindmap' | 'sim' | 'evidence'>('pathway');
  
  const depthSummary = getActiveDepthSummary(entry, depthLevel);
  const curricularMode = getCurricularLearningMode(depthLevel);

  const handleOpenCitation = (sourceId: string) => {
    setActiveTab('evidence');
    const el = document.getElementById(sourceId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJumpToRecommendedTab = () => {
    setActiveTab(curricularMode.recommendedTab);
  };

  const tiersList: DepthLevel[] = ['MS1', 'MS2', 'MS3', 'MS4', 'Resident'];

  return (
    <div className="space-y-6">
      {/* 1. Disease Header Banner */}
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
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              {entry.scope_note}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={onOpenCaseForge}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Simulate Case Forge</span>
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

        {/* DYNAMIC CURRICULAR LEARNING MODE & DEPTH CONSOLE */}
        <div className={`mt-5 p-5 rounded-2xl bg-gradient-to-r ${curricularMode.colorTheme.bg} border ${curricularMode.colorTheme.border} transition-all duration-300`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${curricularMode.colorTheme.badgeBg} ${curricularMode.colorTheme.badgeText} flex items-center gap-1`}>
                  <GraduationCap className="w-3.5 h-3.5" />
                  {curricularMode.tierName}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Target: {curricularMode.targetBoards}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Method of Learning:</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className={`w-4 h-4 ${curricularMode.colorTheme.accent}`} />
                  {curricularMode.methodName}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-1.5 max-w-3xl">
                {depthSummary.summary}
              </p>
            </div>

            {/* Quick-Jump to Curricular Recommended Tab */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
              <button
                onClick={handleJumpToRecommendedTab}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Jump to {curricularMode.recommendedTabLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Depth Dial Quick Tiers Strip */}
          <div className="mt-4 pt-3.5 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Active Medical Tier:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 gap-1">
                {tiersList.map((tier) => {
                  const isCurrent = depthLevel === tier || (depthLevel === 'MS2-3' && tier === 'MS2');
                  return (
                    <button
                      key={tier}
                      onClick={() => onChangeDepth(tier)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-600 text-white shadow-xs scale-102'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 font-medium">
              <span className="font-bold text-teal-700 dark:text-teal-400">High-Yield Exam Pearl: </span>
              {depthSummary.exam_pearl}
            </div>
          </div>
        </div>

        {/* Global Health Lens & Trust Verification Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Trust Score: {entry.trust_score}% Verified</span>
            <span>•</span>
            <span>Reviewed: {entry.last_reviewed}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-cyan-500" />
            <span>WHO Essential Priority: {entry.global_health_note.who_essential_medicines.slice(0, 2).join(', ')}</span>
          </div>
        </div>
      </div>

      {/* 2. Red Flag Ribbon (Coral Sticky Emergency Strip) */}
      <RedFlagRibbon redFlags={entry.red_flags} />

      {/* 3. Depth Dial (MS1 > MS2 > MS3 > MS4 > Resident) */}
      <DepthDial currentLevel={depthLevel} onChangeLevel={onChangeDepth} />

      {/* User-Verified Specific Symptom Diagnostic Card */}
      {entry.verified_symptom_analysis && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50/70 to-indigo-50/50 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-indigo-950/30 border-2 border-teal-500/50 shadow-sm space-y-3.5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 uppercase tracking-wide border border-teal-300 dark:border-teal-800">
                    User-Verified Symptom Association
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    entry.verified_symptom_analysis.correlationStrength.includes('Pathognomonic')
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                  }`}>
                    ● {entry.verified_symptom_analysis.correlationStrength}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-serif-medical text-slate-900 dark:text-white mt-0.5">
                  "{entry.verified_symptom_analysis.symptomQuery}" in {entry.verified_symptom_analysis.associatedCondition}
                </h3>
              </div>
            </div>

            <a
              href={entry.verified_symptom_analysis.citationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 shadow-2xs cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
            >
              <span>Verify on PubMed</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Diagnostic Likelihood & Specificity Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-sans font-bold">Likelihood Ratio (LR+)</span>
              <span className="text-base font-bold text-teal-700 dark:text-teal-300">
                +{entry.verified_symptom_analysis.likelihoodRatioPositive.toFixed(1)}
              </span>
              <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">&gt; 5 indicates high rule-in value</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-sans font-bold">Sensitivity</span>
              <span className="text-base font-bold text-indigo-700 dark:text-indigo-300">
                {entry.verified_symptom_analysis.sensitivityPercent}%
              </span>
              <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">True positive rate</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-sans font-bold">Specificity</span>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                {entry.verified_symptom_analysis.specificityPercent}%
              </span>
              <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">True negative rate</span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-sans font-bold">Emergency Red Flag</span>
              <span className={`text-base font-bold ${entry.verified_symptom_analysis.isRedFlag ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {entry.verified_symptom_analysis.isRedFlag ? '⚠️ Red Flag' : 'Standard'}
              </span>
              <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">Acuity triage</span>
            </div>
          </div>

          {/* Pathophysiological Mechanism */}
          <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-teal-200/60 dark:border-teal-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-bold text-teal-800 dark:text-teal-300 block">
              Pathophysiological Mechanism Linking Symptom to Pathology:
            </span>
            <p className="leading-relaxed">
              {entry.verified_symptom_analysis.underlyingMechanism}
            </p>
          </div>

          {/* Clinical Action Recommendation */}
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
            entry.verified_symptom_analysis.isRedFlag
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold mr-1">Evidence-Based Clinical Guidance:</span>
              <span>{entry.verified_symptom_analysis.clinicalRecommendation}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Matrix Tabs Bar with Curricular Learning Focus Badges */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {[
          { id: 'pathway', label: '1. Pathway Chain', icon: <Activity className="w-3.5 h-3.5" />, baseBadge: 'MVP' },
          { id: 'vindicate', label: '2. VINDICATE & D3 Graph', icon: <Layers className="w-3.5 h-3.5" />, baseBadge: 'D3.js' },
          { id: 'tridomain', label: '3. Tri-Domain & Range React', icon: <Compass className="w-3.5 h-3.5" />, baseBadge: 'Domains' },
          { id: 'severity', label: '4. Severity & Triggers', icon: <Flame className="w-3.5 h-3.5" />, baseBadge: 'Mild/Mod/Sev' },
          { id: 'bodysim', label: '5. Body Simulation', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'presentation', label: '6. Clinical Signs', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          { id: 'treatment', label: '7. Treatment & Rx', icon: <Pill className="w-3.5 h-3.5" /> },
          { id: 'calculators', label: '8. Clinical Tools', icon: <Calculator className="w-3.5 h-3.5" />, baseBadge: 'Validated' },
          { id: 'exam', label: '9. Exam Lens', icon: <Award className="w-3.5 h-3.5" />, baseBadge: 'MVP' },
          { id: 'sim', label: '10. Hemodynamics Lab', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'mindmap', label: '11. Mind Map', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'evidence', label: '12. Open Sources', icon: <ShieldCheck className="w-3.5 h-3.5" />, baseBadge: 'Verified' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const isHighYield = curricularMode.highYieldTabs.includes(tab.id);
          const isRecommended = curricularMode.recommendedTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
                  ★ {curricularMode.tier} Core
                </span>
              )}
              {!isRecommended && isHighYield && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold ml-1">
                  Focus
                </span>
              )}
              {!isHighYield && tab.baseBadge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-white font-bold ml-1">
                  {tab.baseBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Training Challenge Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white mr-1">{curricularMode.tier} Clinical Goal:</strong>
            {curricularMode.activeChallenge}
          </span>
        </div>
        <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 shrink-0 hidden md:inline">
          Method: {curricularMode.methodName}
        </span>
      </div>

      {/* 5. Render Active Tab Content */}
      <div>
        {activeTab === 'pathway' && (
          <PathwayChainEngine
            nodes={entry.pathway}
            depthLevel={depthLevel}
            onOpenCitation={handleOpenCitation}
            onMakeFlashcard={onMakeFlashcard}
          />
        )}

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

        {activeTab === 'tridomain' && (
          <TriDomainClassificationStudio entry={entry} depthLevel={depthLevel} />
        )}

        {activeTab === 'severity' && (
          <SeverityTriggerStudio entry={entry} />
        )}

        {activeTab === 'bodysim' && (
          <BodySimulationStudio entry={entry} />
        )}

        {activeTab === 'presentation' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                Bedside Semiology
              </span>
              <h3 className="text-lg font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
                Clinical Signs & Physical Examination Maneuvers
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted physical maneuvers, cardinal symptoms, and validated bedside diagnostic yield calibrated for {depthLevel} training level.
              </p>
            </div>

            {/* Classic Presentation Summary */}
            <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-xs">
              <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                Classic Clinical Presentation:
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {entry.presentation.classic}
              </p>
            </div>

            {/* Cardinal Symptoms */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Cardinal Symptoms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {entry.presentation.cardinal_symptoms.map((symptom, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Examination Maneuvers */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Physical Examination Signs & Bedside Maneuvers
              </h4>
              <div className="space-y-2.5">
                {entry.presentation.physical_signs.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

            {/* Bedside Scoring Systems */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                Bedside Scoring Systems & Rules
              </h4>
              <div className="space-y-3">
                {entry.presentation.scoring_systems.map((score, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{score.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">Clinical Decision Rule</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {score.criteria.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-teal-700 dark:text-teal-300 font-semibold">
                      Action: {score.clinical_action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                Therapeutic Protocol
              </span>
              <h3 className="text-lg font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
                Evidence-Based Treatment & Pharmacology
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Acute resuscitation, definitive intervention, and mechanism-directed pharmacotherapy calibrated for {depthLevel} trainees.
              </p>
            </div>

            {/* Acute Stabilization */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
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
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
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
                  <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{rx.representative_agent}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {rx.drug_class}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-700 dark:text-slate-200">Mechanism: </strong>
                      {rx.mechanism}
                    </p>
                    <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                      <strong className="text-amber-800 dark:text-amber-300 font-bold">Safety & Monitoring: </strong>
                      {rx.essential_monitoring}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculators' && (
          <ClinicalCalculatorsStudio />
        )}

        {activeTab === 'exam' && (
          <ExamLensView examData={entry.exam_lens} />
        )}

        {activeTab === 'mindmap' && (
          <MindMapStudio
            mindMap={entry.mindmap}
            diseaseTitle={entry.title}
          />
        )}

        {activeTab === 'sim' && (
          <SimulationLab />
        )}

        {activeTab === 'evidence' && (
          <EvidenceShelf evidenceList={entry.evidence} diseaseTitle={entry.title} />
        )}
      </div>
    </div>
  );
};
