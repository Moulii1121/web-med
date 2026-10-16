import React, { useState } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Shuffle, 
  RotateCcw, 
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PathwayChainNode, DepthLevel, PathwayNodeType } from '../types/disease';

interface PathwayChainEngineProps {
  nodes: PathwayChainNode[];
  depthLevel: DepthLevel;
  onOpenCitation: (sourceId: string) => void;
  onMakeFlashcard: (text: string, title: string) => void;
}

const nodeTypeLabels: Record<PathwayNodeType, { label: string; color: string; badge: string }> = {
  trigger: { label: '1. Trigger', color: 'border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300', badge: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200' },
  molecular: { label: '2. Molecular', color: 'border-indigo-400 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300', badge: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200' },
  cellular: { label: '3. Cellular', color: 'border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300', badge: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200' },
  tissue: { label: '4. Tissue', color: 'border-cyan-400 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300', badge: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200' },
  organ: { label: '5. Organ', color: 'border-emerald-400 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200' },
  symptom: { label: '6. Symptom', color: 'border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300', badge: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200' },
  sign: { label: '7. Sign', color: 'border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300', badge: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200' },
  test: { label: '8. Test', color: 'border-purple-400 bg-purple-500/10 text-purple-700 dark:text-purple-300', badge: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-200' },
  treatment: { label: '9. Treatment', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200' },
};

export function resolveMechanismText(node: PathwayChainNode, depth: DepthLevel): string {
  if (node.mechanism[depth]) return node.mechanism[depth]!;
  if (depth === 'MS2' || depth === 'MS3') {
    return node.mechanism['MS2-3'] || node.mechanism.MS2 || node.mechanism.MS3 || node.mechanism.MS1 || '';
  }
  return node.mechanism.MS1 || Object.values(node.mechanism)[0] || '';
}

export const PathwayChainEngine: React.FC<PathwayChainEngineProps> = ({
  nodes,
  depthLevel,
  onOpenCitation,
  onMakeFlashcard
}) => {
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [shuffledOrder, setShuffledOrder] = useState<PathwayChainNode[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startQuiz = () => {
    const shuffled = [...nodes].sort(() => Math.random() - 0.5);
    setShuffledOrder(shuffled);
    setQuizSubmitted(false);
    setQuizMode(true);
  };

  const moveNode = (index: number, direction: 'up' | 'down') => {
    if (quizSubmitted) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= shuffledOrder.length) return;

    const copy = [...shuffledOrder];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setShuffledOrder(copy);
  };

  const correctCount = quizSubmitted
    ? shuffledOrder.filter((node, idx) => node.id === nodes[idx].id).length
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8 transition-colors">
      {/* Header and Quiz Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wide">
              Module A2: Pathway Chain Engine
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              9-Stage Pathophysiologic Nexus
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
            Causal Progression Chain
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            One verifiable sequence from trigger to molecule to cell, tissue, symptom, and targeted therapy.
          </p>
        </div>

        {/* Self-Quiz Toggle Button */}
        <div>
          {!quizMode ? (
            <button
              onClick={startQuiz}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Self-Quiz: Order the Pathway</span>
            </button>
          ) : (
            <button
              onClick={() => setQuizMode(false)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Exit Quiz Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* QUIZ MODE INTERFACE */}
      {quizMode ? (
        <div className="space-y-4">
          <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 p-4 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Active Recall: Sequence the 9 Pathophysiologic Steps
              </h3>
              <p className="text-xs text-teal-700 dark:text-teal-400 mt-0.5">
                Use the Up and Down arrows to arrange the events in order from initial trigger to treatment.
              </p>
            </div>
            {quizSubmitted && (
              <div className="text-right">
                <span className="text-lg font-black font-mono text-teal-700 dark:text-teal-300">
                  {correctCount} / {nodes.length} Correct
                </span>
                <p className="text-[10px] text-teal-600">
                  {correctCount === nodes.length ? 'Perfect Mastery!' : 'Review mismatched steps'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {shuffledOrder.map((node, index) => {
              const isCorrectPosition = quizSubmitted && node.id === nodes[index].id;
              const isWrongPosition = quizSubmitted && node.id !== nodes[index].id;

              return (
                <div
                  key={node.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isCorrectPosition
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                      : isWrongPosition
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-100'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {node.title}
                        </span>
                        {isCorrectPosition && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                            Correct Stage
                          </span>
                        )}
                        {isWrongPosition && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">
                            Expected: {nodeTypeLabels[nodes[index].nodeType].label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {resolveMechanismText(node, depthLevel)}
                      </p>
                    </div>
                  </div>

                  {/* Ordering Controls */}
                  <div className="flex items-center space-x-1">
                    <button
                      disabled={index === 0 || quizSubmitted}
                      onClick={() => moveNode(index, 'up')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === shuffledOrder.length - 1 || quizSubmitted}
                      onClick={() => moveNode(index, 'down')}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
              >
                Submit & Check Sequence
              </button>
            ) : (
              <button
                onClick={startQuiz}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white shadow-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        /* STANDARD 9-STAGE SEQUENCE DISPLAY */
        <div className="relative">
          {/* Vertical connection line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-teal-500 via-indigo-500 to-emerald-500 hidden sm:block" />

          <div className="space-y-4">
            {nodes.map((node, index) => {
              const meta = nodeTypeLabels[node.nodeType];
              const isExpanded = !!expandedNodes[node.id];

              return (
                <div
                  key={node.id}
                  className="relative sm:pl-12 group transition-all"
                >
                  {/* Step Marker Dot */}
                  <div className="absolute left-3.5 top-4 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-500 flex items-center justify-center text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 z-10 hidden sm:flex">
                    {index + 1}
                  </div>

                  {/* Card Container */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-all shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wide ${meta.badge}`}>
                          {meta.label}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {node.title}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Evidence Grade */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          {node.evidenceGrade}
                        </span>

                        {/* Citation Button */}
                        <button
                          onClick={() => onOpenCitation(node.source_id)}
                          className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
                          title="View verified source"
                        >
                          <span>Citation</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Mechanism Description (depth-dial controlled) */}
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans select-text">
                      {resolveMechanismText(node, depthLevel)}
                    </p>

                    {/* Distractor & Action Toolbar */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      {node.examDistractorPitfall && (
                        <div className="text-amber-800 dark:text-amber-300 flex items-center gap-1 text-[11px] font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{node.examDistractorPitfall}</span>
                        </div>
                      )}

                      <button
                        onClick={() => onMakeFlashcard(resolveMechanismText(node, depthLevel), `${meta.label}: ${node.title}`)}
                        className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 self-end sm:self-auto"
                      >
                        <Sparkles className="w-3 h-3" />
                        Make Flashcard
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
