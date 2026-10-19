import React, { useState, useMemo } from 'react';
import { 
  GitPullRequest, 
  Search, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Stethoscope, 
  FlaskConical, 
  FileText, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sliders,
  ExternalLink
} from 'lucide-react';
import likelihoodRatiosData from '../data/likelihoodRatios.json';

export interface LikelihoodRatioEntry {
  condition: string;
  finding: string;
  type: string;
  lr_positive: number;
  lr_negative: number;
  sensitivity: number;
  specificity: number;
  source_pmid: string;
  source_citation: string;
  notes?: string;
}

interface RankedDifferential {
  name: string;
  priorProbability: number; // percentage e.g. 30
  currentProbability: number;
  appliedFindings: {
    finding: string;
    lr: number;
    hasSourcedLr: boolean;
    pmid?: string;
    citation?: string;
  }[];
  discriminatingTip?: string;
}

const PRESET_PRESENTATIONS = [
  {
    id: 'rlq-pain',
    title: 'Right Lower Quadrant Pain & Fever',
    demographics: 'Young adult, 24-year-old',
    initialDifferentials: [
      { name: 'Acute Appendicitis', prior: 40 },
      { name: 'Mesenteric Lymphadenitis', prior: 25 },
      { name: 'Ectopic Pregnancy', prior: 15 },
      { name: 'Nephrolithiasis', prior: 12 },
      { name: 'Acute Cholecystitis', prior: 8 }
    ],
    availableFindings: [
      { label: 'Pain migration from periumbilicus to RLQ', type: 'history' },
      { label: 'Right lower quadrant pain', type: 'history' },
      { label: 'Rebound tenderness / involuntary guarding', type: 'exam' },
      { label: 'Psoas sign positive', type: 'exam' },
      { label: 'Rovsing sign positive', type: 'exam' },
      { label: 'Murphy sign positive', type: 'exam' },
      { label: 'Leukocytosis (WBC > 10,000 /uL)', type: 'lab' },
      { label: 'Positive urine/serum beta-hCG in reproductive-age female', type: 'lab' },
      { label: 'Microscopic or gross hematuria', type: 'lab' },
      { label: 'Recent viral upper respiratory infection in child/adolescent', type: 'history' },
      { label: 'Non-specific mild nausea without anorexia', type: 'history' } // Unsourced finding to demonstrate honesty rule!
    ]
  },
  {
    id: 'knee-pain',
    title: 'Acute Hot Swollen Knee & Inability to Bear Weight',
    demographics: '32-year-old athlete after landing',
    initialDifferentials: [
      { name: 'Anterior Cruciate Ligament (ACL) Tear', prior: 35 },
      { name: 'Meniscal Tear', prior: 30 },
      { name: 'Septic Arthritis of Knee', prior: 20 },
      { name: 'Nephrolithiasis', prior: 2 }
    ],
    availableFindings: [
      { label: 'Lachman test positive', type: 'exam' },
      { label: 'Joint line tenderness with McMurray test click', type: 'exam' },
      { label: 'Synovial fluid WBC > 50,000 /uL with > 90% polymorphonuclear cells', type: 'lab' },
      { label: 'Subjective feeling of knee stiffness in morning', type: 'history' } // Unsourced finding
    ]
  }
];

export const DifferentialLab: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rlq-pain');
  const [customPresentation, setCustomPresentation] = useState<string>('');
  const [activeFindings, setActiveFindings] = useState<string[]>([]);
  const [expandedDiff, setExpandedDiff] = useState<string | null>(null);

  const currentPreset = PRESET_PRESENTATIONS.find(p => p.id === selectedPresetId) || PRESET_PRESENTATIONS[0];
  const allLikelihoodRatios = likelihoodRatiosData as LikelihoodRatioEntry[];

  const handleToggleFinding = (findingLabel: string) => {
    setActiveFindings(prev => 
      prev.includes(findingLabel) 
        ? prev.filter(f => f !== findingLabel) 
        : [...prev, findingLabel]
    );
  };

  // Re-rank candidate differentials ONLY using sourced LRs
  const rankedDifferentials = useMemo(() => {
    return currentPreset.initialDifferentials.map(diff => {
      let currentOdds = (diff.prior / 100) / (1 - diff.prior / 100);
      const appliedFindings: RankedDifferential['appliedFindings'] = [];

      activeFindings.forEach(findingText => {
        const match = allLikelihoodRatios.find(
          lr => lr.condition.toLowerCase() === diff.name.toLowerCase() && 
                lr.finding.toLowerCase() === findingText.toLowerCase()
        );

        if (match) {
          const lr = match.lr_positive;
          currentOdds = currentOdds * lr;
          appliedFindings.push({
            finding: findingText,
            lr,
            hasSourcedLr: true,
            pmid: match.source_pmid,
            citation: match.source_citation
          });
        } else {
          // No sourced LR exists! Leave rank unchanged
          appliedFindings.push({
            finding: findingText,
            lr: 1.0,
            hasSourcedLr: false
          });
        }
      });

      const updatedProbability = (currentOdds / (1 + currentOdds)) * 100;
      return {
        name: diff.name,
        priorProbability: diff.prior,
        currentProbability: Math.min(Math.max(updatedProbability, 0.5), 99.5),
        appliedFindings
      };
    }).sort((a, b) => b.currentProbability - a.currentProbability);
  }, [currentPreset, activeFindings, allLikelihoodRatios]);

  // Discriminate the top two differentials
  const top1 = rankedDifferentials[0];
  const top2 = rankedDifferentials[1];

  const discriminator = useMemo(() => {
    if (!top1 || !top2) return null;
    // Find a sourced finding in table that strongly discriminates top1 from top2
    const top1Findings = allLikelihoodRatios.filter(lr => lr.condition.toLowerCase() === top1.name.toLowerCase());
    const bestTest = top1Findings.find(f => f.lr_positive >= 3.0 && !activeFindings.includes(f.finding));
    
    if (bestTest) {
      return {
        testName: bestTest.finding,
        targetCondition: top1.name,
        lrPos: bestTest.lr_positive,
        lrNeg: bestTest.lr_negative,
        sourceCitation: bestTest.source_citation,
        pmid: bestTest.source_pmid
      };
    }
    return null;
  }, [top1, top2, allLikelihoodRatios, activeFindings]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Signature Feature
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Bayesian Likelihood-Ratio Re-Ranking Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-medical text-slate-900 dark:text-white mt-0.5">
                Differential Lab
              </h1>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 max-w-md">
            <strong className="text-teal-700 dark:text-teal-300 font-bold block mb-0.5">
              Strict Non-Negotiable Honesty Rule:
            </strong>
            Differentials re-rank <em>ONLY</em> using peer-reviewed likelihood ratios from JAMA's Rational Clinical Examination series. If no sourced LR exists, rank stays unchanged.
          </div>
        </div>

        {/* Presentation Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            Select Clinical Presentation:
          </span>
          {PRESET_PRESENTATIONS.map(preset => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedPresetId(preset.id);
                setActiveFindings([]);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPresetId === preset.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sourced Findings Palette */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                Add Clinical Findings
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {activeFindings.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Click any finding to simulate patient history, physical examination, or laboratory findings:
            </p>

            <div className="space-y-2">
              {currentPreset.availableFindings.map((f, idx) => {
                const isActive = activeFindings.includes(f.label);
                const hasSourcedMatch = allLikelihoodRatios.some(lr => lr.finding.toLowerCase() === f.label.toLowerCase());

                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleFinding(f.label)}
                    className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-start justify-between gap-2.5 cursor-pointer border ${
                      isActive
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-950 dark:text-teal-100 shadow-2xs font-semibold'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}>
                        {isActive ? '✓' : '+'}
                      </span>
                      <span>{f.label}</span>
                    </div>

                    <div className="shrink-0">
                      {hasSourcedMatch ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Sourced LR
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                          No LR
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Discriminate Top 2 Callout */}
          {discriminator && (
            <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-600" />
                What to Ask/Test Next:
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                To discriminate between <strong className="text-slate-900 dark:text-white">{top1.name}</strong> ({top1.currentProbability.toFixed(0)}%) and <strong className="text-slate-900 dark:text-white">{top2.name}</strong> ({top2.currentProbability.toFixed(0)}%):
              </p>
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800 text-xs">
                <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  Evaluate: {discriminator.testName}
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-teal-700 dark:text-teal-300">
                  <span>LR(+): +{discriminator.lrPos.toFixed(1)}</span>
                  <span>LR(-): {discriminator.lrNeg.toFixed(2)}</span>
                  <span className="text-slate-400">PMID: {discriminator.pmid}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Ranked Differentials List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Ranked Differential Candidates
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time Bayesian posterior probability based on active findings
                </p>
              </div>
              <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
                {rankedDifferentials.length} Candidates
              </span>
            </div>

            <div className="space-y-3">
              {rankedDifferentials.map((diff, rankIndex) => {
                const isExpanded = expandedDiff === diff.name;
                const probability = diff.currentProbability;

                return (
                  <div 
                    key={diff.name}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 transition-all space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
                          rankIndex === 0 
                            ? 'bg-teal-600 text-white shadow-xs' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          #{rankIndex + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            {diff.name}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500">
                            Prior: {diff.priorProbability}% → Posterior: <strong className="text-teal-600 dark:text-teal-400">{probability.toFixed(1)}%</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                          {probability.toFixed(0)}%
                        </span>
                        <button
                          onClick={() => setExpandedDiff(isExpanded ? null : diff.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Probability Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          probability > 60 ? 'bg-teal-500' : probability > 30 ? 'bg-indigo-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.min(probability, 100)}%` }}
                      />
                    </div>

                    {/* Applied Findings Breakdown (Collapsible) */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 animate-fade-in">
                        <span className="font-bold text-slate-600 dark:text-slate-300 block text-[11px] uppercase tracking-wide">
                          Evidence Receipts for {diff.name}:
                        </span>
                        {diff.appliedFindings.length > 0 ? (
                          diff.appliedFindings.map((af, afIdx) => (
                            <div key={afIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                              <div>
                                <span className="font-medium text-slate-800 dark:text-slate-200">{af.finding}</span>
                                {af.citation && (
                                  <p className="text-[10px] text-slate-500 truncate max-w-sm mt-0.5">{af.citation}</p>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                {af.hasSourcedLr ? (
                                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                                    LR +{af.lr.toFixed(1)} (PMID {af.pmid})
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                                    No Sourced LR
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 text-[11px] italic">No active findings added yet. Select findings on the left to compute posterior probability.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
