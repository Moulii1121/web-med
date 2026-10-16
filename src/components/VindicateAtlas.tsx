import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Flame, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  AlertTriangle,
  Info,
  Share2,
  Grid,
  Columns
} from 'lucide-react';
import { VindicateItem, DepthLevel } from '../types/disease';
import { VindicateD3ForceGraph } from './VindicateD3ForceGraph';

interface VindicateAtlasProps {
  vindicateList: VindicateItem[];
  depthLevel: DepthLevel;
  selectedRegion: string;
  diseaseTitle?: string;
  cardinalSymptoms?: string[];
  physicalSigns?: { sign: string; maneuver: string; diagnostic_yield: string }[];
  redFlags?: { warning: string; immediateAction: string; timeframe: string }[];
}

export const VindicateAtlas: React.FC<VindicateAtlasProps> = ({
  vindicateList,
  depthLevel,
  selectedRegion,
  diseaseTitle = 'Clinical Entity',
  cardinalSymptoms = [],
  physicalSigns = [],
  redFlags = []
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string>('V');
  const [viewMode, setViewMode] = useState<'d3-graph' | 'matrix' | 'split'>('d3-graph');

  const activeCategory = vindicateList.find(v => v.letter === selectedLetter) || vindicateList[0];

  const getHeatmapColor = (weight: number) => {
    if (weight >= 80) return 'bg-rose-500 text-white';
    if (weight >= 50) return 'bg-amber-500 text-white';
    if (weight >= 25) return 'bg-teal-500 text-white';
    return 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8 transition-colors space-y-6">
      {/* Header with View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wide">
              Module A1: VINDICATE Atlas
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Diagnostic Differential Framework
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
            Systematic Etiological Matrix & D3 Symptom Network
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Categorical breakdown across Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Trauma, and Endocrine.
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* View Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('d3-graph')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'd3-graph'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-teal-600" />
              <span>D3 Network Graph</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Matrix Grid</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            {selectedRegion}
          </span>
        </div>
      </div>

      {/* VIEW MODE 1: D3 FORCE-DIRECTED GRAPH */}
      {(viewMode === 'd3-graph' || viewMode === 'split') && (
        <div className={viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6' : ''}>
          <div className={viewMode === 'split' ? 'lg:col-span-7' : 'w-full'}>
            <VindicateD3ForceGraph
              vindicateList={vindicateList}
              diseaseTitle={diseaseTitle}
              cardinalSymptoms={cardinalSymptoms}
              physicalSigns={physicalSigns}
              redFlags={redFlags}
              depthLevel={depthLevel}
              selectedRegion={selectedRegion}
              onSelectCategory={(letter) => setSelectedLetter(letter)}
            />
          </div>

          {/* If in split mode, display the active category card side by side */}
          {viewMode === 'split' && activeCategory && (
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-mono font-bold text-sm flex items-center justify-center">
                      {activeCategory.letter === 'I2' ? 'I' : activeCategory.letter}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {activeCategory.category}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Etiologic Weight: {activeCategory.weight}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Pathophysiologic Manifestation / Role:
                  </h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans select-text">
                    {activeCategory.roleInDisease}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    High-Yield Differentials:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCategory.topDifferentials.map((diff, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                      >
                        ⚡ {diff}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-teal-900/60 text-xs mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {depthLevel === 'MS1' ? 'Basic Science Pearl' : 'Bedside Clinical Pearl'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {depthLevel}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {depthLevel === 'MS1' ? activeCategory.clinicalPearl.simple : activeCategory.clinicalPearl.deep}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: MATRIX GRID & CARDS */}
      {(viewMode === 'matrix') && (
        <div className="space-y-6">
          {/* 9-Letter Interactive Grid / Heatmap Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {vindicateList.map((item) => {
              const isSelected = selectedLetter === item.letter;
              return (
                <button
                  key={item.letter}
                  onClick={() => setSelectedLetter(item.letter)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[75px] cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {item.letter === 'I2' ? 'I' : item.letter}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[70px] mt-1">
                    {item.category.split(' ')[0]}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1">
                    <span className={`text-[9px] font-mono px-1 rounded ${getHeatmapColor(item.weight)}`}>
                      {item.weight}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Category Deep Dive Card */}
          {activeCategory && (
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-mono font-bold text-sm flex items-center justify-center">
                    {activeCategory.letter === 'I2' ? 'I' : activeCategory.letter}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeCategory.category} Category
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Clinical weight & relevance: {activeCategory.weight}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold">
                    Differential Priority
                  </span>
                </div>
              </div>

              {/* Role in Disease */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Pathophysiologic Manifestation / Role:
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans select-text">
                  {activeCategory.roleInDisease}
                </p>
              </div>

              {/* High-Yield Top Differentials in this Category */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  High-Yield Differentials to Rule Out:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeCategory.topDifferentials.map((diff, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                    >
                      ⚡ {diff}
                    </span>
                  ))}
                </div>
              </div>

              {/* Simple vs Deep Clinical Pearl */}
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-teal-900/60 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {depthLevel === 'MS1' ? 'Basic Science Pearl (MS1 Focus)' : 'Bedside Clinical Pearl (Clinical Focus)'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Level: {depthLevel}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {depthLevel === 'MS1' ? activeCategory.clinicalPearl.simple : activeCategory.clinicalPearl.deep}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
