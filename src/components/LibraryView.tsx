import React, { useState } from 'react';
import { 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  FileDown, 
  Trash2, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { QubitsDiseaseEntry, UserProgress } from '../types/disease';
import { QUBITS_SEED_ENTRIES } from '../data/qubitsData';

interface LibraryViewProps {
  userProgress: UserProgress;
  onSelectCondition: (conditionId: string) => void;
  onExportPdfForCondition?: (entry: QubitsDiseaseEntry) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  userProgress,
  onSelectCondition,
  onExportPdfForCondition
}) => {
  const [filter, setFilter] = useState<'bookmarks' | 'history' | 'completed' | 'notes'>('bookmarks');

  // Find bookmarked entries from seed entries or fallback
  const bookmarkedEntries = QUBITS_SEED_ENTRIES.filter(e => userProgress.bookmarkedDiseaseIds.includes(e.id));
  const completedEntries = QUBITS_SEED_ENTRIES.filter(e => userProgress.completedDiseaseIds.includes(e.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Personal Workspace
              </span>
              <span className="text-xs font-mono text-slate-500">Curated Records & Notes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-medical text-slate-900 dark:text-white mt-0.5">
              Clinical Library & Archive
            </h1>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 flex-wrap">
          {[
            { id: 'bookmarks', label: 'Bookmarks', count: userProgress.bookmarkedDiseaseIds.length, icon: <Bookmark className="w-3.5 h-3.5" /> },
            { id: 'completed', label: 'Mastered Topics', count: userProgress.completedDiseaseIds.length, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { id: 'notes', label: 'Clinical Flashcards & Notes', count: userProgress.flashcards.length, icon: <FileText className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Stream */}
      <div className="space-y-3">
        {filter === 'bookmarks' && (
          <div className="space-y-3">
            {bookmarkedEntries.length > 0 ? (
              bookmarkedEntries.map(entry => (
                <div 
                  key={entry.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                        {entry.system}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ICD-10: {entry.codes.icd10}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {entry.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {entry.scope_note}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onExportPdfForCondition && (
                      <button
                        onClick={() => onExportPdfForCondition(entry)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer"
                        title="Download Summary PDF"
                      >
                        <FileDown className="w-3.5 h-3.5 text-teal-600" />
                        <span>PDF</span>
                      </button>
                    )}
                    <button
                      onClick={() => onSelectCondition(entry.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Study Case</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                <Bookmark className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No bookmarked conditions yet. Click the bookmark icon on any condition to pin it here.</p>
              </div>
            )}
          </div>
        )}

        {filter === 'completed' && (
          <div className="space-y-3">
            {completedEntries.length > 0 ? (
              completedEntries.map(entry => (
                <div 
                  key={entry.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {entry.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        {entry.system} • Mastered in {entry.last_reviewed}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCondition(entry.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    Review
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Mark topics as studied/mastered on any condition to track your licensing syllabus progress.</p>
              </div>
            )}
          </div>
        )}

        {filter === 'notes' && (
          <div className="space-y-3">
            {userProgress.flashcards.length > 0 ? (
              userProgress.flashcards.map((card, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-700 dark:text-teal-300 uppercase font-mono text-[10px]">
                      {card.disease_name || card.diseaseName || 'Clinical Pearl'}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Interval: {card.intervalDays || 1}d • Reps: {card.fsrs_state?.reps || card.reviewCount || 0}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Q: {card.front}
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 italic">
                    A: {card.back}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>Highlight any text on a condition page to instantly save it as an active recall flashcard.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
