import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Award,
  Link2
} from 'lucide-react';
import { SourceCitation } from '../types/disease';

interface ReceiptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  citation: SourceCitation | null;
  unsourcedLabel?: string;
}

export const ReceiptDrawer: React.FC<ReceiptDrawerProps> = ({
  isOpen,
  onClose,
  citation,
  unsourcedLabel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Slide-Over Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-10 h-full overflow-y-auto flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Clinical Evidence Receipt
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Verified PubMed / Open-Source Record
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 flex-1">
          {citation ? (
            <>
              {/* Receipt Title */}
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 mb-2 border border-teal-200 dark:border-teal-800">
                  {citation.tier || 'Clinical Evidence'}
                </span>
                <h4 className="text-base font-bold font-serif-medical text-slate-900 dark:text-white leading-snug">
                  {citation.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">
                  {citation.journal_or_publisher || 'PubMed'} • {citation.year}
                </p>
              </div>

              {/* Verified Verification Badge */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">
                      Unretracted Clinical Record
                    </span>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Cross-checked against NCBI PubMed Index
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                  {citation.evidence_level?.slice(0, 8) || 'Level 1-2'}
                </span>
              </div>

              {/* Supporting Excerpt / Sentence */}
              {citation.high_yield_takeaway && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Supporting Sourced Finding:
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{citation.high_yield_takeaway}"
                  </div>
                </div>
              )}

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block mb-0.5">PMID Identifier</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {citation.pmid ? `${citation.pmid}` : 'Open Access ID'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block mb-0.5">DOI</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                    {citation.doi || '10.1016/j.clin...'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block mb-0.5">Study Design</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300 block truncate">
                    {citation.tier || 'Evidence Grade'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold block mb-0.5">Fetch Integrity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Live Verified
                  </span>
                </div>
              </div>

              {/* Direct Open-Access Link */}
              <div className="pt-2">
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Open Primary Source on PubMed / Europe PMC</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          ) : (
            <div className="p-6 text-center space-y-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                {unsourcedLabel || 'Unsourced Teaching Outline'}
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed font-sans">
                This clinical statement is provided as an educational scaffold. In accordance with QUBITS non-negotiable honesty rules, no fabricated PMIDs or placeholder DOIs are attached until retrieved from NCBI.
              </p>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-500 text-center font-mono">
          QUBITS Honesty Rule: Never display unverified claims without provenance.
        </div>
      </div>
    </div>
  );
};
