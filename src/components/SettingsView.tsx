import React from 'react';
import { 
  Sliders, 
  Sun, 
  Moon, 
  Monitor, 
  BookOpen, 
  Globe2, 
  Layers, 
  Database, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';
import { DepthLevel } from '../types/disease';

export type SyllabusLens = 'usmle' | 'cbme' | 'uk_mla' | 'plab';
export type SettingLens = 'high_resource' | 'low_resource';

interface SettingsViewProps {
  themeMode: 'light' | 'dark' | 'auto';
  onChangeThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  syllabusLens: SyllabusLens;
  onChangeSyllabusLens: (lens: SyllabusLens) => void;
  settingLens: SettingLens;
  onChangeSettingLens: (lens: SettingLens) => void;
  depthLevel: DepthLevel;
  onChangeDepthLevel: (depth: DepthLevel) => void;
  onOpenSyncModal: () => void;
  isSupabaseConnected: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  themeMode,
  onChangeThemeMode,
  syllabusLens,
  onChangeSyllabusLens,
  settingLens,
  onChangeSettingLens,
  depthLevel,
  onChangeDepthLevel,
  onOpenSyncModal,
  isSupabaseConnected
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Preferences
              </span>
              <span className="text-xs font-mono text-slate-500">Curricular & Setting Lenses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-medical text-slate-900 dark:text-white mt-0.5">
              System Settings & Lenses
            </h1>
          </div>
        </div>
      </div>

      {/* Section 1: Curricular Syllabus Lens */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Syllabus Lens
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your medical licensing standard. Sourced curriculum competency codes and exam patterns will filter accordingly:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'usmle', label: 'USMLE Step 1 / 2 CK / 3', desc: 'United States Medical Licensing Examination standard blueprint' },
            { id: 'cbme', label: 'NMC CBME (India)', desc: 'National Medical Commission Competency-Based Medical Education' },
            { id: 'uk_mla', label: 'UK MLA / GMC CPS', desc: 'UK Medical Licensing Assessment & Clinical Practice Standards' },
            { id: 'plab', label: 'PLAB 1 & 2', desc: 'Professional and Linguistic Assessments Board blueprint' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onChangeSyllabusLens(item.id as SyllabusLens)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                syllabusLens === item.id
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-950 dark:text-teal-100 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">{item.label}</span>
                {syllabusLens === item.id && <span className="text-xs text-teal-600 font-bold">✓</span>}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Care Setting Lens */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Care Setting Lens
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Adapts diagnostic algorithms and treatments between resource-rich hospitals and low-resource global settings:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { 
              id: 'high_resource', 
              label: 'High-Resource Setting', 
              desc: 'Emphasizes low-dose CT, 3T MRI, laparoscopic suites, and specialty monoclonal therapeutics' 
            },
            { 
              id: 'low_resource', 
              label: 'Low-Resource / WHO Essential', 
              desc: 'Emphasizes bedside clinical scores, ultrasound, open surgery, and WHO Model List of Essential Medicines' 
            }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onChangeSettingLens(item.id as SettingLens)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                settingLens === item.id
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-950 dark:text-teal-100 shadow-2xs'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs">{item.label}</span>
                {settingLens === item.id && <span className="text-xs text-teal-600 font-bold">✓</span>}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Section 3: Visual Theme */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Visual Appearance
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose light (Cream / Navy), dark (Deep Navy / Charcoal), or follow your operating system:
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4 text-amber-500" /> },
            { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
            { id: 'auto', label: 'System', icon: <Monitor className="w-4 h-4 text-slate-500" /> }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onChangeThemeMode(item.id as any)}
              className={`p-3 rounded-2xl flex items-center justify-center gap-2 border text-xs font-bold transition-all cursor-pointer ${
                themeMode === item.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 4: Data Sync */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Cloud Backup & Anki Sync
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Persist your flashcards, notes, and mastery progress across devices with Supabase.
          </p>
        </div>

        <button
          onClick={onOpenSyncModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-colors shrink-0"
        >
          <span>Configure Cloud Sync</span>
        </button>
      </div>
    </div>
  );
};
