export type DepthLevel = 'MS1' | 'MS2' | 'MS3' | 'MS4' | 'Resident' | 'MS2-3';

export interface DepthSummary {
  summary: string;
  cellular_depth: string;
  clinical_focus: string;
  exam_pearl: string;
}

export type DepthContentMap = {
  MS1: DepthSummary;
  MS2?: DepthSummary;
  MS3?: DepthSummary;
  'MS2-3'?: DepthSummary;
  MS4: DepthSummary;
  Resident: DepthSummary;
  [key: string]: DepthSummary | undefined;
};

export type BodyRegion = 
  | 'Right Lower Quadrant Abdomen'
  | 'Epigastrium & RUQ'
  | 'Thorax & Precordium'
  | 'Endocrine & Systemic'
  | 'Central Nervous System'
  | 'Gastrointestinal & Small Bowel'
  | 'Pelvis & Perineum'
  | 'Renal & Retroperitoneum'
  | (string & {});

export type OrganSystem = 
  | 'Gastrointestinal'
  | 'Endocrine / Metabolic'
  | 'Cardiovascular'
  | 'Neurological'
  | 'Immunological'
  | 'Renal'
  | 'Respiratory'
  | (string & {});

export interface EvidenceScoreBreakdown {
  levelScore: number;       // up to 40 (Oxford CEBM evidence level)
  impactFactorScore: number;// up to 30 (Journal Impact Factor)
  corroborationScore: number;// up to 20 (Multi-source corroboration)
  recencyScore: number;     // up to 10 (Recency & unretracted status)
}

export interface VerifiedSymptomAnalysis {
  symptomQuery: string;
  associatedCondition: string;
  correlationStrength: 'Pathognomonic (Very High)' | 'Strong Correlation' | 'Moderate Correlation' | 'Atypical / Non-specific';
  likelihoodRatioPositive: number;
  sensitivityPercent: number;
  specificityPercent: number;
  underlyingMechanism: string;
  verificationSource: string;
  citationUrl: string;
  isRedFlag: boolean;
  clinicalRecommendation: string;
}

export interface SourceCitation {
  source_id: string;
  tier: 'Tier A' | 'Tier B' | 'Tier C'; // A = guideline/systematic review; B = RCT/cohort; C = textbook/consensus
  title: string;
  authors: string;
  journal_or_publisher: string;
  year: number;
  pmid: string;
  pmcid?: string;
  doi?: string;
  url: string;
  license: 'Open Access (CC-BY / Public)' | 'Subscription / Paywalled' | 'Educational Open Access' | string;
  retraction_status: 'Clean (Verified Unretracted)' | 'Flagged';
  verified_via: 'NCBI E-utilities esummary' | 'Crossref DOI' | 'NIH NLM Catalog' | string;
  verified_on: string;
  reviewer_notes: string;
  high_yield_takeaway: string;
  repository?: 'NCBI PubMed / PMC' | 'Europe PMC' | 'WHO Guidelines' | 'openFDA / DailyMed' | 'NCBI Bookshelf / StatPearls' | 'CDC / NIH' | 'NICE Guidelines' | 'Cochrane Summaries' | string;
  cross_validation_count?: number;
  corroborated_sources?: string[];
  // Visual Confidence Score Indicator metadata
  confidence_score?: number; // 0 - 100
  evidence_level?: 'Level 1a (Systematic Review/Meta-analysis)' | 'Level 1b (Large RCT)' | 'Level 2a (Systematic Review of Cohorts)' | 'Level 2b (Cohort Study)' | 'Level 3 (Case-Control)' | 'Level 4 (Case Series)' | 'Level 5 (Expert Consensus/Guideline)';
  journal_impact_factor?: number; // e.g. 96.2 for NEJM, 168.9 for Lancet, 37.8 for Circulation, 12.5 for Cochrane
  evidence_strength_label?: 'Exceptional Strength' | 'High Strength' | 'Moderate Strength' | 'Preliminary / Expert Opinion';
  score_breakdown?: EvidenceScoreBreakdown;
}

export type PathwayNodeType = 
  | 'trigger'
  | 'molecular'
  | 'cellular'
  | 'tissue'
  | 'organ'
  | 'symptom'
  | 'sign'
  | 'test'
  | 'treatment';

export interface PathwayChainNode {
  id: string;
  nodeType: PathwayNodeType;
  title: string;
  mechanism: {
    MS1: string;
    MS2?: string;
    MS3?: string;
    'MS2-3'?: string;
    MS4: string;
    Resident: string;
    [key: string]: string | undefined;
  };
  evidenceGrade: 'Grade A (High)' | 'Grade B (Moderate)' | 'Grade C (Consensus)';
  source_id: string;
  examDistractorPitfall?: string;
}

export interface VindicateItem {
  letter: 'V' | 'I' | 'N' | 'D' | 'I2' | 'C' | 'A' | 'T' | 'E';
  category: 
    | 'Vascular'
    | 'Infectious'
    | 'Neoplastic'
    | 'Degenerative'
    | 'Iatrogenic / Idiopathic'
    | 'Congenital'
    | 'Autoimmune'
    | 'Trauma / Toxic'
    | 'Endocrine / Metabolic';
  weight: number; // 0 - 100 heat map weight
  roleInDisease: string;
  topDifferentials: string[];
  clinicalPearl: {
    simple: string;
    deep: string;
  };
}

export interface ExamLensData {
  patterns: ('SBA' | 'SAQ' | 'OSCE' | 'Viva' | 'EMQ' | 'Spotter')[];
  marks: string; // e.g. "5-10 marks (Short/Long Answer)"
  frequency_tier: 'Perennial (Exam Favorite)' | 'Common' | 'Rare [verify]';
  provenance: string; // Syllabus / Past papers / CBME / USMLE
  curriculum_codes: {
    system: 'USMLE Step 1/2' | 'NMC CBME' | 'UK MLA';
    code: string;
    competency: string;
  }[];
  sample_stems: {
    pattern: string;
    stem: string;
    options?: string[];
    correctOptionIndex?: number;
    explanation: string;
    keyDistractorAnalysis: string;
  }[];
  answer_skeleton: {
    section: 'Definition' | 'Aetiology' | 'Pathophysiology' | 'Clinical Features' | 'Investigations' | 'Management' | 'Complications';
    requiredKeywords: string[];
    typicalMarks: number;
    modelPoints: string[];
  }[];
  viva_ladder: {
    rung: 1 | 2 | 3;
    title: string; // e.g. "Level 1: Recall", "Level 2: Mechanism", "Level 3: Edge Case & Management"
    examinerQuestion: string;
    idealCandidateAnswer: string;
    examinerTrap: string;
  }[];
  osce_checklist: {
    task: string;
    criticalFailCondition?: boolean;
    points: number;
  }[];
}

export interface MindMapNode {
  id: string;
  label: string;
  category: string;
  details: string;
  parentId?: string;
  hiddenForRecall?: boolean;
}

export interface MindMapData {
  layout: 'radial' | 'tree' | 'concept';
  nodes: MindMapNode[];
}

export interface Flashcard {
  id: string;
  type?: 'basic' | 'cloze' | 'why-card' | 'vignette' | 'mnemonic';
  front: string;
  back: string;
  clozeDeletions?: string[];
  source_id?: string;
  disease_id?: string;
  diseaseId?: string;
  disease_name?: string;
  diseaseName?: string;
  category?: string;
  level?: string;
  tags: string[];
  createdAt?: number;
  intervalDays?: number;
  easeFactor?: number;
  reviewCount?: number;
  fsrs_state?: {
    stability: number;
    difficulty: number;
    reps: number;
    lapses: number;
    state: 'new' | 'learning' | 'review' | 'relearning';
    last_review: number;
    due: number;
  };
}

export interface UserProgress {
  userId: string;
  completedDiseaseIds: string[];
  bookmarkedDiseaseIds: string[];
  flashcards: Flashcard[];
  totalFlashcardsReviewed: number;
  lastActive: number;
  syncTimestamp: number;
}

export interface Disease {
  id: string;
  name: string;
  commonName?: string;
  icd10: string;
  organSystem: OrganSystem;
  bodyRegion: BodyRegion;
  acuity: 'Acute' | 'Chronic' | 'Subacute';
  oneLineSummary: string;
  etiology: {
    primaryTrigger: string;
    epidemiology: string;
    keyRiskFactors: string[];
    geneticOrEnvironmental: string;
    firstYearFocus: string;
    fourthYearFocus: string;
  };
  vindicate: any[];
  pathophysiology: {
    overview: string;
    cellularProgression: any[];
    histopathologySummary: string;
    firstYearFocus: string;
    fourthYearFocus: string;
  };
  clinicalPresentation: {
    classicPresentation: string;
    cardinalSymptoms: string[];
    physicalExamSigns: any[];
    atypicalPresentations: string[];
    firstYearFocus: string;
    fourthYearFocus: string;
  };
  treatment: {
    firstLineMedical: any[];
    surgicalOrDefinitive: string;
    supportiveCare: string[];
    clinicalGuidelines: any[];
    firstYearFocus: string;
    fourthYearFocus: string;
  };
  flowchart: any[];
  citations: any[];
}

export interface QubitsDiseaseEntry {
  id: string;
  title: string;
  aliases: string[];
  codes: {
    icd10: string;
    snomed_ct: string;
    mesh: string;
  };
  regions: BodyRegion[];
  system: OrganSystem;
  scope_note: string;
  when_to_ask_clinician: string;
  trust_score: number; // 98%
  last_reviewed: string;
  human_reviewed_by: string;
  ai_generated: boolean;
  global_health_note: {
    high_income: string;
    low_middle_income: string;
    who_essential_medicines: string[];
  };
  
  // Red Flag Ribbon (Coral Emergency Strip)
  red_flags: {
    warning: string;
    immediateAction: string;
    timeframe: string;
  }[];

  // Depth Dial Content
  depth_content: DepthContentMap;

  // Matrix Tabs
  etiology: {
    triggers: string[];
    risk_factors: string[];
    epidemiology: string;
  };
  pathway: PathwayChainNode[];
  vindicate: VindicateItem[];
  presentation: {
    classic: string;
    cardinal_symptoms: string[];
    physical_signs: {
      sign: string;
      maneuver: string;
      diagnostic_yield: string;
    }[];
    scoring_systems: {
      name: string;
      criteria: string[];
      clinical_action: string;
    }[];
  };
  diagnostics: {
    first_line: string;
    gold_standard: string;
    imaging_findings: string[];
    laboratory_pattern: string;
  };
  management: {
    acute_stabilization: string[];
    definitive: string;
    pharmacology: {
      drug_class: string;
      representative_agent: string;
      mechanism: string;
      essential_monitoring: string;
    }[];
  };

  // Exam Lens
  exam_lens: ExamLensData;

  // Visualizations & MindMap
  mindmap: MindMapData;

  // Seed Flashcards
  cards: Flashcard[];

  // Verified Sources
  evidence: SourceCitation[];

  // User-Requested Specific Symptom Verification
  verified_symptom_analysis?: VerifiedSymptomAnalysis;
}

export interface SimulationState {
  // Cardiac Output Sim
  preload: number; // EDV (mL) 50-200
  afterload: number; // SVR (dynes*s/cm5) 600-2400
  contractility: number; // inotropy factor 0.5 - 2.5
  heartRate: number; // bpm 40-180
  
  // PPV / Sensitivity Sim
  prevalence: number; // 0.1% - 30%
  sensitivity: number; // 50% - 99.9%
  specificity: number; // 50% - 99.9%
  sampleSize: number; // 10,000 standard cohort
}
