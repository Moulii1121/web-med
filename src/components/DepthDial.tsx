import React from 'react';
import { DepthLevel } from '../types/disease';
import { Sliders, BookOpen, Stethoscope, Microscope, Award, Brain, Sparkles, CheckCircle2 } from 'lucide-react';

interface DepthDialProps {
  currentLevel: DepthLevel;
  onChangeLevel: (level: DepthLevel) => void;
}

export interface CurricularLevelInfo {
  id: DepthLevel;
  label: string;
  badge: string;
  icon: React.ReactNode;
  methodOfLearning: string;
  desc: string;
  cognitiveTarget: string;
  examFocus: string;
  activeColor: string;
}

export const CURRICULAR_LEVELS: CurricularLevelInfo[] = [
  { 
    id: 'MS1', 
    label: 'MS1', 
    badge: 'Pre-Clinical',
    icon: <Microscope className="w-3.5 h-3.5" />, 
    methodOfLearning: 'Anatomical First-Principles & Molecular Pathways',
    desc: 'Gross anatomy, embryological tissue origin, histology landmarks, and cellular receptor cascades.',
    cognitiveTarget: 'Deduce clinical pathology from basic science, biochemistry, and somatic vs visceral neuroanatomy.',
    examFocus: 'USMLE Step 1 Foundations • CBME Pre-Clinical Anatomy & Biochem • First-Year Oral Viva',
    activeColor: 'bg-teal-600 border-teal-600 text-white'
  },
  { 
    id: 'MS2', 
    label: 'MS2', 
    badge: 'Pathology & Rx',
    icon: <BookOpen className="w-3.5 h-3.5" />, 
    methodOfLearning: 'Organ-System Pathophysiology & Pharmacodynamics',
    desc: 'Bacterial/viral virulence factors, cellular injury mechanisms, drug MOA, and USMLE distractor traps.',
    cognitiveTarget: 'Connect specific etiologies to tissue damage, receptor blockade, and pathognomonic histology.',
    examFocus: 'USMLE Step 1 Systems • Pathology & Pharmacology Shelf • Step 1 Question Stems',
    activeColor: 'bg-indigo-600 border-indigo-600 text-white'
  },
  { 
    id: 'MS3', 
    label: 'MS3', 
    badge: 'Clinical Clerkships',
    icon: <Stethoscope className="w-3.5 h-3.5" />, 
    methodOfLearning: 'Bedside Semiology & Diagnostic Reasoning',
    desc: 'History of present illness, bedside physical maneuvers (Sensitivity, Specificity, LR+), and first-line workup.',
    cognitiveTarget: 'Differentiate look-alike presentations at the bedside and choose the correct initial diagnostic test.',
    examFocus: 'USMLE Step 2 CK Clinical Medicine • UK MLA Clinical • Core Clerkship OSCEs',
    activeColor: 'bg-emerald-600 border-emerald-600 text-white'
  },
  { 
    id: 'MS4', 
    label: 'MS4', 
    badge: 'Sub-Internship',
    icon: <Brain className="w-3.5 h-3.5" />, 
    methodOfLearning: 'Emergency Triage & Inpatient Action Orders',
    desc: 'Emergency red flags, risk calculators (Alvarado, Wells), resuscitation IV fluid rates, and stat orders.',
    cognitiveTarget: 'Rapidly triage acuity (sick vs not sick), order immediate stabilization, and determine consult timing.',
    examFocus: 'USMLE Step 2 CK High-Acuity Triage • Sub-Internship ICU/ED • Internship Readiness',
    activeColor: 'bg-amber-600 border-amber-600 text-white'
  },
  { 
    id: 'Resident', 
    label: 'Resident', 
    badge: 'Postgraduate Practice',
    icon: <Award className="w-3.5 h-3.5" />, 
    methodOfLearning: 'Evidence-Based Practice, Landmark Trials & Complications',
    desc: 'Clinical society guidelines, landmark randomized trials (PMIDs), non-operative failure rates, and salvage care.',
    cognitiveTarget: 'Navigate treatment controversies, manage refractory cases, and ground care in high-impact trial evidence.',
    examFocus: 'Specialty Board Exams • In-Training Exam (ITE) • Hospital Inpatient Attending Rounds',
    activeColor: 'bg-purple-600 border-purple-600 text-white'
  },
];

export const DepthDial: React.FC<DepthDialProps> = ({ currentLevel, onChangeLevel }) => {
  // Normalize MS2-3 if passed
  const activeLevelId = currentLevel === 'MS2-3' ? 'MS2' : currentLevel;
  const activeInfo = CURRICULAR_LEVELS.find(l => l.id === activeLevelId) || CURRICULAR_LEVELS[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs mb-6 transition-all">
      {/* Top Header Row with Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/60">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Curricular Depth Dial™
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                5 Medical Tiers
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dynamically transforms learning method, terminology, mechanism depth, and clinical priorities across the entire page.
            </p>
          </div>
        </div>

        {/* 5-Step Dial Switcher */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700 w-full md:w-auto">
          {CURRICULAR_LEVELS.map((lvl) => {
            const isActive = activeLevelId === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => onChangeLevel(lvl.id)}
                className={`flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? `${lvl.activeColor} shadow-xs scale-102`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700/60'
                }`}
                title={`${lvl.label}: ${lvl.methodOfLearning}`}
              >
                <span className="shrink-0">{lvl.icon}</span>
                <span className="mt-0.5 sm:mt-0">{lvl.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Active Learning Method Transformation Strip */}
      <div className="mt-4 pt-1 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Method of Learning Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] uppercase font-mono font-bold text-teal-700 dark:text-teal-400 block mb-1">
            Active Learning Method:
          </span>
          <p className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
            {activeInfo.methodOfLearning}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {activeInfo.desc}
          </p>
        </div>

        {/* Cognitive Target */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
            Cognitive Medical Goal:
          </span>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            {activeInfo.cognitiveTarget}
          </p>
        </div>

        {/* Exam Lens Alignment */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              Curricular & Exam Target:
            </span>
            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              {activeInfo.examFocus}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500 font-mono">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Page dynamically tuned to {activeInfo.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
