import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  GitPullRequest, 
  BookOpen, 
  Calculator, 
  GraduationCap, 
  Sliders, 
  ShieldCheck, 
  Activity, 
  Compass, 
  ArrowRight,
  Sparkles,
  FileText,
  FileDown
} from 'lucide-react';
import { QUBITS_SEED_ENTRIES } from '../data/qubitsData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCondition: (conditionId: string) => void;
  onSelectTab: (tabId: string) => void;
  onExportPdf?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCondition,
  onSelectTab,
  onExportPdf
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { id: 'diff-lab', label: 'Open Differential Lab', category: 'Tool', icon: <GitPullRequest className="w-4 h-4 text-teal-600" />, action: () => { onSelectTab('diff-lab'); onClose(); } },
    { id: 'recall', label: 'Study Due Flashcards (Recall)', category: 'Study', icon: <BookOpen className="w-4 h-4 text-emerald-600" />, action: () => { onSelectTab('recall'); onClose(); } },
    { id: 'argue', label: 'Argue the Differential (Viva Examiner)', category: 'Exam', icon: <GraduationCap className="w-4 h-4 text-indigo-600" />, action: () => { onSelectTab('exam-lens'); onClose(); } },
    { id: 'calculators', label: 'Clinical Calculators (CURB-65, Wells, etc.)', category: 'Tool', icon: <Calculator className="w-4 h-4 text-amber-600" />, action: () => { onSelectTab('tools'); onClose(); } },
    { id: 'pdf', label: 'Generate Clinical Summary PDF', category: 'Export', icon: <FileDown className="w-4 h-4 text-teal-600" />, action: () => { onExportPdf?.(); onClose(); } },
    { id: 'sources', label: 'Verified Sources & Provenance', category: 'Trust', icon: <ShieldCheck className="w-4 h-4 text-teal-600" />, action: () => { onSelectTab('sources'); onClose(); } },
    { id: 'settings', label: 'Settings & Curricular Lenses', category: 'Config', icon: <Sliders className="w-4 h-4 text-slate-500" />, action: () => { onSelectTab('settings'); onClose(); } }
  ];

  const matchedConditions = QUBITS_SEED_ENTRIES.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.system.toLowerCase().includes(query.toLowerCase()) ||
    c.regions.some(r => r.toLowerCase().includes(query.toLowerCase()))
  );

  const matchedActions = quickActions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fade-in">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, condition (e.g. Appendicitis), or tool..."
            className="w-full text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800">
            ESC
          </span>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          {matchedActions.length > 0 && (
            <div>
              <span className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Navigation & Tools
              </span>
              <div className="space-y-1">
                {matchedActions.map(action => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full p-2.5 rounded-xl text-left text-xs text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {action.icon}
                      <span className="font-semibold">{action.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-teal-600">
                      {action.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Curated Conditions */}
          {matchedConditions.length > 0 && (
            <div>
              <span className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Evidence-Based Conditions
              </span>
              <div className="space-y-1">
                {matchedConditions.map(cond => (
                  <button
                    key={cond.id}
                    onClick={() => {
                      onSelectCondition(cond.id);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl text-left text-xs text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-teal-600" />
                        <span>{cond.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {cond.system} • {cond.regions[0]} • ICD-10: {cond.codes.icd10}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedActions.length === 0 && matchedConditions.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No direct matches for "{query}". Try searching in Explore tab to fetch live from PubMed.
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with mouse or keyboard</span>
          <span>QUBITS Command Central</span>
        </div>
      </div>
    </div>
  );
};
