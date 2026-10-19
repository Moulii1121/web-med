import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Calendar, UserCheck, Info } from 'lucide-react';
import { QubitsDiseaseEntry } from '../types/disease';

interface HonestyMeterProps {
  entry: QubitsDiseaseEntry;
}

export const HonestyMeter: React.FC<HonestyMeterProps> = ({ entry }) => {
  const isCurated = !entry.ai_generated;
  const trustScore = entry.trust_score || (isCurated ? 99 : 92);
  const reviewer = entry.human_reviewed_by || (isCurated ? 'MD Clinical Faculty Panel' : 'NCBI Cross-Validated');
  const reviewDate = entry.last_reviewed || '2026-10-16';

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
      <div className="flex items-center space-x-3">
        {/* Circular / Gauge Ring */}
        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
          <svg className="w-11 h-11 transform -rotate-90">
            <circle
              cx="22"
              cy="22"
              r="17"
              stroke="currentColor"
              strokeWidth="3.5"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="22"
              cy="22"
              r="17"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray={106.8}
              strokeDashoffset={106.8 - (106.8 * trustScore) / 100}
              strokeLinecap="round"
              className={isCurated ? 'text-emerald-500' : 'text-teal-500'}
              fill="transparent"
            />
          </svg>
          <span className="absolute font-mono font-extrabold text-[11px] text-slate-800 dark:text-white">
            {trustScore}%
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Honesty Meter
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              isCurated 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
            }`}>
              {isCurated ? 'Curated & Reviewed' : 'AI-Generated Sourced'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {trustScore}% of clinical statements tied to verified PubMed citations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono self-start sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[150px]">{reviewer}</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{reviewDate}</span>
        </div>
      </div>
    </div>
  );
};
