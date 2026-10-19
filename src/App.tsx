import React, { useState, useEffect } from 'react';
import { 
  QubitsDiseaseEntry, 
  DepthLevel, 
  UserProgress 
} from './types/disease';
import { QUBITS_SEED_ENTRIES } from './data/qubitsData';
import { buildDynamicConditionEntry } from './services/openSourceVerification';
import { downloadConditionPdf } from './services/pdfGenerator';
import { 
  loadLocalProgress, 
  toggleBookmark, 
  toggleCompletion, 
  addFlashcard, 
  subscribeToProgress,
  getSupabaseConfig 
} from './services/supabaseClient';

// Components
import { NavigationSidebar, NavigationTab } from './components/NavigationSidebar';
import { TodayView } from './components/TodayView';
import { DifferentialLab } from './components/DifferentialLab';
import { ArgueDifferentialStudio } from './components/ArgueDifferentialStudio';
import { SourcesView } from './components/SourcesView';
import { SettingsView, SyllabusLens, SettingLens } from './components/SettingsView';
import { LibraryView } from './components/LibraryView';
import { CommandPalette } from './components/CommandPalette';
import { UserConditionInputBar } from './components/UserConditionInputBar';
import { DiseaseDetailView } from './components/DiseaseDetailView';
import { ClinicalCalculatorsStudio } from './components/ClinicalCalculatorsStudio';
import { FlashcardsStudyModal } from './components/FlashcardsStudyModal';
import { CaseForgeModal } from './components/CaseForgeModal';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { TextHighlightCapture } from './components/TextHighlightCapture';

import { 
  Stethoscope, 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Search, 
  FileDown, 
  FileText,
  AlertTriangle,
  Compass,
  CheckCircle2,
  X
} from 'lucide-react';

export function App() {
  // Theme state
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(() => {
    return (localStorage.getItem('qubits-med-theme') as 'light' | 'dark' | 'auto') || 'light';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const isDarkEffective = themeMode === 'dark' || (themeMode === 'auto' && systemPrefersDark);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

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

  // Navigation tab state
  const [currentNavTab, setCurrentNavTab] = useState<NavigationTab>('explore');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Curricular & Setting Lenses
  const [syllabusLens, setSyllabusLens] = useState<SyllabusLens>('usmle');
  const [settingLens, setSettingLens] = useState<SettingLens>('high_resource');
  const [depthLevel, setDepthLevel] = useState<DepthLevel>('MS1');

  // Condition State (initialized with acute-appendicitis as default high-yield entry)
  const [userCondition, setUserCondition] = useState<QubitsDiseaseEntry | null>(QUBITS_SEED_ENTRIES[0]);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationHistory, setVerificationHistory] = useState<QubitsDiseaseEntry[]>([QUBITS_SEED_ENTRIES[0]]);

  // User progress & Modals
  const [userProgress, setUserProgress] = useState<UserProgress>(loadLocalProgress());
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState<boolean>(false);
  const [isCaseForgeOpen, setIsCaseForgeOpen] = useState<boolean>(false);
  const [isSyncSettingsOpen, setIsSyncSettingsOpen] = useState<boolean>(false);

  // Custom PDF Issue Generation Modal
  const [isPdfPromptOpen, setIsPdfPromptOpen] = useState<boolean>(false);
  const [customPdfIssue, setCustomPdfIssue] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToProgress((updated) => {
      setUserProgress(updated);
    });
    return () => unsubscribe();
  }, []);

  const supabaseConfig = getSupabaseConfig();

  // Verification Handler
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
      setCurrentNavTab('explore');

      if (verifiedEntry.cards && verifiedEntry.cards.length > 0) {
        verifiedEntry.cards.forEach(c => {
          const exists = userProgress.flashcards.some(f => f.front === c.front);
          if (!exists) addFlashcard(c);
        });
      }
    } catch (err) {
      console.error('Open-source condition verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  // Condition actions
  const isBookmarked = userCondition ? userProgress.bookmarkedDiseaseIds.includes(userCondition.id) : false;
  const isCompleted = userCondition ? userProgress.completedDiseaseIds.includes(userCondition.id) : false;

  const handleToggleBookmark = () => {
    if (userCondition) toggleBookmark(userCondition.id);
  };

  const handleToggleComplete = () => {
    if (userCondition) toggleCompletion(userCondition.id);
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

  // PDF Export Handler
  const handleExportPdfForActiveCondition = (entryToExport?: QubitsDiseaseEntry) => {
    const target = entryToExport || userCondition;
    if (target) {
      downloadConditionPdf({
        entry: target,
        depthLevel,
        syllabusLens: syllabusLens.toUpperCase(),
        settingLens: settingLens === 'high_resource' ? 'High-Resource Hospital' : 'Low-Resource / WHO Essential'
      });
    } else {
      setIsPdfPromptOpen(true);
    }
  };

  // Generate PDF for any specific issue given by the user
  const handleGeneratePdfForSpecificIssue = async () => {
    if (!customPdfIssue.trim()) return;
    setIsGeneratingPdf(true);
    try {
      const entry = await buildDynamicConditionEntry(customPdfIssue.trim(), 'disease-name', 'all');
      downloadConditionPdf({
        entry,
        depthLevel,
        syllabusLens: syllabusLens.toUpperCase(),
        settingLens: settingLens === 'high_resource' ? 'High-Resource Hospital' : 'Low-Resource / WHO Essential'
      });
      setIsPdfPromptOpen(false);
      setCustomPdfIssue('');
    } catch (err) {
      console.error('Failed to generate PDF for issue:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const dueFlashcardsCount = userProgress.flashcards.filter(f => {
    if (f.fsrs_state?.due) return f.fsrs_state.due <= Date.now();
    return true;
  }).length;

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0B1F3A] text-[#0B1F3A] dark:text-[#F7F4EE] flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* 1. Sleek Navigation Menu Bar / Sidebar */}
      <NavigationSidebar
        activeTab={currentNavTab}
        onSelectTab={setCurrentNavTab}
        dueFlashcardsCount={dueFlashcardsCount}
        depthLevel={depthLevel}
        onChangeDepth={setDepthLevel}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onExportPdf={() => handleExportPdfForActiveCondition()}
        isDarkEffective={isDarkEffective}
        onToggleTheme={() => setThemeMode(isDarkEffective ? 'light' : 'dark')}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Minimal Utility Bar */}
        <header className="h-14 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400">
              QUBITS
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">
              {currentNavTab.replace('-', ' ')}
            </span>
            {userCondition && currentNavTab === 'explore' && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                  {userCondition.title}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Direct PDF Generate Button in Menu Bar */}
            <button
              onClick={() => setIsPdfPromptOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
              title="Generate PDF for any condition or issue"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Generate PDF</span>
            </button>

            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <span className="text-[10px] font-mono opacity-60">⌘K</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route View Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* TAB 1: TODAY */}
          {currentNavTab === 'today' && (
            <TodayView
              lastCondition={userCondition}
              onSelectCondition={(id) => {
                const found = QUBITS_SEED_ENTRIES.find(s => s.id === id);
                if (found) {
                  setUserCondition(found);
                  setCurrentNavTab('explore');
                }
              }}
              onNavigateTab={setCurrentNavTab}
              userProgress={userProgress}
              depthLevel={depthLevel}
              onExportPdf={() => handleExportPdfForActiveCondition()}
            />
          )}

          {/* TAB 2: EXPLORE (Condition Search & Breakdown) */}
          {currentNavTab === 'explore' && (
            <div className="space-y-6">
              {/* Search Console */}
              <UserConditionInputBar
                currentConditionTitle={userCondition?.title}
                isVerifying={isVerifying}
                onVerifyCondition={handleVerifyUserInput}
                onResetCondition={() => setUserCondition(null)}
              />

              {/* History Chips */}
              {verificationHistory.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider shrink-0">
                    Recent:
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

              {/* Condition View or Minimal Landing State */}
              {userCondition ? (
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
                  onExportPdf={() => handleExportPdfForActiveCondition()}
                />
              ) : (
                /* Pure Minimal Landing Page */
                <div className="py-12 sm:py-16 text-center max-w-2xl mx-auto px-4 space-y-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
                    <Stethoscope className="w-8 h-8" />
                  </div>

                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-medical text-slate-900 dark:text-white tracking-tight">
                      Hold every differential until the evidence collapses it.
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-sans">
                      QUBITS is the only clinical study tool where every claim has an unretracted PubMed receipt, differentials stay open until sourced findings narrow them, and explanation depth dynamically calibrates to your training stage.
                    </p>
                  </div>

                  {/* 3 Example Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Instant Examples:
                    </span>
                    {[
                      { label: 'Acute Appendicitis', id: 'acute-appendicitis' },
                      { label: 'Type 2 Diabetes', id: 'type-2-diabetes' },
                      { label: 'Knee Pain & Internal Derangement', id: 'knee-pain' }
                    ].map(chip => (
                      <button
                        key={chip.id}
                        onClick={() => {
                          if (chip.id === 'knee-pain') {
                            handleVerifyUserInput('knee pain', 'disease-name', 'all');
                          } else {
                            const found = QUBITS_SEED_ENTRIES.find(s => s.id === chip.id);
                            if (found) setUserCondition(found);
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-teal-500 shadow-2xs cursor-pointer transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIFFERENTIAL LAB */}
          {currentNavTab === 'diff-lab' && (
            <DifferentialLab />
          )}

          {/* TAB 4: RECALL / FLASHCARDS */}
          {currentNavTab === 'recall' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold font-serif-medical text-slate-900 dark:text-white">
                    Recall & Spaced Repetition
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Free Spaced Repetition Scheduler (FSRS) algorithm calibrated for medical boards.
                  </p>
                </div>
                <button
                  onClick={() => setIsFlashcardsOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Start Full-Screen Recall</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <LibraryView
                userProgress={userProgress}
                onSelectCondition={(id) => {
                  const found = QUBITS_SEED_ENTRIES.find(s => s.id === id);
                  if (found) {
                    setUserCondition(found);
                    setCurrentNavTab('explore');
                  }
                }}
                onExportPdfForCondition={handleExportPdfForActiveCondition}
              />
            </div>
          )}

          {/* TAB 5: EXAM & VIVA EXAMINER */}
          {currentNavTab === 'exam-lens' && (
            <ArgueDifferentialStudio
              currentCondition={userCondition}
              depthLevel={depthLevel}
            />
          )}

          {/* TAB 6: CLINICAL CALCULATORS */}
          {currentNavTab === 'tools' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
                <h1 className="text-2xl font-extrabold font-serif-medical text-slate-900 dark:text-white">
                  Validated Clinical Decision Tools
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Evidence-based risk stratification calculators grounded with primary paper citations (JAMA, NEJM, Lancet).
                </p>
              </div>
              <ClinicalCalculatorsStudio />
            </div>
          )}

          {/* TAB 7: LIBRARY */}
          {currentNavTab === 'library' && (
            <LibraryView
              userProgress={userProgress}
              onSelectCondition={(id) => {
                const found = QUBITS_SEED_ENTRIES.find(s => s.id === id);
                if (found) {
                  setUserCondition(found);
                  setCurrentNavTab('explore');
                }
              }}
              onExportPdfForCondition={handleExportPdfForActiveCondition}
            />
          )}

          {/* TAB 8: SOURCES & PROVENANCE */}
          {currentNavTab === 'sources' && (
            <SourcesView />
          )}

          {/* TAB 9: SETTINGS & LENSES */}
          {currentNavTab === 'settings' && (
            <SettingsView
              themeMode={themeMode}
              onChangeThemeMode={setThemeMode}
              syllabusLens={syllabusLens}
              onChangeSyllabusLens={setSyllabusLens}
              settingLens={settingLens}
              onChangeSettingLens={setSettingLens}
              depthLevel={depthLevel}
              onChangeDepthLevel={setDepthLevel}
              onOpenSyncModal={() => setIsSyncSettingsOpen(true)}
              isSupabaseConnected={supabaseConfig.isConnected}
            />
          )}
        </main>
      </div>

      {/* 3. Global Command Palette (Cmd/Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCondition={(id) => {
          const found = QUBITS_SEED_ENTRIES.find(s => s.id === id);
          if (found) {
            setUserCondition(found);
            setCurrentNavTab('explore');
          }
        }}
        onSelectTab={(tabId) => setCurrentNavTab(tabId as NavigationTab)}
        onExportPdf={() => handleExportPdfForActiveCondition()}
      />

      {/* 4. Custom Issue PDF Export Modal */}
      {isPdfPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            onClick={() => setIsPdfPromptOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Generate Clinical Summary PDF
                </h3>
              </div>
              <button 
                onClick={() => setIsPdfPromptOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Enter any condition, presentation, or specific medical issue to generate a publication-quality clinical brief with honest citations:
            </p>

            <input
              type="text"
              value={customPdfIssue}
              onChange={(e) => setCustomPdfIssue(e.target.value)}
              placeholder="e.g. Acute Appendicitis, Knee Pain, Pulmonary Embolism..."
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPdfPromptOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePdfForSpecificIssue}
                disabled={!customPdfIssue.trim() || isGeneratingPdf}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                {isGeneratingPdf ? <span>Compiling Verified PDF...</span> : <span>Download PDF</span>}
                <FileDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Highlight to Flashcard Capture */}
      <TextHighlightCapture
        diseaseId={userCondition?.id || 'general-pearl'}
        diseaseName={userCondition?.title || 'General Medicine'}
        onSaveFlashcard={addFlashcard}
      />

      {/* 6. Spaced Repetition Modal */}
      {isFlashcardsOpen && (
        <FlashcardsStudyModal
          isOpen={isFlashcardsOpen}
          onClose={() => setIsFlashcardsOpen(false)}
          flashcards={userProgress.flashcards}
          onReviewCard={() => {}}
        />
      )}

      {/* 7. Case Forge Simulation Lab Modal */}
      {isCaseForgeOpen && userCondition && (
        <CaseForgeModal
          isOpen={isCaseForgeOpen}
          onClose={() => setIsCaseForgeOpen(false)}
          diseaseTitle={userCondition.title}
        />
      )}

      {/* 8. Supabase Sync Modal */}
      {isSyncSettingsOpen && (
        <SupabaseSyncModal
          isOpen={isSyncSettingsOpen}
          onClose={() => setIsSyncSettingsOpen(false)}
          userProgress={userProgress}
          onForceSync={() => {}}
        />
      )}
    </div>
  );
}

export default App;
