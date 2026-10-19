import React from 'react';
import { 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  GitPullRequest, 
  GraduationCap, 
  Clock, 
  FileDown,
  Stethoscope,
  Activity,
  Award
} from 'lucide-react';
import { QubitsDiseaseEntry, UserProgress, DepthLevel } from '../types/disease';

interface TodayViewProps {
  lastCondition: QubitsDiseaseEntry | null;
  onSelectCondition: (conditionId: string) => void;
  onNavigateTab: (tab: any) => void;
  userProgress: UserProgress;
  depthLevel: DepthLevel;
  onExportPdf?: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  lastCondition,
  onSelectCondition,
  onNavigateTab,
  userProgress,
  depthLevel,
  onExportPdf
}) => {
  const dueFlashcards = userProgress.flashcards.filter(f => {
    if (f.fsrs_state?.due) return f.fsrs_state.due <= Date.now();
    return true;
  });
  const suggestedTopic = {
    id: 'acute-appendicitis',
    title: 'Acute Appendicitis',
    pearl: 'Visceral T10 dull periumbilical pain shifting to sharp somatic RLQ pain as inflammation touches parietal peritoneum.',
    highYieldExam: 'USMLE Step 1/2 CK Perennial Favorite'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Hero Greeting */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Daily Medical Rounds
              </span>
              <span className="text-xs font-mono text-slate-500">
                Calibrated to: {depthLevel} Level
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-medical text-slate-900 dark:text-white">
              Today's Evidence Briefing
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              "Hold every differential until the evidence collapses it."
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Due Cards</span>
              <span className="text-base font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {dueFlashcards.length}
              </span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Mastered</span>
              <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {userProgress.completedDiseaseIds.length}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Daily Action Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Card 1: Due Flashcards Review */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-amber-50/70 to-orange-50/40 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200 dark:border-amber-850 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                FSRS Spaced Review
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {dueFlashcards.length > 0 
                  ? `You have ${dueFlashcards.length} clinical flashcards ready for active recall review.`
                  : 'All flashcards reviewed! Add more from any condition using text highlight.'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('recall')}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>{dueFlashcards.length > 0 ? 'Start Review' : 'Open Recall Deck'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Resume Last Condition */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-teal-50/70 to-emerald-50/40 dark:from-teal-950/30 dark:to-emerald-950/20 border border-teal-200 dark:border-teal-850 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {lastCondition ? 'Resume Condition' : 'Explore Clinical OS'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {lastCondition 
                  ? `${lastCondition.title} (${lastCondition.system}) — ${lastCondition.scope_note}`
                  : 'Explore acute appendicitis, type 2 diabetes, or enter any symptom.'}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('explore')}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>{lastCondition ? `Open ${lastCondition.title}` : 'Open Explore'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Suggested High-Yield Topic */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-50/70 to-purple-50/40 dark:from-indigo-950/30 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-850 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 font-bold uppercase">
                {suggestedTopic.highYieldExam}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                {suggestedTopic.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {suggestedTopic.pearl}
              </p>
            </div>
            <button
              onClick={() => onSelectCondition(suggestedTopic.id)}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Study High-Yield Pearl</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Signature Differential Lab Quick Launch Strip */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Signature Tool
              </span>
              <span className="text-xs font-mono text-slate-400">Bayesian Reasoning</span>
            </div>
            <h3 className="text-base font-bold font-serif-medical text-white mt-0.5">
              Practice in the Differential Lab
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Re-rank candidate diagnoses in real-time strictly using JAMA Rational Clinical Exam likelihood ratios.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('diff-lab')}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>Launch Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
