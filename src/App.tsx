/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DepthLevel, Flashcard, UserProgress, QubitsDiseaseEntry } from './types/disease';
import { 
  loadLocalProgress, 
  saveProgress, 
  addFlashcard, 
  removeFlashcard, 
  reviewFlashcard, 
  toggleBookmark, 
  toggleCompletion,
  subscribeToProgress,
  getSupabaseConfig
} from './services/supabaseClient';
import { buildDynamicConditionEntry } from './services/openSourceVerification';
import { Header } from './components/Header';
import { UserConditionInputBar } from './components/UserConditionInputBar';
import { DiseaseDetailView } from './components/DiseaseDetailView';
import { FlashcardsStudyModal } from './components/FlashcardsStudyModal';
import { CaseForgeModal } from './components/CaseForgeModal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { TextHighlightCapture } from './components/TextHighlightCapture';
import { 
  Sparkles, 
  Brain, 
  Stethoscope, 
  Layers, 
  ShieldCheck, 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  MapPin,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Theme Mode: 'light' | 'dark' | 'auto' (saved in localStorage across sessions)
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qubits-med-theme');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved;
    }
    return 'auto';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Effective dark mode flag
  const isDarkEffective = themeMode === 'dark' || (themeMode === 'auto' && systemPrefersDark);

  // Listen to system prefers-color-scheme media query
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update HTML root element with .dark class and save preference
  useEffect(() => {
    if (isDarkEffective) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('qubits-med-theme', themeMode);
  }, [isDarkEffective, themeMode]);

  // State: Condition is given ONLY by the user!
  const [userCondition, setUserCondition] = useState<QubitsDiseaseEntry | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationHistory, setVerificationHistory] = useState<QubitsDiseaseEntry[]>([]);

  const [depthLevel, setDepthLevel] = useState<DepthLevel>('MS1');
  const [userProgress, setUserProgress] = useState<UserProgress>(loadLocalProgress());
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState<boolean>(false);
  const [isCaseForgeOpen, setIsCaseForgeOpen] = useState<boolean>(false);
  const [isSyncSettingsOpen, setIsSyncSettingsOpen] = useState<boolean>(false);

  // Subscribe to real-time progress updates (across tabs and upstream)
  useEffect(() => {
    const unsubscribe = subscribeToProgress((updated) => {
      setUserProgress(updated);
    });
    return () => unsubscribe();
  }, []);

  const supabaseConfig = getSupabaseConfig();

  // Handler for user-entered disease or trigger region with live open-source verification
  const handleVerifyUserInput = async (
    userInput: string, 
    mode: 'disease-name' | 'body-region' | 'condition-symptom', 
    repository: string = 'all',
    symptomInput?: string
  ) => {
    if (!userInput.trim()) return;
    setIsVerifying(true);
    try {
      const verifiedEntry = await buildDynamicConditionEntry(userInput, mode, repository, symptomInput);
      setUserCondition(verifiedEntry);
      setVerificationHistory((prev) => {
        const filtered = prev.filter(p => p.id !== verifiedEntry.id);
        return [verifiedEntry, ...filtered].slice(0, 10);
      });

      // Auto-seed this condition's initial flashcards into user's recall deck
      if (verifiedEntry.cards && verifiedEntry.cards.length > 0) {
        verifiedEntry.cards.forEach(c => {
          const exists = userProgress.flashcards.some(f => f.front === c.front);
          if (!exists) {
            addFlashcard(c);
          }
        });
      }
    } catch (err) {
      console.error('Open-source condition verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const isBookmarked = userCondition ? userProgress.bookmarkedDiseaseIds.includes(userCondition.id) : false;
  const isCompleted = userCondition ? userProgress.completedDiseaseIds.includes(userCondition.id) : false;

  const handleToggleBookmark = () => {
    if (userCondition) {
      toggleBookmark(userCondition.id);
    }
  };

  const handleToggleComplete = () => {
    if (userCondition) {
      toggleCompletion(userCondition.id);
    }
  };

  const handleMakeFlashcard = (text: string, title: string) => {
    if (!userCondition) return;
    addFlashcard({
      type: 'basic',
      front: `Explain the clinical significance of: ${title}`,
      back: text,
      disease_id: userCondition.id,
      disease_name: userCondition.title,
      source_id: userCondition.evidence[0]?.source_id || 'src-manual-pearl',
      tags: ['High-Yield', 'Pathophysiology', userCondition.system],
      fsrs_state: {
        stability: 2.0,
        difficulty: 3.0,
        reps: 0,
        lapses: 0,
        state: 'new',
        last_review: Date.now(),
        due: Date.now() + 86400000
      }
    });
    setIsFlashcardsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0B1F3A] text-[#0B1F3A] dark:text-[#F7F4EE] transition-colors duration-200 flex flex-col font-sans">
      {/* 1. Global Navigation Header */}
      <Header
        themeMode={themeMode}
        isDarkEffective={isDarkEffective}
        onChangeThemeMode={setThemeMode}
        userProgress={userProgress}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        onOpenSyncSettings={() => setIsSyncSettingsOpen(true)}
        isSupabaseConnected={supabaseConfig.isConnected}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* User Condition & Trigger Region Input Console */}
        <UserConditionInputBar
          currentConditionTitle={userCondition?.title}
          isVerifying={isVerifying}
          onVerifyCondition={handleVerifyUserInput}
          onResetCondition={() => setUserCondition(null)}
        />

        {/* History of User Verified Conditions during this session */}
        {verificationHistory.length > 1 && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-teal-600" />
              <span>Session Conditions ({verificationHistory.length}):</span>
            </span>
            {verificationHistory.map(item => (
              <button
                key={item.id}
                onClick={() => setUserCondition(item)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
                  userCondition?.id === item.id
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}

        {/* CONDITIONAL RENDERING: USER-GIVEN CONDITION DASHBOARD */}
        {userCondition ? (
          <div>
            {/* Open-Source Verification Status Ribbon */}
            <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Clinical Entity Cross-Validated via Open Verified Repositories
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                      {userCondition.evidence.length} Corroborated Citations
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Grounding: NCBI PubMed/PMC • Europe PMC • WHO Guidelines • openFDA • StatPearls • CDC • MeSH: {userCondition.codes.mesh}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setUserCondition(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  Enter Another Condition
                </button>
              </div>
            </div>

            {/* Dynamic Disease Breakdown Operating System */}
            <DiseaseDetailView
              entry={userCondition}
              depthLevel={depthLevel}
              onChangeDepth={setDepthLevel}
              isBookmarked={isBookmarked}
              isCompleted={isCompleted}
              onToggleBookmark={handleToggleBookmark}
              onToggleComplete={handleToggleComplete}
              onMakeFlashcard={handleMakeFlashcard}
              onOpenCaseForge={() => setIsCaseForgeOpen(true)}
            />
          </div>
        ) : (
          /* WELCOME / HERO STATE WHEN NO CONDITION IS LOADED YET */
          <div className="py-12 sm:py-16 text-center max-w-3xl mx-auto px-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20 mb-6">
              <Stethoscope className="w-8 h-8" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-medical text-slate-900 dark:text-white tracking-tight">
              Evidence-Based Clinical OS for Undergraduate Medicine
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
              No static hardcoded diseases. Enter any condition, disease name, or anatomical trigger region in the search bar above to verify it live against open-source PubMed literature and generate the full 9-stage Pathway, VINDICATE framework, Depth Dial, and Exam Lens.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-left">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 mb-2">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  1. Enter Any Disease
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Type any pathology (e.g. Acute Pancreatitis, Pulmonary Embolism, DKA, Meningitis).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  2. Or Trigger Region
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Type any pain trigger (e.g. Right Lower Quadrant, Tearing Chest Pain, Severe Headache).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  3. Verified from PubMed
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Connects to open-source NCBI E-Utilities to ground claims with real PMIDs and DOIs.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Text Highlight Capture (Highlight text anywhere to save as Flashcard) */}
      <TextHighlightCapture
        diseaseId={userCondition?.id || 'general-pearl'}
        diseaseName={userCondition?.title || 'General Medicine'}
        onSaveFlashcard={(card) => addFlashcard(card)}
      />

      {/* 5. Adaptive Recall Study Modal */}
      <FlashcardsStudyModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        flashcards={userProgress.flashcards}
        onReviewCard={reviewFlashcard}
        onAddCard={(card) => addFlashcard(card)}
      />

      {/* 6. Case Forge Virtual Patient Simulation Modal */}
      <CaseForgeModal
        isOpen={isCaseForgeOpen}
        onClose={() => setIsCaseForgeOpen(false)}
        diseaseTitle={userCondition?.title || 'Acute Clinical Insult'}
      />

      {/* 7. Supabase Real-Time Sync Configuration Modal */}
      <SupabaseSyncModal
        isOpen={isSyncSettingsOpen}
        onClose={() => setIsSyncSettingsOpen(false)}
        userProgress={userProgress}
        onForceSync={() => saveProgress(userProgress)}
      />
    </div>
  );
}
