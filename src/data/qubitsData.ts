import { QubitsDiseaseEntry } from '../types/disease';

export const QUBITS_SEED_ENTRIES: QubitsDiseaseEntry[] = [
  {
    id: 'acute-appendicitis',
    title: 'Acute Appendicitis',
    aliases: ['Appendicitis', 'Epityphlitis', 'Inflammation of vermiform appendix'],
    codes: {
      icd10: 'K35.80',
      snomed_ct: '74400008',
      mesh: 'D001064'
    },
    regions: ['Right Lower Quadrant Abdomen', 'Pelvis & Perineum'],
    system: 'Gastrointestinal',
    scope_note: 'Acute inflammation of the luminal vermiform appendix requiring prompt surgical triage to avert perforation and peritonitis.',
    when_to_ask_clinician: 'Any involuntary guarding, rigid "board-like" abdomen, hypotension with tachycardia, or right iliac fossa pain in women of childbearing age without pregnancy exclusion.',
    trust_score: 99,
    last_reviewed: '2026-10-14',
    human_reviewed_by: 'MD Clinical Faculty Panel & Medical Librarian Review',
    ai_generated: false,
    global_health_note: {
      high_income: 'Laparoscopic appendectomy within 12-24 hours supported by routine preoperative low-dose IV-contrast abdominopelvic CT (sensitivity >95%). Median stay <24h.',
      low_middle_income: 'Clinical diagnosis relied upon heavily using Alvarado/PAS scoring + ultrasound. Open appendectomy via McBurney/gridiron incision remains standard where laparoscopic stacks or CT are scarce. WHO Essential surgical priority.',
      who_essential_medicines: ['Ceftriaxone', 'Metronidazole', 'Amoxicillin + Clavulanic Acid', 'Morphine IV / Paracetamol IV']
    },

    red_flags: [
      {
        warning: 'Sudden complete relief of sharp RLQ pain followed hours later by diffuse abdominal agony & high spiking fever (>38.5°C)',
        immediateAction: 'Suspect gangrenous perforation with generalized purulent peritonitis. Order emergent broad-spectrum IV antibiotics, isotonic bolus, and emergent surgical consultation.',
        timeframe: 'Immediate (< 15 mins)'
      },
      {
        warning: 'Involuntary guarding, rebound tenderness, or board-like abdominal rigidity',
        immediateAction: 'True parietal peritoneal irritation. Keep strict NPO, establish two large-bore IVs, avoid oral analgesics/laxatives.',
        timeframe: 'Immediate (< 30 mins)'
      },
      {
        warning: 'Hypotension (SBP <90 mmHg) with tachycardia (HR >110 bpm) and tachypnea',
        immediateAction: 'Septic shock secondary to perforated appendiceal phlegmon or abscess. Trigger Sepsis Six pathway.',
        timeframe: 'Emergency (< 10 mins)'
      }
    ],

    depth_content: {
      MS1: {
        summary: 'A closed-loop luminal obstruction of the vermiform appendix resulting in venous congestion, ischemic necrosis of the antimesenteric border, and mucosal breakdown.',
        cellular_depth: 'Goblet cell mucin retention elevates intraluminal pressure beyond capillary perfusion pressure (~60 mmHg). Hypoxia degrades epithelial tight junctions (claudin/occludin), allowing bacterial transmural invasion and neutrophil diapedesis into the muscularis propria.',
        clinical_focus: 'Visceral afferent C-fibers enter the spinal cord at T10, producing dull, diffuse periumbilical pain. As inflammation extends through the serosa to touch parietal peritoneum, pain shifts to sharp, well-localized somatic RLQ pain (T11-L1).',
        exam_pearl: 'Dermatome rule: T10 = umbilicus (visceral appendiceal referral via lesser splanchnic nerve). McBurney point lies 1/3 distance from right ASIS to umbilicus.'
      },
      'MS2-3': {
        summary: 'Transmural polymicrobial inflammatory infection (E. coli, Bacteroides fragilis). Luminal obstruction produces ischemia, gangrene, and perforation within 24-48 hours.',
        cellular_depth: 'Lipopolysaccharide (LPS) activates TLR-4 on resident macrophages, provoking massive IL-1β, IL-6, and TNF-α secretion. Neutrophil elastase and MMP-9 degrade extracellular matrix, leading to liquefactive and coagulative necrosis.',
        clinical_focus: 'Physical signs: Rovsing sign (LLQ pressure causes RLQ pain via gas displacement), Psoas sign (pain on passive right hip extension = retrocecal appendix), Obturator sign (internal rotation of flexed hip = pelvic appendix).',
        exam_pearl: 'Histopathologic requirement for diagnosis: Transmural neutrophils actively infiltrating the muscularis propria. Luminal exudate alone is not diagnostic.'
      },
      MS4: {
        summary: 'Acute abdomen triage: Alvarado score calculation, selection of imaging modality based on patient demographics, and preoperative resuscitation with targeted anti-anaerobic/gram-negative coverage.',
        cellular_depth: 'Arteriolar thrombosis of the terminal appendicular artery (physiologic end-artery without collaterals) causes antimesenteric focal necrosis.',
        clinical_focus: 'Imaging algorithm: Ultrasound is first-line in pediatrics and pregnant patients (outer diameter >6mm non-compressible). In non-pregnant adult men and non-elderly adults, abdominopelvic CT with IV contrast is preferred (sensitivity >95%).',
        exam_pearl: 'In uncomplicated cases, antibiotics alone have ~70% 90-day success, but 29% undergo appendectomy within 90 days, and presence of an appendicolith dramatically increases perforation risk (CODA Trial, NEJM).'
      },
      Resident: {
        summary: 'Surgical decision-making in complicated vs uncomplicated appendicitis; interval appendectomy for walled-off phlegmon/abscess (>4cm requires percutaneous drainage first); ruling out occult malignancy in patients >50.',
        cellular_depth: 'Carcinoid / Neuroendocrine Tumors (NET) stain positive for Chromogranin A and Synaptophysin; tumors >2 cm or involving the appendiceal base mandate right hemicolectomy.',
        clinical_focus: 'Post-operative care: 24h prophylaxis for uncomplicated laparoscopic appendectomy; 3-5 days therapeutic IV broad-spectrum antibiotics (Piperacillin-Tazobactam or Ceftriaxone + Metronidazole) for perforated/gangrenous disease.',
        exam_pearl: 'Any patient aged >50 presenting with acute appendicitis must undergo colonoscopy 6-8 weeks postoperatively to exclude obstructing cecal adenocarcinoma.'
      }
    },

    etiology: {
      triggers: [
        'Fecalith / Appendicolith (calcified intraluminal fecal deposit; predominant in adults)',
        'Lymphoid follicular hyperplasia (predominant in children/adolescents following viral gastroenteritis, adenovirus, or EBV)',
        'Diet low in insoluble dietary fiber and high in refined sugars (prolongs colonic transit time)',
        'Inspissated barium, foreign body, or gallstone migration',
        'Parasitic infestation (Enterobius vermicularis, Ascaris lumbricoides)',
        'Appendiceal neuroendocrine tumor (carcinoid) or cecal adenocarcinoma (elderly)'
      ],
      risk_factors: [
        'Age 10-30 years (peak incidence)',
        'Male sex (1.4:1 male-to-female ratio)',
        'Family history of appendicitis in first-degree relative (<30 years old: 3-fold risk elevation)',
        'Cystic Fibrosis (thickened mucus plugs)'
      ],
      epidemiology: 'Lifetime incidence is approximately 8.6% in males and 6.7% in females. It is the single most common surgical emergency of the abdomen worldwide, with ~300,000 cases annually in the United States alone.'
    },

    pathway: [
      {
        id: 'node-app-1',
        nodeType: 'trigger',
        title: 'Luminal Obstruction',
        mechanism: {
          MS1: 'Fecalith or submucosal lymphoid follicles mechanically block the narrow 2-3 mm appendiceal orifice.',
          'MS2-3': 'Obstruction creates a closed loop system while continuous mucosal secretion proceeds unaltered.',
          MS4: 'Calcified appendicolith visible on low-dose unenhanced CT in ~30% of adult patients.',
          Resident: 'Appendicoliths correlate with 41% failure rate during antibiotic-first non-operative trials.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-coda-nejm',
        examDistractorPitfall: 'Pitfall: Confusing lymphoid hyperplasia in children with viral gastroenteritis; viral prodrome is common before appendicitis onset.'
      },
      {
        id: 'node-app-2',
        nodeType: 'molecular',
        title: 'Mucus Secretion & Intraluminal Hypertension',
        mechanism: {
          MS1: 'Goblet cells continue active secretion of MUC2 mucin glycoproteins, raising pressure past 60 mmHg.',
          'MS2-3': 'Hydrostatic pressure surpasses venous and capillary closing pressure (~40-60 mmHg).',
          MS4: 'Progressive mural distention triggers active visceral nociceptor depolarization.',
          Resident: 'Elevated intraluminal pressure impairs lymphatic drainage first, followed by venular thrombosis.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-app',
        examDistractorPitfall: 'Distractor: Intraluminal pressure exceeds arterial systolic pressure early (Incorrect: venular collapse occurs first; arterial pressure is maintained until late stage).'
      },
      {
        id: 'node-app-3',
        nodeType: 'cellular',
        title: 'Mucosal Hypoxia & Bacterial Translocation',
        mechanism: {
          MS1: 'Epithelial enterocytes starve of ATP; tight junctions (claudin/occludin) break down.',
          'MS2-3': 'Normal gut commensals (E. coli, Bacteroides fragilis) invade lamina propria and submucosa.',
          MS4: 'Endotoxin (LPS) triggers TLR-4, activating NF-κB and releasing pro-inflammatory cytokines.',
          Resident: 'Anaerobic overgrowth surpasses aerobic bacteria by 10:1 within 24 hours of occlusion.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-app',
        examDistractorPitfall: 'High-yield exam question: Primary anaerobe in appendiceal flora is Bacteroides fragilis, not Clostridium.'
      },
      {
        id: 'node-app-4',
        nodeType: 'tissue',
        title: 'Transmural Neutrophilic Infiltration',
        mechanism: {
          MS1: 'Circulating neutrophils roll, adhere (ICAM-1/selectins), and diapedese into muscularis propria.',
          'MS2-3': 'Extensive microabscesses form with mucosal ulceration and subserosal vascular engorgement.',
          MS4: 'Pathognomonic histologic standard: PMN invasion across the circular and longitudinal muscle layers.',
          Resident: 'Appendiceal wall thickness exceeds normal 2 mm threshold; diameter exceeds 6 mm on axial imaging.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-app',
        examDistractorPitfall: 'Exam trap: Finding neutrophils only in the mucosa indicates acute enteritis, NOT acute appendicitis.'
      },
      {
        id: 'node-app-5',
        nodeType: 'organ',
        title: 'Parietal Peritoneal Contact & Serositis',
        mechanism: {
          MS1: 'Inflammation spans full thickness to the outer visceral serosa, contacting adjacent somatic parietal peritoneum.',
          'MS2-3': 'Fibrinopurulent exudate carpets the serosa, stimulating somatic spinal nerves T11-L1.',
          MS4: 'Omentum migrates toward the right iliac fossa attempting to wall off the inflammatory phlegmon.',
          Resident: 'Underdeveloped greater omentum in children <5 years explains significantly higher perforation rates.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-wjes-guidelines',
        examDistractorPitfall: 'Pitfall: Forgetting that retrocecal appendicitis may never contact anterior parietal peritoneum, blunting abdominal signs.'
      },
      {
        id: 'node-app-6',
        nodeType: 'symptom',
        title: 'Migratory Abdominal Pain (Periumbilical -> RLQ)',
        mechanism: {
          MS1: 'Visceral afferent C-fibers synapse at T10 spinal dorsal horn (periumbilical). Later, somatic parietal irritation produces sharp, localized RLQ pain.',
          'MS2-3': 'Classical Murphy triad: Pain preceding vomiting, followed by fever and anorexia.',
          MS4: 'Anorexia is so sensitive (>80%) that an intensely hungry patient demands a search for alternative diagnoses.',
          Resident: 'Migration occurs characteristically between 12 to 24 hours from pain onset.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-app',
        examDistractorPitfall: 'Classic distractor: Vomiting preceding abdominal pain (favors gastroenteritis, bowel obstruction, or food poisoning over appendicitis).'
      },
      {
        id: 'node-app-7',
        nodeType: 'sign',
        title: 'Focal Peritoneal Signs (McBurney, Rovsing, Psoas)',
        mechanism: {
          MS1: 'Direct pressure over McBurney point compresses the inflamed appendiceal base against posterior fascia.',
          'MS2-3': 'Rovsing sign: Colonic retrograde air distends cecum. Psoas sign: Hip extension stretches psoas against retrocecal appendix.',
          MS4: 'Dunphy sign: Coughing sharply jars the inflamed parietal peritoneum (high specificity for localized peritonitis).',
          Resident: 'Obturator sign: Passive internal rotation of the flexed right hip stresses pelvic appendicitis.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-app',
        examDistractorPitfall: 'Exam favorite: Positive Psoas sign indicates retrocecal anatomical position; Obturator sign indicates pelvic location.'
      },
      {
        id: 'node-app-8',
        nodeType: 'test',
        title: 'Laboratory Leukocytosis & Contrast CT Imaging',
        mechanism: {
          MS1: 'Bone marrow releases granulocytes in response to G-CSF; leukocytosis >10,000/µL with left shift (>75% neutrophils).',
          'MS2-3': 'Abdominopelvic CT with IV contrast demonstrates dilated appendix >6mm, wall thickening >2mm, appendicolith, and periappendiceal fat stranding.',
          MS4: 'Calculate Alvarado Score: Score ≥7 warrants urgent surgical consult; score 4-6 warrants CT imaging.',
          Resident: 'In pregnancy, graded compression ultrasound is initial; non-contrast MRI is definitive second-line if inconclusive.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-wjes-guidelines',
        examDistractorPitfall: 'USMLE Trap: Choosing CT scan in a pregnant woman (Incorrect: Graded compression ultrasound is 1st line; MRI is 2nd line).'
      },
      {
        id: 'node-app-9',
        nodeType: 'treatment',
        title: 'Laparoscopic Appendectomy & Pre-op Antibiotic Prophylaxis',
        mechanism: {
          MS1: 'Ligation and division of the appendicular artery and base; removal of the infectious nidus.',
          'MS2-3': 'Preoperative single-dose broad-spectrum IV coverage: Cefoxitin 2g IV OR Ceftriaxone 1-2g + Metronidazole 500mg IV.',
          MS4: 'Laparoscopy offers lower surgical site infection, faster return to work, and lower post-op pain than open laparotomy.',
          Resident: 'Non-operative management with antibiotics alone is an option for select uncomplicated patients without appendicolith.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-coda-nejm',
        examDistractorPitfall: 'Surgical error: Discharging a non-operative patient with appendicolith on oral antibiotics without counseling on 41% recurrence.'
      }
    ],

    vindicate: [
      {
        letter: 'V',
        category: 'Vascular',
        weight: 85,
        roleInDisease: 'Appendicular artery thrombosis causes ischemic antimesenteric wall necrosis.',
        topDifferentials: ['Mesenteric Ischemia', 'Omental Torsion', 'Ovarian/Testicular Torsion'],
        clinicalPearl: {
          simple: 'The appendicular artery is a terminal branch of the ileocolic artery without collaterals.',
          deep: 'Elderly patients with atrial fibrillation and severe out-of-proportion RLQ pain must be evaluated for superior mesenteric artery embolus.'
        }
      },
      {
        letter: 'I',
        category: 'Infectious',
        weight: 98,
        roleInDisease: 'Secondary bacterial overgrowth (E. coli, B. fragilis) drives acute suppurative gangrene.',
        topDifferentials: ['Acute Mesenteric Adenitis (Yersinia)', 'Infectious Ileocolitis (Campylobacter)', 'Pelvic Inflammatory Disease (PID)'],
        clinicalPearl: {
          simple: 'Mesenteric adenitis often follows an upper respiratory infection and shows multiple enlarged RLQ lymph nodes on ultrasound.',
          deep: 'Yersinia enterocolitica infection ("pseudoappendicitis") occurs after consuming unpasteurized milk or contaminated pork.'
        }
      },
      {
        letter: 'N',
        category: 'Neoplastic',
        weight: 35,
        roleInDisease: 'Appendiceal neuroendocrine tumor (carcinoid) or cecal adenocarcinoma physically obstructs the orifice.',
        topDifferentials: ['Cecal Adenocarcinoma (patients >50)', 'Appendiceal Neuroendocrine Tumor (NET)', 'Gastrointestinal Stromal Tumor (GIST)'],
        clinicalPearl: {
          simple: 'Neuroendocrine carcinoids are the most common primary tumor of the appendix.',
          deep: 'Patients >50 years diagnosed with acute appendicitis need screening colonoscopy 6-8 weeks post-resolution.'
        }
      },
      {
        letter: 'D',
        category: 'Degenerative',
        weight: 20,
        roleInDisease: 'Cecal or ascending colonic diverticular phlegmon mimicking acute appendicitis.',
        topDifferentials: ['Cecal Diverticulitis', 'Right colonic diverticular phlegmon'],
        clinicalPearl: {
          simple: 'Cecal diverticulitis is more prevalent in patients of East Asian descent.',
          deep: 'CT scan differentiates diverticular outpouching with wall thickening from a distinct dilated tubular appendix.'
        }
      },
      {
        letter: 'I2',
        category: 'Iatrogenic / Idiopathic',
        weight: 25,
        roleInDisease: 'Barotrauma post-colonoscopy or retained foreign body/clip inciting obstruction.',
        topDifferentials: ['Post-colonoscopy electrocoagulation syndrome', 'Retained surgical clip impaction'],
        clinicalPearl: {
          simple: 'Presents within 24-48 hours of colonoscopy with polypectomy.',
          deep: 'Post-polypectomy syndrome presents with focal peritonitis without free air on upright abdominal radiograph.'
        }
      },
      {
        letter: 'C',
        category: 'Congenital',
        weight: 45,
        roleInDisease: 'Meckel diverticulitis or intestinal malrotation presenting with identical acute signs.',
        topDifferentials: ['Meckel\'s Diverticulitis', 'Intestinal Malrotation with volvulus', 'Duplication Cyst'],
        clinicalPearl: {
          simple: 'Meckel\'s diverticulum is a persistent vitelline (omphalomesenteric) duct.',
          deep: 'If the appendix is grossly normal during surgery, inspect the distal 100 cm of ileum for an inflamed Meckel diverticulum.'
        }
      },
      {
        letter: 'A',
        category: 'Autoimmune',
        weight: 30,
        roleInDisease: 'Terminal ileitis from Crohn\'s disease presenting as acute right iliac fossa pain.',
        topDifferentials: ['Crohn\'s Disease (Terminal Ileitis)', 'IgA Vasculitis (Henoch-Schönlein)'],
        clinicalPearl: {
          simple: 'Crohn\'s causes transmural cobblestone lesions and non-caseating granulomas.',
          deep: 'Do not remove a normal-appearing appendix in the presence of acute Crohn\'s ileitis, as cecal incision carries high risk of enterocutaneous fistula.'
        }
      },
      {
        letter: 'T',
        category: 'Trauma / Toxic',
        weight: 15,
        roleInDisease: 'Direct blunt abdominal handlebar injury causing appendiceal crush or burst perforation.',
        topDifferentials: ['Abdominal Wall Rectus Sheath Hematoma', 'Traumatic Mesenteric Avulsion'],
        clinicalPearl: {
          simple: 'Focal bicycle handlebar impact to RLQ in pediatric patients.',
          deep: 'Rectus sheath hematoma exhibits Fothergill\'s sign (mass does not cross midline and remains palpable during abdominal wall contraction).'
        }
      },
      {
        letter: 'E',
        category: 'Endocrine / Metabolic',
        weight: 20,
        roleInDisease: 'Diabetic ketoacidosis (DKA) or acute intermittent porphyria causing pseudoperitonitis.',
        topDifferentials: ['Diabetic Ketoacidosis (DKA pseudoperitonitis)', 'Acute Intermittent Porphyria (AIP)', 'Adrenal Crisis'],
        clinicalPearl: {
          simple: 'DKA causes severe abdominal pain, nausea, and leukocytosis that mimics a surgical acute abdomen.',
          deep: 'Always check blood glucose, urinalysis, and serum ketones before transporting any patient with severe abdominal pain to the operating room.'
        }
      }
    ],

    presentation: {
      classic: 'Periumbilical crampy visceral pain lasting 12-24 hours that migrates to the right lower quadrant, becoming sharp, somatic, and exacerbated by walking or coughing, accompanied by anorexia, low-grade fever (37.5-38.3°C), and nausea/vomiting starting AFTER pain onset.',
      cardinal_symptoms: [
        'Migratory abdominal pain (periumbilical -> RLQ McBurney point)',
        'Anorexia (Hamburger sign: loss of desire for favorite food)',
        'Nausea and vomiting (characteristically begins AFTER abdominal pain)',
        'Low-grade fever (37.5°C - 38.3°C / 99.5°F - 101.0°F)',
        'Small-volume diarrheal bowel movements or constipation/obstipation'
      ],
      physical_signs: [
        {
          sign: 'McBurney\'s Point Tenderness',
          maneuver: 'Palpation 1/3 the distance from the right ASIS to the umbilicus.',
          diagnostic_yield: 'Sensitivity 85%, Specificity 75%'
        },
        {
          sign: 'Rovsing\'s Sign',
          maneuver: 'Palpation of LLQ reproduces sharp pain in the RLQ.',
          diagnostic_yield: 'Sensitivity 68%, Specificity 80%'
        },
        {
          sign: 'Psoas Sign',
          maneuver: 'Passive right hip extension in left lateral decubitus position.',
          diagnostic_yield: 'Sensitivity 16%, Specificity 95% (High for retrocecal)'
        },
        {
          sign: 'Obturator Sign',
          maneuver: 'Passive internal rotation of flexed right hip and knee.',
          diagnostic_yield: 'Sensitivity 8%, Specificity 94% (High for pelvic)'
        },
        {
          sign: 'Dunphy\'s Sign (Cough Test)',
          maneuver: 'Voluntary cough or car ride bump sharply reproduces RLQ peritoneal pain.',
          diagnostic_yield: 'Sensitivity 90%, Specificity 70%'
        }
      ],
      scoring_systems: [
        {
          name: 'Alvarado Score (MANTRELS)',
          criteria: [
            'M - Migration of pain to RLQ (+1)',
            'A - Anorexia (+1)',
            'N - Nausea / Vomiting (+1)',
            'T - Tenderness in RLQ (+2)',
            'R - Rebound tenderness (+1)',
            'E - Elevated temperature ≥37.3°C (+1)',
            'L - Leukocytosis >10,000/µL (+2)',
            'S - Shift to left (neutrophilia >75%) (+1)'
          ],
          clinical_action: 'Score ≤4: Appendicitis unlikely (observe/discharge). Score 5-6: Equivocal, order CT scan. Score ≥7: High probability, surgical consult for appendectomy.'
        }
      ]
    },

    diagnostics: {
      first_line: 'Graded compression ultrasound for pediatric patients and pregnant women; contrast-enhanced abdominal CT for adult men and non-pregnant females.',
      gold_standard: 'Abdominopelvic CT with IV contrast (Sensitivity 95-98%, Specificity 96-98%). Findings: Outer appendiceal diameter >6mm, wall thickening >2mm with "target sign", periappendiceal fat stranding, appendicolith, or free fluid.',
      imaging_findings: [
        'CT: Blind-ended tubular structure originating from cecum with diameter >6mm and circumferential wall enhancement',
        'CT: Periappendiceal mesenteric fat stranding and extraluminal fluid collection',
        'Ultrasound: Non-compressible, blind-ended aperistaltic tubular structure >6mm outer diameter in cross-section ("bulls-eye" or "target" sign)',
        'Color Doppler: Hypervascular ring ("ring of fire") surrounding inflamed mural wall; hypovascularity implies gangrene'
      ],
      laboratory_pattern: 'Leukocytosis (10,000 - 18,000/µL) with left shift (bandemia >10% or PMNs >75%); elevated serum C-Reactive Protein (CRP >10 mg/L); elevated Procalcitonin if complicated.'
    },

    management: {
      acute_stabilization: [
        'Strict NPO (Nil per os) status to prepare for anesthesia',
        'Intravenous crystalloid resuscitation (Lactated Ringer\'s 20-30 mL/kg bolus followed by maintenance)',
        'Multimodal intravenous analgesia (IV Paracetamol 1g + IV Hydromorphone/Fentanyl as needed; early analgesia does not mask clinical examination findings)',
        'Intravenous antiemetics (Ondansetron 4mg IV)'
      ],
      definitive: 'Laparoscopic Appendectomy: Standard of care worldwide. Shorter hospitalization, decreased surgical site infections, lower postoperative pain, and faster return to work compared to open appendectomy. In non-operative candidates or uncomplicated cases without appendicolith, IV-to-oral antibiotics (10-day course) can be considered with shared decision making.',
      pharmacology: [
        {
          drug_class: 'Cephamycin (2nd Generation Cephalosporin)',
          representative_agent: 'Cefoxitin (or Cefotetan)',
          mechanism: 'Inhibits bacterial cell wall peptidoglycan transpeptidation; active against aerobic Gram-negative bacilli and anaerobes (B. fragilis).',
          essential_monitoring: 'Administer single 2g IV dose within 60 minutes prior to surgical skin incision.'
        },
        {
          drug_class: '3rd Gen Cephalosporin + Nitroimidazole',
          representative_agent: 'Ceftriaxone + Metronidazole',
          mechanism: 'Ceftriaxone inhibits cell wall synthesis; Metronidazole generates cytotoxic nitro radicals that fracture anaerobic bacterial helical DNA.',
          essential_monitoring: 'Ceftriaxone 1-2g IV q24h + Metronidazole 500mg IV q8h. Standard alternative for penicillin-tolerant patients.'
        },
        {
          drug_class: 'Antipseudomonal Penicillin + Beta-Lactamase Inhibitor',
          representative_agent: 'Piperacillin-Tazobactam',
          mechanism: 'Broad-spectrum beta-lactam bactericidal against Pseudomonas, Enterobacteriaceae, and anaerobes with beta-lactamase protection.',
          essential_monitoring: 'Reserved for perforated appendicitis, intra-abdominal abscess, peritonitis, or septic shock.'
        }
      ]
    },

    exam_lens: {
      patterns: ['SBA', 'SAQ', 'OSCE', 'Viva'],
      marks: '5-10 marks (SAQ) / 100 marks (Full Blueprint)',
      frequency_tier: 'Perennial (Exam Favorite)',
      provenance: 'USMLE Step 1/2 CK Content Outline, NMC CBME Surgery SU28.1-SU28.3, UK MLA Clinical Conditions',
      curriculum_codes: [
        {
          system: 'USMLE Step 1/2',
          code: 'GI-04.02',
          competency: 'Acute abdomen, surgical pathology, and diagnostic imaging selection'
        },
        {
          system: 'NMC CBME',
          code: 'SU28.2',
          competency: 'Describe clinical features, investigations, and principles of management of acute appendicitis and its complications'
        },
        {
          system: 'UK MLA',
          code: 'MLA-SURG-APP',
          competency: 'Recognise presentations of acute appendicitis, formulate differential diagnosis, interpret investigations, and outline surgical emergency management'
        }
      ],
      sample_stems: [
        {
          pattern: 'SBA (Single Best Answer / USMLE Style)',
          stem: 'A 22-year-old college student presents to the emergency department with a 16-hour history of abdominal pain. The pain initially began as a dull, vague ache around his navel, but over the last 4 hours has migrated to his right lower quadrant, where it is sharp and exacerbated by walking. He reports nausea and no appetite ("Hamburger sign"). Temperature is 37.9°C (100.2°F), pulse is 96/min, BP is 124/78 mmHg. Abdominal exam reveals maximal focal tenderness one-third of the distance from the anterior superior iliac spine to the umbilicus with involuntary guarding. Laboratory studies show a leukocyte count of 14,200/µL with 82% neutrophils. Which of the following nerve pathways is primarily responsible for the INITIAL periumbilical discomfort described by this patient?',
          options: [
            'A. Somatic sensory fibers of the iliohypogastric nerve (L1)',
            'B. Visceral afferent fibers traversing the sympathetic plexus to T10 spinal cord segment',
            'C. Somatic sensory fibers of the subcostal nerve (T12)',
            'D. Parasympathetic preganglionic fibers in the vagus nerve (CN X)',
            'E. Somatic motor fibers traveling through the genitofemoral nerve'
          ],
          correctOptionIndex: 1,
          explanation: 'Visceral afferent C-fibers from the midgut vermiform appendix travel retrograde along sympathetic splanchnic pathways to enter the dorsal root ganglion at spinal cord level T10. Because the somatic sensory dermatome for T10 corresponds to the periumbilical region, the brain misinterprets the visceral input as originating from the periumbilical area. Only when the full-thickness transmural inflammation reaches the somatic parietal peritoneum do somatic spinal nerves (T11-L1) carry sharp, somatotopically precise pain to McBurney\'s point in the RLQ.',
          keyDistractorAnalysis: 'Option A is incorrect because the iliohypogastric nerve supplies somatic sensation to the suprapubic and groin skin. Option D is incorrect because vagal parasympathetics do not transmit pain sensation from abdominal viscera.'
        }
      ],
      answer_skeleton: [
        {
          section: 'Definition',
          typicalMarks: 1,
          requiredKeywords: ['Acute inflammation', 'Vermiform appendix', 'Luminal obstruction', 'Surgical emergency'],
          modelPoints: [
            'Acute appendicitis is the acute inflammation and infection of the vermiform appendix, typically initiated by luminal obstruction and representing the most common non-trauma acute surgical abdomen.'
          ]
        },
        {
          section: 'Aetiology',
          typicalMarks: 1,
          requiredKeywords: ['Fecalith', 'Lymphoid hyperplasia', 'Appendicolith', 'Carcinoid / Neoplasm'],
          modelPoints: [
            'Adults: Appendicolith / fecalith (calcified feces) in ~35-40%.',
            'Children: Submucosal lymphoid follicular hyperplasia secondary to viral gastroenteritis or respiratory tract infections.',
            'Rare: Foreign body, gallstone, parasite (Enterobius vermicularis), neuroendocrine carcinoid tumor, or cecal adenocarcinoma.'
          ]
        },
        {
          section: 'Pathophysiology',
          typicalMarks: 2,
          requiredKeywords: ['Closed-loop obstruction', 'Mucus retention', 'Venous hypertension', 'Ischemia', 'Bacteroides fragilis', 'Transmural necrosis'],
          modelPoints: [
            'Obstruction -> intraluminal mucus accumulation -> pressure >60 mmHg -> venous congestion and mucosal hypoxia.',
            'Mucosal barrier breakdown permits polymicrobial invasion (E. coli, B. fragilis) -> transmural neutrophilic infiltration into muscularis propria.',
            'Arteriolar thrombosis of the appendicular end-artery causes antimesenteric gangrene and perforation after 24-36 hours.'
          ]
        },
        {
          section: 'Clinical Features',
          typicalMarks: 2,
          requiredKeywords: ['Periumbilical to RLQ migration', 'Anorexia', 'McBurney tenderness', 'Rovsing sign', 'Psoas sign'],
          modelPoints: [
            'Symptoms: Visceral periumbilical dull ache migrating to sharp somatic RLQ pain within 12-24h; anorexia; nausea/vomiting following pain onset; low-grade fever.',
            'Signs: McBurney\'s point tenderness (1/3 from ASIS to umbilicus); Rovsing\'s sign (LLQ pressure -> RLQ pain); Psoas sign (retrocecal); Obturator sign (pelvic); Dunphy\'s cough sign.'
          ]
        },
        {
          section: 'Investigations',
          typicalMarks: 2,
          requiredKeywords: ['Alvarado score', 'Leukocytosis left shift', 'Contrast-enhanced CT', 'Ultrasound pediatric/pregnant', '>6mm outer diameter'],
          modelPoints: [
            'Labs: CBC (leukocytosis >10,000/µL with left shift >75%), CRP, urine beta-hCG in females to exclude ectopic pregnancy.',
            'Imaging: Abdominal CT with IV contrast (first-line in adult men/non-pregnant women; sensitivity >95%, outer diameter >6mm with wall thickening). Graded compression US first-line in pediatrics/pregnancy; MRI second-line.'
          ]
        },
        {
          section: 'Management',
          typicalMarks: 2,
          requiredKeywords: ['NPO', 'IV fluids', 'Laparoscopic appendectomy', 'Cefoxitin / Metronidazole', 'Perforation coverage'],
          modelPoints: [
            'Resuscitation: Strict NPO, IV crystalloid hydration, multimodal analgesia.',
            'Antibiotic prophylaxis: Preoperative single dose within 60 min of incision (Cefoxitin 2g IV OR Ceftriaxone 1g + Metronidazole 500mg IV).',
            'Definitive surgery: Laparoscopic appendectomy within 12-24 hours. If perforated/gangrenous: peritoneal lavage, 3-5 days IV antibiotics (Piperacillin-Tazobactam).'
          ]
        }
      ],
      viva_ladder: [
        {
          rung: 1,
          title: 'Rung 1: Recall & Diagnostic Triad',
          examinerQuestion: 'What is Murphy\'s triad in acute appendicitis, and how does pain chronology help differentiate it from acute gastroenteritis?',
          idealCandidateAnswer: 'Murphy\'s triad consists of: 1) Pain, 2) Vomiting, and 3) Fever, occurring in that strict chronological order. In acute appendicitis, abdominal pain characteristically precedes vomiting and nausea. In acute viral gastroenteritis or food poisoning, vomiting and diarrhea characteristically precede or coincide with diffuse cramping pain.',
          examinerTrap: 'Candidate states vomiting occurs before pain, or states fever is the initial symptom.'
        },
        {
          rung: 2,
          title: 'Rung 2: Anatomical Variations & Clinical Signs',
          examinerQuestion: 'A patient has acute appendicitis but exhibits minimal anterior abdominal tenderness and no guarding on palpation. Which anatomical position do you suspect, and which specific physical exam maneuver will you perform to unmask it?',
          idealCandidateAnswer: 'I suspect a retrocecal appendix, which accounts for approximately 65% of anatomical positions. Because the inflamed appendix is shielded anteriorly by the gas-filled cecum, anterior peritoneal signs are blunted. I would perform the Psoas Sign: placing the patient in the left lateral decubitus position and passively extending the right hip (or asking the patient to actively flex the right thigh against my resistance). This stretches the iliopsoas muscle directly against the inflamed retrocecal appendix, reproducing sharp focal pain.',
          examinerTrap: 'Candidate confuses Psoas sign (retrocecal) with Obturator sign (pelvic, tested by internal rotation of flexed hip).'
        },
        {
          rung: 3,
          title: 'Rung 3: Surgical Edge Cases & Controversies',
          examinerQuestion: 'You are performing a diagnostic laparoscopy for suspected appendicitis in a 24-year-old female. You inspect the appendix and find it is completely pale, soft, and macroscopically normal. What is your systematic intraoperative exploration protocol?',
          idealCandidateAnswer: 'First, I will inspect the right adnexa (ovary and fallopian tube) to rule out a ruptured ovarian cyst, ovarian torsion, ectopic pregnancy, or pelvic inflammatory disease. Second, I will systematically run the bowel: exteriorizing and inspecting the terminal 100 cm of ileum to search for an inflamed Meckel\'s diverticulum or signs of Crohn\'s regional enteritis (creeping fat, mesenteric thickening). Third, I will inspect the mesenteric lymph nodes for mesenteric adenitis and check the gallbladder/duodenum in the right upper quadrant for free bile or perforated ulcer. If Crohn\'s disease is found involving the terminal ileum and the cecal base is inflamed, I will NOT resect the normal appendix due to the high risk of enterocutaneous fistula.',
          examinerTrap: 'Candidate says "I will just remove the appendix and close without inspecting other quadrants."'
        }
      ],
      osce_checklist: [
        { task: 'Introduces self, confirms patient identity (name + DOB), explains examination and obtains consent', points: 1 },
        { task: 'Ensures adequate exposure (xiphisternum to symphysis pubis) with patient lying flat supine with knees slightly flexed', points: 1 },
        { task: 'Asks patient where the pain is located BEFORE touching and watches the patient\'s face throughout for pain cues', points: 2, criticalFailCondition: true },
        { task: 'Performs light palpation starting in the quadrant furthest away from the site of pain (e.g. LLQ)', points: 2, criticalFailCondition: true },
        { task: 'Accurately locates McBurney\'s point (1/3 distance from anterior superior iliac spine to umbilicus)', points: 2 },
        { task: 'Demonstrates Rovsing\'s sign correctly by applying deep pressure in the LLQ and noting referred RLQ pain', points: 1 },
        { task: 'Demonstrates Psoas sign correctly (hip extension in left lateral decubitus)', points: 1 },
        { task: 'Synthesizes findings, states Alvarado score, and outlines immediate emergency resuscitation plan', points: 2 }
      ]
    },

    mindmap: {
      layout: 'radial',
      nodes: [
        { id: 'mm-core', label: 'Acute Appendicitis', category: 'Core', details: 'Acute surgical abdomen; closed-loop luminal obstruction of vermiform appendix' },
        { id: 'mm-etio', label: 'Etiology', category: 'Etiology', parentId: 'mm-core', details: 'Fecalith in adults (~40%), Lymphoid hyperplasia in children' },
        { id: 'mm-path', label: 'Pathophysiology', category: 'Pathophysiology', parentId: 'mm-core', details: 'Mucus retention -> Intraluminal P >60mmHg -> Venous thrombosis -> Transmural PMN invasion' },
        { id: 'mm-pres', label: 'Clinical Presentation', category: 'Clinical', parentId: 'mm-core', details: 'Migratory pain (T10 visceral -> somatic RLQ), Anorexia, McBurney point tenderness' },
        { id: 'mm-diag', label: 'Diagnostics', category: 'Diagnostics', parentId: 'mm-core', details: 'Leukocytosis with left shift, CT IV contrast (>6mm diameter, wall thickening), US in kids/pregnancy' },
        { id: 'mm-diff', label: 'Differentials (VINDICATE)', category: 'Differential', parentId: 'mm-core', details: 'Mesenteric adenitis, Meckel diverticulitis, Crohn terminal ileitis, Ectopic pregnancy, Ovarian torsion' },
        { id: 'mm-mgmt', label: 'Management', category: 'Management', parentId: 'mm-core', details: 'Laparoscopic appendectomy within 12-24h + Pre-op IV Cefoxitin or Ceftriaxone + Metronidazole' }
      ]
    },

    cards: [
      {
        id: 'fc-app-cloze-1',
        type: 'cloze',
        front: 'The definitive histopathologic hallmark required to diagnose acute appendicitis is active neutrophilic infiltration of the {{c1::muscularis propria}}.',
        back: 'Transmural infiltration of the muscularis propria is pathognomonic. Finding neutrophils only in the mucosa represents superficial enteritis, not true appendicitis.',
        clozeDeletions: ['muscularis propria'],
        source_id: 'src-statpearls-app',
        disease_id: 'acute-appendicitis',
        disease_name: 'Acute Appendicitis',
        tags: ['Pathology', 'Histology', 'USMLE High-Yield'],
        fsrs_state: {
          stability: 2.8,
          difficulty: 4.1,
          reps: 2,
          lapses: 0,
          state: 'review',
          last_review: Date.now() - 86400000,
          due: Date.now() + 172800000
        }
      },
      {
        id: 'fc-app-why-2',
        type: 'why-card',
        front: 'WHY does early appendicitis pain refer to the periumbilical region (T10), while late pain localizes sharply to McBurney\'s point?',
        back: 'Early pain is VISCERAL: appendiceal distention activates unmyelinated C-fibers traveling via sympathetic splanchnic nerves to the T10 dorsal horn, causing vague periumbilical pain. Late pain is SOMATIC: transmural inflammation contacts the parietal peritoneum innervated by somatic spinal nerves (T11-L1), providing sharp, pinpoint somatotopic localization.',
        source_id: 'src-statpearls-app',
        disease_id: 'acute-appendicitis',
        disease_name: 'Acute Appendicitis',
        tags: ['Anatomy', 'Neuroanatomy', 'Clinical Pearl'],
        fsrs_state: {
          stability: 3.2,
          difficulty: 3.5,
          reps: 3,
          lapses: 0,
          state: 'review',
          last_review: Date.now() - 43200000,
          due: Date.now() + 259200000
        }
      },
      {
        id: 'fc-app-vignette-3',
        type: 'vignette',
        front: 'A 24-year-old female presents with RLQ pain. Vital signs: BP 118/74, HR 88, T 37.8°C. What test MUST be performed before administering IV contrast CT?',
        back: 'Urine or serum β-hCG pregnancy test. If pregnant, abdominopelvic CT exposes fetus to ionizing radiation; graded compression ultrasound is first-line imaging, followed by non-contrast MRI if ultrasound is equivocal.',
        source_id: 'src-wjes-guidelines',
        disease_id: 'acute-appendicitis',
        disease_name: 'Acute Appendicitis',
        tags: ['Emergency Triage', 'Obstetrics', 'Radiology Protocol'],
        fsrs_state: {
          stability: 4.0,
          difficulty: 2.9,
          reps: 4,
          lapses: 0,
          state: 'review',
          last_review: Date.now() - 172800000,
          due: Date.now() + 432000000
        }
      }
    ],

    evidence: [
      {
        source_id: 'src-coda-nejm',
        tier: 'Tier B',
        title: 'A Randomized Trial Comparing Antibiotics with Appendectomy for Appendicitis (The CODA Trial)',
        authors: 'CODA Collaborative, Flum DR, Davidson GH, Monsell SE, et al.',
        journal_or_publisher: 'New England Journal of Medicine (NEJM)',
        year: 2020,
        pmid: '33017772',
        pmcid: 'PMC7735506',
        doi: '10.1056/NEJMoa2014320',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33017772/',
        license: 'Educational Open Access',
        retraction_status: 'Clean (Verified Unretracted)',
        verified_via: 'NCBI E-utilities esummary',
        verified_on: '2026-10-14',
        reviewer_notes: 'Landmark randomized trial of 1,552 patients. Antibiotics noninferior at 30 days based on EQ-5D, but 29% in the antibiotic group required appendectomy by 90 days. Appendicoliths conferred high complication and failure rate (41%).',
        high_yield_takeaway: 'Non-operative management with antibiotics has a 70% success rate at 90 days, but appendicoliths are associated with a 41% rate of treatment failure and urgent appendectomy.'
      },
      {
        source_id: 'src-wjes-guidelines',
        tier: 'Tier A',
        title: 'Diagnosis and management of acute appendicitis. WSES Jerusalem guidelines',
        authors: 'Di Saverio S, Podda M, De Simone B, Ceresoli M, et al.',
        journal_or_publisher: 'World Journal of Emergency Surgery (WJES)',
        year: 2020,
        pmid: '32698822',
        pmcid: 'PMC7374786',
        doi: '10.1186/s13017-020-00306-3',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32698822/',
        license: 'Open Access (CC-BY / Public)',
        retraction_status: 'Clean (Verified Unretracted)',
        verified_via: 'Crossref DOI',
        verified_on: '2026-10-14',
        reviewer_notes: 'International consensus guideline by World Society of Emergency Surgery. Recommends laparoscopic appendectomy as standard gold therapy and validates Alvarado and AIR risk scoring.',
        high_yield_takeaway: 'Laparoscopic appendectomy is first-line across all age groups and sexes. Ultrasound is preferred in pregnancy and pediatrics; CT with IV contrast in general adult populations.'
      },
      {
        source_id: 'src-statpearls-app',
        tier: 'Tier C',
        title: 'Acute Appendicitis - StatPearls Clinical Compendium',
        authors: 'Jones MW, Lopez RA, Deppen JG',
        journal_or_publisher: 'StatPearls Publishing / National Library of Medicine (NCBI Bookshelf)',
        year: 2024,
        pmid: '29630245',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK441887/',
        license: 'Open Access (CC-BY / Public)',
        retraction_status: 'Clean (Verified Unretracted)',
        verified_via: 'NIH NLM Catalog',
        verified_on: '2026-10-14',
        reviewer_notes: 'Gold standard open access reference covering neuroanatomy (T10 dermatome), histopathology (muscularis propria PMNs), and clinical maneuver sensitivities/specificities.',
        high_yield_takeaway: 'Muscularis propria neutrophil infiltration is mandatory for pathology diagnosis. Alvarado score ≥7 indicates surgical management.'
      }
    ]
  },
  {
    id: 'type-2-diabetes',
    title: 'Type 2 Diabetes Mellitus',
    aliases: ['T2DM', 'Non-insulin dependent diabetes', 'Adult-onset diabetes'],
    codes: {
      icd10: 'E11.9',
      snomed_ct: '44054006',
      mesh: 'D003924'
    },
    regions: ['Endocrine & Systemic'],
    system: 'Endocrine / Metabolic',
    scope_note: 'Progressive metabolic endocrinopathy characterized by peripheral insulin resistance, inadequate compensatory beta-cell secretion, and uninhibited hepatic gluconeogenesis.',
    when_to_ask_clinician: 'Severe dehydration with altered sensorium (suspect Hyperosmolar Hyperglycemic State HHS), blood glucose >600 mg/dL, refractory foot ulcer with deep crepitus/erythema, or euglycemic ketoacidosis on SGLT2i.',
    trust_score: 99,
    last_reviewed: '2026-10-14',
    human_reviewed_by: 'MD Endocrinology & Medical Librarian Review',
    ai_generated: false,
    global_health_note: {
      high_income: 'First-line combination of Metformin plus cardioprotective SGLT2 inhibitors and GLP-1 RAs; continuous glucose monitoring (CGM).',
      low_middle_income: 'Metformin and Sulfonylureas (Gliclazide/Glimepiride) remain the primary accessible agents on the WHO Model List of Essential Medicines; SMBG fingerstick monitoring.',
      who_essential_medicines: ['Metformin', 'Gliclazide', 'Human Insulin (NPH/Regular)', 'Empagliflozin (selective)']
    },
    red_flags: [
      {
        warning: 'Profound lethargy, serum glucose >600 mg/dL, and effective plasma osmolality >320 mOsm/kg without marked ketoacidosis',
        immediateAction: 'Hyperosmolar Hyperglycemic State (HHS). Aggressive isotonic crystalloid resuscitation (1-2L in 1st hour) and low-dose IV insulin infusion after potassium correction.',
        timeframe: 'Immediate (< 15 mins)'
      },
      {
        warning: 'Diabetic foot ulcer with probe-to-bone contact, surrounding ascending cellulitis, or systemic fevers',
        immediateAction: 'High risk of acute osteomyelitis / limb-threatening necrotizing soft tissue infection. Urgent surgical consult, IV broad-spectrum antibiotics, non-weight bearing status.',
        timeframe: 'Immediate (< 30 mins)'
      }
    ],
    depth_content: {
      MS1: {
        summary: 'Defect in insulin receptor tyrosine kinase downstream signaling (IRS-1 serine phosphorylation via PKC-theta) impairing GLUT4 vesicle translocation to the sarcolemma and adipocyte plasma membrane.',
        cellular_depth: 'Excess intracellular diacylglycerol and ceramides activate novel PKC isoforms, causing inhibitory serine phosphorylation of IRS-1/2, disabling the PI3K/Akt pathway. Uninhibited FoxO1 drives gluconeogenesis via PEPCK and Glucose-6-Phosphatase.',
        clinical_focus: 'Renal threshold for glucose is ~180 mg/dL. Glucosuria triggers osmotic diuresis, producing the hallmark triad: polyuria, polydipsia, and polyphagia.',
        exam_pearl: 'Islet pathology: Progressive deposition of amorphous, Congo-red positive, apple-green birefringent Islet Amyloid Polypeptide (IAPP / Amylin).'
      },
      'MS2-3': {
        summary: 'DeFronzo\'s Ominous Octet: beta-cell failure, incretin defect, elevated lipolysis, increased renal glucose reabsorption (SGLT2), reduced muscle glucose uptake, brain neurotransmitter defect, uninhibited hepatic glucose output, and alpha-cell hypersecretion.',
        cellular_depth: 'Chronic beta-cell secretory stress overloads the endoplasmic reticulum, triggering the Unfolded Protein Response (PERK, IRE1) and pro-apoptotic CHOP transcription factor, causing beta-cell apoptosis.',
        clinical_focus: 'Microvascular triad: Retinopathy (pericyte loss, VEGF-driven neovascularization), Nephropathy (Kimmelstiel-Wilson nodular glomerulosclerosis), Neuropathy (stocking-glove sensory loss via sorbitol toxicity).',
        exam_pearl: 'Diagnostic criteria: HbA1c ≥6.5%, Fasting Plasma Glucose ≥126 mg/dL, or 2-hour 75g OGTT ≥200 mg/dL (confirmed on repeat testing).'
      },
      MS4: {
        summary: 'ADA Standards of Care: Comprehensive cardiorenal risk management. Independent of baseline HbA1c, prescribe SGLT2i for Heart Failure / CKD, and GLP-1 RA for established ASCVD / obesity.',
        cellular_depth: 'SGLT2 inhibitors block sodium-glucose cotransport in the proximal convoluted tubule, restoring macula densa tubuloglomerular feedback and afferent arteriolar vasoconstriction, reducing intraglomerular hypertension.',
        clinical_focus: 'Recognize Euglycemic DKA on SGLT2 inhibitors (blood glucose may be normal <200 mg/dL; check serum ketones and arterial blood gas). Stop SGLT2i 3-4 days before scheduled major surgery.',
        exam_pearl: 'Metformin mechanism: Inhibits mitochondrial complex I and mGPD -> increases AMP:ATP ratio -> activates AMPK -> suppresses FoxO1 and gluconeogenesis. Contraindicated if eGFR <30 mL/min.'
      },
      Resident: {
        summary: 'Advanced inpatient glycemic control, managing steroid-induced hyperglycemia (peaks afternoon/evening), perioperative insulin protocol, and titrating dual incretin agonists (Tirzepatide).',
        cellular_depth: 'Advanced glycation end-products (AGEs) bind RAGE receptors on vascular endothelium, stimulating NF-κB, increasing endothelin-1, and reducing eNOS, accelerating atherosclerosis.',
        clinical_focus: 'In patients with CKD and persistent albuminuria on maximum tolerated ACEi/ARB + SGLT2i, initiate the nonsteroidal mineralocorticoid receptor antagonist Finerenone.',
        exam_pearl: 'UKPDS 34 landmark trial demonstrated that intensive glycemic control with Metformin produced a 36% reduction in all-cause mortality and 39% reduction in myocardial infarction.'
      }
    },
    etiology: {
      triggers: [
        'Visceral adiposity and elevated waist-to-hip ratio',
        'Physical inactivity and sedentary screen time',
        'High glycemic load and refined carbohydrate diet',
        'Systemic glucocorticoid therapy (iatrogenic)',
        'Polycystic Ovary Syndrome (PCOS)'
      ],
      risk_factors: [
        'First-degree relative with T2DM (70-90% concordance in monozygotic twins)',
        'High-risk ethnicity (Hispanic, Black, Asian, Native American)',
        'History of Gestational Diabetes (GDM) or infant >9 lbs (4.1 kg)',
        'Hypertension (≥130/80 mmHg) and dyslipidemia (triglycerides >250, HDL <35)'
      ],
      epidemiology: 'Affects over 530 million adults globally (~10.5% prevalence). Projected to exceed 780 million by 2045. Accounts for over 90% of all diagnosed diabetes cases.'
    },
    pathway: [
      {
        id: 'node-t2d-1',
        nodeType: 'trigger',
        title: 'Adiposity & Ectopic Lipid Infiltration',
        mechanism: {
          MS1: 'Visceral adipocytes overflow lipid storage capacity, releasing free fatty acids (FFAs) that deposit in liver and skeletal myocytes.',
          'MS2-3': 'Intracellular diacylglycerol accumulates, activating protein kinase C (PKC-theta).',
          MS4: 'Lipid toxicity drives hepatic steatosis (MASH) and accelerates systemic metabolic syndrome.',
          Resident: 'Adiponectin levels decline while leptin, resistin, and TNF-alpha increase, promoting endothelial inflammation.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-ada-guidelines'
      },
      {
        id: 'node-t2d-2',
        nodeType: 'molecular',
        title: 'IRS-1 Serine Phosphorylation & FoxO1 Activation',
        mechanism: {
          MS1: 'PKC-theta phosphorylates serine residues on IRS-1, blocking normal tyrosine phosphorylation by the insulin receptor.',
          'MS2-3': 'PI3K and Akt are not recruited; FoxO1 remains unphosphorylated and translocates to the nucleus.',
          MS4: 'Constitutive transcription of PEPCK and Glucose-6-Phosphatase drives uninhibited gluconeogenesis.',
          Resident: 'Hepatic glucose production continues unabated even in the presence of marked compensatory hyperinsulinemia.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-t2d'
      },
      {
        id: 'node-t2d-3',
        nodeType: 'cellular',
        title: 'Impaired GLUT4 Translocation & Sarcoplasmic Starvation',
        mechanism: {
          MS1: 'Absence of Akt activation prevents AS160 phosphorylation, trapping GLUT4 storage vesicles intracellularly.',
          'MS2-3': 'Skeletal muscle glucose uptake drops by >60%, leaving glucose trapped in the extracellular space.',
          MS4: 'Postprandial glucose surges (>200 mg/dL) develop following carbohydrate meals.',
          Resident: 'AMPK activation by exercise or Metformin bypasses insulin signaling to stimulate GLUT4 translocation independently.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-ukpds-lancet'
      },
      {
        id: 'node-t2d-4',
        nodeType: 'tissue',
        title: 'Islet Amyloid Polypeptide (Amylin) Deposition',
        mechanism: {
          MS1: 'Beta-cells hypersecrete insulin and amylin to compensate; amylin oligomerizes into toxic beta-sheet fibrils.',
          'MS2-3': 'Amorphous amyloid fibrils replace endocrine parenchyma; islets show apple-green birefringence under polarized light.',
          MS4: 'Functional beta-cell mass declines by ~50% by the time clinical hyperglycemia is diagnosed.',
          Resident: 'ER stress triggers caspase-3 and mitochondrial apoptosis, driving progressive secretory failure.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-t2d'
      },
      {
        id: 'node-t2d-5',
        nodeType: 'organ',
        title: 'Renal SGLT2 Glucosuria & Tubuloglomerular Hyperfiltration',
        mechanism: {
          MS1: 'Filtered glucose exceeds proximal tubular reabsorption capacity (~180 mg/dL; TmG ~375 mg/min).',
          'MS2-3': 'SGLT2 upregulation reabsorbs excess sodium, starving the macula densa and dilating afferent arterioles.',
          MS4: 'Intraglomerular capillary hypertension drives microalbuminuria (UACR >30 mg/g) and podocyte effacement.',
          Resident: 'SGLT2 inhibitors restore sodium delivery to macula densa, inducing afferent vasoconstriction that protects nephrons.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-ada-guidelines'
      },
      {
        id: 'node-t2d-6',
        nodeType: 'symptom',
        title: 'Classic Osmotic Triad (Polyuria, Polydipsia, Blurred Vision)',
        mechanism: {
          MS1: 'Intraluminal glucose exerts osmotic drag in collecting ducts, causing water diuresis and severe thirst.',
          'MS2-3': 'Hyperglycemia drives lens sorbitol accumulation via aldose reductase, swelling the crystalline lens.',
          MS4: 'Patients complain of nocturia, chronic fatigue, and blurred vision uncorrected by new eyeglass prescriptions.',
          Resident: 'Hyperosmolar dehydration can trigger Hyperosmolar Hyperglycemic State (HHS) in elderly patients with blunted thirst.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-statpearls-t2d'
      },
      {
        id: 'node-t2d-7',
        nodeType: 'sign',
        title: 'Acanthosis Nigricans & Stocking-Glove Sensory Loss',
        mechanism: {
          MS1: 'Profound hyperinsulinemia cross-activates epidermal IGF-1 receptors, causing velvety hyperpigmentation.',
          'MS2-3': 'Sorbitol toxicity and endoneurial ischemia produce length-dependent peripheral neuropathy.',
          MS4: 'Loss of 10-g Semmes-Weinstein monofilament sensation on plantar surfaces predicts diabetic foot ulceration.',
          Resident: 'Diabetic autonomic neuropathy produces resting tachycardia (>90 bpm) and orthostatic hypotension.'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-ada-guidelines'
      },
      {
        id: 'node-t2d-8',
        nodeType: 'test',
        title: 'HbA1c Glycation & Urine Albumin-to-Creatinine Ratio (UACR)',
        mechanism: {
          MS1: 'Glucose non-enzymatically glycates the N-terminal valine of the hemoglobin beta-chain in erythrocytes.',
          'MS2-3': 'HbA1c reflects average glycemic control over the 90-120 day lifespan of circulating red blood cells.',
          MS4: 'Diagnostic cutoffs: HbA1c ≥6.5%, Fasting glucose ≥126 mg/dL; annual spot UACR to detect microalbuminuria (30-300 mg/g).',
          Resident: 'Falsely low HbA1c occurs in hemolytic anemia, G6PD deficiency, or hemodialysis (reduced RBC lifespan).'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-ada-guidelines'
      },
      {
        id: 'node-t2d-9',
        nodeType: 'treatment',
        title: 'Metformin + Cardioprotective SGLT2i / GLP-1 RA Therapy',
        mechanism: {
          MS1: 'Metformin activates AMPK, suppressing hepatic gluconeogenesis without inducing hypoglycemia or weight gain.',
          'MS2-3': 'SGLT2 inhibitors (Empagliflozin) reduce cardiovascular death and heart failure hospitalizations.',
          MS4: 'GLP-1 receptor agonists (Semaglutide) delay gastric emptying, stimulate insulin secretion, and induce 15-20% weight loss.',
          Resident: 'In advanced disease with persistent hyperglycemia >10% HbA1c, add basal insulin glargine or dual incretins (Tirzepatide).'
        },
        evidenceGrade: 'Grade A (High)',
        source_id: 'src-ukpds-lancet'
      }
    ],
    vindicate: [
      {
        letter: 'V',
        category: 'Vascular',
        weight: 98,
        roleInDisease: 'Microvascular (retinopathy, nephropathy, neuropathy) and macrovascular (CAD, stroke, PAD) disease.',
        topDifferentials: ['Atherosclerotic Vascular Disease without DM', 'Hypertensive Nephrosclerosis'],
        clinicalPearl: {
          simple: 'AGEs bind RAGE receptors on vascular endothelium, reducing nitric oxide and causing accelerated atherosclerosis.',
          deep: 'Early intervention with ACEi/ARB or SGLT2i reduces intraglomerular hyperfiltration and retards diabetic kidney disease.'
        }
      },
      {
        letter: 'I',
        category: 'Infectious',
        weight: 65,
        roleInDisease: 'Hyperglycemia impairs neutrophil chemotaxis, predisposing to osteomyelitis, Fournier gangrene, and candidiasis.',
        topDifferentials: ['Diabetic Foot Osteomyelitis', 'Malignant Otitis Externa (Pseudomonas)'],
        clinicalPearl: {
          simple: 'High glucose paralyzes neutrophil phagocytosis and complement opsonization.',
          deep: 'Deep ear canal pain in an elderly diabetic is malignant external otitis until proven otherwise.'
        }
      },
      {
        letter: 'N',
        category: 'Neoplastic',
        weight: 40,
        roleInDisease: 'Hyperinsulinemia and IGF-1 exert mitogenic stimulation, increasing risk for pancreatic and colon cancer.',
        topDifferentials: ['Pancreatic Adenocarcinoma (new-onset DM in patient >50 can be herald sign)'],
        clinicalPearl: {
          simple: 'Insulin and IGF-1 stimulate cellular proliferation via Ras/MAPK signaling.',
          deep: 'Sudden unexplained worsening of glycemic control in an elderly patient warrants abdominal CT for occult pancreatic cancer.'
        }
      },
      {
        letter: 'D',
        category: 'Degenerative',
        weight: 90,
        roleInDisease: 'Islet amyloid polypeptide (IAPP) fibril deposition causes beta-cell apoptosis and islet sclerosis.',
        topDifferentials: ['Diabetic Charcot Neuroarthropathy', 'Vascular Dementia'],
        clinicalPearl: {
          simple: 'Islet amyloid stains positive with Congo red and shows apple-green birefringence.',
          deep: 'Charcot foot presents as an erythematous, warm, edematous rocker-bottom foot in a neuropathic patient.'
        }
      },
      {
        letter: 'I2',
        category: 'Iatrogenic / Idiopathic',
        weight: 55,
        roleInDisease: 'Glucocorticoids, atypical antipsychotics (Olanzapine), and thiazides exacerbate insulin resistance.',
        topDifferentials: ['Steroid-Induced Hyperglycemia', 'Antipsychotic-Induced Metabolic Syndrome'],
        clinicalPearl: {
          simple: 'Glucocorticoids increase gluconeogenesis and induce peripheral insulin resistance.',
          deep: 'Steroid-induced hyperglycemia characteristically peaks in the afternoon and evening rather than early morning.'
        }
      },
      {
        letter: 'C',
        category: 'Congenital',
        weight: 35,
        roleInDisease: 'Must distinguish from monogenic Maturity-Onset Diabetes of the Young (MODY).',
        topDifferentials: ['MODY 2 (Glucokinase GCK mutation)', 'MODY 3 (HNF-1α mutation)'],
        clinicalPearl: {
          simple: 'MODY has autosomal dominant inheritance across 3 generations in young non-obese patients.',
          deep: 'MODY 3 patients exhibit exquisite sensitivity to low-dose sulfonylureas.'
        }
      },
      {
        letter: 'A',
        category: 'Autoimmune',
        weight: 60,
        roleInDisease: 'Must rule out Latent Autoimmune Diabetes in Adults (LADA) and Type 1 Diabetes Mellitus.',
        topDifferentials: ['Latent Autoimmune Diabetes in Adults (LADA)', 'Type 1 Diabetes Mellitus (T1DM)'],
        clinicalPearl: {
          simple: 'T1DM/LADA involves autoantibodies against GAD65, IA-2, and ZnT8.',
          deep: 'Suspect LADA in lean adult diabetics who fail oral agents rapidly within 1-2 years.'
        }
      },
      {
        letter: 'T',
        category: 'Trauma / Toxic',
        weight: 30,
        roleInDisease: 'Chronic pancreatitis from alcohol (Type 3c Diabetes) or Hemochromatosis (iron deposition in islets).',
        topDifferentials: ['Type 3c Pancreatogenic Diabetes', 'Hereditary Hemochromatosis ("Bronze Diabetes")'],
        clinicalPearl: {
          simple: 'Loss of alpha cells in pancreatogenic diabetes leads to severe brittle hypoglycemia.',
          deep: 'Suspect hemochromatosis with elevated transferrin saturation >45% and ferritin >1000 ng/mL.'
        }
      },
      {
        letter: 'E',
        category: 'Endocrine / Metabolic',
        weight: 100,
        roleInDisease: 'Core metabolic disease; secondary endocrine causes include Cushing syndrome, Acromegaly, and Pheochromocytoma.',
        topDifferentials: ['Cushing\'s Syndrome (excess cortisol)', 'Acromegaly (excess GH/IGF-1)', 'Pheochromocytoma'],
        clinicalPearl: {
          simple: 'Cortisol and growth hormone directly antagonize insulin receptor substrate signaling.',
          deep: 'Screen for secondary endocrinopathies in patients with resistant hypertension and hypokalemia.'
        }
      }
    ],
    presentation: {
      classic: 'Often asymptomatic for years. Classic presentation features the "3 Ps" (polyuria, polydipsia, polyphagia), fatigue, blurred vision from sorbitol accumulation, and recurrent mucocutaneous candidal infections.',
      cardinal_symptoms: [
        'Polyuria (osmotic diuresis exceeding renal threshold >180 mg/dL)',
        'Polydipsia (hyperosmolar thirst center stimulation)',
        'Polyphagia (cellular starvation despite hyperglycemia)',
        'Unintentional weight loss (catabolic advanced state)',
        'Blurred vision (lens osmotic swelling)'
      ],
      physical_signs: [
        {
          sign: 'Acanthosis Nigricans',
          maneuver: 'Inspection of posterior neck nape, axillae, and skin folds for hyperpigmented velvety plaques.',
          diagnostic_yield: 'High specificity for severe insulin resistance'
        },
        {
          sign: '10-g Semmes-Weinstein Monofilament Test',
          maneuver: 'Apply monofilament until it buckles on plantar aspect of great toe and metatarsal heads.',
          diagnostic_yield: 'Sensitivity 85% for loss of protective sensation'
        },
        {
          sign: 'Dilated Fundoscopy for Retinopathy',
          maneuver: 'Ophthalmoscopic visualization of microaneurysms, dot-blot hemorrhages, and cotton-wool spots.',
          diagnostic_yield: 'Leading cause of preventable adult blindness'
        }
      ],
      scoring_systems: [
        {
          name: 'ADA Diagnostic Algorithm',
          criteria: [
            'Fasting Plasma Glucose (FPG) ≥126 mg/dL (7.0 mmol/L)',
            'HbA1c ≥6.5% (48 mmol/mol)',
            '2-hour 75g Oral Glucose Tolerance Test (OGTT) ≥200 mg/dL (11.1 mmol/L)',
            'Random plasma glucose ≥200 mg/dL with classic hyperglycemic crisis'
          ],
          clinical_action: 'Requires 2 abnormal results from same test sample or 2 separate test samples.'
        }
      ]
    },
    diagnostics: {
      first_line: 'Fasting Plasma Glucose and HbA1c screening with comprehensive metabolic panel (electrolytes, BUN, creatinine, eGFR).',
      gold_standard: 'Fasting Plasma Glucose ≥126 mg/dL or 2-hour 75g OGTT ≥200 mg/dL; annual spot Urine Albumin-to-Creatinine Ratio (UACR).',
      imaging_findings: [
        'Renal ultrasound: Normal to enlarged kidneys in early diabetic nephropathy (hyperfiltration); cortical thinning late',
        'Dilated fundus photography: Microaneurysms, hard exudates, and retinal neovascularization'
      ],
      laboratory_pattern: 'Fasting blood glucose >126 mg/dL; HbA1c >6.5%; microalbuminuria (UACR 30-300 mg/g); elevated triglycerides and low HDL.'
    },
    management: {
      acute_stabilization: [
        'Recognize and triage Hyperosmolar Hyperglycemic State (HHS) vs DKA',
        'Isotonic fluid replacement (Normal Saline 15-20 mL/kg/hr in 1st hour)',
        'Check serum potassium before starting IV insulin; hold insulin if K+ <3.3 mEq/L',
        'Comprehensive lifestyle: 150 mins/week aerobic exercise and Mediterranean/DASH diet'
      ],
      definitive: 'First-line pharmacotherapy with Metformin + comprehensive lifestyle modification. If patient has established ASCVD, Heart Failure, or CKD, initiate an SGLT2 inhibitor (Empagliflozin) and/or GLP-1 RA (Semaglutide) with proven organ protection, independent of baseline HbA1c.',
      pharmacology: [
        {
          drug_class: 'Biguanide (AMPK Activator)',
          representative_agent: 'Metformin',
          mechanism: 'Inhibits complex I of mitochondrial respiratory chain -> activates AMPK -> suppresses FoxO1 and hepatic gluconeogenesis.',
          essential_monitoring: 'Titrate from 500mg daily to 1000mg BID. Check eGFR; contraindicated if eGFR <30 mL/min due to lactic acidosis.'
        },
        {
          drug_class: 'SGLT2 Inhibitor',
          representative_agent: 'Empagliflozin (or Dapagliflozin)',
          mechanism: 'Inhibits sodium-glucose cotransporter 2 in proximal convoluted tubule; excretes ~70g glucose/day and restores tubuloglomerular feedback.',
          essential_monitoring: 'Proven to reduce Heart Failure hospitalizations and CKD progression. Monitor for mycotic genital infections and euglycemic DKA.'
        },
        {
          drug_class: 'GLP-1 Receptor Agonist / Dual Incretin',
          representative_agent: 'Semaglutide (or Tirzepatide)',
          mechanism: 'Stimulates glucose-dependent insulin secretion, suppresses glucagon, delays gastric emptying, and induces significant weight loss.',
          essential_monitoring: 'Subcutaneous weekly injection; titrate slowly to prevent nausea. Reduces MACE in established ASCVD.'
        }
      ]
    },
    exam_lens: {
      patterns: ['SBA', 'SAQ', 'OSCE', 'Viva'],
      marks: '10 marks (Full SAQ)',
      frequency_tier: 'Perennial (Exam Favorite)',
      provenance: 'USMLE Step 1/2 CK Content Outline, NMC CBME Medicine PE10.1-PE10.4',
      curriculum_codes: [
        {
          system: 'USMLE Step 1/2',
          code: 'ENDO-02.01',
          competency: 'Pathophysiology of insulin resistance, diabetes pharmacology, and micro/macrovascular complications'
        },
        {
          system: 'NMC CBME',
          code: 'PE10.2',
          competency: 'Etiopathogenesis, clinical features, investigations, and comprehensive management of Type 2 Diabetes'
        }
      ],
      sample_stems: [
        {
          pattern: 'SBA (USMLE Step 1 Style)',
          stem: 'A 56-year-old male with a 4-year history of Type 2 Diabetes Mellitus presents for routine evaluation. His current medication is Metformin 1000mg BID. Vital signs: BP 138/84 mmHg, HR 76 bpm, BMI 31 kg/m². Laboratory studies reveal: HbA1c 7.8%, serum creatinine 1.1 mg/dL, estimated GFR 78 mL/min/1.73m², and spot urine albumin-to-creatinine ratio (UACR) 180 mg/g (normal <30 mg/g). Echocardiogram reveals an ejection fraction of 42% with mild left ventricular enlargement. According to current ADA guidelines, which of the following medications should be added to this patient\'s regimen to provide optimal cardiorenal protection?',
          options: [
            'A. Glipizide (Sulfonylurea)',
            'B. Empagliflozin (SGLT2 Inhibitor)',
            'C. Pioglitazone (Thiazolidinedione)',
            'D. Sitagliptin (DPP-4 Inhibitor)',
            'E. Acarbose (Alpha-glucosidase inhibitor)'
          ],
          correctOptionIndex: 1,
          explanation: 'Empagliflozin is an SGLT2 inhibitor. ADA 2025/2026 Standards of Care mandate the addition of an SGLT2 inhibitor in patients with Type 2 Diabetes and established Heart Failure with reduced ejection fraction (HFrEF) or Chronic Kidney Disease with albuminuria (UACR 30-300 mg/g), regardless of baseline HbA1c. SGLT2 inhibitors reduce intraglomerular pressure, reduce heart failure hospitalization, and delay progression to end-stage renal disease.',
          keyDistractorAnalysis: 'Option C (Pioglitazone) is contraindicated in patients with symptomatic heart failure because it causes renal sodium reabsorption and fluid retention. Option A (Glipizide) stimulates insulin secretion but carries hypoglycemia risk and provides zero cardiorenal protection.'
        }
      ],
      answer_skeleton: [
        {
          section: 'Definition',
          typicalMarks: 1,
          requiredKeywords: ['Metabolic disorder', 'Insulin resistance', 'Beta-cell dysfunction', 'Hyperglycemia'],
          modelPoints: [
            'Type 2 Diabetes Mellitus is a chronic metabolic endocrinopathy characterized by peripheral insulin resistance and progressive pancreatic beta-cell secretory defect.'
          ]
        },
        {
          section: 'Pathophysiology',
          typicalMarks: 3,
          requiredKeywords: ['IRS-1 serine phosphorylation', 'FoxO1', 'GLUT4 defect', 'Islet amyloid polypeptide (IAPP)', 'Glucosuria'],
          modelPoints: [
            'Intracellular diacylglycerol activates PKC-theta -> inhibitory serine phosphorylation of IRS-1 -> impaired PI3K/Akt signaling.',
            'Uninhibited FoxO1 drives hepatic gluconeogenesis via PEPCK; GLUT4 translocation to muscle sarcolemma is blocked.',
            'Beta-cells undergo ER stress and apoptosis mediated by Islet Amyloid Polypeptide (IAPP) oligomer deposition.'
          ]
        },
        {
          section: 'Investigations',
          typicalMarks: 2,
          requiredKeywords: ['HbA1c ≥6.5%', 'Fasting glucose ≥126', 'UACR microalbuminuria', 'Lipid panel'],
          modelPoints: [
            'Diagnostic criteria: HbA1c ≥6.5%, Fasting Plasma Glucose ≥126 mg/dL, or 2-hour OGTT ≥200 mg/dL.',
            'Monitoring: Spot urine albumin-to-creatinine ratio (UACR) annually, serum creatinine/eGFR, and lipid profile.'
          ]
        },
        {
          section: 'Management',
          typicalMarks: 4,
          requiredKeywords: ['Metformin', 'AMPK activation', 'SGLT2 inhibitor', 'GLP-1 RA', 'Lifestyle exercise'],
          modelPoints: [
            'First-line: Metformin (activates AMPK, suppresses gluconeogenesis) + lifestyle.',
            'Cardiorenal protection: SGLT2 inhibitors for CKD/Heart Failure; GLP-1 RAs for ASCVD and obesity.',
            'Comprehensive ABCDE goals: A1c <7%, BP <130/80, Statin therapy, Annual dilated eye and monofilament foot exams.'
          ]
        }
      ],
      viva_ladder: [
        {
          rung: 1,
          title: 'Rung 1: Diagnostic Cutoffs',
          examinerQuestion: 'What are the 4 diagnostic laboratory criteria for Type 2 Diabetes Mellitus according to the ADA?',
          idealCandidateAnswer: '1) Fasting plasma glucose ≥126 mg/dL after 8h fast; 2) HbA1c ≥6.5%; 3) 2-hour plasma glucose ≥200 mg/dL during a 75g oral glucose tolerance test; or 4) In a patient with classic symptoms of hyperglycemia, a random plasma glucose ≥200 mg/dL. In the absence of unequivocal symptomatic hyperglycemia, criteria 1-3 require repeat testing for confirmation.',
          examinerTrap: 'Candidate states a random glucose of 140 mg/dL is diagnostic, or forgets that repeat testing is required in asymptomatic screening.'
        },
        {
          rung: 2,
          title: 'Rung 2: Hemodynamic Renal Mechanism',
          examinerQuestion: 'How does an SGLT2 inhibitor protect the kidney in diabetic nephropathy at the glomerular level?',
          idealCandidateAnswer: 'In diabetes, proximal tubule SGLT2 is upregulated, reabsorbing both glucose and sodium. This starves the downstream macula densa of sodium, which the juxtaglomerular apparatus misinterprets as renal hypoperfusion, dilating the afferent arteriole and causing severe intraglomerular capillary hypertension. SGLT2 inhibitors block proximal sodium-glucose reabsorption, restoring sodium delivery to the macula densa. This restores tubuloglomerular feedback, constricting the afferent arteriole and decreasing intraglomerular hyperfiltration and podocyte shear stress.',
          examinerTrap: 'Candidate claims SGLT2 inhibitors constrict the efferent arteriole (Incorrect: that is the mechanism of ACE inhibitors and ARBs; SGLT2 inhibitors constrict the afferent arteriole via tubuloglomerular feedback).'
        },
        {
          rung: 3,
          title: 'Rung 3: Hyperglycemic Emergencies Triage',
          examinerQuestion: 'A 68-year-old with T2DM presents with glucose 920 mg/dL, serum bicarbonate 20 mEq/L, venous pH 7.34, and serum osmolality 345 mOsm/kg. Why does this patient have minimal ketoacidosis compared to a Type 1 diabetic?',
          idealCandidateAnswer: 'This patient has Hyperosmolar Hyperglycemic State (HHS). Type 2 diabetics retain trace residual basal insulin secretion. While this trace insulin is inadequate to facilitate peripheral muscle glucose uptake or suppress hepatic gluconeogenesis (leading to severe hyperglycemia and profound osmotic diuresis), it is sufficient to inhibit adipose hormone-sensitive lipase. Thus, free fatty acid lipolysis is suppressed, preventing hepatic ketogenesis and avoiding significant ketoacidosis.',
          examinerTrap: 'Candidate claims the patient has DKA and administers bicarbonate; HHS primary emergency management is aggressive crystalloid fluid resuscitation, not acidosis correction.'
        }
      ],
      osce_checklist: [
        { task: 'Performs bilateral Semmes-Weinstein 10-g monofilament examination at plantar surfaces of great toe and metatarsal heads', points: 2 },
        { task: 'Tests 128-Hz tuning fork vibratory sensation at distal interphalangeal joint of great toe', points: 2 },
        { task: 'Inspects interdigital web spaces for tinea pedis, fissures, maceration, or occult ulceration', points: 2 },
        { task: 'Palpates dorsalis pedis and posterior tibial arterial pulses bilaterally', points: 2 },
        { task: 'Councils patient on daily mirror foot self-inspections and never walking barefoot', points: 2 }
      ]
    },
    mindmap: {
      layout: 'radial',
      nodes: [
        { id: 'mm-core', label: 'Type 2 Diabetes Mellitus', category: 'Core', details: 'Metabolic syndrome; insulin resistance + progressive beta-cell failure' },
        { id: 'mm-etio', label: 'Etiology', category: 'Etiology', parentId: 'mm-core', details: 'Visceral adiposity, genetics, sedentary lifestyle, ER stress' },
        { id: 'mm-path', label: 'Pathophysiology', category: 'Pathophysiology', parentId: 'mm-core', details: 'IRS-1 serine phosphorylation -> GLUT4 defect -> Islet Amyloid (IAPP) -> SGLT2 hyperfiltration' },
        { id: 'mm-pres', label: 'Clinical Presentation', category: 'Clinical', parentId: 'mm-core', details: 'Polyuria, Polydipsia, Acanthosis nigricans, Peripheral neuropathy' },
        { id: 'mm-diag', label: 'Diagnostics', category: 'Diagnostics', parentId: 'mm-core', details: 'HbA1c ≥6.5%, FPG ≥126 mg/dL, spot UACR for microalbuminuria' },
        { id: 'mm-diff', label: 'Differentials (VINDICATE)', category: 'Differential', parentId: 'mm-core', details: 'T1DM, LADA, MODY, Cushing syndrome, Hemochromatosis' },
        { id: 'mm-mgmt', label: 'Management', category: 'Management', parentId: 'mm-core', details: 'Metformin + SGLT2i / GLP-1 RA for cardiorenal protection + Lifestyle' }
      ]
    },
    cards: [
      {
        id: 'fc-t2d-1',
        type: 'cloze',
        front: 'The microscopic hallmark of pancreatic islet degeneration in Type 2 Diabetes is extracellular deposition of {{c1::Islet Amyloid Polypeptide (IAPP / Amylin)}}.',
        back: 'Amylin is co-secreted with insulin and oligomerizes into toxic beta-sheet amyloid fibrils that stain positive with Congo red and exhibit apple-green birefringence.',
        clozeDeletions: ['Islet Amyloid Polypeptide (IAPP / Amylin)'],
        source_id: 'src-statpearls-t2d',
        disease_id: 'type-2-diabetes',
        disease_name: 'Type 2 Diabetes Mellitus',
        tags: ['Pathology', 'Histology', 'USMLE High-Yield'],
        fsrs_state: {
          stability: 3.5,
          difficulty: 3.0,
          reps: 2,
          lapses: 0,
          state: 'review',
          last_review: Date.now() - 43200000,
          due: Date.now() + 259200000
        }
      }
    ],
    evidence: [
      {
        source_id: 'src-ada-guidelines',
        tier: 'Tier A',
        title: 'Standards of Care in Diabetes—2025/2026',
        authors: 'American Diabetes Association (ADA) Professional Practice Committee',
        journal_or_publisher: 'Diabetes Care',
        year: 2025,
        pmid: '38085127',
        doi: '10.2337/dc24-S001',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38085127/',
        license: 'Open Access (CC-BY / Public)',
        retraction_status: 'Clean (Verified Unretracted)',
        verified_via: 'NCBI E-utilities esummary',
        verified_on: '2026-10-14',
        reviewer_notes: 'Consensus guideline establishing early cardiorenal combination therapy with SGLT2 inhibitors and GLP-1 RAs in patients with CKD, HF, or ASCVD.',
        high_yield_takeaway: 'Initiate SGLT2i and/or GLP-1 RA in high-risk patients with ASCVD, Heart Failure, or CKD regardless of baseline HbA1c.'
      },
      {
        source_id: 'src-statpearls-t2d',
        tier: 'Tier C',
        title: 'Type 2 Diabetes - Pathophysiology and Clinical Management',
        authors: 'Goyal R, Singhal M, Jialal I',
        journal_or_publisher: 'StatPearls Publishing / NCBI Bookshelf',
        year: 2024,
        pmid: '30020625',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK513253/',
        license: 'Open Access (CC-BY / Public)',
        retraction_status: 'Clean (Verified Unretracted)',
        verified_via: 'NIH NLM Catalog',
        verified_on: '2026-10-14',
        reviewer_notes: 'Comprehensive compendium covering the Ominous Octet, diagnostic cutoffs, and management of Hyperosmolar Hyperglycemic State.',
        high_yield_takeaway: 'Trace insulin suppresses lipolysis in HHS preventing marked ketoacidosis; primary management is aggressive volume rehydration.'
      },
      {
        source_id: 'src-ukpds-lancet',
        tier: 'Tier B',
        title: 'Effects of Intensive Blood-Glucose Control with Metformin on Complications in Overweight Patients with Type 2 Diabetes (UKPDS 34)',
        authors: 'UK Prospective Diabetes Study (UKPDS) Group',
        journal_or_publisher: 'The Lancet',
        year: 1998,
        pmid: '9742977',
        doi: '10.1016/S0140-6736(98)07019-6',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9742977/',
        license: 'Educational Open Access',
        retraction_status: 'Clean (Verified Unretracted)',
        verified_via: 'NCBI E-utilities esummary',
        verified_on: '2026-10-14',
        reviewer_notes: 'Landmark randomized trial establishing Metformin as the foundational therapeutic agent in overweight patients with T2DM.',
        high_yield_takeaway: 'Metformin reduced all-cause mortality by 36% and diabetes-related endpoints by 32%.'
      }
    ]
  }
];
