import React, { useState } from 'react';
import { 
  GitFork, 
  Eye, 
  EyeOff, 
  Download, 
  Sparkles, 
  ChevronRight, 
  Share2,
  Maximize2
} from 'lucide-react';
import { MindMapData, MindMapNode } from '../types/disease';

interface MindMapStudioProps {
  mindMap: MindMapData;
  diseaseTitle: string;
}

export const MindMapStudio: React.FC<MindMapStudioProps> = ({ mindMap, diseaseTitle }) => {
  const [hideAndRecall, setHideAndRecall] = useState<boolean>(false);
  const [revealedNodes, setRevealedNodes] = useState<Record<string, boolean>>({});
  const [layout, setLayout] = useState<'radial' | 'tree'>('radial');

  const toggleRevealNode = (id: string) => {
    setRevealedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const coreNode = mindMap.nodes.find(n => n.id === 'mm-core') || mindMap.nodes[0];
  const branchNodes = mindMap.nodes.filter(n => n.id !== coreNode.id);

  const exportMindMap = () => {
    const textContent = `${diseaseTitle} - Mind Map\n` + 
      branchNodes.map(n => `- [${n.category}] ${n.label}: ${n.details}`).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${diseaseTitle}_mindmap.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wide">
              Module B: Mind Map Studio
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Structural Knowledge Graph
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
            Visual Concept Architecture
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Multi-branch mind map with "Hide and Recall" active testing mode.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Hide and Recall Mode Toggle */}
          <button
            onClick={() => setHideAndRecall(!hideAndRecall)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              hideAndRecall
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {hideAndRecall ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{hideAndRecall ? 'Hide & Recall ACTIVE' : 'Hide & Recall Mode'}</span>
          </button>

          <button
            onClick={exportMindMap}
            className="p-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Export Mind Map Outline"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Mind Map Graph Container */}
      <div className="bg-slate-50/80 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        {/* Core Central Node */}
        <div className="flex justify-center mb-6">
          <div className="bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-md text-center max-w-sm">
            <span className="text-[10px] font-mono uppercase tracking-wider opacity-80 block">
              Central Pathology
            </span>
            <h3 className="text-base font-bold font-serif-medical">
              {coreNode.label}
            </h3>
            <p className="text-xs text-teal-100 mt-0.5 line-clamp-2">
              {coreNode.details}
            </p>
          </div>
        </div>

        {/* Branch Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {branchNodes.map((node) => {
            const isRevealed = !hideAndRecall || !!revealedNodes[node.id];

            return (
              <div
                key={node.id}
                onClick={() => hideAndRecall && toggleRevealNode(node.id)}
                className={`p-4 rounded-xl border transition-all ${
                  hideAndRecall
                    ? 'cursor-pointer hover:border-amber-400 bg-white dark:bg-slate-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    {node.category}
                  </span>
                  {hideAndRecall && (
                    <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      {isRevealed ? 'Revealed' : 'Click to test'}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {node.label}
                </h4>

                {isRevealed ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {node.details}
                  </p>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-dashed border-amber-300 dark:border-amber-800 text-center text-xs text-amber-800 dark:text-amber-300">
                    [Hidden for Active Recall — click to check]
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
