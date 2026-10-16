import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Activity, 
  BookOpen, 
  CheckCircle2, 
  X, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { Disease, BodyRegion, OrganSystem } from '../types/disease';

export type SearchMode = 'disease-name' | 'body-region';

interface DualSearchProps {
  diseases: Disease[];
  selectedDiseaseId: string;
  onSelectDisease: (id: string) => void;
  completedDiseaseIds: string[];
}

export const DualSearch: React.FC<DualSearchProps> = ({
  diseases,
  selectedDiseaseId,
  onSelectDisease,
  completedDiseaseIds
}) => {
  const [searchMode, setSearchMode] = useState<SearchMode>('disease-name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');

  // Available unique regions and organ systems
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    diseases.forEach(d => set.add(d.bodyRegion));
    return Array.from(set);
  }, [diseases]);

  const availableSystems = useMemo(() => {
    const set = new Set<string>();
    diseases.forEach(d => set.add(d.organSystem));
    return Array.from(set);
  }, [diseases]);

  // Filtered diseases based on active search mode and query/filters
  const filteredDiseases = useMemo(() => {
    return diseases.filter(d => {
      const q = searchQuery.toLowerCase().trim();

      if (searchMode === 'disease-name') {
        if (!q) return true;
        return (
          d.name.toLowerCase().includes(q) ||
          (d.commonName && d.commonName.toLowerCase().includes(q)) ||
          d.icd10.toLowerCase().includes(q) ||
          d.oneLineSummary.toLowerCase().includes(q)
        );
      } else {
        // Body Region / Organ System mode
        const matchesRegion = selectedRegion === 'all' || d.bodyRegion === selectedRegion;
        const matchesSystem = selectedSystem === 'all' || d.organSystem === selectedSystem;
        
        if (q) {
          const matchesQuery = 
            d.bodyRegion.toLowerCase().includes(q) ||
            d.organSystem.toLowerCase().includes(q) ||
            d.name.toLowerCase().includes(q) ||
            d.clinicalPresentation.cardinalSymptoms.some((s: string) => s.toLowerCase().includes(q));
          return matchesRegion && matchesSystem && matchesQuery;
        }

        return matchesRegion && matchesSystem;
      }
    });
  }, [diseases, searchMode, searchQuery, selectedRegion, selectedSystem]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5 mb-8 transition-colors">
      {/* Prominent Mode Toggle Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Medical Knowledge Retrieval
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Query across pathology databases, organ systems, and anatomical planes
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <button
            onClick={() => {
              setSearchMode('disease-name');
              setSearchQuery('');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              searchMode === 'disease-name'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Search by Disease Name</span>
          </button>
          
          <button
            onClick={() => {
              setSearchMode('body-region');
              setSearchQuery('');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              searchMode === 'body-region'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Search by Body Region / Organ System</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {searchMode === 'disease-name' ? (
            <Search className="w-4 h-4 text-teal-500" />
          ) : (
            <MapPin className="w-4 h-4 text-emerald-500" />
          )}
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            searchMode === 'disease-name'
              ? 'Search disease (e.g. Acute Appendicitis, Type 2 Diabetes, STEMI)...'
              : 'Search anatomical site or organ system (e.g. Right Lower Quadrant, Epigastrium, Endocrine)...'
          }
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body Region & Organ System Filter Chips (Shown when in Body Region mode) */}
      {searchMode === 'body-region' && (
        <div className="space-y-2.5 pt-1 pb-2">
          {/* Anatomical Body Regions */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-emerald-500" />
              <span>Anatomical Region:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedRegion('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedRegion === 'all'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Regions
              </button>
              {availableRegions.map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRegion === region
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Organ Systems */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-teal-500" />
              <span>Organ System:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSystem('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedSystem === 'all'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All Systems
              </button>
              {availableSystems.map(system => (
                <button
                  key={system}
                  onClick={() => setSelectedSystem(system)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedSystem === system
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {system}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disease Selection Chips / Horizontal Grid */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>Available Showcase Conditions ({filteredDiseases.length}):</span>
          <span className="text-[11px] font-mono">Click card to load breakdown</span>
        </div>

        {filteredDiseases.length === 0 ? (
          <div className="py-6 px-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
            <Search className="w-8 h-8 text-teal-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No direct index matches for "{searchQuery}"
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              QUBITS is indexed with high-yield evidence-based clinical entries. You can explore available core modules or clear your search input:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {diseases.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('all');
                    setSelectedSystem('all');
                    onSelectDisease(d.id);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300 hover:border-teal-500 shadow-xs cursor-pointer transition-colors"
                >
                  Load {d.name}
                </button>
              ))}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSelectedSystem('all');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 cursor-pointer transition-colors"
              >
                Clear Search Filter
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {filteredDiseases.map((d) => {
              const isSelected = d.id === selectedDiseaseId;
              const isCompleted = completedDiseaseIds.includes(d.id);

              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDisease(d.id)}
                  className={`text-left p-3 rounded-xl border transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500/80 ring-2 ring-teal-500/20 shadow-sm'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-750 hover:bg-slate-100/80 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {d.name}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                      {d.icd10}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {d.bodyRegion}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {d.oneLineSummary}
                  </p>

                  {isSelected && (
                    <div className="mt-2 pt-1.5 border-t border-teal-200/60 dark:border-teal-800/50 flex items-center justify-between text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                      <span>Active Condition</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
