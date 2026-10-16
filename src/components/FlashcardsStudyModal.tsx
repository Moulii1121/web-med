import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  Layers, 
  Download, 
  CheckCircle2, 
  Brain, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Flashcard } from '../types/disease';
import { Plus } from 'lucide-react';

interface FlashcardsStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  onReviewCard: (id: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onAddCard?: (card: Omit<Flashcard, 'id'>) => void;
}

export const FlashcardsStudyModal: React.FC<FlashcardsStudyModalProps> = ({
  isOpen,
  onClose,
  flashcards,
  onReviewCard,
  onAddCard
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedSession, setCompletedSession] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  // New card inputs
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newType, setNewType] = useState<Flashcard['type']>('basic');
  const [newTags, setNewTags] = useState('High-Yield, Clinical');

  if (!isOpen) return null;

  const currentCard = flashcards[currentIndex];

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    onReviewCard(currentCard.id, rating);
    setIsFlipped(false);

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompletedSession(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const exportAnkiCSV = () => {
    const csvRows = ['Front,Back,Tags,Type'];
    flashcards.forEach(card => {
      const front = `"${card.front.replace(/"/g, '""')}"`;
      const back = `"${card.back.replace(/"/g, '""')}"`;
      const tags = `"${card.tags.join(' ')}"`;
      const type = `"${card.type}"`;
      csvRows.push(`${front},${back},${tags},${type}`);
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'QUBITS_Adaptive_Recall_Deck.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Adaptive Recall Engine (FSRS)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  Spaced Repetition
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Card {currentIndex + 1} of {flashcards.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreatingCard(!isCreatingCard)}
              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 font-semibold transition-all cursor-pointer ${
                isCreatingCard
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/40 hover:bg-teal-100'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isCreatingCard ? 'Back to Review' : 'Add Card'}</span>
            </button>

            <button
              onClick={exportAnkiCSV}
              className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
              title="Export CSV for Anki import"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Anki</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MANUAL FLASHCARD CREATION FORM */}
        {isCreatingCard ? (
          <div className="flex-1 flex flex-col justify-between space-y-4 animate-fade-in p-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  Manual Flashcard Input:
                </span>
                <div className="flex gap-1.5">
                  {(['basic', 'cloze', 'why-card', 'vignette'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        newType === t
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Card Front (Question / Clinical Scenario):
                </label>
                <textarea
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. What is the cardinal migratory pain path of acute appendicitis and why does it shift?"
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Card Back (High-Yield Answer & Evidence):
                </label>
                <textarea
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. Begins as dull, poorly localized visceral pain at T10 periumbilical dermatome due to luminal distension; shifts to sharp somatic pain at McBurney's point as parietal peritoneum becomes inflamed."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tags (comma separated):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreatingCard(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newFront.trim() || !newBack.trim()}
                onClick={() => {
                  if (onAddCard) {
                    onAddCard({
                      type: newType,
                      front: newFront,
                      back: newBack,
                      disease_id: 'custom-card',
                      disease_name: 'Custom Study Card',
                      source_id: 'src-manual-input',
                      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
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
                  }
                  setNewFront('');
                  setNewBack('');
                  setIsCreatingCard(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs disabled:opacity-40 transition-all cursor-pointer"
              >
                Save Flashcard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-teal-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              />
            </div>

            {/* STUDY CARD AREA */}
            {!completedSession && currentCard ? (
              <div className="flex-1 flex flex-col justify-between">
            {/* Flashcard Box with Flip */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 min-h-[220px] p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-teal-500/50 bg-slate-50 dark:bg-slate-800/60 cursor-pointer transition-all flex flex-col justify-between select-none relative group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {(currentCard.type || 'BASIC').toUpperCase()}
                </span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                  {isFlipped ? 'Click to show question' : 'Click card to flip / show answer'}
                </span>
              </div>

              {/* Card Content */}
              <div className="my-auto py-4">
                {!isFlipped ? (
                  <div>
                    <h4 className="text-base sm:text-lg font-serif-medical text-slate-900 dark:text-white leading-relaxed">
                      {currentCard.front}
                    </h4>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1">
                      Verified Clinical Answer:
                    </span>
                    <p className="text-sm sm:text-base font-serif-medical text-slate-900 dark:text-white leading-relaxed">
                      {currentCard.back}
                    </p>
                  </div>
                )}
              </div>

              {/* Tags footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-teal-600 dark:text-teal-400 font-medium">
                  {currentCard.disease_name || currentCard.diseaseName || 'General Pathology'}
                </span>
                <div className="flex gap-1 flex-wrap">
                  {(currentCard.tags || []).map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-750 text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* FSRS Rating Buttons (Revealed when card is flipped) */}
            <div className="mt-4 pt-2">
              {isFlipped ? (
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRating('again')}
                    className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all text-center"
                  >
                    <div>Again</div>
                    <div className="text-[10px] font-normal opacity-80">&lt; 10m</div>
                  </button>

                  <button
                    onClick={() => handleRating('hard')}
                    className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold transition-all text-center"
                  >
                    <div>Hard</div>
                    <div className="text-[10px] font-normal opacity-80">1 day</div>
                  </button>

                  <button
                    onClick={() => handleRating('good')}
                    className="p-2.5 rounded-xl border border-teal-300 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:border-teal-900 text-teal-700 dark:text-teal-300 text-xs font-bold transition-all text-center"
                  >
                    <div>Good</div>
                    <div className="text-[10px] font-normal opacity-80">3 days</div>
                  </button>

                  <button
                    onClick={() => handleRating('easy')}
                    className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all text-center"
                  >
                    <div>Easy</div>
                    <div className="text-[10px] font-normal opacity-80">7 days</div>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Show Answer / Flip
                </button>
              )}
            </div>
          </div>
        ) : (
          /* SESSION COMPLETED */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold font-serif-medical text-slate-900 dark:text-white">
              Daily Recall Target Complete!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
              All due cards have been processed with the FSRS spaced repetition algorithm. Synced in real-time.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  setCompletedSession(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              >
                Review Deck Again
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    )}
      </div>
    </div>
  );
};
