import React, { useState } from 'react';
import { AlertOctagon, ChevronDown, ChevronUp, Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import { QubitsDiseaseEntry } from '../types/disease';

interface RedFlagRibbonProps {
  redFlags: QubitsDiseaseEntry['red_flags'];
}

export const RedFlagRibbon: React.FC<RedFlagRibbonProps> = ({ redFlags }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!redFlags || redFlags.length === 0) return null;

  const topFlag = redFlags[0];

  return (
    <div className="sticky top-16 z-20 mb-6 shadow-md transition-all">
      <div className="bg-[#FF6B5B] dark:bg-[#FF8A7D] text-white dark:text-slate-950 px-4 py-2.5 rounded-2xl flex items-center justify-between border-2 border-rose-300 dark:border-rose-400">
        <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 dark:bg-black/10 flex items-center justify-center shrink-0 animate-pulse">
            <ShieldAlert className="w-4 h-4 text-white dark:text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-black/20 dark:bg-white/20 font-mono">
                RED FLAG RIBBON
              </span>
              <span className="text-[11px] font-mono font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Action: {topFlag.timeframe}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold truncate">
              {topFlag.warning}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/15 dark:bg-white/20 hover:bg-black/25 flex items-center gap-1 shrink-0"
        >
          <span>{isExpanded ? 'Hide' : `${redFlags.length} Emergency Action${redFlags.length > 1 ? 's' : ''}`}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Accordion of Emergency Red Flags */}
      {isExpanded && (
        <div className="bg-rose-50 dark:bg-slate-900 border-2 border-t-0 border-[#FF6B5B] dark:border-[#FF8A7D] rounded-b-2xl p-4 space-y-3 animate-fade-in shadow-xl">
          {redFlags.map((flag, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                    Triage Warning #{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-500" />
                    Target Time: {flag.timeframe}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {flag.warning}
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 font-medium mt-1">
                  Immediate Management: {flag.immediateAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
