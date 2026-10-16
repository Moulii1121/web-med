import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  X, 
  BookOpen, 
  CheckCircle2, 
  Loader2,
  Stethoscope,
  Flame,
  Zap,
  Globe2,
  Filter,
  Pill,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { OpenSourceRepository } from '../services/openSourceVerification';

interface UserConditionInputBarProps {
  currentConditionTitle?: string;
  isVerifying: boolean;
  onVerifyCondition: (
    userInput: string, 
    mode: 'disease-name' | 'body-region' | 'condition-symptom', 
    repository?: string,
    symptomInput?: string
  ) => void;
  onResetCondition?: () => void;
}

export const UserConditionInputBar: React.FC<UserConditionInputBarProps> = ({
  currentConditionTitle,
  isVerifying,
  onVerifyCondition,
  onResetCondition
}) => {
  const [searchMode, setSearchMode] = useState<'disease-name' | 'body-region' | 'condition-symptom'>('disease-name');
  const [selectedRepo, setSelectedRepo] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [symptomQuery, setSymptomQuery] = useState('');

  const quickInspirations = [
    { label: 'Acute Pancreatitis', trigger: 'Epigastrium radiating to back', system: 'Gastrointestinal', mode: 'disease-name' as const },
    { label: 'Pulmonary Embolism', trigger: 'Thorax & Acute Pleuritic Dyspnea', system: 'Cardiovascular / Resp', mode: 'disease-name' as const },
    { label: 'Acute Appendicitis', trigger: 'Verify Rovsing & McBurney Sign', symptom: 'Rovsing sign (indirect tenderness)', system: 'Gastrointestinal', mode: 'condition-symptom' as const },
    { label: 'Acute Coronary Syndrome', trigger: 'Verify Levine Sign & Diaphoresis', symptom: 'Levine sign / Right arm radiation', system: 'Cardiovascular', mode: 'condition-symptom' as const },
    { label: 'Right Lower Quadrant Abdomen', trigger: 'Migratory Visceral to Somatic Pain', system: 'Gastrointestinal', mode: 'body-region' as const },
    { label: 'Type 2 Diabetes', trigger: 'Verify Acanthosis Nigricans', symptom: 'Acanthosis nigricans', system: 'Endocrine', mode: 'condition-symptom' as const },
    { label: 'Subarachnoid Hemorrhage', trigger: 'Severe Occipital Thunderclap Headache', system: 'Neurological', mode: 'disease-name' as const },
    { label: 'Diabetic Ketoacidosis (DKA)', trigger: 'Kussmaul Breathing & Hyperglycemia', symptom: 'Kussmaul breathing / Acetone breath', system: 'Endocrine', mode: 'condition-symptom' as const },
    { label: 'Acute Cholecystitis', trigger: 'Right Upper Quadrant (Murphy Sign)', symptom: 'Murphy sign (inspiratory arrest)', system: 'Hepatobiliary', mode: 'condition-symptom' as const },
    { label: 'Tearing Substernal Chest Pain', trigger: 'Thorax & Precordium (Aortic Dissection)', system: 'Cardiovascular', mode: 'body-region' as const }
  ];

  const repositories = [
    { id: 'all', label: 'All Verified Open Repositories', icon: '🌐', desc: 'PubMed, Europe PMC, WHO, openFDA, StatPearls, CDC' },
    { id: 'pubmed', label: 'NCBI PubMed & PMC', icon: '📚', desc: 'NIH National Library of Medicine clinical index' },
    { id: 'europe_pmc', label: 'Europe PMC', icon: '🇪🇺', desc: 'EMBL-EBI open scholarly biomedical database' },
    { id: 'who', label: 'WHO Guidelines & EML', icon: '🇺🇳', desc: 'World Health Organization Essential Medicines & Guidelines' },
    { id: 'openfda', label: 'openFDA & DailyMed', icon: '💊', desc: 'US FDA official open drug labels & pharmacology' },
    { id: 'statpearls', label: 'NCBI StatPearls', icon: '📖', desc: 'Peer-reviewed comprehensive clinical compendium' },
    { id: 'cdc_nih', label: 'CDC & NIH Protocols', icon: '🏛️', desc: 'Public health & clinical practice standards' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isVerifying) return;
    if (searchMode === 'condition-symptom') {
      onVerifyCondition(query.trim(), 'condition-symptom', selectedRepo, symptomQuery.trim());
    } else {
      onVerifyCondition(query.trim(), searchMode, selectedRepo);
    }
  };

  const handleQuickSelect = (item: typeof quickInspirations[0]) => {
    setQuery(item.label);
    setSearchMode(item.mode);
    if (item.mode === 'condition-symptom' && item.symptom) {
      setSymptomQuery(item.symptom);
      onVerifyCondition(item.label, 'condition-symptom', selectedRepo, item.symptom);
    } else {
      onVerifyCondition(item.label, item.mode, selectedRepo);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 sm:p-6 mb-8 transition-colors">
      {/* Header & Open-Source Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-teal-600" />
              <span>Multi-Source Open Verified Data Engine</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              NCBI PubMed • Europe PMC • WHO Guidelines • openFDA • StatPearls • CDC
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-medical text-slate-900 dark:text-white">
            Enter Any Disease, Trigger Region, or Specific Symptom Association
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mt-0.5">
            Type any clinical entity, anatomical quadrant, or test whether a specific symptom correlates with a disease. The engine cross-validates claims across open-source databases with diagnostic likelihood and confidence scoring.
          </p>
        </div>

        {/* Input Mode Switcher */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shrink-0 self-start md:self-auto flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setSearchMode('disease-name')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              searchMode === 'disease-name'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>1. Disease Entity</span>
          </button>
          
          <button
            type="button"
            onClick={() => setSearchMode('body-region')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              searchMode === 'body-region'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>2. Trigger Region</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode('condition-symptom')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              searchMode === 'condition-symptom'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs ring-1 ring-teal-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>3. Condition + Specific Symptom</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
              Verify
            </span>
          </button>
        </div>
      </div>

      {/* Repository Selection Chips */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>Select Verified Open-Source Repositories to Ground Evidence:</span>
          </span>
          <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400">
            Current Target: {repositories.find(r => r.id === selectedRepo)?.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {repositories.map((repo) => {
            const isSelected = selectedRepo === repo.id;
            return (
              <button
                key={repo.id}
                type="button"
                onClick={() => setSelectedRepo(repo.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border text-xs ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs ring-1 ring-teal-400'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
                title={repo.desc}
              >
                <span>{repo.icon}</span>
                <span>{repo.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search / Query Form */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        {searchMode === 'condition-symptom' ? (
          /* Compound Dual Input for Condition + Specific Symptom */
          <div className="flex flex-col lg:flex-row gap-2.5">
            {/* Condition Query */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Activity className="w-4 h-4 text-teal-500" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Specific Condition (e.g. Acute Appendicitis, Myocardial Infarction, DKA, Meningitis)..."
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Specific Symptom Query to Verify */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
              </div>
              <input
                type="text"
                value={symptomQuery}
                onChange={(e) => setSymptomQuery(e.target.value)}
                placeholder="Specific Symptom or Bedside Sign to Verify (e.g. Rovsing sign, Levine sign, Acanthosis nigricans)..."
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-800/80 border border-emerald-300 dark:border-emerald-700/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-sans"
              />
              {symptomQuery && (
                <button
                  type="button"
                  onClick={() => setSymptomQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isVerifying}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 shrink-0 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Symptom Association...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-teal-200" />
                  <span>Verify Symptom & Build OS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Single Input for Disease or Body Region */
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {searchMode === 'disease-name' ? (
                  <Search className="w-4 h-4 text-teal-500" />
                ) : (
                  <MapPin className="w-4 h-4 text-emerald-500" />
                )}
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchMode === 'disease-name'
                    ? 'Enter any disease (e.g. Acute Pancreatitis, Pulmonary Embolism, Meningitis, Asthma, DKA)...'
                    : 'Enter trigger region or symptom (e.g. Right Lower Quadrant, Tearing Chest Pain, Epigastrium, Sudden Dyspnea)...'
                }
                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-sans"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isVerifying}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 shrink-0 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Open Sources...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-teal-200" />
                  <span>Verify & Build Operating System</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Live Verification Step Banner when processing */}
      {isVerifying && (
        <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 mb-4 animate-fade-in space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-900 dark:text-teal-200">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>Multi-Source Literature & Clinical Repository Cross-Validation in Progress...</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] text-teal-800 dark:text-teal-300 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>1. Querying NCBI PubMed & Europe PMC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>2. Calculating Evidence Level & Journal IF</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>3. Cross-Validating Symptom Likelihood (LR+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>4. Synthesizing Operating System & VINDICATE</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Launchers / Example Inspiration Triggers */}
      <div>
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Inspiration Triggers (Click to analyze any disease, trigger region, or symptom):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickInspirations.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isVerifying}
              onClick={() => handleQuickSelect(item)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-teal-500 dark:hover:border-teal-500 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group text-left"
            >
              <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600">
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                ({item.trigger})
              </span>
              {item.mode === 'condition-symptom' && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  Symptom Test
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Currently Loaded Banner (if active condition exists) */}
      {currentConditionTitle && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Active Loaded Condition:</span>
            <span className="font-bold font-serif-medical text-sm text-teal-700 dark:text-teal-300">
              {currentConditionTitle}
            </span>
            <span className="px-2 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300">
              Multi-Source Verified
            </span>
          </div>

          {onResetCondition && (
            <button
              type="button"
              onClick={onResetCondition}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer"
            >
              Clear & Enter New Condition
            </button>
          )}
        </div>
      )}
    </div>
  );
};
