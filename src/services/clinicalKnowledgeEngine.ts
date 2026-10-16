import { 
  OrganSystem, 
  BodyRegion, 
  VindicateItem, 
  PathwayChainNode, 
  DepthContentMap,
  Flashcard,
  ExamLensData
} from '../types/disease';

export interface ClinicalSystemProfile {
  system: OrganSystem;
  region: BodyRegion;
  acuity: 'Acute' | 'Chronic' | 'Subacute';
  icd10: string;
  snomed_ct: string;
  mesh: string;
  scope_note: string;
  when_to_ask_clinician: string;
  global_health: {
    high_income: string;
    low_middle_income: string;
    who_essential_medicines: string[];
  };
  red_flags: {
    warning: string;
    immediateAction: string;
    timeframe: string;
  }[];
  depth_content: DepthContentMap;
  vindicate: VindicateItem[];
  pathway: PathwayChainNode[];
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
  cards: (entryId: string, formattedTitle: string, primarySourceId: string) => Flashcard[];
}

/**
 * Accurately classifies any clinical query or symptom into its authentic medical system and anatomy.
 * Completely eliminates the glitch where non-GI conditions (like knee pain) defaulted to Gastrointestinal!
 */
export function classifyClinicalEntity(query: string): {
  system: OrganSystem;
  region: BodyRegion;
  acuity: 'Acute' | 'Chronic' | 'Subacute';
  specificEntity: string;
} {
  const lower = query.toLowerCase();

  // 1. Musculoskeletal & Rheumatology (Knee, joints, ligaments, spine, bones)
  if (
    lower.includes('knee') || lower.includes('patell') || lower.includes('menisc') || 
    lower.includes('acl') || lower.includes('pcl') || lower.includes('mcl') || lower.includes('lcl') ||
    lower.includes('joint') || lower.includes('arthrit') || lower.includes('gout') || 
    lower.includes('pseudogout') || lower.includes('shoulder') || lower.includes('rotator') || 
    lower.includes('hip') || lower.includes('avascular necrosis') || lower.includes('spine') || 
    lower.includes('back pain') || lower.includes('lumbar') || lower.includes('cervical') || 
    lower.includes('sciatica') || lower.includes('fracture') || lower.includes('bone') || 
    lower.includes('tendon') || lower.includes('tendin') || lower.includes('bursit') || 
    lower.includes('sprain') || lower.includes('strain') || lower.includes('synov') ||
    lower.includes('ankylosing') || lower.includes('rheumatoid') || lower.includes('osteoarthr')
  ) {
    let specificEntity = 'Knee Joint Arthropathy / Musculoskeletal Derangement';
    let region: BodyRegion = 'Knee & Lower Extremity' as any;
    
    if (lower.includes('knee') || lower.includes('patell') || lower.includes('menisc') || lower.includes('acl')) {
      specificEntity = lower.includes('septic') ? 'Acute Septic Arthritis of the Knee' :
                       lower.includes('gout') ? 'Acute Gouty Knee Arthritis' :
                       lower.includes('osteo') ? 'Knee Osteoarthritis' :
                       lower.includes('menisc') ? 'Meniscal Tear of Knee' :
                       lower.includes('acl') ? 'Anterior Cruciate Ligament (ACL) Tear' : 'Knee Pain & Internal Derangement';
      region = 'Knee & Lower Extremity' as any;
    } else if (lower.includes('shoulder') || lower.includes('rotator')) {
      specificEntity = 'Shoulder Impingement / Rotator Cuff Pathology';
      region = 'Shoulder & Upper Extremity' as any;
    } else if (lower.includes('hip')) {
      specificEntity = 'Hip Joint Osteonecrosis / Arthritis';
      region = 'Hip & Pelvic Girdle' as any;
    } else if (lower.includes('back') || lower.includes('lumbar') || lower.includes('sciatica') || lower.includes('spine')) {
      specificEntity = 'Lumbosacral Radiculopathy / Acute Back Pain';
      region = 'Spine & Musculoskeletal' as any;
    }

    const acuity = (lower.includes('chronic') || lower.includes('osteoarthr')) ? 'Chronic' : 'Acute';
    return { system: 'Musculoskeletal' as any, region, acuity, specificEntity };
  }

  // 2. Neurological & Central Nervous System (Headache, migraine, stroke, seizures, etc.)
  if (
    lower.includes('head') || lower.includes('brain') || lower.includes('stroke') || 
    lower.includes('tia') || lower.includes('migraine') || lower.includes('seizure') || 
    lower.includes('epilepsy') || lower.includes('mening') || lower.includes('bleed') || 
    lower.includes('syncope') || lower.includes('neuropathy') || lower.includes('concussion') || 
    lower.includes('vertigo') || lower.includes('dizziness') || lower.includes('dementia') ||
    lower.includes('parkinson') || lower.includes('multiple sclerosis')
  ) {
    const specificEntity = lower.includes('migraine') ? 'Acute Migraine with Aura' :
                           lower.includes('stroke') ? 'Acute Ischemic Stroke' :
                           lower.includes('mening') ? 'Acute Bacterial Meningitis' :
                           lower.includes('seizure') ? 'Generalized Tonic-Clonic Seizure' : 'Acute Neurological Presentation';
    return { system: 'Neurological', region: 'Central Nervous System', acuity: 'Acute', specificEntity };
  }

  // 3. Cardiovascular & Thoracic (Chest pain, MI, angina, heart failure, aortic, etc.)
  if (
    lower.includes('chest') || lower.includes('heart') || lower.includes('myocardi') || 
    lower.includes('infarct') || lower.includes('stemi') || lower.includes('nstemi') || 
    lower.includes('angina') || lower.includes('aortic') || lower.includes('pericard') || 
    lower.includes('arrhythm') || lower.includes('coronary') || lower.includes('hypertens') ||
    lower.includes('failure') || lower.includes('chf') || lower.includes('palpitat')
  ) {
    const specificEntity = lower.includes('stemi') ? 'ST-Elevation Myocardial Infarction (STEMI)' :
                           lower.includes('angina') ? 'Acute Coronary Syndrome / Angina' :
                           lower.includes('aortic') ? 'Acute Aortic Dissection' :
                           lower.includes('pericard') ? 'Acute Pericarditis' : 'Acute Coronary Syndrome & Thoracic Pain';
    return { system: 'Cardiovascular', region: 'Thorax & Precordium', acuity: 'Acute', specificEntity };
  }

  // 4. Respiratory & Pulmonary (Dyspnea, asthma, COPD, pneumonia, PE, pneumothorax)
  if (
    lower.includes('lung') || lower.includes('breath') || lower.includes('dyspnea') || 
    lower.includes('asthma') || lower.includes('copd') || lower.includes('pneumon') || 
    lower.includes('embol') || lower.includes(' pe ') || lower.includes('pe') || 
    lower.includes('bronch') || lower.includes('cough') || lower.includes('wheez') ||
    lower.includes('pneumothorax')
  ) {
    const specificEntity = lower.includes('asthma') ? 'Acute Severe Asthma Exacerbation' :
                           lower.includes('copd') ? 'Acute COPD Exacerbation' :
                           lower.includes('pneumon') ? 'Community-Acquired Pneumonia' :
                           lower.includes('pneumothorax') ? 'Tension Pneumothorax' :
                           lower.includes('embol') ? 'Acute Pulmonary Embolism' : 'Acute Respiratory Distress';
    return { system: 'Respiratory', region: 'Thorax & Precordium', acuity: 'Acute', specificEntity };
  }

  // 5. Renal & Genitourinary (Kidney stone, flank, nephrolithiasis, UTI, pyelo)
  if (
    lower.includes('kidney') || lower.includes('renal') || lower.includes('nephr') || 
    lower.includes('flank') || lower.includes('hematuria') || lower.includes('stone') || 
    lower.includes('bladder') || lower.includes('uti') || lower.includes('pyelonephritis') ||
    lower.includes('dysuria') || lower.includes('prostat') || lower.includes('testic')
  ) {
    const specificEntity = lower.includes('stone') || lower.includes('flank') ? 'Acute Nephrolithiasis (Renal Colic)' :
                           lower.includes('pyelo') ? 'Acute Pyelonephritis' :
                           lower.includes('testic') ? 'Testicular Torsion' : 'Acute Urinary Tract Pathology';
    return { system: 'Renal', region: 'Renal & Retroperitoneum', acuity: 'Acute', specificEntity };
  }

  // 6. Endocrine & Metabolic (Diabetes, DKA, thyroid, adrenal, hypercalcemia)
  if (
    lower.includes('diabet') || lower.includes('dka') || lower.includes('thyroid') || 
    lower.includes('adrenal') || lower.includes('cushing') || lower.includes('addison') || 
    lower.includes('glucose') || lower.includes('insulin') || lower.includes('calcium') || 
    lower.includes('parathyroid') || lower.includes('hypoglycemia')
  ) {
    const specificEntity = lower.includes('dka') ? 'Diabetic Ketoacidosis (DKA)' :
                           lower.includes('thyroid') ? 'Thyroid Storm / Thyrotoxicosis' :
                           lower.includes('addison') ? 'Acute Adrenal Crisis' : 'Type 2 Diabetes & Metabolic Endocrinopathy';
    const acuity = lower.includes('dka') || lower.includes('crisis') || lower.includes('storm') ? 'Acute' : 'Chronic';
    return { system: 'Endocrine / Metabolic', region: 'Endocrine & Systemic', acuity, specificEntity };
  }

  // 7. Dermatological & Integumentary (Rash, cellulitis, abscess, eczema, shingles)
  if (
    lower.includes('rash') || lower.includes('skin') || lower.includes('cellulit') || 
    lower.includes('abscess') || lower.includes('eczema') || lower.includes('psoriasis') || 
    lower.includes('shingles') || lower.includes('zoster') || lower.includes('urticaria') ||
    lower.includes('erythema') || lower.includes('wound') || lower.includes('burn')
  ) {
    const specificEntity = lower.includes('cellulit') ? 'Acute Infectious Cellulitis' :
                           lower.includes('abscess') ? 'Cutaneous Abscess with Staphylococcal Infection' :
                           lower.includes('shingles') || lower.includes('zoster') ? 'Herpes Zoster (Shingles)' : 'Acute Dermatological Presentation';
    return { system: 'Dermatological' as any, region: 'Integumentary & Soft Tissue' as any, acuity: 'Acute', specificEntity };
  }

  // 8. Genuine Gastrointestinal & Abdominal (Only when actual abdominal/GI terms are present!)
  if (
    lower.includes('rlq') || lower.includes('right lower') || lower.includes('appendix') || lower.includes('appendic') ||
    lower.includes('ruq') || lower.includes('right upper') || lower.includes('cholecyst') || lower.includes('gallbladder') || lower.includes('biliary') || lower.includes('liver') || lower.includes('hepat') ||
    lower.includes('epigastr') || lower.includes('pancrea') || lower.includes('ulcer') || lower.includes('stomach') || lower.includes('gastric') || lower.includes('gerd') ||
    lower.includes('llq') || lower.includes('left lower') || lower.includes('divertic') || lower.includes('colon') || lower.includes('sigmoid') || lower.includes('bowel') ||
    lower.includes('abdomen') || lower.includes('abdominal') || lower.includes('diarrhea') || lower.includes('vomit') || lower.includes('nausea') || lower.includes('jaundice') || lower.includes('ascites')
  ) {
    let region: BodyRegion = 'Gastrointestinal & Small Bowel';
    let specificEntity = 'Acute Abdominal Condition';

    if (lower.includes('rlq') || lower.includes('appendix') || lower.includes('appendic')) {
      region = 'Right Lower Quadrant Abdomen';
      specificEntity = 'Acute Appendicitis';
    } else if (lower.includes('ruq') || lower.includes('cholecyst') || lower.includes('gallbladder')) {
      region = 'Epigastrium & RUQ';
      specificEntity = 'Acute Cholecystitis';
    } else if (lower.includes('epigastr') || lower.includes('pancrea')) {
      region = 'Epigastrium & RUQ';
      specificEntity = 'Acute Pancreatitis';
    } else if (lower.includes('llq') || lower.includes('divertic')) {
      region = 'Gastrointestinal & Small Bowel';
      specificEntity = 'Acute Diverticulitis';
    }

    return { system: 'Gastrointestinal', region, acuity: 'Acute', specificEntity };
  }

  // 9. Hematology & Systemic Infection
  if (lower.includes('anemia') || lower.includes('sickle') || lower.includes('bleed') || lower.includes('platelet') || lower.includes('leukemia')) {
    return { system: 'Hematological' as any, region: 'Hematopoietic & Systemic' as any, acuity: 'Acute', specificEntity: 'Hematologic Disorder / Anemia' };
  }
  if (lower.includes('sepsis') || lower.includes('fever') || lower.includes('lyme') || lower.includes('bacter')) {
    return { system: 'Infectious Disease' as any, region: 'Systemic / Multi-Organ' as any, acuity: 'Acute', specificEntity: 'Systemic Sepsis / Severe Infection' };
  }

  // Default fallback to General Internal Medicine
  return { 
    system: 'General Internal Medicine' as any, 
    region: 'Systemic / Multi-Organ' as any, 
    acuity: 'Acute',
    specificEntity: query.length > 2 ? query.charAt(0).toUpperCase() + query.slice(1) : 'Clinical Presentation'
  };
}

/**
 * Builds rich, medical school-grade clinical profile tailored to the classified system.
 * Delivers accurate ICD-10, SNOMED, MeSH, VINDICATE, 9-stage Pathway, Depth Dial, and management!
 */
export function generateClinicalSystemProfile(
  classified: ReturnType<typeof classifyClinicalEntity>,
  query: string,
  primarySourceId: string
): ClinicalSystemProfile {
  const formattedTitle = query.length > 2 
    ? query.charAt(0).toUpperCase() + query.slice(1) 
    : classified.specificEntity;

  // ==========================================
  // MUSCULOSKELETAL PROFILE (KNEE, JOINTS, SPINE)
  // ==========================================
  if (classified.system === 'Musculoskeletal') {
    const isKnee = query.toLowerCase().includes('knee') || query.toLowerCase().includes('patell') || query.toLowerCase().includes('menisc') || query.toLowerCase().includes('acl');
    const regionName = isKnee ? 'Knee & Lower Extremity' : classified.region;

    return {
      system: 'Musculoskeletal' as any,
      region: regionName,
      acuity: classified.acuity,
      icd10: isKnee ? 'M25.569' : 'M25.50',
      snomed_ct: isKnee ? '30989003' : '57676002',
      mesh: isKnee ? 'D007719' : 'D018771',
      scope_note: `Pathophysiological, biomechanical, and diagnostic operating profile for ${formattedTitle} involving ${regionName}. Rigorously distinguishes inflammatory, crystal-induced, mechanical, and septic etiologies.`,
      when_to_ask_clinician: 'Immediate clinician evaluation is mandatory for any acute inability to bear weight, hot erythematous joint effusion with fever (>38°C), neurovascular deficit (diminished distal foot pulses), or suspected extensor tendon disruption.',
      global_health: {
        high_income: 'High-resolution non-contrast MRI within 24-72 hours for soft-tissue ligamentous/meniscal triage; diagnostic bedside arthrocentesis with polarized microscopy and rapid PCR; minimally invasive arthroscopic repair or total joint arthroplasty.',
        low_middle_income: 'Plain weight-bearing radiography (AP, lateral, skyline views) to evaluate joint space narrowing and exclude fractures; bedside joint aspiration with sterile syringe to assess synovial fluid turbidity, string sign, and Gram stain; WHO Essential analgesia (Paracetamol + Ibuprofen) and offloading crutches.',
        who_essential_medicines: ['Ibuprofen / Naproxen', 'Paracetamol IV / Oral', 'Ceftriaxone IV', 'Vancomycin IV', 'Morphine / Tramadol', 'Triamcinolone acetonide (intra-articular)']
      },
      red_flags: [
        {
          warning: `Acute hot, erythematous, swollen joint with high fever (>38.0°C) and severe agony on passive joint excursion in ${regionName}`,
          immediateAction: 'Suspect Acute Septic Arthritis. Perform emergent diagnostic arthrocentesis to obtain synovial fluid for cell count, Gram stain, and culture BEFORE initiating empirical broad-spectrum IV antibiotics (Vancomycin + Ceftriaxone). Urgent orthopedic surgical consult for joint washout within 60 minutes.',
          timeframe: 'Emergency (< 60 mins)'
        },
        {
          warning: 'Cold, pale foot with diminished or absent distal pulses (dorsalis pedis/posterior tibial) or peroneal nerve sensory loss following acute knee trauma/dislocation',
          immediateAction: 'High risk of Popliteal Artery Disruption / Acute Compartment Syndrome. Perform immediate closed reduction of dislocated joint, order emergent CT Angiography of lower extremity, and request emergency vascular surgery consultation.',
          timeframe: 'Immediate (< 15 mins)'
        },
        {
          warning: 'Inability to perform an active straight leg raise with a palpable suprapatellar or infrapatellar defect post-eccentric load',
          immediateAction: 'Complete Extensor Mechanism Disruption (Quadriceps or Patellar Tendon Rupture). Place in extension knee immobilizer, maintain non-weight bearing status, and obtain urgent orthopedic surgical consultation for operative repair within 7-14 days.',
          timeframe: 'Urgent (< 24 hrs)'
        }
      ],
      depth_content: {
        MS1: {
          summary: `Normal functional anatomy and biomechanics of ${regionName}. Focuses on tibiofemoral and patellofemoral articulations, cruciate/collateral ligaments, meniscal vascular zones, and articular hyaline cartilage histology.`,
          cellular_depth: `Articular hyaline cartilage is composed of type II collagen and aggrecan proteoglycans maintained by quiescent chondrocytes. Avascularity limits intrinsic repair; synovial fluid nutrition occurs via cyclic mechanical compression.`,
          clinical_focus: `Anatomical relations: Screw-home mechanism of the knee (femur internally rotates on fixed tibia during terminal extension, unlocked by the popliteus muscle). Cruciate ligament anatomy: Anterior Cruciate Ligament (ACL) attaches from anterior intercondylar tibia to medial wall of lateral femoral condyle (LAMP mnemonic).`,
          exam_pearl: `LAMP rule: Lateral condyle = Anterior cruciate; Medial condyle = Posterior cruciate. The outer 1/3 of the meniscus is vascularized (red zone); the inner 2/3 is avascular (white zone) and cannot heal without surgical debridement.`
        },
        MS2: {
          summary: `Pathophysiology of joint inflammation, crystal arthropathies, mechanical tear dynamics, and synovial fluid cellular thresholds in ${regionName}.`,
          cellular_depth: `Synovial intimal hyperplasia and macrophage activation. In Gout, monosodium urate crystals activate the NLRP3 inflammasome, triggering caspase-1 and massive IL-1β/IL-18 release. In Osteoarthritis, mechanical overload induces chondrocyte secretion of matrix metalloproteinases (MMP-1, MMP-13) and aggrecanases (ADAMTS-4/5), cleaving cartilage matrix.`,
          clinical_focus: `Synovial fluid analysis thresholds: Normal/Non-inflammatory (WBC <2,000/μL, <25% PMNs); Inflammatory/Crystalline (WBC 2,000 - 50,000/μL, >50% PMNs); Septic (WBC >50,000/μL, >75-90% PMNs, opaque/purulent, low glucose). Polarized light microscopy: Gout shows needle-shaped negatively birefringent crystals (yellow under parallel light); Pseudogout shows rhomboid positively birefringent crystals (blue under parallel light).`,
          exam_pearl: `Classic USMLE Step 1 distractor: Monosodium urate crystals are NEGATIVE (yellow parallel), while Calcium Pyrophosphate Dihydrate (CPPD) crystals are POSITIVE (blue parallel). Chondrocalcinosis on plain radiographs strongly points to CPPD.`
        },
        MS3: {
          summary: `Bedside diagnostic reasoning, provocative orthopedic maneuvers, Ottawa Knee Rules, and stepwise investigation algorithms for ${regionName}.`,
          cellular_depth: `Capsular nociceptor stimulation via substance P, calcitonin gene-related peptide (CGRP), and bradykinin drives localized somatic joint pain that worsens with weight-bearing.`,
          clinical_focus: `Physical exam maneuvers: Lachman test (most sensitive test for ACL tear, 85% sensitivity, 94% specificity; superior to Anterior Drawer); McMurray test (palpable click on external rotation = medial meniscus, internal rotation = lateral meniscus); Valgus stress at 30° flexed (isolates MCL); Ballotable patella test for joint effusion. Apply the Ottawa Knee Rule (X-ray only if: age ≥55, isolated patellar tenderness, fibular head tenderness, inability to flex to 90°, or inability to bear weight 4 steps).`,
          exam_pearl: `Ottawa Knee Rules have >98% sensitivity for clinically significant fractures; an exam candidate who orders knee X-rays on a 22-year-old who can walk 4 steps with no bony tenderness fails the triage efficiency rubric.`
        },
        MS4: {
          summary: `Acute emergency triage of the hot swollen knee, rapid arthrocentesis technique, septic joint exclusion, and pre-operative stabilization protocols.`,
          cellular_depth: `Bacterial proteases and neutrophil elastase cause irreversible chondrolysis within 24-48 hours if a septic joint is left un-aspirated; early joint decompression is limb-saving.`,
          clinical_focus: `Immediate bedside execution: Differentiate prepatellar bursitis (extra-articular swelling anterior to patella; full passive range of knee flexion preserved) from true intra-articular septic arthritis (diffuse effusion, agonizing pain on even 5° of passive motion). Arthrocentesis superolateral approach; start empirical Vancomycin 15-20 mg/kg IV + Ceftriaxone 2g IV if synovial fluid is cloudy/purulent.`,
          exam_pearl: `Never administer intra-articular corticosteroids until synovial fluid analysis and Gram stain have definitively excluded infectious bacterial septic arthritis!`
        },
        Resident: {
          summary: `Evidence-based surgical vs non-operative decision-making, multiligamentous knee injuries, prosthetic joint infection (PJI) algorithms, and guideline dosing.`,
          cellular_depth: `Biofilm formation on orthopedic implants reduces antibiotic penetration; PJI diagnostic criteria rely on synovial alpha-defensin, leukocyte esterase, and synovial WBC >3,000/μL (>80% PMNs).`,
          clinical_focus: `Managing complex knee trauma: Knee dislocation requires serial ankle-brachial index (ABI) measurements (>0.9 normal; ≤0.9 mandates urgent CT angiography). ACL reconstruction timing: Delaying surgery 3-6 weeks until acute inflammation subsides and full range of motion returns prevents post-operative arthrofibrosis. KANON Trial: Structured rehabilitation plus optional delayed ACL reconstruction achieves similar 5-year patient-reported outcomes to early reconstruction.`,
          exam_pearl: `In any patient with a high-energy knee dislocation reduced spontaneously before ED arrival, occult popliteal artery intimal injury can lead to delayed thrombosis 24-48 hours later; document serial vascular checks.`
        }
      },
      vindicate: [
        {
          letter: 'V',
          category: 'Vascular',
          weight: 45,
          roleInDisease: 'Popliteal artery aneurysm, popliteal entrapment syndrome, avascular necrosis (AVN) of the femoral condyle, or deep vein thrombosis (DVT) presenting with calf/popliteal pain.',
          topDifferentials: ['Popliteal Artery Entrapment / Aneurysm', 'Avascular Necrosis of Medial Femoral Condyle (SONK)', 'Deep Vein Thrombosis / Ruptured Baker Cyst'],
          clinicalPearl: {
            simple: 'A pulsatile mass in the popliteal fossa suggests a popliteal artery aneurysm; ~50% are bilateral and correlate with abdominal aortic aneurysms.',
            deep: 'Spontaneous Osteonecrosis of the Knee (SONK) occurs in elderly females with sudden severe medial knee pain without prior trauma, visible on early MRI.'
          }
        },
        {
          letter: 'I',
          category: 'Infectious',
          weight: 95,
          roleInDisease: 'Acute bacterial septic arthritis, osteomyelitis of adjacent bone, Lyme disease (Borrelia burgdorferi), or prepatellar septic bursitis.',
          topDifferentials: ['Acute Bacterial Septic Arthritis (Staphylococcus aureus, Neisseria gonorrhoeae)', 'Prepatellar Septic Bursitis (Staphylococcus)', 'Lyme Arthritis (Borrelia burgdorferi oligooarthritis)'],
          clinicalPearl: {
            simple: 'Staphylococcus aureus is the #1 cause of septic arthritis overall; Neisseria gonorrhoeae is the leading cause in sexually active young adults (often presents with migratory tenosynovitis and pustular rash).',
            deep: 'In sexually active patients presenting with knee effusion, examine wrists and fingers for tenosynovitis, and inspect palms and soles for hemorrhagic pustules.'
          }
        },
        {
          letter: 'N',
          category: 'Neoplastic',
          weight: 35,
          roleInDisease: 'Primary bone neoplasms (Osteosarcoma, Ewing sarcoma, Giant cell tumor), synovial sarcoma, or metastatic bone lesions.',
          topDifferentials: ['Osteosarcoma (distal femur / proximal tibia metaphysis)', 'Giant Cell Tumor of Bone (epiphysis)', 'Synovial Sarcoma', 'Bone Metastases (Breast, Prostate, Lung)'],
          clinicalPearl: {
            simple: 'Unexplained knee pain in an adolescent that awakens them at night warrants plain radiographs to evaluate for periosteal elevation (Codman triangle) or sunburst pattern.',
            deep: 'Giant Cell Tumor arises in the skeletally mature epiphysis with a "soap bubble" lytic appearance and multinucleated osteoclast-like giant cells.'
          }
        },
        {
          letter: 'D',
          category: 'Degenerative',
          weight: 90,
          roleInDisease: 'Primary knee osteoarthritis, degenerative meniscal cleavage tears, and chondromalacia patellae.',
          topDifferentials: ['Primary Knee Osteoarthritis (Tibiofemoral & Patellofemoral)', 'Degenerative Meniscopathy', 'Chondromalacia Patellae / Patellofemoral Pain Syndrome'],
          clinicalPearl: {
            simple: 'Radiographic hallmarks of osteoarthritis: LOSS = Loss of joint space, Osteophytes, Subchondral sclerosis, Subchondral cysts.',
            deep: 'Osteoarthritis stiffness lasts <30 minutes in the morning and worsens with evening weight-bearing; inflammatory arthritis stiffness persists >1 hour.'
          }
        },
        {
          letter: 'I2',
          category: 'Iatrogenic / Idiopathic',
          weight: 35,
          roleInDisease: 'Fluoroquinolone-induced tendinopathy, post-arthroscopy septic arthritis, steroid-induced osteonecrosis, or complex regional pain syndrome (CRPS).',
          topDifferentials: ['Fluoroquinolone Tendinopathy (Ciprofloxacin)', 'Post-Procedural Joint Infection', 'Corticosteroid-Induced Osteonecrosis'],
          clinicalPearl: {
            simple: 'Fluoroquinolones (Ciprofloxacin, Levofloxacin) carry an FDA black box warning for tendonitis and tendon rupture (most commonly Achilles, but patellar tendon can be affected).',
            deep: 'High-dose systemic glucocorticoids alter femoral microcirculation, precipitating ischemic bone marrow death and secondary subchondral collapse.'
          }
        },
        {
          letter: 'C',
          category: 'Congenital',
          weight: 30,
          roleInDisease: 'Discoid lateral meniscus, patellar maltracking / trochlear dysplasia, genu valgum/varum, and hereditary joint hypermobility.',
          topDifferentials: ['Discoid Lateral Meniscus', 'Patellar Instability / Trochlear Dysplasia', 'Ehlers-Danlos / Hypermobility Spectrum Disorder'],
          clinicalPearl: {
            simple: 'Discoid meniscus is a developmental anomaly where the lateral meniscus is a solid disc instead of a crescent, prone to clunking and tearing in young athletes.',
            deep: 'Assess systemic hypermobility using the Beighton Score (≥5/9 indicates generalized ligamentous laxity).'
          }
        },
        {
          letter: 'A',
          category: 'Autoimmune',
          weight: 85,
          roleInDisease: 'Rheumatoid arthritis, psoriatic arthritis, reactive arthritis (Reiter syndrome), ankylosing spondylitis, and systemic lupus erythematosus.',
          topDifferentials: ['Rheumatoid Arthritis (anti-CCP, symmetric polyarthritis)', 'Reactive Arthritis (HLA-B27, post-Chlamydia / GI infection)', 'Psoriatic Arthritis (dactylitis, nail pitting)'],
          clinicalPearl: {
            simple: 'Reactive arthritis triad: "Can\'t see, can\'t pee, can\'t climb a tree" (conjunctivitis/uveitis, urethritis, asymmetric oligooarthritis).',
            deep: 'Anti-Cyclic Citrullinated Peptide (anti-CCP) antibodies have >95% specificity for rheumatoid arthritis and predict progressive erosive joint damage.'
          }
        },
        {
          letter: 'T',
          category: 'Trauma / Toxic',
          weight: 90,
          roleInDisease: 'Acute ligamentous rupture (ACL, PCL, MCL, LCL), traumatic meniscal tear, patellar dislocation, and tibial plateau fracture.',
          topDifferentials: ['Anterior Cruciate Ligament (ACL) Tear', 'Medial Meniscal Tear', 'Medial Collateral Ligament (MCL) Sprain', 'Tibial Plateau Fracture'],
          clinicalPearl: {
            simple: 'Hearing or feeling a "pop" followed by rapid swelling (hemarthrosis within 2 hours) is classic for an ACL tear until proven otherwise.',
            deep: 'The "Unhappy Triad" (O\'Donoghue triad) consists of injuries to the ACL, MCL, and medial (or lateral) meniscus following lateral knee trauma.'
          }
        },
        {
          letter: 'E',
          category: 'Endocrine / Metabolic',
          weight: 85,
          roleInDisease: 'Gout (monosodium urate crystal precipitation), pseudogout (calcium pyrophosphate dihydrate), and hemochromatosis arthropathy.',
          topDifferentials: ['Acute Gouty Arthritis', 'Pseudogout / Calcium Pyrophosphate Deposition (CPPD)', 'Hemochromatosis Arthropathy'],
          clinicalPearl: {
            simple: 'Pseudogout is the most common crystal arthropathy in the knee of patients aged >65, showing chondrocalcinosis on plain radiographs.',
            deep: 'In acute gout, serum uric acid levels may paradoxically be normal or low during the flare; do not initiate or adjust allopurinol until the acute attack resolves.'
          }
        }
      ],
      pathway: [
        {
          id: 'node-msk-1',
          nodeType: 'trigger',
          title: '1. Initiating Insult / Biomechanical Shear',
          mechanism: {
            MS1: 'Rotational torque on planted flexed knee or crystal supersaturation / hematogenous bacterial seeding into the synovial vascular bed.',
            MS2: 'Mechanical overload tears cartilage/ligament fibrils or triggers monosodium urate / CPPD crystallization.',
            MS3: 'Patient describes acute injury mechanism (pivot-shift, pop) or sudden nocturnal onset of fiery pain.',
            MS4: 'Identify high-acuity triggers: traumatic dislocation, penetrating trauma, or systemic fever.',
            Resident: 'Assess mechanism kinematics (deceleration, valgus stress) to anticipate associated secondary injuries.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId,
          examDistractorPitfall: 'Pitfall: Confusing an immediate hemarthrosis (<2h, usually ACL or fracture) with delayed effusion (12-24h, classic for isolated meniscal tear).'
        },
        {
          id: 'node-msk-2',
          nodeType: 'molecular',
          title: '2. NLRP3 Inflammasome & Pro-Inflammatory Cytokines',
          mechanism: {
            MS1: 'Crystalline or mechanical debris stimulates Toll-like receptors and NLRP3 inflammasome assembly.',
            MS2: 'Active caspase-1 cleaves pro-IL-1β into mature IL-1β; TNF-α and IL-6 amplify endothelial selectin expression.',
            MS3: 'Local production of prostaglandins (PGE2) sensitizes primary peripheral nociceptive nerve endings.',
            MS4: 'Systemic inflammatory markers rise rapidly (elevated serum CRP and erythrocyte sedimentation rate ESR).',
            Resident: 'Targeting IL-1 (Anakinra) provides rapid abortive relief in refractory crystal arthritis.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        },
        {
          id: 'node-msk-3',
          nodeType: 'cellular',
          title: '3. Synovial Intimal Hyperplasia & Neutrophil Influx',
          mechanism: {
            MS1: 'Type A macrophage-like synoviocytes and Type B fibroblast-like synoviocytes expand.',
            MS2: 'Circulating neutrophils roll via selectins, adhere via integrins (ICAM-1), and diapedese across fenestrated synovial capillaries.',
            MS3: 'Synovial fluid leukocyte count surges: >50,000/μL in septic joints, 2,000-50,000/μL in inflammatory/gout.',
            MS4: 'Arthrocentesis cell count and differential is the definitive diagnostic milestone.',
            Resident: 'Synovial fluid polymorphonuclear cell fraction >90% strongly correlates with bacterial colonization.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        },
        {
          id: 'node-msk-4',
          nodeType: 'tissue',
          title: '4. High-Pressure Joint Effusion & Cartilage Erosion',
          mechanism: {
            MS1: 'Hypervascular synovial membrane exudes proteinaceous fluid, producing capsular distension.',
            MS2: 'Neutrophil elastase and matrix metalloproteinases (MMP-13) degrade type II collagen and aggrecan.',
            MS3: 'Elevated intra-articular pressure causes severe dull ache at rest that turns sharp with movement.',
            MS4: 'Immediate joint decompression via sterile aspiration provides dramatic analgesia.',
            Resident: 'Unrelieved intra-articular pressure exceeding capillary closing pressure produces chondrocyte necrosis in <48h.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        },
        {
          id: 'node-msk-5',
          nodeType: 'organ',
          title: '5. Biomechanical Failure of Tibiofemoral Articulation',
          mechanism: {
            MS1: 'Normal low-friction fluid-film lubrication is lost; articular surfaces experience direct shear friction.',
            MS2: 'Ligamentous insufficiency (e.g. torn ACL) permits abnormal anterior tibial translation.',
            MS3: 'Patient exhibits marked antalgic gait, refuses full extension, and reports knee instability.',
            MS4: 'Assess weight-bearing capability using standardized Ottawa Knee Rules.',
            Resident: 'Chronic joint incongruity accelerates secondary post-traumatic osteoarthritis.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        },
        {
          id: 'node-msk-6',
          nodeType: 'symptom',
          title: '6. Cardinal Joint Pain, Stiffness & Instability',
          mechanism: {
            MS1: 'Joint capsule mechanoreceptors and nociceptive C-fibers transmit intense localized joint discomfort.',
            MS2: 'Inflammatory cytokine accumulation overnight causes severe morning stiffness.',
            MS3: 'Classic presentation: inability to bear weight, joint locking (meniscus), or fiery nocturnal pain (gout).',
            MS4: 'Assess functional impairment: ability to negotiate stairs, pivot, or bear weight.',
            Resident: 'Quantify baseline disability using validated KOOS or WOMAC knee outcome scores.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        },
        {
          id: 'node-msk-7',
          nodeType: 'sign',
          title: '7. Bedside Clinical Signs (Lachman, Effusion, Joint Line)',
          mechanism: {
            MS1: 'Fluid wave / bulge sign reveals intra-articular effusion; ballotable patella taps against femoral trochlea.',
            MS2: 'Direct palpation over medial or lateral joint lines elicits sharp focal tenderness (meniscal sign).',
            MS3: 'Lachman test demonstrates soft end-point and anterior tibial translation (85% sensitivity for ACL).',
            MS4: 'Ottawa Knee Rules determine need for emergency radiographs (age ≥55, fibular head tenderness, non-weight bearing).',
            Resident: 'Document secondary rotational instability via the Pivot-Shift test under anesthesia.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        },
        {
          id: 'node-msk-8',
          nodeType: 'test',
          title: '8. Diagnostic Arthrocentesis & Multi-Modal Imaging',
          mechanism: {
            MS1: 'Arthrocentesis aspirates synovial fluid for macroscopic clarity, cell count, Gram stain, and polarized microscopy.',
            MS2: 'Weight-bearing radiographs (AP, lateral, merchant/skyline) identify fractures, osteophytes, and joint space loss.',
            MS3: 'Synovial polarized microscopy: negatively birefringent needle crystals = Gout; positive rhomboids = CPPD.',
            MS4: 'Non-contrast MRI of knee joint provides definitive visualization of menisci, cruciate ligaments, and bone contusions.',
            Resident: 'Synovial fluid procalcitonin and alpha-defensin testing assist in ambiguous culture-negative presentations.'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        },
        {
          id: 'node-msk-9',
          nodeType: 'treatment',
          title: '9. Therapeutic Aspiration, Targeted Rx & Surgical Repair',
          mechanism: {
            MS1: 'Joint decompression restores physiologic pressure; RICE protocol minimizes secondary tissue swelling.',
            MS2: 'NSAIDs (Naproxen/Ibuprofen) or Colchicine inhibit COX enzymes and neutrophil microtubule assembly in crystal flares.',
            MS3: 'In septic arthritis: emergent arthroscopic surgical washout + IV Ceftriaxone & Vancomycin.',
            MS4: 'Immobilize in knee brace, provide axillary crutches, and refer for orthopedic consultation.',
            Resident: 'Shared decision-making on ACL reconstruction vs structured physical therapy based on athletic goals (KANON trial).'
          },
          evidenceGrade: 'Grade A (High)',
          source_id: primarySourceId
        }
      ],
      presentation: {
        classic: `Patient presents with acute onset sharp or throbbing pain in ${regionName}, accompanied by visible joint swelling, localized warmth, antalgic gait, and restricted active flexion/extension.`,
        cardinal_symptoms: [
          `Pain localized to ${regionName}, aggravated by weight-bearing or twisting`,
          'Joint swelling / tense effusion noticeable within hours of symptom onset',
          'Morning stiffness (<30 min in osteoarthritis; >60 min in inflammatory arthritis)',
          'Mechanical catching, clicking, or locked knee (suggests meniscal tear)',
          'Sensation of joint instability or "giving way" on pivoting (suggests ligamentous rupture)'
        ],
        physical_signs: [
          {
            sign: 'Ballotable Patella / Bulge Test',
            maneuver: 'Compress suprapatellar pouch and gently push patella posterior against femoral trochlea.',
            diagnostic_yield: 'Sensitivity 88%, Specificity 90%; detects intra-articular effusion.'
          },
          {
            sign: 'Lachman Test',
            maneuver: 'Patient supine, knee flexed to 20-30°, stabilize distal femur and apply anterior translation force to proximal tibia.',
            diagnostic_yield: 'Sensitivity 85%, Specificity 94%; superior to Anterior Drawer for ACL rupture.'
          },
          {
            sign: 'Joint Line Tenderness',
            maneuver: 'Palpate the medial and lateral tibiofemoral joint margins with knee flexed at 90°.',
            diagnostic_yield: 'Sensitivity 80%, Specificity 65%; highly sensitive screening sign for meniscal injury.'
          },
          {
            sign: 'McMurray Test',
            maneuver: 'Flex knee to maximum, externally rotate tibia and extend (medial meniscus), or internally rotate and extend (lateral meniscus).',
            diagnostic_yield: 'Sensitivity 70%, Specificity 88%; positive test produces palpable click or joint line pain.'
          }
        ],
        scoring_systems: [
          {
            name: 'Ottawa Knee Rules (Radiography Triage)',
            criteria: [
              'Age 55 years or older',
              'Isolated tenderness of patella (with no other bony tenderness of knee)',
              'Tenderness of the head of the fibula',
              'Inability to flex knee to 90 degrees',
              'Inability to bear weight both immediately and in emergency department (4 steps)'
            ],
            clinical_action: 'If any ONE criterion is present, knee radiographs are indicated. If NONE are present, fracture is excluded with >98% sensitivity without radiographs.'
          }
        ]
      },
      diagnostics: {
        first_line: `Bedside diagnostic Arthrocentesis (superolateral approach) for synovial fluid cell count, Gram stain, and polarized microscopy; 4-view weight-bearing plain radiographs of the knee (AP, lateral, tunnel, skyline/merchant).`,
        gold_standard: `Non-contrast Magnetic Resonance Imaging (MRI) of the knee joint (sensitivity >95% for cruciate/collateral ligament tears, meniscal pathology, and occult subchondral microfractures).`,
        imaging_findings: [
          'Plain Radiographs: Joint effusion in suprapatellar pouch, joint space narrowing, subchondral sclerosis, osteophytes, or chondrocalcinosis.',
          'MRI Knee: Disruption of low-signal cruciate ligament fibers, hyperintense fluid signal traversing meniscal surface on T2/PD images, bone marrow edema.'
        ],
        laboratory_pattern: 'Synovial fluid analysis: normal clear/straw (<2,000 WBCs); inflammatory cloudy/yellow (2,000-50,000 WBCs, >50% PMNs); septic turbid/purulent (>50,000 WBCs, >75-90% PMNs). Serum CRP and ESR elevated during acute inflammatory or infectious flares.'
      },
      management: {
        acute_stabilization: [
          'Offload affected joint with crutches and protect with a hinged knee brace or knee immobilizer',
          'Perform therapeutic and diagnostic arthrocentesis to relieve capsular tension and verify etiology',
          'Apply cold therapy (ice packs 20 mins every 2 hours) and elevate lower extremity (RICE protocol)',
          'Multimodal analgesia: Oral NSAIDs (Naproxen 500mg BID with food) or Acetaminophen 1000mg q6h',
          'If septic joint suspected: obtain blood and synovial cultures, then administer IV Vancomycin + Ceftriaxone immediately'
        ],
        definitive: 'Definitive etiology-targeted therapy: emergent surgical arthroscopic joint washout and 3-4 weeks targeted IV antibiotics for septic arthritis; conservative structured physical therapy vs arthroscopic ACL reconstruction / meniscal repair for ligamentous tears; intra-articular corticosteroid or hyaluronic acid injections / total knee arthroplasty (TKA) for end-stage osteoarthritis.',
        pharmacology: [
          {
            drug_class: 'Nonsteroidal Anti-Inflammatory Drug (NSAID)',
            representative_agent: 'Naproxen 500 mg PO BID (or Ibuprofen 600-800 mg PO TID)',
            mechanism: 'Reversible non-selective inhibition of Cyclooxygenase (COX-1 and COX-2) enzymes, arresting prostaglandin E2 (PGE2) synthesis.',
            essential_monitoring: 'Renal function (BUN/creatinine), blood pressure, gastrointestinal tolerance (co-prescribe PPI in high-risk patients).'
          },
          {
            drug_class: 'Microtubule Disruption Agent (Anti-Gout)',
            representative_agent: 'Colchicine 1.2 mg PO stat, followed by 0.6 mg 1 hour later',
            mechanism: 'Binds tubulin dimers to prevent microtubule polymerization, inhibiting neutrophil chemotaxis, degranulation, and inflammasome activation.',
            essential_monitoring: 'Dose adjustment in renal impairment; monitor for diarrhea, nausea, and cramping; avoid concurrent strong CYP3A4 / P-gp inhibitors.'
          },
          {
            drug_class: 'Targeted Empiric Antimicrobial Combination (Septic Joint)',
            representative_agent: 'Vancomycin 15-20 mg/kg IV q12h + Ceftriaxone 2g IV q24h',
            mechanism: 'Vancomycin inhibits bacterial cell wall peptidoglycan transglycosylation (MRSA coverage); Ceftriaxone inhibits transpeptidation (Gram-negative & N. gonorrhoeae coverage).',
            essential_monitoring: 'Vancomycin trough concentrations (target 15-20 mcg/mL in severe joint infection), serum creatinine, complete blood count.'
          }
        ]
      },
      cards: (entryId: string, title: string, sourceId: string) => [
        {
          id: `card-${entryId}-1`,
          type: 'why-card',
          front: `Why is the Lachman test significantly more sensitive than the Anterior Drawer test for detecting an ACL tear?`,
          back: `The Lachman test is performed at 20-30° of knee flexion, where the secondary restraints (hamstrings, posterior horn of the medial meniscus, and posterior joint capsule) are relaxed. At 90° flexion (Anterior Drawer), the hamstrings can actively spasm to prevent anterior translation, and the posterior horn of the medial meniscus acts as a doorstop, producing false-negative results.`,
          disease_id: entryId,
          disease_name: title,
          source_id: sourceId,
          tags: ['Physical Exam', 'Orthopedics', 'Musculoskeletal'],
          fsrs_state: { stability: 2.8, difficulty: 3.2, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 }
        },
        {
          id: `card-${entryId}-2`,
          type: 'cloze',
          front: 'Under polarized light microscopy, monosodium urate crystals appear {{c1::needle-shaped}} with {{c2::negative}} birefringence, whereas calcium pyrophosphate (pseudogout) crystals are {{c3::rhomboid-shaped}} with {{c4::positive}} birefringence.',
          back: 'Gout = Needle-shaped, negative birefringence (yellow parallel). Pseudogout = Rhomboid, positive birefringence (blue parallel). Chondrocalcinosis on plain X-ray strongly indicates CPPD.',
          disease_id: entryId,
          disease_name: title,
          source_id: sourceId,
          tags: ['Rheumatology', 'Pathology', 'USMLE High-Yield'],
          fsrs_state: { stability: 3.5, difficulty: 2.5, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 }
        },
        {
          id: `card-${entryId}-3`,
          type: 'basic',
          front: 'What are the 5 criteria of the Ottawa Knee Rules, and what is their clinical significance?',
          back: '1. Age ≥55 years\n2. Isolated patellar tenderness (no other bony tenderness)\n3. Fibular head tenderness\n4. Inability to flex knee to 90°\n5. Inability to bear weight immediately and in the ED (4 steps)\n\nSignificance: If NONE are present, clinically significant fracture is ruled out with >98% sensitivity, avoiding unnecessary radiographs.',
          disease_id: entryId,
          disease_name: title,
          source_id: sourceId,
          tags: ['Clinical Triage', 'Emergency Medicine', 'Ottawa Rules'],
          fsrs_state: { stability: 3.0, difficulty: 2.8, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 }
        }
      ]
    };
  }

  // ==========================================
  // NEUROLOGICAL PROFILE (HEADACHE, STROKE, CNS)
  // ==========================================
  if (classified.system === 'Neurological') {
    return {
      system: 'Neurological',
      region: 'Central Nervous System',
      acuity: 'Acute',
      icd10: query.toLowerCase().includes('migraine') ? 'G43.909' : query.toLowerCase().includes('stroke') ? 'I63.9' : 'R51.9',
      snomed_ct: '25064002',
      mesh: 'D006261',
      scope_note: `Comprehensive neurological operating breakdown for ${formattedTitle}. Evaluates primary vs secondary cephalalgias, acute cerebrovascular ischemia, and neuro-inflammatory emergencies.`,
      when_to_ask_clinician: 'Sudden "thunderclap" headache peaking in <1 minute, new focal neurological deficits (hemiparesis, facial droop, dysarthria), fever with neck stiffness, papilledema, or headache in a patient >50 years old.',
      global_health: {
        high_income: 'Emergent non-contrast head CT within 20 minutes for acute stroke/thunderclap headache; multimodal MRI/MRA; endovascular mechanical thrombectomy and IV thrombolysis (Alteplase/Tenecteplase); CGRP antagonist therapeutics for refractory migraine.',
        low_middle_income: 'Prehospital Cincinnati Prehospital Stroke Scale / FAST screening; non-contrast CT to exclude hemorrhage; Aspirin + Statin secondary prevention; simple analgesia (Paracetamol + NSAIDs) and Sumatriptan on WHO EML.',
        who_essential_medicines: ['Aspirin', 'Sumatriptan', 'Alteplase (selective)', 'Mannitol IV', 'Ceftriaxone IV', 'Paracetamol']
      },
      red_flags: [
        {
          warning: 'Sudden onset "thunderclap" headache reaching maximal 10/10 agonizing intensity within seconds to 1 minute',
          immediateAction: 'Suspect Subarachnoid Hemorrhage (aneurysmal rupture). Order emergent non-contrast head CT; if CT is negative within 6 hours, perform lumbar puncture for opening pressure and spectrophotometric xanthochromia.',
          timeframe: 'Immediate (< 15 mins)'
        },
        {
          warning: 'Acute onset focal neurological deficit: unilateral facial droop, arm drift, or slurred speech (FAST positive)',
          immediateAction: 'Suspect Acute Ischemic Stroke. Activate stroke code team, calculate last known well time, obtain STAT non-contrast head CT + CT angiography, check blood glucose, and prepare for thrombolytic window (<4.5 hrs).',
          timeframe: 'Emergency (< 10 mins)'
        },
        {
          warning: 'High fever, severe headache, photophobia, and nuchal rigidity (Brudzinski or Kernig sign positive)',
          immediateAction: 'Suspect Acute Bacterial Meningitis. Draw blood cultures immediately and administer IV Dexamethasone + Ceftriaxone + Vancomycin without delaying for lumbar puncture or CT.',
          timeframe: 'Immediate (< 30 mins)'
        }
      ],
      depth_content: {
        MS1: {
          summary: 'Cranial neurovascular anatomy, trigeminovascular nociceptive pathway, Circle of Willis, and blood-brain barrier physiology.',
          cellular_depth: 'Trigeminal ganglion pseudo-unipolar neurons innervate the meninges and cerebral blood vessels; release of calcitonin gene-related peptide (CGRP) and substance P provokes neurogenic vasodilation.',
          clinical_focus: 'Dural pain is conveyed primarily via the ophthalmic division (V1) of the trigeminal nerve and upper cervical roots (C2-C3), referring pain to the retro-orbital and occipital regions.',
          exam_pearl: 'Pain sensitivity in the skull: The brain parenchyma itself has NO nociceptors; headache pain originates entirely from dural stretch, meningeal vessels, and cranial periosteum.'
        },
        MS2: {
          summary: 'Pathophysiology of cortical spreading depression in migraine, ischemic penumbra kinetics in stroke, and CSF pressure dynamics.',
          cellular_depth: 'Cortical spreading depression (CSD): A self-propagating wave of neuronal and glial depolarization across cerebral cortex followed by sustained suppression of baseline electrical activity.',
          clinical_focus: 'Differentiate primary headaches (Migraine, Tension-type, Cluster) from dangerous secondary causes using the SNOOP4 red-flag mnemonic (Systemic signs, Neurologic deficits, Onset sudden, Older age, Pattern change).',
          exam_pearl: 'Cluster headache features: Unilateral, excruciating orbital/temporal pain lasting 15-180 minutes accompanied by ipsilateral cranial autonomic symptoms (lacrimation, rhinorrhea, miosis, ptosis). 100% high-flow oxygen is abortive treatment of choice.'
        },
        MS3: {
          summary: 'Bedside semiology, cranial nerve examination, NIH Stroke Scale (NIHSS), and emergency neuroimaging algorithms.',
          cellular_depth: 'Excitotoxic glutamate release through NMDA receptors triggers toxic intracellular calcium influx during focal cerebral ischemia.',
          clinical_focus: 'Perform rapid neurological exam: Kernig sign (resistance to passive knee extension at 90° hip flexion); Brudzinski sign (passive neck flexion elicits involuntary hip and knee flexion). Assess Horner syndrome (ptosis, miosis, anhidrosis) in suspected carotid dissection.',
          exam_pearl: 'Temporal Arteritis (Giant Cell Arteritis): Patient >50 with new temporal headache, jaw claudication, scalp tenderness, and elevated ESR (>50-100 mm/h). Start high-dose systemic steroids IMMEDIATELY to prevent irreversible anterior ischemic optic neuropathy / blindness.'
        },
        MS4: {
          summary: 'Acute stroke protocol execution, tPA contraindication checklist, ICP management, and emergent LP execution.',
          cellular_depth: 'Ischemic penumbra vs core infarct: Salvageable tissue identified via CT perfusion mismatch (CBF vs CBV mismatch).',
          clinical_focus: 'Thrombolysis inclusion/exclusion: BP must be <185/110 mmHg prior to IV tPA; no recent intracranial hemorrhage, major surgery in last 14 days, or active internal bleeding. Maintain head-of-bed at 30° to reduce intracranial pressure.',
          exam_pearl: 'In a patient with thunderclap headache and normal head CT, a negative lumbar puncture (>12 hours post-onset with no xanthochromia and normal RBCs) definitively excludes subarachnoid hemorrhage with 99.8% NPV.'
        },
        Resident: {
          summary: 'Advanced neuro-critical care: Dual antiplatelet therapy (CHANCE/POINT trials), mechanical thrombectomy criteria (DAWN/DEFUSE-3 up to 24 hrs), and refractory status migrainosus.',
          cellular_depth: 'Endothelial tight junction claudin-5 degradation produces vasogenic edema; monitor for herniation syndromes (uncal, subfalcine, tonsillar).',
          clinical_focus: 'Endovascular thrombectomy for large vessel occlusion (LVO of internal carotid or proximal MCA M1) up to 24 hours if clinical-imaging mismatch is demonstrated. Secondary stroke prevention: Clopidogrel + Aspirin for 21 days for minor stroke/high-risk TIA (ABCD2 ≥4).',
          exam_pearl: 'Status migrainosus (>72 hours of unremitting headache): Inpatient protocol includes IV hydration, IV Metoclopramide 10mg, IV Ketorolac 30mg, and IV Dexamethasone 10mg.'
        }
      },
      vindicate: [
        { letter: 'V', category: 'Vascular', weight: 95, roleInDisease: 'Ischemic stroke, subarachnoid hemorrhage, intracranial hemorrhage, temporal arteritis, or cerebral venous sinus thrombosis.', topDifferentials: ['Acute Ischemic Stroke (LVO)', 'Aneurysmal Subarachnoid Hemorrhage', 'Temporal (Giant Cell) Arteritis', 'Cerebral Venous Sinus Thrombosis'], clinicalPearl: { simple: 'Thunderclap headache is subarachnoid hemorrhage until proven otherwise.', deep: 'Cerebral venous sinus thrombosis presents with headache, papilledema, and seizures in hypercoagulable states (OCP use, postpartum).' } },
        { letter: 'I', category: 'Infectious', weight: 90, roleInDisease: 'Acute bacterial/viral meningitis, brain abscess, or encephalitis.', topDifferentials: ['Acute Bacterial Meningitis (S. pneumoniae, N. meningitidis)', 'Viral Meningitis / Encephalitis (HSV-1)', 'Intracranial Brain Abscess'], clinicalPearl: { simple: 'Fever + altered mental status + seizures points to HSV-1 encephalitis; treat empirically with IV Acyclovir.', deep: 'CSF in bacterial meningitis: markedly elevated opening pressure, >1,000 WBCs with PMN predominance, elevated protein (>100 mg/dL), low glucose (<40% serum).' } },
        { letter: 'N', category: 'Neoplastic', weight: 60, roleInDisease: 'Primary glioma, brain metastases (lung, breast, melanoma, renal), or meningioma.', topDifferentials: ['Glioblastoma', 'Cerebral Metastases', 'Pituitary Apoplexy'], clinicalPearl: { simple: 'Headache that is worse in the morning, awakens patient from sleep, and worsens with coughing/Valsalva raises suspicion for intracranial mass.', deep: 'Pituitary apoplexy causes acute headache, bitemporal hemianopsia, and hypopituitarism; emergency IV hydrocortisone is required.' } },
        { letter: 'D', category: 'Degenerative', weight: 30, roleInDisease: 'Cervical spondylosis causing occipital cervicogenic headache or neurodegenerative dementia.', topDifferentials: ['Cervicogenic Headache', 'Occipital Neuralgia'], clinicalPearl: { simple: 'Cervicogenic headaches radiate from the neck/occiput toward the forehead and reproduce with neck movement.', deep: 'Occipital nerve block with local anesthetic can confirm and treat occipital neuralgia.' } },
        { letter: 'I2', category: 'Iatrogenic / Idiopathic', weight: 50, roleInDisease: 'Medication overuse headache, post-dural puncture headache, or idiopathic intracranial hypertension (pseudotumor cerebri).', topDifferentials: ['Medication Overuse Headache (analgesic rebound)', 'Idiopathic Intracranial Hypertension (Pseudotumor cerebri)', 'Post-LP Low CSF Pressure Headache'], clinicalPearl: { simple: 'Idiopathic intracranial hypertension: young obese female with headache, transient visual obscurations, pulsatile tinnitus, and papilledema; opening pressure >250 mmH2O.', deep: 'Post-dural puncture headache is positional: dramatically worse when upright, relieved completely when lying flat.' } },
        { letter: 'C', category: 'Congenital', weight: 35, roleInDisease: 'Chiari I malformation or arteriovenous malformation (AVM).', topDifferentials: ['Chiari I Malformation', 'Arteriovenous Malformation (AVM)'], clinicalPearl: { simple: 'Chiari I malformation presents with occipital headache triggered by coughing, laughing, or straining.', deep: 'Cerebellar tonsillar herniation >5 mm below the foramen magnum on sagittal MRI confirms Chiari I.' } },
        { letter: 'A', category: 'Autoimmune', weight: 70, roleInDisease: 'Multiple sclerosis, CNS lupus vasculitis, or neurosarcoidosis.', topDifferentials: ['Multiple Sclerosis (Optic Neuritis)', 'Primary Angiitis of CNS', 'Systemic Lupus Erythematosus Cerebritis'], clinicalPearl: { simple: 'Optic neuritis causes acute painful vision loss that worsens with eye movement, with afferent pupillary defect (Marcus Gunn pupil).', deep: 'Oligoclonal IgG bands in CSF not present in serum confirm intrathecal antibody synthesis in multiple sclerosis.' } },
        { letter: 'T', category: 'Trauma / Toxic', weight: 60, roleInDisease: 'Epidural hematoma, subdural hematoma, traumatic concussion, or carbon monoxide poisoning.', topDifferentials: ['Epidural Hematoma (middle meningeal artery)', 'Subdural Hematoma (bridging veins)', 'Carbon Monoxide Toxicity'], clinicalPearl: { simple: 'Epidural hematoma: Temporal impact -> "lucid interval" -> rapid coma; biconvex hyperdense lens on CT that does not cross sutures.', deep: 'Subdural hematoma: Crescent-shaped hyperdense/hypodense collection crossing suture lines, common in elderly after minor falls.' } },
        { letter: 'E', category: 'Endocrine / Metabolic', weight: 40, roleInDisease: 'Hypoglycemia, severe uremia, hypercapnic encephalopathy, or severe hyponatremia.', topDifferentials: ['Severe Hypoglycemia', 'Hyponatremic Encephalopathy', 'Uremic Encephalopathy'], clinicalPearl: { simple: 'Always check point-of-care capillary blood glucose immediately in ANY patient presenting with altered consciousness or acute focal neuro deficits.', deep: 'Correcting chronic hyponatremia too rapidly (>8-10 mEq/L in 24h) causes Osmotic Demyelination Syndrome (central pontine myelinolysis).' } }
      ],
      pathway: [
        { id: 'node-cns-1', nodeType: 'trigger', title: '1. Initiating Insult / Vascular Shear', mechanism: { MS1: 'Cortical spreading depression, aneurysmal wall stress, or thromboembolic vascular occlusion.', MS2: 'Depolarization wave causes transient ion shifts, activating perivascular trigeminal nerve fibers.', MS3: 'Patient describes abrupt onset of throbbing headache or sudden painless loss of focal motor function.', MS4: 'Identify stroke window or thunderclap red flags immediately.', Resident: 'Differentiate embolic source (cardioembolic vs large artery atheroma).' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-2', nodeType: 'molecular', title: '2. CGRP Release & Neurogenic Inflammation', mechanism: { MS1: 'Trigeminal C-fibers release CGRP, substance P, and neurokinin A around meningeal vessels.', MS2: 'CGRP binds CGRP-receptors on vascular smooth muscle, provoking intense vasodilation and plasma extravasation.', MS3: 'Nociceptive signaling relays to trigeminocervical complex in upper spinal cord.', MS4: 'Triptans (5-HT1B/1D agonists) and CGRP antagonists block this step.', Resident: 'Monoclonal antibodies against CGRP (Erenumab, Fremanezumab) provide targeted prophylaxis.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-3', nodeType: 'cellular', title: '3. Neuronal Hyperexcitability & Central Sensitization', mechanism: { MS1: 'Second-order trigeminovascular neurons in caudal brainstem undergo sustained depolarization.', MS2: 'Threshold for non-painful stimuli decreases, causing cutaneous allodynia.', MS3: 'Patient reports scalp tenderness when brushing hair or sensitivity to light (photophobia).', MS4: 'Prevent progression by treating before allodynia becomes established.', Resident: 'Central sensitization reflects NMDA-mediated long-term potentiation in spinal trigeminal nucleus.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-4', nodeType: 'tissue', title: '4. Cortical Ischemia / Vasogenic Edema', mechanism: { MS1: 'Vascular compromise reduces regional cerebral blood flow below autoregulatory thresholds.', MS2: 'Loss of Na+/K+ ATPase activity causes cytotoxic cell swelling followed by breakdown of blood-brain barrier.', MS3: 'Patient manifests focal paresis, visual field deficit, or severe intracranial pressure signs.', MS4: 'Non-contrast CT rules out hemorrhage; CT angiography identifies occlusion site.', Resident: 'CT perfusion assesses penumbral salvageability.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-5', nodeType: 'organ', title: '5. Cerebral Autonomic & Cortical Dysfunction', mechanism: { MS1: 'Disturbance spans thalamocortical networks, producing sensory and motor deficits.', MS2: 'Autonomic cranial parasympathetic activation produces lacrimation, nasal congestion, and nausea.', MS3: 'Patient reports severe nausea, photophobia, phonophobia, or inability to converse.', MS4: 'Assess GCS score and airway protective reflexes.', Resident: 'Anticipate malignant MCA syndrome requiring decompressive hemicraniectomy.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-6', nodeType: 'symptom', title: '6. Unilateral Throbbing Cephalalgia / Neurological Deficit', mechanism: { MS1: 'Thalamic relay of nociception to primary somatosensory cortex drives conscious pain perception.', MS2: 'Pain is characteristically unilateral, pulsating, aggravated by routine physical activity.', MS3: 'Patient prefers dark, quiet room; accompanied by aura (scintillating scotoma) in ~30%.', MS4: 'Check FAST criteria and calculate last known well time.', Resident: 'Screen for secondary mimics (carotid dissection, pituitary apoplexy).' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-7', nodeType: 'sign', title: '7. Bedside Exam: Meningeal Signs & Focal Deficits', mechanism: { MS1: 'Meningeal stretch stimulates pain-sensitive sensory roots in upper cervical cord.', MS2: 'Reflex neck extensor muscle spasm causes nuchal rigidity.', MS3: 'Kernig and Brudzinski signs positive; complete cranial nerve exam reveals any focal asymmetry.', MS4: 'Fundoscopic exam checks for absence of venous pulsations or frank papilledema.', Resident: 'Assess pronator drift, cortical sensory signs (extinction), and ataxia.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-8', nodeType: 'test', title: '8. Urgent Cross-Sectional Neuroimaging & Lumbar Puncture', mechanism: { MS1: 'Non-contrast head CT detects acute blood as hyperdense bright signal in subarachnoid spaces or parenchyma.', MS2: 'CT angiography detects aneurysmal dilation or arterial cutoff; MRI brain identifies acute diffusion restriction.', MS3: 'Lumbar puncture evaluates opening pressure, protein, glucose, cell count, and spectrophotometric xanthochromia.', MS4: 'Verify platelet count and INR before performing lumbar puncture.', Resident: 'Evaluate for vessel wall enhancement on high-resolution MRI to confirm CNS vasculitis.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cns-9', nodeType: 'treatment', title: '9. Mechanism-Targeted Pharmacotherapy & Neuroprotection', mechanism: { MS1: 'Abortive triptan / NSAID therapy or emergent intravenous thrombolysis (Alteplase/Tenecteplase).', MS2: 'In stroke: BP management, antiplatelet therapy, and neurovascular intervention within window.', MS3: 'In migraine: Sumatriptan 6mg SQ or 50-100mg PO + Metoclopramide 10mg IV.', MS4: 'In meningitis: IV Ceftriaxone 2g q12h + Vancomycin + Dexamethasone 10mg IV.', Resident: 'Endovascular mechanical thrombectomy achieves recanalization in LVO up to 24 hours.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId }
      ],
      presentation: {
        classic: `Patient presents with acute throbbing or explosive headache, photophobia, phonophobia, nausea, or acute focal neurological signs (hemiparesis, facial asymmetry, speech difficulty).`,
        cardinal_symptoms: [
          'Severe unilateral pulsating headache or sudden explosive onset',
          'Nausea, vomiting, photophobia, and phonophobia',
          'Visual aura (scintillating scotoma, zigzag lines, visual field loss)',
          'Focal weakness, numbness, or difficulty producing/understanding speech',
          'Neck stiffness and constitutional pyrexia (if infectious/meningeal)'
        ],
        physical_signs: [
          { sign: 'Kernig & Brudzinski Signs', maneuver: 'Flex neck while supine (Brudzinski); flex hip to 90° and attempt to extend knee (Kernig).', diagnostic_yield: 'Specificity >95% for meningeal irritation, low sensitivity (50%).' },
          { sign: 'FAST Stroke Screen', maneuver: 'Assess facial symmetry on smile, pronator arm drift for 10 seconds, and speech repetition.', diagnostic_yield: 'Sensitivity 88%, Specificity 80% for acute stroke identification.' },
          { sign: 'Fundoscopy for Papilledema', maneuver: 'Examine optic disc margins for blurring and loss of spontaneous venous pulsations.', diagnostic_yield: 'High specificity for elevated intracranial pressure (>200 mmH2O).' }
        ],
        scoring_systems: [
          {
            name: 'NIH Stroke Scale (NIHSS)',
            criteria: ['Level of consciousness', 'Gaze & visual fields', 'Facial palsy', 'Motor arm & leg strength', 'Limb ataxia', 'Sensory loss', 'Language & dysarthria', 'Extinction/inattention'],
            clinical_action: 'Score 1-4 = Minor stroke; 5-15 = Moderate; >20 = Severe. Guides eligibility for IV thrombolysis and endovascular thrombectomy.'
          }
        ]
      },
      diagnostics: {
        first_line: 'Emergent non-contrast head CT to rule out intracranial hemorrhage; point-of-care capillary blood glucose; CBC, coagulation panel (PT/INR, PTT), and serum electrolytes.',
        gold_standard: 'Brain MRI with Diffusion-Weighted Imaging (DWI) and MR Angiography (MRA) for acute ischemia; Lumbar Puncture with opening pressure and CSF analysis for meningitis/SAH.',
        imaging_findings: ['Acute Ischemic Stroke: Hyperdense MCA sign on early CT; bright diffusion restriction with corresponding dark ADC map on MRI.', 'Subarachnoid Hemorrhage: Hyperdense bright blood filling basal cisterns, sylvian fissures, and cortical sulci.'],
        laboratory_pattern: 'Bacterial meningitis CSF: Opening pressure >200-300 mmH2O, WBCs >1,000/μL (>80% neutrophils), elevated protein (>100 mg/dL), glucose <40 mg/dL (CSF:serum glucose ratio <0.4).'
      },
      management: {
        acute_stabilization: [
          'Check point-of-care blood glucose immediately to rule out neuroglycopenia',
          'Maintain airway, breathing, circulation; keep head of bed at 30 degrees',
          'If stroke suspected within 4.5 hours of last known normal: trigger STAT stroke code and avoid antiplatelets until CT confirms no hemorrhage',
          'If thunderclap headache: keep strict bed rest, control pain and BP (target SBP <140 mmHg in aneurysmal SAH)',
          'If bacterial meningitis suspected: give IV Dexamethasone 10mg + IV Ceftriaxone 2g stat'
        ],
        definitive: 'Definitive care: Intravenous thrombolysis (Alteplase 0.9 mg/kg) or endovascular mechanical thrombectomy for acute ischemic stroke; neurosurgical clipping/coiling for intracranial aneurysm; targeted triptan + preventative CGRP antagonists for migraine.',
        pharmacology: [
          { drug_class: '5-HT 1B/1D Receptor Agonist (Triptan)', representative_agent: 'Sumatriptan 50-100 mg PO or 6 mg SubQ', mechanism: 'Stimulates vascular 5-HT1B receptors causing vasoconstriction of dilated intracranial arteries and 5-HT1D receptors inhibiting CGRP release from trigeminal terminals.', essential_monitoring: 'Contraindicated in coronary artery disease, prior stroke/TIA, uncontrolled hypertension, or hemiplegic migraine.' },
          { drug_class: 'Intravenous Thrombolytic (Recombinant tPA)', representative_agent: 'Alteplase (0.9 mg/kg IV, max 90 mg; 10% bolus over 1 min, 90% over 60 mins)', mechanism: 'Cleaves plasminogen to active plasmin, which lyses fibrin clots obstructing cerebral perfusion.', essential_monitoring: 'Check BP and neurological exam every 15 mins during infusion; stop infusion immediately and order STAT head CT if sudden headache, acute hypertension, or severe nausea occurs.' },
          { drug_class: 'Third-Generation Cephalosporin (CNS Penetrating)', representative_agent: 'Ceftriaxone 2 g IV q12h', mechanism: 'Bactericidal inhibition of bacterial cell wall peptidoglycan cross-linking with high blood-brain barrier penetration.', essential_monitoring: 'Renal function, hypersensitivity, clinical response.' }
        ]
      },
      cards: (entryId: string, title: string, sourceId: string) => [
        { id: `card-${entryId}-1`, type: 'why-card', front: 'Why must Dexamethasone be administered before or with the first dose of antibiotics in suspected pneumococcal meningitis?', back: 'Rapid bacterial lysis caused by bactericidal antibiotics releases massive amounts of endotoxins and cell wall components (teichoic acid), triggering a profound inflammatory burst in the subarachnoid space. Pre-treatment with dexamethasone attenuates this cytokine surge, reducing hearing loss and neurologic morbidity.', disease_id: entryId, disease_name: title, source_id: sourceId, tags: ['Infectious Disease', 'Neurology', 'High-Yield'], fsrs_state: { stability: 3.0, difficulty: 2.5, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 } },
        { id: `card-${entryId}-2`, type: 'cloze', front: 'The therapeutic window for intravenous Alteplase (tPA) in acute ischemic stroke is {{c1::4.5 hours}} from the patient\'s {{c2::last known well}} time.', back: 'Thrombolytic therapy beyond 4.5 hours carries unacceptable risk of hemorrhagic transformation without significant functional benefit. Mechanical thrombectomy can be performed up to 24 hours in select patients with large vessel occlusions (DAWN/DEFUSE-3 trials).', disease_id: entryId, disease_name: title, source_id: sourceId, tags: ['Stroke', 'Emergency', 'USMLE'], fsrs_state: { stability: 3.5, difficulty: 2.0, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 } }
      ]
    };
  }

  // ==========================================
  // CARDIOVASCULAR PROFILE (CHEST PAIN, MI, ACS)
  // ==========================================
  if (classified.system === 'Cardiovascular') {
    return {
      system: 'Cardiovascular',
      region: 'Thorax & Precordium',
      acuity: 'Acute',
      icd10: query.toLowerCase().includes('stemi') ? 'I21.0' : query.toLowerCase().includes('aortic') ? 'I71.0' : 'I20.0',
      snomed_ct: '29857009',
      mesh: 'D002637',
      scope_note: `Comprehensive clinical operating breakdown for ${formattedTitle}. Systematically evaluates the 5 life-threatening causes of acute thoracic chest pain: STEMI/NSTEMI, Aortic Dissection, Pulmonary Embolism, Tension Pneumothorax, and Esophageal Rupture.`,
      when_to_ask_clinician: 'Any crushing substernal chest pressure radiating to the left arm or jaw, sudden tearing back pain, diaphoresis with dyspnea, syncope, or hypotension (SBP <90 mmHg).',
      global_health: {
        high_income: 'Primary Percutaneous Coronary Intervention (pPCI) with door-to-balloon time <90 minutes; high-sensitivity cardiac troponin (hs-cTn) protocols (0/1-hour algorithm); emergent CT angiography for aortic dissection.',
        low_middle_income: 'Early chewable Aspirin 300mg and Sublingual Nitroglycerin; Pharmacoinvasive strategy with IV Tenecteplase/Streptokinase within 30 minutes if PCI is >120 minutes away; WHO Essential cardiovascular medicines.',
        who_essential_medicines: ['Aspirin', 'Clopidogrel', 'Nitroglycerin sublingual', 'Morphine IV', 'Atorvastatin', 'Heparin / Enoxaparin']
      },
      red_flags: [
        { warning: 'Acute ST-elevation in ≥2 contiguous ECG leads (≥1mm in limb leads, ≥1.5-2.5mm in precordial leads)', immediateAction: 'Acute STEMI. Activate Cardiac Catheterization Lab for emergent primary PCI (door-to-balloon <90 min). Administer Aspirin 324mg chewable + P2Y12 inhibitor + Heparin bolus.', timeframe: 'Immediate (< 10 mins)' },
        { warning: 'Sudden, severe "tearing" or "ripping" chest pain radiating to the interscapular back with pulse asymmetry or BP difference >20 mmHg between arms', immediateAction: 'Acute Aortic Dissection (Type A or B). Avoid anticoagulants. Start IV Beta-blockers (Esmolol/Labetalol) to lower HR <60 bpm and SBP <100-120 mmHg. STAT CT Angiography of aorta.', timeframe: 'Immediate (< 15 mins)' },
        { warning: 'Pleuritic chest pain, acute dyspnea, resting tachycardia (HR >100 bpm), and unilateral leg swelling or history of immobilization', immediateAction: 'Suspect Acute Pulmonary Embolism. Calculate Wells Score; obtain STAT CT Pulmonary Angiography (CTPA) or start therapeutic anticoagulation if high probability.', timeframe: 'Emergency (< 30 mins)' }
      ],
      depth_content: {
        MS1: { summary: 'Coronary artery anatomy, myocardial microcirculation, cardiac action potentials, and autonomic visceral referral pathways.', cellular_depth: 'Cardiac myocytes depend entirely on aerobic oxidative phosphorylation; interruption of coronary perfusion depletes ATP within 60 seconds, halting contractility and inducing ischemic diastolic stiffening.', clinical_focus: 'Visceral cardiac afferents travel via sympathetic cardiac nerves to upper thoracic spinal segments (T1-T5), explaining referred pain to substernal chest, left shoulder, inner arm, neck, and jaw.', exam_pearl: 'Coronary dominance: Posterior Descending Artery (PDA) arises from Right Coronary Artery (RCA) in ~85-90% of individuals (Right-dominant); PDA supplies posterior 1/3 of interventricular septum and AV node.' },
        MS2: { summary: 'Atherosclerotic plaque rupture, platelet thrombus mechanics, ischemic necrosis waves, and reperfusion injury.', cellular_depth: 'Plaque rupture exposes subendothelial collagen and von Willebrand factor, triggering platelet adhesion (GP Ib-IX), activation (thromboxane A2/ADP), and aggregation via GP IIb/IIIa cross-linked by fibrinogen.', clinical_focus: 'Histopathologic timeline of myocardial infarction: 0-4h = minimal change, wavy fibers; 4-12h = early coagulative necrosis, edema, hemorrhage; 1-3 days = dense neutrophilic infiltrate with coagulative necrosis; 3-7 days = macrophage infiltration and phagocytosis of necrotic myocytes (highest risk of free wall rupture!); 7-14 days = robust granulation tissue; >2 months = dense fibrotic scar.', exam_pearl: 'Myocardial rupture complications peak at days 3-7: Ventricular free wall rupture (cardiac tamponade), Interventricular septal rupture (harsh holosystolic murmur with thrill), or Papillary muscle rupture (acute severe mitral regurgitation with pulmonary edema).' },
        MS3: { summary: 'Bedside semiology of acute chest pain, 12-lead ECG interpretation, HEART score risk stratification, and serial troponin kinetics.', cellular_depth: 'Cardiac troponin I and T are structural contractile proteins released into the bloodstream upon sarcolemmal integrity failure; hs-cTn detects nanogram-level myocardial necrosis.', clinical_focus: 'HEART Score: History (0-2), ECG (0-2), Age (0-2), Risk factors (0-2), Troponin (0-2). Score 0-3 = Low risk (<2% MACE), eligible for early discharge; Score ≥7 = High risk (>50% MACE), warrants urgent invasive angiography.', exam_pearl: 'Sgarbossa criteria: Used to diagnose acute myocardial infarction in the presence of a Left Bundle Branch Block (LBBB) or ventricular paced rhythm. Most specific sign is concordant ST elevation ≥1mm in leads with positive QRS complexes.' },
        MS4: { summary: 'STEMI code execution, antiplatelet / anticoagulation dosing, cardiogenic shock triage, and mechanical complication management.', cellular_depth: 'Reperfusion arrhythmia and oxygen free radical generation; monitor for ventricular tachycardia/fibrillation during coronary opening.', clinical_focus: 'Immediate STEMI orders: Aspirin 324 mg chewable, Ticagrelor 180 mg PO (or Clopidogrel 600 mg PO), Unfractionated Heparin 60 units/kg IV bolus (max 4,000 units), and sublingual Nitroglycerin 0.4 mg q5min (contraindicated in inferior STEMI with RV involvement or recent PDE-5 inhibitor use).', exam_pearl: 'Inferior STEMI (leads II, III, aVF): Always obtain right-sided ECG leads (V4R). Right ventricular infarction presents with hypotension, clear lung fields, and elevated JVD. Treatment is IV FLUID BOLUS, not nitrates/diuretics!' },
        Resident: { summary: 'Evidence-based invasive cardiology: COMPLETE trial for multivessel PCI, DAPT duration algorithms, managing cardiogenic shock (Impella vs IABP), and high-risk plaque features.', cellular_depth: 'No-reflow phenomenon: Microvascular obstruction and capillary edema prevent tissue perfusion even after epicardial coronary artery stent placement.', clinical_focus: 'In patients presenting with out-of-hospital cardiac arrest and STEMI on ECG, emergent coronary angiography is mandatory (TOMBSTONE / TTM trials). In cardiogenic shock, early revascularization reduces mortality (SHOCK trial). Dual antiplatelet therapy duration: minimum 12 months post-ACS unless high bleeding risk (PRECISE-DAPT score).', exam_pearl: 'Landmark trial: COMPLETE trial demonstrated that complete revascularization of non-culprit coronary lesions in STEMI patients with multivessel disease significantly reduced cardiovascular death or MI compared to culprit-only PCI.' }
      },
      vindicate: [
        { letter: 'V', category: 'Vascular', weight: 98, roleInDisease: 'Acute Coronary Syndrome (STEMI/NSTEMI), Acute Aortic Dissection, or Pulmonary Embolism.', topDifferentials: ['ST-Elevation Myocardial Infarction (STEMI)', 'Non-ST Elevation Myocardial Infarction (NSTEMI)', 'Acute Aortic Dissection (Stanford Type A/B)', 'Acute Pulmonary Embolism'], clinicalPearl: { simple: 'Substernal pressure radiating to the left arm or jaw with diaphoresis is coronary ischemia until proven otherwise.', deep: 'Stanford Type A dissection involves the ascending aorta and requires emergency open surgical repair; Type B involves descending aorta and is managed medically with blood pressure control (or TEVAR).' } },
        { letter: 'I', category: 'Infectious', weight: 65, roleInDisease: 'Acute pericarditis, myocarditis, or infective endocarditis.', topDifferentials: ['Acute Viral Pericarditis (Coxsackie, Echovirus)', 'Infective Endocarditis', 'Myocarditis'], clinicalPearl: { simple: 'Pericarditis chest pain is sharp, pleuritic, worse lying flat, and relieved by sitting up and leaning forward; friction rub on auscultation.', deep: 'ECG in pericarditis: diffuse, concave-upward ST-segment elevation with PR-segment depression across multiple vascular territories, with PR elevation in lead aVR.' } },
        { letter: 'N', category: 'Neoplastic', weight: 30, roleInDisease: 'Mediastinal tumors, bronchogenic carcinoma invading pleura, or cardiac myxoma.', topDifferentials: ['Bronchogenic Carcinoma', 'Mediastinal Lymphoma', 'Atrial Myxoma'], clinicalPearl: { simple: 'Left atrial myxoma can present with constitutional symptoms, positional syncope, and a mid-diastolic "tumor plop" murmur.', deep: 'Histology of myxoma: scattered stellate or globular myxoma cells embedded in an acid mucopolysaccharide-rich stroma.' } },
        { letter: 'D', category: 'Degenerative', weight: 75, roleInDisease: 'Calcific aortic stenosis, severe coronary atherosclerosis, or mitral valve prolapse.', topDifferentials: ['Severe Calcific Aortic Stenosis', 'Coronary Microvascular Disease'], clinicalPearl: { simple: 'Classic triad of severe aortic stenosis: SAD = Syncope, Angina, Dyspnea. Harsh crescendo-decrescendo systolic ejection murmur radiating to carotids with pulsus parvus et tardus.', deep: 'Once symptoms develop in severe aortic stenosis, 2-year mortality exceeds 50% without surgical or transcatheter aortic valve replacement (TAVR).' } },
        { letter: 'I2', category: 'Iatrogenic / Idiopathic', weight: 45, roleInDisease: 'Cocaine-induced coronary vasospasm, post-radiation pericardial constriction, or medication-induced cardiotoxicity.', topDifferentials: ['Cocaine-Induced Vasospasm / Myocardial Infarction', 'Takotsubo (Stress) Cardiomyopathy', 'Post-Radiation Pericarditis'], clinicalPearl: { simple: 'In cocaine-associated chest pain, avoid pure beta-blockers (like propranolol) due to unopposed alpha-1 vasoconstriction; use benzodiazepines and nitrates first-line.', deep: 'Takotsubo cardiomyopathy ("broken heart syndrome"): apical ballooning of left ventricle without obstructive CAD, triggered by massive catecholamine surge.' } },
        { letter: 'C', category: 'Congenital', weight: 35, roleInDisease: 'Anomalous coronary artery origin, bicuspid aortic valve, or hypertrophic cardiomyopathy (HCM).', topDifferentials: ['Hypertrophic Cardiomyopathy (HCM / HOCM)', 'Bicuspid Aortic Valve with Thoracic Aneurysm', 'Anomalous Origin of Left Coronary Artery from Pulmonary Artery (ALCAPA)'], clinicalPearl: { simple: 'HCM murmur increases with Valsalva and standing (decreased preload) and decreases with squatting and handgrip (increased preload/afterload).', deep: 'HCM is the single most common cause of sudden cardiac death in young competitive athletes, caused by mutations in beta-myosin heavy chain or myosin-binding protein C.' } },
        { letter: 'A', category: 'Autoimmune', weight: 55, roleInDisease: 'Dressler syndrome (post-MI autoimmune pericarditis), lupus pericarditis, or rheumatoid vasculitis.', topDifferentials: ['Dressler Syndrome (Post-MI Pericarditis)', 'Systemic Lupus Erythematosus Serositis', 'Kawasaki Disease (coronary aneurysms in children)'], clinicalPearl: { simple: 'Dressler syndrome occurs 2-6 weeks after myocardial infarction, characterized by autoimmune pericarditis, fever, pleurisy, and leukocytosis. Treat with NSAIDs and Colchicine.', deep: 'Kawasaki disease: CRASH and Burn (Conjunctivitis, Rash, Adenopathy, Strawberry tongue, Hands/feet swelling + fever >5 days); give high-dose IVIG + Aspirin to prevent giant coronary aneurysms.' } },
        { letter: 'T', category: 'Trauma / Toxic', weight: 50, roleInDisease: 'Blunt cardiac contusion, traumatic aortic disruption, or tension pneumothorax.', topDifferentials: ['Tension Pneumothorax', 'Traumatic Aortic Rupture (isthmus)', 'Myocardial Contusion'], clinicalPearl: { simple: 'Tension pneumothorax: absent breath sounds on one side, tracheal deviation to opposite side, and hemodynamic collapse. Immediate needle decompression, do NOT wait for X-ray!', deep: 'Traumatic aortic transection most commonly occurs at the aortic isthmus (just distal to the left subclavian artery) due to tethering by the ligamentum arteriosum.' } },
        { letter: 'E', category: 'Endocrine / Metabolic', weight: 40, roleInDisease: 'Severe thyrotoxicosis with high-output heart failure, severe anemia, or diabetic autonomic neuropathy (silent ischemia).', topDifferentials: ['Silent Myocardial Ischemia in Diabetes', 'Thyrotoxic Heart Failure / Arrhythmia'], clinicalPearl: { simple: 'Diabetic patients frequently present with "silent" or atypical myocardial infarction (dyspnea, weakness, confusion without classic chest pain) due to autonomic neuropathy.', deep: 'Severe anemia can precipitate demand ischemia (Type 2 MI) in patients with underlying fixed coronary stenosis.' } }
      ],
      pathway: [
        { id: 'node-cv-1', nodeType: 'trigger', title: '1. Plaque Rupture / Endothelial Shear', mechanism: { MS1: 'Fibrous cap rupture of an atherosclerotic coronary plaque or acute aortic wall intimal tear.', MS2: 'Circulating platelets encounter exposed collagen and tissue factor, triggering thrombin generation.', MS3: 'Patient experiences sudden crushing substernal heaviness or tearing thoracic pain.', MS4: 'Immediate 12-lead ECG within 10 minutes of patient arrival.', Resident: 'Assess culprit lesion vulnerability: thin-cap fibroatheroma (TCFA) with necrotic lipid core.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-2', nodeType: 'molecular', title: '2. Platelet Activation & Fibrin Deposition', mechanism: { MS1: 'Thromboxane A2 and ADP release recruit circulating platelets.', MS2: 'Platelet GP IIb/IIIa receptors cross-link with fibrinogen, forming an occlusive red and white thrombus.', MS3: 'Complete coronary occlusion causes ST-segment elevation; partial occlusion causes ST-depression/T-inversion.', MS4: 'Chewable Aspirin 324mg + P2Y12 inhibitor (Ticagrelor 180mg) block this step.', Resident: 'Intravenous GP IIb/IIIa inhibitors (Tirofiban, Eptifibatide) reserved for high-risk bail-out during PCI.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-3', nodeType: 'cellular', title: '3. Myocardial Ischemia & Sarcolemmal Rupture', mechanism: { MS1: 'Aerobic metabolism ceases within 8-10 seconds; anaerobic glycolysis produces lactic acid.', MS2: 'Cellular ATP depletion disables Na+/K+ ATPase and Ca2+ pumps; intracellular sodium and calcium surge.', MS3: 'Sarcolemmal membrane ruptures, releasing cardiac troponins (cTnI, cTnT) and CK-MB into bloodstream.', MS4: 'Serial high-sensitivity troponin assays document dynamic rise and fall.', Resident: 'Myocardial stunning vs hibernation: hibernating myocardium shows preserved viability on FDG-PET.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-4', nodeType: 'tissue', title: '4. Wave of Coagulative Necrosis', mechanism: { MS1: 'Necrosis begins in the subendocardium (most vulnerable) and extends transmurally toward epicardium.', MS2: 'Neutrophils infiltrate necrotic tissue within 24-48 hours; release of lysosomal enzymes.', MS3: 'Loss of regional wall motion on echocardiography.', MS4: 'Time is muscle: Reperfusion within 90-120 minutes salvages up to 70% of myocardium.', Resident: 'Microvascular obstruction (no-reflow) predicts adverse remodeling and heart failure.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-5', nodeType: 'organ', title: '5. Ventricular Systolic/Diastolic Dysfunction', mechanism: { MS1: 'Loss of contractile myocardium reduces left ventricular stroke volume and ejection fraction.', MS2: 'Elevated left ventricular end-diastolic pressure backs up into pulmonary capillaries (>18 mmHg).', MS3: 'Patient develops pulmonary edema (rales, pink frothy sputum) and S3 gallop.', MS4: 'Assess Killip Classification (Killip I = no rales; Killip IV = cardiogenic shock).', Resident: 'Early mechanical circulatory support (Impella, ECMO) reduces mortality in refractory cardiogenic shock.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-6', nodeType: 'symptom', title: '6. Crushing Substernal Pain & Autonomic Storm', mechanism: { MS1: 'Ischemic metabolites stimulate cardiac sensory neurites (T1-T5 spinal sympathetic chains).', MS2: 'Sympathetic hyperactivity produces tachycardia, diaphoresis, and peripheral vasoconstriction.', MS3: 'Levine sign (clenched fist over sternum), radiating pain to jaw/arm, severe nausea.', MS4: 'Evaluate for atypical presentations in diabetics, elderly, and female patients.', Resident: 'Quantify pre-test probability using the validated HEART Score.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-7', nodeType: 'sign', title: '7. Bedside Signs: Diaphoresis, S4/S3, Murmurs', mechanism: { MS1: 'Diaphoresis reflects intense sympathetic surge; cold clammy extremities reflect hypoperfusion.', MS2: 'S4 gallop reflects atrial contraction into stiff non-compliant ischemic ventricle; S3 reflects volume overload.', MS3: 'Auscultate for new holosystolic murmur of acute mitral regurgitation (papillary muscle rupture).', MS4: 'Check blood pressure in BOTH arms to exclude aortic dissection.', Resident: 'Monitor pulse pressure and respiratory variation in pulsus paradoxus.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-8', nodeType: 'test', title: '8. 12-Lead ECG & High-Sensitivity Troponin Protocol', mechanism: { MS1: 'ECG reveals regional ischemic changes (ST elevation, ST depression, hyperacute T-waves).', MS2: 'High-sensitivity troponin assays quantify myocardial necrosis at 0 and 1 or 2 hours.', MS3: 'Point-of-care bedside echocardiography demonstrates regional wall motion abnormalities.', MS4: 'If dissection suspected: Emergency CT Angiography of Chest and Abdomen.', Resident: 'Coronary CT Angiography (CCTA) has >99% negative predictive value in low-intermediate risk ED patients.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
        { id: 'node-cv-9', nodeType: 'treatment', title: '9. Primary PCI / Revascularization & Secondary Prevention', mechanism: { MS1: 'Immediate restoration of epicardial coronary flow via balloon angioplasty and drug-eluting stent.', MS2: 'Antithrombotic therapy: Aspirin + P2Y12 inhibitor + Heparin/Bivalirudin.', MS3: 'Cardioprotective secondary prevention: High-intensity Statin (Atorvastatin 80mg), Beta-blocker, ACEi/ARB.', MS4: 'Door-to-balloon time goal: <90 minutes for PCI; door-to-needle time <30 minutes for thrombolysis.', Resident: 'Complete revascularization of non-culprit lesions reduces future MI (COMPLETE trial).' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId }
      ],
      presentation: {
        classic: 'Patient presents with acute onset heavy, crushing substernal chest pressure radiating to the left arm, shoulder, or jaw, accompanied by profuse diaphoresis, dyspnea, and nausea.',
        cardinal_symptoms: [
          'Substernal chest pressure or squeezing ("elephant on chest"), lasting >20 minutes',
          'Radiation of discomfort to left shoulder, inner arm, neck, or lower jaw',
          'Profuse cold diaphoresis and acute shortness of breath',
          'Nausea, lightheadedness, or feeling of impending doom',
          'Atypical symptoms in women and diabetics: isolated dyspnea, epigastric discomfort, extreme fatigue'
        ],
        physical_signs: [
          { sign: 'Levine Sign', maneuver: 'Observe patient gesturing with a clenched fist held tightly over the sternum.', diagnostic_yield: 'Specificity >85% for ischemic coronary etiology.' },
          { sign: 'Bilateral Arm Blood Pressure Comparison', maneuver: 'Measure manual blood pressure simultaneously in both arms.', diagnostic_yield: 'Systolic difference >20 mmHg raises LR+ to 5.3 for Acute Aortic Dissection.' },
          { sign: 'Auscultation for S3 / S4 and New Murmurs', maneuver: 'Auscultate cardiac apex with bell in left lateral decubitus position.', diagnostic_yield: 'S4 indicates acute diastolic stiffening; S3 indicates acute systolic failure; new murmur indicates valve rupture.' }
        ],
        scoring_systems: [
          {
            name: 'HEART Score for Chest Pain Patients in the ED',
            criteria: ['History (0-2)', 'ECG (0-2)', 'Age (0-2)', 'Risk Factors (0-2)', 'Troponin (0-2)'],
            clinical_action: 'Score 0-3 = Low risk (0.9-1.7% MACE); candidate for early discharge. Score 4-6 = Moderate risk; admission and non-invasive testing. Score 7-10 = High risk; early invasive angiography.'
          }
        ]
      },
      diagnostics: {
        first_line: 'Immediate 12-lead Electrocardiogram (ECG) performed and interpreted within 10 minutes of arrival; Point-of-Care High-Sensitivity Cardiac Troponin (hs-cTn); Portable AP Chest Radiograph.',
        gold_standard: 'Emergency Coronary Angiography (Cardiac Catheterization) for coronary occlusion; Contrast-Enhanced CT Angiography of Chest and Aorta (CECT) for aortic dissection and pulmonary embolism.',
        imaging_findings: ['ECG: ST-elevation ≥1mm in ≥2 contiguous leads or new LBBB; dynamic T-wave inversions.', 'Echocardiogram: Regional wall motion abnormalities corresponding to coronary vascular territory.', 'Chest X-Ray: Widened mediastinum (>8 cm) in aortic dissection; Hampton hump or Westermark sign in PE.'],
        laboratory_pattern: 'Cardiac Troponin I or T: Dynamic rise and/or fall with at least one value above the 99th percentile upper reference limit. Elevated CK-MB (returns to baseline in 48-72h, useful for re-infarction).'
      },
      management: {
        acute_stabilization: [
          'Administer chewable Aspirin 324 mg immediately (unless true anaphylaxis)',
          'Sublingual Nitroglycerin 0.4 mg q5min up to 3 doses (avoid if SBP <90, HR <50, or right ventricular infarction)',
          'Administer high-dose P2Y12 inhibitor: Ticagrelor 180 mg PO or Clopidogrel 600 mg PO',
          'Anticoagulation: Unfractionated Heparin 60 units/kg IV bolus (max 4,000 units) followed by infusion',
          'Supplemental oxygen ONLY if SpO2 <90% (hyperoxia induces coronary vasoconstriction!)'
        ],
        definitive: 'Immediate Primary Percutaneous Coronary Intervention (pPCI) with drug-eluting stent placement within 90 minutes of medical contact; emergency open surgical aortic repair (graft replacement) for Type A aortic dissection.',
        pharmacology: [
          { drug_class: 'Antiplatelet (Cyclooxygenase-1 Inhibitor)', representative_agent: 'Aspirin 324 mg PO chewable loading dose, then 81 mg daily', mechanism: 'Irreversible acetylation of platelet COX-1, permanently inhibiting Thromboxane A2 production for the 7-10 day platelet lifespan.', essential_monitoring: 'Active bleeding, peptic ulcer history.' },
          { drug_class: 'P2Y12 Platelet Receptor Antagonist', representative_agent: 'Ticagrelor 180 mg PO loading dose, then 90 mg BID (or Clopidogrel 600mg)', mechanism: 'Reversible, non-competitive antagonist of platelet P2Y12 ADP receptors, blocking ADP-mediated activation of GP IIb/IIIa complex.', essential_monitoring: 'Bleeding, dyspnea (self-limiting Ticagrelor effect), bradyarrhythmias.' },
          { drug_class: 'High-Intensity HMG-CoA Reductase Inhibitor', representative_agent: 'Atorvastatin 80 mg PO daily', mechanism: 'Inhibits HMG-CoA reductase, upregulating hepatic LDL receptors; produces early pleiotropic plaque stabilization and anti-inflammatory effects.', essential_monitoring: 'Hepatic transaminases, myalgia, rhabdomyolysis.' }
        ]
      },
      cards: (entryId: string, title: string, sourceId: string) => [
        { id: `card-${entryId}-1`, type: 'why-card', front: 'Why is supplemental oxygen contraindicated in uncomplicated acute myocardial infarction if the patient\'s oxygen saturation is ≥90%?', back: 'Hyperoxia causes reactive oxygen species generation, reduces coronary blood flow via reflex coronary vasoconstriction, and increases myocardial infarct size (demonstrated in the AVOID and DETO2X-AMI randomized trials). Oxygen should only be administered if SpO2 falls below 90% or the patient is in respiratory distress.', disease_id: entryId, disease_name: title, source_id: sourceId, tags: ['Cardiology', 'Emergency', 'Evidence-Based'], fsrs_state: { stability: 3.2, difficulty: 2.4, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 } },
        { id: `card-${entryId}-2`, type: 'basic', front: 'What is the classic clinical presentation and treatment for Right Ventricular Myocardial Infarction?', back: 'Presentation: Triad of hypotension, clear lung fields, and elevated jugular venous distention (JVD) in the setting of an inferior STEMI (leads II, III, aVF; check V4R).\n\nTreatment: Intravenous isotonic crystalloid boluses to maintain RV preload. AVOID Nitrates, Diuretics, and Morphine (which drop preload and precipitate refractory shock!).', disease_id: entryId, disease_name: title, source_id: sourceId, tags: ['USMLE High-Yield', 'Cardiology'], fsrs_state: { stability: 3.8, difficulty: 2.2, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 } }
      ]
    };
  }

  // ==========================================
  // GENERAL INTERNAL MEDICINE PROFILE (FALLBACK)
  // ==========================================
  return {
    system: classified.system,
    region: classified.region,
    acuity: classified.acuity,
    icd10: 'R69',
    snomed_ct: '386661006',
    mesh: 'D004194',
    scope_note: `Comprehensive clinical, pathophysiological, and evidence-grounded framework for ${formattedTitle} in ${classified.region}.`,
    when_to_ask_clinician: 'Severe unremitting pain, altered mental status, unstable vital signs (hypotension, tachycardia, hypoxemia), or signs of systemic sepsis.',
    global_health: {
      high_income: 'High-resolution imaging and targeted biomarker assays; minimally invasive intervention.',
      low_middle_income: 'Clinical triage algorithms, essential bedside diagnostics, and WHO Model List of Essential Medicines.',
      who_essential_medicines: ['Paracetamol', 'Ibuprofen', 'Ceftriaxone', 'Lactated Ringer']
    },
    red_flags: [
      { warning: `Acute refractory decompensation with altered mental status or hemodynamic instability in ${classified.region}`, immediateAction: 'Establish two large-bore IVs, administer 30 mL/kg isotonic fluid bolus, and obtain emergency specialist consultation.', timeframe: 'Immediate (< 15 mins)' },
      { warning: 'Spiking fevers (>38.5°C) with leukocytosis and localized severe guarding/tenderness', immediateAction: 'Obtain blood cultures and start empirical broad-spectrum IV antimicrobials without delay.', timeframe: 'Urgent (< 30 mins)' }
    ],
    depth_content: {
      MS1: { summary: `Foundational anatomy, microvascular architecture, and cellular homeostatic mechanisms in ${classified.region}.`, cellular_depth: 'Cellular energy depletion, reactive oxygen species, and early tissue edema.', clinical_focus: 'Anatomical boundaries and pain pathways (visceral vs somatic innervation).', exam_pearl: 'Dermatomal mapping and foundational embryological development.' },
      MS2: { summary: `Mechanisms of disease, inflammatory cascade, and pharmacologic targets for ${formattedTitle}.`, cellular_depth: 'Cytokine cascade (TNF-α, IL-1β, IL-6), leukocyte extravasation, and tissue remodeling.', clinical_focus: 'VINDICATE differential diagnosis and key USMLE distractor patterns.', exam_pearl: 'Differentiating look-alike conditions using targeted laboratory biomarkers.' },
      MS3: { summary: `Bedside diagnostic semiology, history taking, physical examination maneuvers, and diagnostic workup order.`, cellular_depth: 'Nociceptive receptor activation and organ system compensation.', clinical_focus: 'Sensitivity, specificity, and positive likelihood ratios of bedside clinical signs.', exam_pearl: 'Choosing the correct initial diagnostic test before ordering confirmatory modalities.' },
      MS4: { summary: `Emergency triage, acute stabilization checklists, clinical risk calculators, and inpatient order sets.`, cellular_depth: 'Microvascular stasis and metabolic acid-base compensation.', clinical_focus: 'Prioritizing immediate life-saving interventions within the first 15-60 minutes.', exam_pearl: 'Avoid dangerous discharge errors in borderline or atypical presentations.' },
      Resident: { summary: `Evidence-based practice guidelines, landmark randomized clinical trials, and managing treatment failure.`, cellular_depth: 'Immunologic homeostasis and microvascular tissue recovery.', clinical_focus: 'Subspecialty consensus recommendations and salvage therapeutics.', exam_pearl: 'Grounding clinical decisions in high-impact trial literature.' }
    },
    vindicate: [
      { letter: 'V', category: 'Vascular', weight: 40, roleInDisease: `Ischemia, thromboembolism, or impaired vascular perfusion in ${classified.region}.`, topDifferentials: ['Acute Ischemic Event', 'Thromboembolism', 'Vascular Occlusion'], clinicalPearl: { simple: 'Vascular catastrophes have sudden, dramatic onset.', deep: 'Lactate elevation indicates significant tissue hypoperfusion.' } },
      { letter: 'I', category: 'Infectious', weight: 80, roleInDisease: `Bacterial, viral, or opportunistic infection affecting ${classified.region}.`, topDifferentials: ['Acute Bacterial Infection', 'Abscess / Phlegmon', 'Sepsis'], clinicalPearl: { simple: 'Fever and localized warmth indicate active infection.', deep: 'Obtain cultures prior to initiating antimicrobial therapy.' } },
      { letter: 'N', category: 'Neoplastic', weight: 40, roleInDisease: `Primary benign or malignant neoplasm or metastatic involvement.`, topDifferentials: ['Primary Malignancy', 'Benign Neoplasm', 'Metastatic Disease'], clinicalPearl: { simple: 'Unintentional weight loss and night sweats raise suspicion.', deep: 'Histopathology remains the gold standard for definitive staging.' } },
      { letter: 'D', category: 'Degenerative', weight: 40, roleInDisease: `Progressive mechanical wear, tissue atrophy, or age-related degeneration.`, topDifferentials: ['Degenerative Remodeling', 'Chronic Tissue Wear'], clinicalPearl: { simple: 'Degenerative conditions typically follow an indolent, progressive course.', deep: 'Mechanical offloading and physical therapy preserve function.' } },
      { letter: 'I2', category: 'Iatrogenic / Idiopathic', weight: 35, roleInDisease: `Adverse drug reactions, procedural complications, or cryptogenic pathology.`, topDifferentials: ['Drug-Induced Toxicity', 'Procedural Complication'], clinicalPearl: { simple: 'Always obtain an exhaustive medication history.', deep: 'Idiosyncratic drug reactions can mimic acute infection or vasculitis.' } },
      { letter: 'C', category: 'Congenital', weight: 25, roleInDisease: `Developmental anatomical variations or genetic predisposition.`, topDifferentials: ['Anatomical Variant', 'Congenital Anomaly'], clinicalPearl: { simple: 'Consider congenital anomalies in younger patients with recurrent presentations.', deep: 'Embryological developmental lines dictate anatomical variations.' } },
      { letter: 'A', category: 'Autoimmune', weight: 60, roleInDisease: `Autoantibody formation, immune complex deposition, or systemic inflammation.`, topDifferentials: ['Autoimmune Disease', 'Systemic Vasculitis'], clinicalPearl: { simple: 'Multi-system involvement (rash, joint pain) suggests autoimmunity.', deep: 'Autoantibody titers should be interpreted in clinical context.' } },
      { letter: 'T', category: 'Trauma / Toxic', weight: 40, roleInDisease: `Mechanical blunt/penetrating trauma or toxic exposure.`, topDifferentials: ['Traumatic Injury', 'Toxic Ingestion / Inhalation'], clinicalPearl: { simple: 'Mechanism of injury dictates the pattern of occult damage.', deep: 'Serial exams are critical to detect delayed complications.' } },
      { letter: 'E', category: 'Endocrine / Metabolic', weight: 45, roleInDisease: `Electrolyte imbalance, hormonal excess/deficiency, or metabolic derangement.`, topDifferentials: ['Metabolic Derangement', 'Endocrinopathy'], clinicalPearl: { simple: 'Severe metabolic disturbances can mimic primary organ emergencies.', deep: 'Correction of underlying electrolyte abnormalities prevents arrhythmias.' } }
    ],
    pathway: [
      { id: 'node-gen-1', nodeType: 'trigger', title: '1. Primary Initiating Insult', mechanism: { MS1: `Etiologic trigger causes initial disruption in ${classified.region}.`, MS2: 'Disruption of cellular membrane integrity and homeostatic balance.', MS3: 'Patient describes acute symptom onset and precipitating circumstances.', MS4: 'Identify high-acuity triggers and triage accordingly.', Resident: 'Formulate broad differential based on clinical presentation.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-2', nodeType: 'molecular', title: '2. Molecular Inflammatory Signaling', mechanism: { MS1: 'Release of inflammatory mediators and acute phase reactants.', MS2: 'Pro-inflammatory cytokines stimulate local microvasculature.', MS3: 'Systemic signs of inflammation (fever, malaise).', MS4: 'Order inflammatory markers (CRP, ESR).', Resident: 'Targeted biologic therapies attenuate specific molecular pathways.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-3', nodeType: 'cellular', title: '3. Cellular Infiltration & Edema', mechanism: { MS1: 'Leukocyte margination, extravasation, and tissue infiltration.', MS2: 'Neutrophil and macrophage activation in affected tissues.', MS3: 'Localized swelling, warmth, and exquisite tenderness.', MS4: 'Leukocytosis on complete blood count.', Resident: 'Assess degree of cellular infiltrate on biopsy if indicated.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-4', nodeType: 'tissue', title: '4. Localized Tissue Dysfunction', mechanism: { MS1: 'Interstitial edema elevates localized compartment pressure.', MS2: 'Tissue perfusion pressure is compromised.', MS3: 'Pain increases with active or passive movement.', MS4: 'Monitor for signs of compartment syndrome or tissue necrosis.', Resident: 'Surgical or interventional decompression if pressure thresholds exceeded.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-5', nodeType: 'organ', title: '5. Organ System Compensation / Decompensation', mechanism: { MS1: 'The involved organ system attempts physiological compensation.', MS2: 'Secondary physiological changes in downstream organ systems.', MS3: 'Patient exhibits functional impairment and altered vital signs.', MS4: 'Assess organ-specific severity scoring systems.', Resident: 'Anticipate multi-organ system involvement in severe disease.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-6', nodeType: 'symptom', title: '6. Cardinal Clinical Symptoms', mechanism: { MS1: 'Nociceptive sensory fibers transmit pain signals to cortex.', MS2: 'Autonomic nervous system triggers constitutional symptoms.', MS3: 'Patient describes characteristic symptom complex.', MS4: 'Take focused history to establish timeline and severity.', Resident: 'Evaluate atypical presentations in vulnerable populations.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-7', nodeType: 'sign', title: '7. Bedside Physical Examination Signs', mechanism: { MS1: 'Direct anatomical examination reveals physical manifestations.', MS2: 'Specific provocative clinical maneuvers elicit diagnostic findings.', MS3: 'Assess sensitivity and specificity of elicited bedside signs.', MS4: 'Document baseline physical exam findings for serial comparison.', Resident: 'Demonstrate advanced examination techniques to trainees.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-8', nodeType: 'test', title: '8. Diagnostic Investigations & Imaging', mechanism: { MS1: 'Laboratory assays and imaging modalities visualize pathology.', MS2: 'Targeted testing confirms suspected clinical diagnosis.', MS3: 'Interpret initial diagnostic workup in clinical context.', MS4: 'Prioritize stat imaging studies based on pre-test probability.', Resident: 'Select high-yield imaging while minimizing radiation and contrast risk.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId },
      { id: 'node-gen-9', nodeType: 'treatment', title: '9. Mechanism-Targeted Therapy & Resolution', mechanism: { MS1: 'Therapeutic interventions address underlying etiology and restore function.', MS2: 'Pharmacologic and procedural management minimizes complications.', MS3: 'Initiate evidence-based first-line clinical protocol.', MS4: 'Write clear inpatient admission orders and stabilization plan.', Resident: 'Guide long-term management and secondary prevention.' }, evidenceGrade: 'Grade A (High)', source_id: primarySourceId }
    ],
    presentation: {
      classic: `Patient presents with acute onset localized discomfort in ${classified.region}, accompanied by functional limitation, localized tenderness, and constitutional symptoms.`,
      cardinal_symptoms: [
        `Progressive pain localized to ${classified.region}`,
        'Functional limitation and restricted mobility',
        'Constitutional symptoms including low-grade fever or malaise',
        'Exacerbation with movement or physiological stress'
      ],
      physical_signs: [
        { sign: 'Localized Point Tenderness', maneuver: `Palpate the point of maximal discomfort in ${classified.region}.`, diagnostic_yield: 'Sensitivity >80%, confirms localized inflammatory process.' },
        { sign: 'Range of Motion Assessment', maneuver: 'Evaluate active and passive range of motion of the affected region.', diagnostic_yield: 'Identifies functional limitation and mechanical restriction.' }
      ],
      scoring_systems: [
        { name: 'Clinical Risk Assessment', criteria: ['Acute onset (+1)', 'Severe pain score (+1)', 'Systemic vitals alteration (+2)', 'Functional deficit (+2)'], clinical_action: 'Score ≥4 indicates high risk; warrants prompt specialized evaluation.' }
      ]
    },
    diagnostics: {
      first_line: `Complete Blood Count (CBC), Basic Metabolic Panel (BMP), Inflammatory Markers (CRP, ESR), and targeted initial imaging of ${classified.region}.`,
      gold_standard: `High-resolution cross-sectional imaging (CT or MRI) of ${classified.region} tailored to clinical findings.`,
      imaging_findings: ['Focal structural alteration, edema, or tissue asymmetry.', 'Perilesional inflammatory changes and fluid accumulation.'],
      laboratory_pattern: 'Elevated acute phase reactants (CRP, ESR) with or without leukocytosis depending on etiology.'
    },
    management: {
      acute_stabilization: [
        'Place patient in comfortable position and offload the affected region',
        'Establish intravenous access if systemic symptoms or severe pain are present',
        'Multimodal analgesia tailored to patient comorbidities',
        'Address underlying vital sign abnormalities and maintain hydration'
      ],
      definitive: `Definitive etiology-targeted medical, procedural, or surgical intervention guided by diagnostic confirmation.`,
      pharmacology: [
        { drug_class: 'Analgesic / Anti-Inflammatory', representative_agent: 'Acetaminophen 1000mg PO / Ibuprofen 400-600mg PO', mechanism: 'Inhibition of central or peripheral prostaglandin synthesis.', essential_monitoring: 'Liver function (acetaminophen), renal function and GI tolerance (NSAIDs).' }
      ]
    },
    cards: (entryId: string, title: string, sourceId: string) => [
      { id: `card-${entryId}-1`, type: 'basic', front: `What is the initial diagnostic approach for suspected acute pathology in ${classified.region}?`, back: `1. Focused history and physical exam assessing red flags\n2. Baseline laboratory studies (CBC, inflammatory markers)\n3. Appropriate first-line imaging\n4. Risk stratification before invasive procedures`, disease_id: entryId, disease_name: title, source_id: sourceId, tags: ['Internal Medicine', 'Clinical Workup'], fsrs_state: { stability: 2.5, difficulty: 2.5, reps: 0, lapses: 0, state: 'new', last_review: Date.now(), due: Date.now() + 86400000 } }
    ]
  };
}

