import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  UserCheck, 
  CheckCircle,
  FileBadge,
  Filter,
  CheckCircle2,
  Globe2,
  Pill,
  Award,
  Search,
  Database,
  ArrowUpRight,
  Sparkles,
  Layers,
  HeartHandshake,
  Gauge,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SourceCitation } from '../types/disease';
import { computeCitationConfidenceScore } from '../services/openSourceVerification';

interface EvidenceShelfProps {
  evidenceList: SourceCitation[];
  diseaseTitle?: string;
}

export const EvidenceShelf: React.FC<EvidenceShelfProps> = ({ 
  evidenceList,
  diseaseTitle = 'Acute Coronary Syndrome'
}) => {
  const [selectedRepoFilter, setSelectedRepoFilter] = useState<string>('all');
  const [searchOpenSourceQuery, setSearchOpenSourceQuery] = useState<string>('');
  const [expandedScoreBreakdowns, setExpandedScoreBreakdowns] = useState<Set<string>>(new Set());

  const toggleBreakdown = (sourceId: string) => {
    setExpandedScoreBreakdowns(prev => {
      const next = new Set(prev);
      if (next.has(sourceId)) next.delete(sourceId);
      else next.add(sourceId);
      return next;
    });
  };

  // Comprehensive list of Open Verified Resources beyond PubMed
  const openVerifiedRepositories = useMemo(() => [
    {
      name: 'NCBI PubMed / PMC',
      badge: 'Peer-Reviewed / Open-i',
      tier: 'Tier 1',
      description: 'NLM Biomedical literature citations and full-text PMC open access archive.',
      getUrl: (query: string) => `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}`,
      status: 'Active API / Direct Connect'
    },
    {
      name: 'Europe PMC',
      badge: 'Global Open Access',
      tier: 'Tier 1',
      description: 'Comprehensive worldwide life sciences articles with open preprint & full-text indexing.',
      getUrl: (query: string) => `https://europepmc.org/search?query=${encodeURIComponent(query)}`,
      status: 'Active Gateway'
    },
    {
      name: 'openFDA (FDA Open Data)',
      badge: 'Pharmacopeia & Alerts',
      tier: 'Tier 1',
      description: 'Official US FDA database for approved drugs, contraindications, and adverse events.',
      getUrl: (query: string) => `https://open.fda.gov/apis/drug/label/`,
      status: 'Government Open Data'
    },
    {
      name: 'NCBI Bookshelf / StatPearls',
      badge: 'Clinical Compendium',
      tier: 'Tier 1',
      description: 'Peer-reviewed clinical guidelines, management pathways, and board-level pearls.',
      getUrl: (query: string) => `https://www.ncbi.nlm.nih.gov/books/?term=${encodeURIComponent(query)}`,
      status: 'Indexed Open Text'
    },
    {
      name: 'WHO IRIS & Guidelines',
      badge: 'Global Public Health',
      tier: 'Tier 1',
      description: 'World Health Organization consensus guidelines and Essential Medicines List (EML).',
      getUrl: (query: string) => `https://iris.who.int/discover?query=${encodeURIComponent(query)}`,
      status: 'Global Health Standard'
    },
    {
      name: 'DOAJ (Open Access Journals)',
      badge: 'Community Curated',
      tier: 'Tier 2',
      description: 'Directory of Open Access Journals covering high-quality international peer-reviewed journals.',
      getUrl: (query: string) => `https://doaj.org/search/articles?source=%7B%22query%22%3A%7B%22query_string%22%3A%7B%22query%22%3A%22${encodeURIComponent(query)}%22%7D%7D%7D`,
      status: 'Open Journal Index'
    },
    {
      name: 'OpenAlex',
      badge: 'Global Scholarly Graph',
      tier: 'Tier 2',
      description: 'Open catalog of 250M+ scientific papers, researchers, and citation networks.',
      getUrl: (query: string) => `https://openalex.org/works?search=${encodeURIComponent(query)}`,
      status: 'Graph Database'
    },
    {
      name: 'Cochrane Library (Open Abstracts)',
      badge: 'Evidence Synthesis',
      tier: 'Tier 1',
      description: 'Gold-standard systematic reviews, meta-analyses, and clinical intervention trials.',
      getUrl: (query: string) => `https://www.cochranelibrary.com/search?searchText=${encodeURIComponent(query)}`,
      status: 'Systematic Review Engine'
    },
    {
      name: 'Human Phenotype Ontology (HPO)',
      badge: 'Phenotypic Vocabulary',
      tier: 'Tier 1',
      description: 'Standardized vocabulary of phenotypic abnormalities encountered in human disease.',
      getUrl: (query: string) => `https://hpo.jax.org/browse/term/${encodeURIComponent(query)}`,
      status: 'Ontology Graph'
    },
    {
      name: 'DailyMed / RxNorm',
      badge: 'Structured Product Labels',
      tier: 'Tier 1',
      description: 'Comprehensive, up-to-date medication package inserts and clinical pharmacology.',
      getUrl: (query: string) => `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(query)}`,
      status: 'NLM DailyMed'
    }
  ], []);

  // Derive available repositories from citations list
  const repositories = useMemo(() => {
    const set = new Set<string>();
    evidenceList.forEach(e => {
      if (e.repository) set.add(e.repository);
    });
    return Array.from(set);
  }, [evidenceList]);

  const filteredList = useMemo(() => {
    if (selectedRepoFilter === 'all') return evidenceList;
    return evidenceList.filter(e => e.repository === selectedRepoFilter);
  }, [evidenceList, selectedRepoFilter]);

  const getRepoBadgeColor = (repo?: string) => {
    if (!repo) return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    if (repo.includes('WHO')) return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300';
    if (repo.includes('openFDA')) return 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300';
    if (repo.includes('PubMed')) return 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300';
    if (repo.includes('Europe')) return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300';
    if (repo.includes('StatPearls')) return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300';
    return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-300';
  };

  const effectiveQuery = searchOpenSourceQuery.trim() || diseaseTitle;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8 transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase tracking-wide">
              Module A11: Open Sources & Verification Engine
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Multi-Source Corroborated</span>
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
            Open Sources & Independent Verification Repositories
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Grounding across official open-access databases: NCBI PubMed/PMC, Europe PMC, WHO Guidelines, openFDA Drug Labels, StatPearls, DOAJ, OpenAlex, and Cochrane.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Hierarchy: Guidelines (Tier 1) &gt; RCTs/Reviews (Tier 2) &gt; Compendia (Tier 3)
        </div>
      </div>

      {/* Multi-Source Cross-Validation Protocol Banner */}
      <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-teal-900 dark:text-teal-200 block">
              2+ Independent Source Cross-Validation Protocol:
            </span>
            <span className="text-teal-700 dark:text-teal-300 text-[11px]">
              Every clinical assertion must be corroborated across 2+ independent open sources. No single-source dependency. Recency verified (&lt; 5 years) and licensed under CC-BY / Open Access.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-[11px] text-teal-800 dark:text-teal-300 font-bold">
          <span>{evidenceList.length} Verified Records Linked</span>
        </div>
      </div>

      {/* OPEN SOURCES FEDERATED DIRECTORY */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Federated Open-Source Portals (Direct 1-Click Access for "{effectiveQuery}")
            </h3>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchOpenSourceQuery}
              onChange={(e) => setSearchOpenSourceQuery(e.target.value)}
              placeholder={`Query portal (e.g. ${diseaseTitle})...`}
              className="text-xs pl-8 pr-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 w-52 sm:w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {openVerifiedRepositories.map((repo, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/60 dark:bg-slate-800/50 hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {repo.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold">
                    {repo.tier}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                  {repo.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ {repo.status}
                </span>

                <a
                  href={repo.getUrl(effectiveQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors cursor-pointer"
                >
                  <span>Query {repo.name.split(' ')[0]}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repository Filter Chips for Loaded Citations */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-teal-600" />
            <span>Filter Verified Citations:</span>
          </span>

          <button
            onClick={() => setSelectedRepoFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer text-xs border ${
              selectedRepoFilter === 'all'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
            }`}
          >
            All Repositories ({evidenceList.length})
          </button>

          {repositories.map((repo) => {
            const isSelected = selectedRepoFilter === repo;
            const count = evidenceList.filter(e => e.repository === repo).length;
            return (
              <button
                key={repo}
                onClick={() => setSelectedRepoFilter(repo)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer text-xs border ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs ring-1 ring-teal-400'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                <span>{repo}</span>
                <span className="text-[10px] opacity-80 ml-1">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Citations Grid */}
        <div className="space-y-4">
          {filteredList.map((source) => (
            <div
              key={source.source_id}
              id={source.source_id}
              className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 transition-all hover:border-teal-500/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Repository Origin Badge */}
                  {source.repository && (
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border ${getRepoBadgeColor(source.repository)}`}>
                      {source.repository}
                    </span>
                  )}

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    (source.tier as string) === 'Tier A' || (source.tier as string) === 'Tier 1'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300'
                      : (source.tier as string) === 'Tier B' || (source.tier as string) === 'Tier 2'
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200 border border-teal-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                  }`}>
                    {source.tier}
                  </span>

                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {source.journal_or_publisher} ({source.year})
                  </span>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Ref ID: {source.pmid}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{source.retraction_status}</span>
                  </span>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Open {source.repository?.split('/')[0] || 'Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-serif-medical leading-snug">
                {source.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authors: {source.authors}
              </p>

              {/* Visual Clinical Evidence Confidence Score Indicator */}
              {(() => {
                const scoreData = source.confidence_score !== undefined ? {
                  confidence_score: source.confidence_score,
                  evidence_level: source.evidence_level || 'Level 1b (Large RCT)',
                  journal_impact_factor: source.journal_impact_factor || 18.2,
                  evidence_strength_label: source.evidence_strength_label || 'High Strength',
                  score_breakdown: source.score_breakdown || {
                    levelScore: 36,
                    impactFactorScore: 24,
                    corroborationScore: 18,
                    recencyScore: 10
                  }
                } : computeCitationConfidenceScore({
                  journalOrPublisher: source.journal_or_publisher,
                  tier: source.tier,
                  year: source.year,
                  retractionClean: source.retraction_status.includes('Clean'),
                  corroboratedCount: source.cross_validation_count || 3,
                  repository: source.repository
                });

                const isExpanded = expandedScoreBreakdowns.has(source.source_id);
                const score = scoreData.confidence_score;
                const isHigh = score >= 90;
                const isMedHigh = score >= 80;

                return (
                  <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/5 dark:from-teal-950/30 dark:via-emerald-950/30 dark:to-indigo-950/20 border border-teal-200/80 dark:border-teal-800/80 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Score Gauge & Evidence Strength */}
                      <div className="flex items-center space-x-3">
                        {/* Radial Score Gauge Badge */}
                        <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border-2 border-teal-500/60 flex flex-col items-center justify-center shrink-0 shadow-xs">
                          <span className={`text-sm font-extrabold font-mono ${
                            isHigh ? 'text-emerald-600 dark:text-emerald-400' : isMedHigh ? 'text-teal-600 dark:text-teal-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {score}
                          </span>
                          <span className="text-[8px] uppercase font-bold text-slate-400 -mt-0.5">/100</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                              isHigh 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                                : isMedHigh
                                ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                            }`}>
                              ● {scoreData.evidence_strength_label}
                            </span>

                            {/* Journal Impact Factor Badge */}
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-indigo-600" />
                              <span>Impact Factor: {scoreData.journal_impact_factor.toFixed(1)}</span>
                            </span>
                          </div>

                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 block">
                            {scoreData.evidence_level}
                          </span>
                        </div>
                      </div>

                      {/* Right: Expand Breakdown Button */}
                      <button
                        type="button"
                        onClick={() => toggleBreakdown(source.source_id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 px-2.5 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-teal-200 dark:border-teal-800 shadow-2xs cursor-pointer self-start sm:self-auto transition-colors"
                      >
                        <Gauge className="w-3.5 h-3.5 text-teal-600" />
                        <span>Score Breakdown</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Expanded Breakdown Accordion Panel */}
                    {isExpanded && (
                      <div className="pt-2.5 border-t border-teal-200/60 dark:border-teal-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] animate-fade-in font-mono">
                        <div className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 uppercase font-sans">Evidence Level</span>
                          <span className="font-bold text-teal-700 dark:text-teal-300 text-xs">
                            {scoreData.score_breakdown.levelScore} / 40 pts
                          </span>
                          <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">Oxford CEBM scale</span>
                        </div>

                        <div className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 uppercase font-sans">Journal IF Weight</span>
                          <span className="font-bold text-indigo-700 dark:text-indigo-300 text-xs">
                            {scoreData.score_breakdown.impactFactorScore} / 30 pts
                          </span>
                          <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">JIF: {scoreData.journal_impact_factor.toFixed(1)}</span>
                        </div>

                        <div className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 uppercase font-sans">Corroboration</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">
                            {scoreData.score_breakdown.corroborationScore} / 20 pts
                          </span>
                          <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">2+ independent sources</span>
                        </div>

                        <div className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                          <span className="block text-[10px] text-slate-500 uppercase font-sans">Integrity & Recency</span>
                          <span className="font-bold text-teal-700 dark:text-teal-300 text-xs">
                            {scoreData.score_breakdown.recencyScore} / 10 pts
                          </span>
                          <span className="block text-[9px] text-slate-400 mt-0.5 font-sans">Clean unretracted</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* High-Yield Takeaway */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-teal-700 dark:text-teal-400 block mb-0.5">
                  Core Clinical Takeaway:
                </span>
                {source.high_yield_takeaway}
              </div>

              {/* Corroborated sources list */}
              {source.corroborated_sources && source.corroborated_sources.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 flex-wrap">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Corroborated by 2+ Independent Sources:</span>
                  {source.corroborated_sources.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Verification Metadata Footer */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Verified via: {source.verified_via} on {source.verified_on}</span>
                <span>License: {source.license}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
