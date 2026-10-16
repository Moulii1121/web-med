import React from 'react';
import { 
  Sun, 
  Moon, 
  Monitor,
  Sparkles, 
  Layers, 
  Database, 
  Bookmark, 
  GraduationCap,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { UserProgress } from '../types/disease';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface HeaderProps {
  themeMode: ThemeMode;
  isDarkEffective: boolean;
  onChangeThemeMode: (mode: ThemeMode) => void;
  userProgress: UserProgress;
  onOpenFlashcards: () => void;
  onOpenSyncSettings: () => void;
  isSupabaseConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  themeMode,
  isDarkEffective,
  onChangeThemeMode,
  userProgress,
  onOpenFlashcards,
  onOpenSyncSettings,
  isSupabaseConnected
}) => {
  const flashcardCount = userProgress.flashcards.length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Med<span className="text-teal-600 dark:text-teal-400">Vindicate</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                USMLE High-Yield
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Clinical Differential & Pathophysiology Framework
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Supabase Sync Status Indicator Button */}
          <button
            onClick={onOpenSyncSettings}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isSupabaseConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
            title="Configure Supabase Real-Time Progress Sync"
          >
            <div className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-teal-500'}`} />
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isSupabaseConnected ? 'Supabase Live' : 'Real-Time Sync'}
            </span>
          </button>

          {/* Flashcards Deck Button */}
          <button
            onClick={onOpenFlashcards}
            className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Flashcards</span>
            {flashcardCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] bg-teal-800 text-teal-100 font-bold ml-1">
                {flashcardCount}
              </span>
            )}
          </button>

          {/* Quick 1-Click Toggle + 3-Way Mode Switcher */}
          <div className="flex items-center space-x-1.5">
            {/* 1-Click Quick Toggle Button */}
            <button
              onClick={() => onChangeThemeMode(isDarkEffective ? 'light' : 'dark')}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title={`Click to switch immediately to ${isDarkEffective ? 'Light' : 'Dark'} mode`}
              aria-label={`Switch to ${isDarkEffective ? 'Light' : 'Dark'} mode`}
            >
              {isDarkEffective ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                  <span className="text-xs font-bold">Dark</span>
                </>
              )}
            </button>

            {/* Detailed 3-Way Mode Pill Selector */}
            <div 
              className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs" 
              role="radiogroup" 
              aria-label="Theme selection"
            >
              <button
                onClick={() => onChangeThemeMode('light')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-semibold text-[11px] ${
                  themeMode === 'light'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Force Light Theme"
                role="radio"
                aria-checked={themeMode === 'light'}
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                onClick={() => onChangeThemeMode('dark')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-semibold text-[11px] ${
                  themeMode === 'dark'
                    ? 'bg-slate-700 text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Force Dark Theme (Comfortable for long study)"
                role="radio"
                aria-checked={themeMode === 'dark'}
              >
                <Moon className="w-3 h-3 text-amber-400" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => onChangeThemeMode('auto')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-semibold text-[11px] ${
                  themeMode === 'auto'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Follow System Theme Preference"
                role="radio"
                aria-checked={themeMode === 'auto'}
              >
                <Monitor className="w-3 h-3" />
                <span>Auto</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
