import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, X, Brain } from 'lucide-react';
import { Flashcard } from '../types/disease';

interface TextHighlightCaptureProps {
  diseaseId: string;
  diseaseName: string;
  onSaveFlashcard: (card: Omit<Flashcard, 'id'>) => void;
}

export const TextHighlightCapture: React.FC<TextHighlightCaptureProps> = ({
  diseaseId,
  diseaseName,
  onSaveFlashcard
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cardPrompt, setCardPrompt] = useState<string>('');
  const [cardType, setCardType] = useState<Flashcard['type']>('basic');
  const [cardTags, setCardTags] = useState<string>('High-Yield, Pathology');

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // Do not trigger when clicking inside inputs, textareas, buttons, or editable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('button'))
      ) {
        setCoords(null);
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        if (!isModalOpen) setCoords(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length > 5) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setCoords({
            x: Math.min(window.innerWidth - 180, Math.max(10, rect.left + rect.width / 2 - 80)),
            y: Math.max(10, rect.top - 45) // Fixed viewport coordinates
          });
          setSelectedText(text);
        } catch (e) {
          setCoords(null);
        }
      } else {
        if (!isModalOpen) setCoords(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isModalOpen]);

  const handleOpenCreator = () => {
    setCardPrompt(`Explain the clinical significance or mechanism: "${selectedText.slice(0, 70)}..."`);
    setIsModalOpen(true);
    setCoords(null);
  };

  const handleSave = () => {
    onSaveFlashcard({
      type: cardType,
      front: cardPrompt,
      back: selectedText,
      disease_id: diseaseId,
      disease_name: diseaseName,
      source_id: 'src-highlight',
      tags: cardTags.split(',').map(t => t.trim()).filter(Boolean),
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

    setIsModalOpen(false);
    setSelectedText('');
    window.getSelection()?.removeAllRanges();
  };

  return (
    <>
      {/* Floating Action Button */}
      {coords && !isModalOpen && (
        <button
          onClick={handleOpenCreator}
          style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
          className="fixed z-40 px-3 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xl border border-slate-700 dark:border-slate-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all animate-bounce"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 dark:text-teal-600" />
          <span>Save as Flashcard</span>
        </button>
      )}

      {/* Flashcard Quick Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Generate Flashcard from Selected Text
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Card Type Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Card Type:
                </label>
                <div className="flex gap-2">
                  {(['basic', 'cloze', 'why-card', 'vignette'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCardType(type)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        cardType === type
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Front (Prompt / Question) */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Card Front (Question / Prompt):
                </label>
                <textarea
                  value={cardPrompt}
                  onChange={(e) => setCardPrompt(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Back (Answer / Highlighted Text) */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Card Back (Highlighted Verified Content):
                </label>
                <textarea
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tags (comma separated):
                </label>
                <input
                  type="text"
                  value={cardTags}
                  onChange={(e) => setCardTags(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
              >
                Save to FSRS Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
