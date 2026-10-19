import React, { useState } from 'react';
import { 
  Calendar, 
  Compass, 
  GitPullRequest, 
  BookOpen, 
  Award, 
  Calculator, 
  Bookmark, 
  ShieldCheck, 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Stethoscope, 
  GraduationCap, 
  Sun, 
  Moon, 
  FileDown, 
  Menu, 
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DepthLevel } from '../types/disease';

export type NavigationTab = 
  | 'today'
  | 'explore'
  | 'diff-lab'
  | 'recall'
  | 'exam-lens'
  | 'tools'
  | 'library'
  | 'sources'
  | 'settings';

interface NavigationSidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  dueFlashcardsCount: number;
  depthLevel: DepthLevel;
  onChangeDepth: (depth: DepthLevel) => void;
  onOpenCommandPalette: () => void;
  onExportPdf?: () => void;
  isDarkEffective: boolean;
  onToggleTheme: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onSelectTab,
  dueFlashcardsCount,
  depthLevel,
  onChangeDepth,
  onOpenCommandPalette,
  onExportPdf,
  isDarkEffective,
  onToggleTheme
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState<boolean>(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'today', label: 'Today', icon: <Calendar className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { id: 'diff-lab', label: 'Differential Lab', icon: <GitPullRequest className="w-4 h-4" />, badge: 'Core' },
    { id: 'recall', label: 'Recall', icon: <BookOpen className="w-4 h-4" />, badge: dueFlashcardsCount > 0 ? dueFlashcardsCount : undefined },
    { id: 'exam-lens', label: 'Exam & Viva', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'tools', label: 'Calculators', icon: <Calculator className="w-4 h-4" /> },
    { id: 'library', label: 'Library', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'sources', label: 'Sources', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> }
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP SIDEBAR (Collapsible, Left Side)                     */}
      {/* ============================================================ */}
      <aside 
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 h-screen transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Brand & Collapse Trigger */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="truncate">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-serif-medical">
                  QUBITS
                </span>
                <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 block -mt-1 font-bold">
                  Evidence-Based OS
                </span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              Q
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Search Shortcut Button */}
        <div className="p-3">
          <button
            onClick={onOpenCommandPalette}
            className={`w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Open Command Palette (Cmd+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-600" />
              {!isCollapsed && <span className="font-sans">Search or jump...</span>}
            </div>
            {!isCollapsed && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                ⌘K
              </span>
            )}
          </button>
        </div>

        {/* Main Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar font-sans">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                } ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 shadow-2xs font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    typeof item.badge === 'number'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick PDF Clinical Export */}
        {onExportPdf && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={onExportPdf}
              className={`w-full p-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer ${
                isCollapsed ? 'p-2.5' : ''
              }`}
              title="Export Condition PDF Summary"
            >
              <FileDown className="w-4 h-4" />
              {!isCollapsed && <span>Export Clinical PDF</span>}
            </button>
          </div>
        )}

        {/* Bottom Theme & Depth Widget */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-850 bg-slate-50/70 dark:bg-slate-850/50 space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                Depth Dial:
              </span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-[11px]">
                {depthLevel}
              </span>
            </div>
          )}

          {/* Depth Segmented Control */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold text-center">
            {(['MS1', 'MS2', 'MS4', 'Resident'] as DepthLevel[]).map((level) => {
              const isSelected = depthLevel === level || (depthLevel === 'MS2-3' && level === 'MS2');
              return (
                <button
                  key={level}
                  onClick={() => onChangeDepth(level)}
                  className={`py-1 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={level}
                >
                  {level === 'Resident' ? 'PGY' : level}
                </button>
              );
            })}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-full p-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer font-sans"
          >
            {isDarkEffective ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            {!isCollapsed && <span>{isDarkEffective ? 'Light Theme' : 'Dark Theme'}</span>}
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE BOTTOM TAB BAR (5 primary tabs + More drawer)         */}
      {/* ============================================================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'today', label: 'Today', icon: <Calendar className="w-5 h-5" /> },
          { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
          { id: 'diff-lab', label: 'Diff Lab', icon: <GitPullRequest className="w-5 h-5" /> },
          { id: 'recall', label: 'Recall', icon: <BookOpen className="w-5 h-5" />, badge: dueFlashcardsCount > 0 ? dueFlashcardsCount : undefined },
          { id: 'more', label: 'More', icon: <Menu className="w-5 h-5" /> }
        ].map((tab) => {
          const isActive = tab.id === 'more' ? isMobileMoreOpen : activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'more') {
                  setIsMobileMoreOpen(!isMobileMoreOpen);
                } else {
                  onSelectTab(tab.id as NavigationTab);
                  setIsMobileMoreOpen(false);
                }
              }}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] text-[10px] font-semibold transition-colors cursor-pointer relative ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ============================================================ */}
      {/* MOBILE "MORE" SHEET (Exam Lens, Tools, Library, Sources, Settings) */}
      {/* ============================================================ */}
      {isMobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
          <div 
            onClick={() => setIsMobileMoreOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-6 z-10 space-y-4 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                More Features & Tools
              </h3>
              <button 
                onClick={() => setIsMobileMoreOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'exam-lens', label: 'Exam & Viva', icon: <GraduationCap className="w-5 h-5 text-indigo-600" /> },
                { id: 'tools', label: 'Calculators', icon: <Calculator className="w-5 h-5 text-amber-600" /> },
                { id: 'library', label: 'Library', icon: <Bookmark className="w-5 h-5 text-teal-600" /> },
                { id: 'sources', label: 'Sources', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" /> },
                { id: 'settings', label: 'Settings', icon: <Sliders className="w-5 h-5 text-slate-600" /> }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id as NavigationTab);
                    setIsMobileMoreOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Export PDF in Mobile Sheet */}
            {onExportPdf && (
              <button
                onClick={() => {
                  onExportPdf();
                  setIsMobileMoreOpen(false);
                }}
                className="w-full py-3 rounded-xl text-xs font-bold bg-teal-600 text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Clinical Summary PDF</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
