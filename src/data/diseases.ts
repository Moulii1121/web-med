import { Disease } from '../types/disease';

export const DISEASES_DATA: Disease[] = [
  {
    id: 'acute-appendicitis',
    name: 'Acute Appendicitis',
    commonName: 'Appendicitis',
    icd10: 'K35.80',
    organSystem: 'Gastrointestinal',
    bodyRegion: 'Right Lower Quadrant Abdomen',
    acuity: 'Acute',
    oneLineSummary: 'Luminal obstruction of the vermiform appendix resulting in mucosal ischemia, bacterial overgrowth, transmural inflammation, and risk of gangrenous perforation.',
    
    etiology: {
      primaryTrigger: 'Luminal obstruction of the vermiform appendix. In adults, most frequently caused by a fecalith (calcified fecal deposit); in pediatric patients and young adults, frequently triggered by lymphoid hyperplasia secondary to viral gastroenteritis or respiratory infections.',
      epidemiology: 'Lifetime risk ~8.6% in males, 6.7% in females. Peak incidence occurs between ages 10 and 30 years. It represents the single most common non-trauma general surgical emergency worldwide.',
      keyRiskFactors: [
        'Fecalith / Appendicolith formation',
        'Lymphoid follicular hyperplasia (post-viral gastroenteritis, Epstein-Barr, adenovirus)',
        'Diet low in dietary fiber (slowed colonic transit time)',
        'Foreign bodies, gallstones, or parasitic infection (Enterobius vermicularis, Ascaris)',
        'Carcinoid tumor / neuroendocrine neoplasm obstructing the appendiceal base (rare, ~0.5%)'
      ],
      geneticOrEnvironmental: 'Polygenic familial predisposition noted with nearly 3-fold higher risk if first-degree relative had appendicitis before age 30. Western dietary patterns (refined sugars, low insoluble fiber) correlate with higher incidence.',
      firstYearFocus: 'Understand embryologic development of the midgut, arterial blood supply via the appendicular artery (terminal branch of ileocolic artery without collaterals), and lymphoid aggregate proliferation in lamina propria.',
      fourthYearFocus: 'Rapid risk stratification utilizing the Alvarado Score (MANTRELS score) or Pediatric Appendicitis Score (PAS). Identify patients requiring emergent laparoscopic appendectomy vs broad-spectrum pre-operative antibiotics.'
    },

    vindicate: [
      {
        letter: 'V',
        category: 'Vascular',
        roleInDisease: 'Luminal distention exceeds appendiceal intraluminal capillary and venular pressures (~60-80 mmHg), causing venous stasis, arterial thrombosis of the terminal appendicular artery, transmural ischemia, and ischemic necrosis.',
        highYieldDifferential: ['Mesenteric Ischemia', 'Omental Torsion', 'Testicular / Ovarian Torsion with referred pelvic ischemia'],
        clinicalPearl: {
          firstYear: 'The appendicular artery is a physiologic end-artery originating from the ileocolic artery; occlusion quickly produces coagulative necrosis of the antimesenteric border.',
          fourthYear: 'In elderly patients presenting with atypical right lower quadrant pain, always rule out acute mesenteric ischemia, as mortality exceeds 50% if unmanaged.'
        },
        relevanceScore: 'primary'
      },
      {
        letter: 'I',
        category: 'Infectious',
        roleInDisease: 'Primary luminal obstruction triggers massive bacterial proliferation behind the mucus block. Normal gut commensals shift to polymicrobial anaerobic and aerobic invasion (Escherichia coli, Bacteroides fragilis, Klebsiella pneumoniae, Enterococcus faecalis).',
        highYieldDifferential: ['Acute Mesenteric Lymphadenitis (Yersinia enterocolitica, viral)', 'Infectious Ileocolitis (Campylobacter, Salmonella)', 'Pelvic Inflammatory Disease (Chlamydia trachomatis, Neisseria gonorrhoeae)'],
        clinicalPearl: {
          firstYear: 'Lipopolysaccharide (LPS/endotoxin) activates Toll-like Receptor 4 (TLR4) on resident tissue macrophages, prompting massive IL-1β, IL-6, and TNF-α cytokine storm.',
          fourthYear: 'In children presenting with RLQ guarding after a recent viral upper respiratory infection, evaluate mesenteric lymph nodes on ultrasound to distinguish mesenteric adenitis from true appendicitis.'
        },
        relevanceScore: 'primary'
      },
      {
        letter: 'N',
        category: 'Neoplastic',
        roleInDisease: 'Neoplasms located at the cecal base or appendix can physically obstruct the orifice. Appendiceal neuroendocrine (carcinoid) tumors and mucinous adenocarcinoma (which can rupture into pseudomyxoma peritonei) are discovered in ~1% of surgical appendectomy specimens.',
        highYieldDifferential: ['Cecal Adenocarcinoma (especially in patients >50 yrs)', 'Appendiceal Neuroendocrine Tumor (Carcinoid)', 'Gastrointestinal Stromal Tumor (GIST)'],
        clinicalPearl: {
          firstYear: 'Neuroendocrine tumors derive from Kulchitsky (enterochromaffin) cells and stain intensely positive for Chromogranin A and Synaptophysin.',
          fourthYear: 'In any patient >50 presenting with acute appendicitis, colonoscopy must be performed 6-8 weeks post-resolution to rule out underlying cecal or appendiceal malignancy.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'D',
        category: 'Degenerative',
        roleInDisease: 'Diverticular disease of the cecum and ascending colon or appendiceal diverticulosis can mimic or trigger inflammatory luminal collapse.',
        highYieldDifferential: ['Cecal Diverticulitis', 'Right-sided colonic diverticular phlegmon'],
        clinicalPearl: {
          firstYear: 'True diverticula involve all intestinal wall layers; false diverticula (pseudodiverticula) represent mucosal/submucosal herniations through gaps in the muscularis externa.',
          fourthYear: 'Right-sided diverticulitis is common in Asian populations and young patients; CT abdomen with IV contrast differentiates diverticular colonic wall thickening from an enlarged appendix (>6 mm).'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'I2',
        category: 'Iatrogenic / Idiopathic',
        roleInDisease: 'Previous abdominal surgeries, retained surgical clips, post-colonoscopy barotrauma, or barium impaction can rarely incite obstruction or localized perforation.',
        highYieldDifferential: ['Post-colonoscopy appendiceal barotrauma', 'Foreign body / migrated surgical clip impaction'],
        clinicalPearl: {
          firstYear: 'Mechanical injury disrupts mucosal barrier integrity, permitting transmural bacterial translocation across intact epithelial tight junctions.',
          fourthYear: 'If symptoms develop within 48 hours of diagnostic colonoscopy, distinguish between post-polypectomy electrocoagulation syndrome, micro-perforation, and secondary appendicitis.'
        },
        relevanceScore: 'secondary'
      },
      {
        letter: 'C',
        category: 'Congenital',
        roleInDisease: 'Congenital abnormalities of the midgut (such as Meckel\'s diverticulum, appendiceal duplication, or cecal malrotation) frequently present with identical signs of acute peritoneal inflammation.',
        highYieldDifferential: ['Meckel\'s Diverticulitis (persistent vitelline/omphalomesenteric duct)', 'Intestinal Malrotation with midgut volvulus', 'Duplication cysts'],
        clinicalPearl: {
          firstYear: 'Meckel\'s diverticulum follows the "Rule of 2s": 2% of population, within 2 feet of ileocecal valve, 2 inches long, 2 types of ectopic tissue (gastric and pancreatic).',
          fourthYear: 'If the appendix appears normal during surgical exploration, the surgeon must systematically inspect the terminal 100 cm of ileum to search for an inflamed Meckel\'s diverticulum.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'A',
        category: 'Autoimmune',
        roleInDisease: 'Inflammatory bowel disease, particularly Crohn\'s disease of the terminal ileum (regional enteritis) or cecum, can cause transmural RLQ inflammation and aphthous ulcerations that perfectly mimic acute appendicitis.',
        highYieldDifferential: ['Crohn\'s Disease (Terminal Ileitis)', 'Ulcerative Colitis (with appendiceal "skip" lesion / cecal patch)', 'Systemic Vasculitis (IgA Vasculitis / Henoch-Schönlein Purpura)'],
        clinicalPearl: {
          firstYear: 'Crohn\'s disease features non-caseating granulomas, Th1/Th17 cell activation, transmural cobblestone lesions, and creeping fat.',
          fourthYear: 'Avoid appendectomy in acute Crohn\'s terminal ileitis if the appendix itself is completely normal, as surgical incision in inflamed bowel carries high risk of enterocutaneous fistula.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'T',
        category: 'Trauma / Toxic',
        roleInDisease: 'Blunt abdominal trauma (e.g. handlebar injury or seatbelt deceleration) can cause localized burst perforation, direct hematoma of the mesoappendix, or chemical peritonitis from ingested caustic agents.',
        highYieldDifferential: ['Blunt Abdominal Wall Hematoma', 'Traumatic Mesenteric Avulsion', 'Ingested Button Battery / Magnet perforation'],
        clinicalPearl: {
          firstYear: 'Deceleration forces exert shear stress at anatomic tethering points such as the cecal retroperitoneal fixation.',
          fourthYear: 'Maintain high suspicion for hollow viscous injury if abdominal exam demonstrates focal peritoneal signs after motor vehicle collision or assault, regardless of normal initial ultrasound.'
        },
        relevanceScore: 'secondary'
      },
      {
        letter: 'E',
        category: 'Endocrine / Metabolic',
        roleInDisease: 'Metabolic crises like Diabetic Ketoacidosis (DKA) or acute porphyria can produce intense, diffuse abdominal pain with leukocytosis and vomiting, falsely masquerading as surgical peritonitis.',
        highYieldDifferential: ['Diabetic Ketoacidosis (DKA pseudo-peritonitis)', 'Acute Intermittent Porphyria (AIP)', 'Adrenal Crisis'],
        clinicalPearl: {
          firstYear: 'Acidosis-induced gut hypoperfusion and high circulating ketone bodies stimulate splanchnic nociceptors and induce ileus, mimicking an acute surgical abdomen.',
          fourthYear: 'Never take a patient with severe abdominal pain to the OR without first checking serum glucose, ketones, and electrolytes; resolving ketoacidosis completely abolishes DKA pseudo-peritonitis.'
        },
        relevanceScore: 'differential-ruleout'
      }
    ],

    pathophysiology: {
      overview: 'Acute appendicitis evolves along a predictable pathophysiologic progression: obstruction -> luminal hypersecretion and mucus accumulation -> intraluminal hypertension (>60 mmHg) -> venous congestion and mucosal hypoxia -> transmural polymicrobial invasion -> microvascular thrombosis and transmural ischemic necrosis -> gangrenous perforation with localized abscess or diffuse peritonitis.',
      cellularProgression: [
        {
          stage: '1. Luminal Obstruction & Visceral Distention (0 - 12 hours)',
          cellularEvent: 'Goblet cells continue mucus secretion into closed-loop lumen. Intraluminal volume increases pressure > 65 mmHg, exceeding venular collapse thresholds.',
          histology: 'Mucosal edema, compressed capillary beds, early transudation into lamina propria, intact surface epithelium.'
        },
        {
          stage: '2. Cellular Hypoxia & Bacterial Invasion (12 - 24 hours)',
          cellularEvent: 'Loss of mucosal barrier ATP synthesis; breakdown of epithelial tight junctions (claudin/occludin). Normal commensal E. coli and B. fragilis invade into submucosa. Neutrophils marginate and diapedese.',
          histology: 'Transmural neutrophil infiltration through the muscularis propria into the subserosa (pathognomonic hallmark), mucosal ulceration, microabscesses.'
        },
        {
          stage: '3. Thrombosis & Antimesenteric Ischemia (24 - 36 hours)',
          cellularEvent: 'Thromboxane A2 release and endothelial damage produce microthrombi in end-arterioles of the appendicular artery. Progressive transmural coagulative necrosis develops.',
          histology: 'Full-thickness coagulative necrosis, fibrinopurulent serosal exudate, red blood cell extravasation, loss of normal glandular architecture.'
        },
        {
          stage: '4. Gangrene & Perforation (> 36 hours)',
          cellularEvent: 'Necrotic wall thins and ruptures under continuous hydrostatic pressure. Purulent contents spill into peritoneal cavity, triggering parietal peritoneum nociception.',
          histology: 'Complete wall rupture, macroscopic defect, acute purulent peritonitis with extensive fibrinopurulent coating and free peritoneal bacteria.'
        }
      ],
      histopathologySummary: 'Pathognomonic criterion: Presence of polymorphonuclear neutrophils (PMNs) actively infiltrating the muscularis propria. Luminal pus alone without muscularis propria invasion does NOT establish a pathologic diagnosis of acute appendicitis.',
      firstYearFocus: 'Correlate the neuroanatomy: Dull visceral pain is carried by unmyelinated sympathetic C-fibers entering spinal cord at T10 (referred to periumbilical region). Sharp somatic pain begins only when inflammation contacts the somatic parietal peritoneum innervated by somatic spinal nerves (L1-L2), shifting pain to McBurney\'s point.',
      fourthYearFocus: 'Risk of perforation escalates steeply after 36 to 48 hours of symptom onset. Perforation rate is notably elevated in extremes of age (<5 years due to underdeveloped omentum; >65 years due to delayed presentation and vascular sclerosis).'
    },

    clinicalPresentation: {
      classicPresentation: 'A patient presents with anorexia ("hamburger sign"), followed by vague periumbilical cramping pain that migrates after 12-24 hours to the right lower quadrant, becoming sharp, constant, and worsened by walking, coughing, or bumps on the road during transit.',
      cardinalSymptoms: [
        'Migratory abdominal pain (periumbilical -> RLQ / McBurney\'s point)',
        'Anorexia (nearly universal; if patient is ravenously hungry, appendicitis is less likely)',
        'Nausea and vomiting (characteristically occurring AFTER the onset of pain)',
        'Low-grade fever (37.5°C - 38.3°C / 99.5°F - 101.0°F; high fevers >38.5°C indicate perforation)',
        'Obstipation or small-volume diarrheal bowel movements secondary to pelvic rectal irritation'
      ],
      physicalExamSigns: [
        {
          signName: 'McBurney\'s Point Tenderness',
          maneuverOrFinding: 'Maximal tenderness located 1/3 of the distance from the anterior superior iliac spine (ASIS) to the umbilicus.',
          mechanism: 'Direct palpation over the base of the inflamed appendix causing parietal peritoneal irritation.',
          diagnosticValue: 'Sensitivity: ~85%, Specificity: ~75%'
        },
        {
          signName: 'Rovsing\'s Sign',
          maneuverOrFinding: 'Deep palpation of the Left Lower Quadrant (LLQ) produces sharp pain in the Right Lower Quadrant (RLQ).',
          mechanism: 'Retrograde displacement of gas within the continuous colon stretches the inflamed cecum and appendix.',
          diagnosticValue: 'Sensitivity: ~68%, Specificity: ~80%'
        },
        {
          signName: 'Psoas Sign',
          maneuverOrFinding: 'Passive extension of the right hip while the patient lies in left lateral decubitus, or active right hip flexion against resistance.',
          mechanism: 'Stretches the right iliopsoas muscle against an inflamed retrocecal appendix.',
          diagnosticValue: 'Sensitivity: ~16%, Specificity: ~95% (High specificity for retrocecal position)'
        },
        {
          signName: 'Obturator Sign',
          maneuverOrFinding: 'Passive internal rotation of the flexed right hip and knee while supine.',
          mechanism: 'Stretches the internal obturator muscle adjacent to an inflamed pelvic appendix.',
          diagnosticValue: 'Sensitivity: ~8%, Specificity: ~94% (Specific for pelvic anatomical location)'
        },
        {
          signName: 'Dunphy\'s Sign (Cough Sign)',
          maneuverOrFinding: 'Increased sharp RLQ pain triggered by voluntary coughing or jumping.',
          mechanism: 'Abrupt increase in intra-abdominal pressure jarres the parietal peritoneum.',
          diagnosticValue: 'Sensitivity: ~90%, Specificity: ~70%'
        }
      ],
      atypicalPresentations: [
        'Retrocecal appendix (65% of cases): flank or back pain with minimal anterior guarding; Psoas sign positive.',
        'Pelvic appendix (30% of cases): suprapubic pain, urinary urgency, dysuria, rectal tenesmus; Obturator sign positive.',
        'Pregnancy (2nd/3rd trimester): appendix displaced superiorly and laterally toward RUQ by expanding gravid uterus.',
        'Elderly patients: blunted peritoneal signs, absence of fever or leukocytosis, presentation with unexplained confusion or bowel obstruction.'
      ],
      firstYearFocus: 'Dermatome distribution: T10 dermatome covers the umbilicus via the lesser splanchnic nerve, while somatic sensory supply to the parietal peritoneum is carried via T11-L1 spinal nerves.',
      fourthYearFocus: 'Calculate Alvarado Score: M (Migration of pain = 1), A (Anorexia = 1), N (Nausea/vomiting = 1), T (Tenderness in RLQ = 2), R (Rebound tenderness = 1), E (Elevated temperature = 1), L (Leukocytosis >10k = 2), S (Shift to left/neutrophilia = 1). Score 7-10 strongly indicates surgical consultation; 4-6 warrants CT abdomen/pelvis with IV contrast.'
    },

    treatment: {
      firstLineMedical: [
        {
          drug: 'Cefoxitin OR Cefotetan (2nd Gen Cephalosporin)',
          class: 'Cephamycins (Cell wall synthesis inhibitor)',
          dosingConcept: '2g IV single pre-operative dose administered within 60 minutes of surgical incision',
          rationale: 'Provides dual coverage against Gram-negative enterics (E. coli, Klebsiella) AND anaerobic Bacteroides fragilis.'
        },
        {
          drug: 'Ceftriaxone + Metronidazole',
          class: '3rd Gen Cephalosporin + Nitroimidazole',
          dosingConcept: 'Ceftriaxone 1g-2g IV q24h + Metronidazole 500mg IV q8h',
          rationale: 'Standard broad-spectrum combination therapy when 2nd-generation cephamycins are unavailable or for penicillin/cephalosporin-allergic patients (substituting Ciprofloxacin for Ceftriaxone).'
        },
        {
          drug: 'Piperacillin-Tazobactam (Zosyn)',
          class: 'Antipseudomonal Penicillin + Beta-Lactamase Inhibitor',
          dosingConcept: '3.375g - 4.5g IV q6h or extended infusion',
          rationale: 'Indicated for perforated appendicitis with complicated intra-abdominal infection, sepsis, or immunocompromised hosts.'
        }
      ],
      surgicalOrDefinitive: 'Laparoscopic Appendectomy: The gold standard definitive treatment. Advantages include lower wound infection rates, shorter hospital stay (<24-48 hrs), less postoperative pain, and faster return to normal activities compared to open laparotomy (McBurney / Rocky-Davis incision). Non-operative antibiotic management is considered in select uncomplicated cases (CODA trial criteria) with shared decision-making.',
      supportiveCare: [
        'NPO (Nil per os) status immediately upon clinical suspicion to prepare for emergency surgery.',
        'Intravenous isotonic crystalloid resuscitation (Lactated Ringer\'s or Normal Saline 20-30 mL/kg).',
        'Intravenous analgesia (Multimodal: IV acetaminophen, NSAIDs if surgery not immediate, or IV fentanyl/hydromorphone - early analgesia does NOT obscure diagnostic abdominal exams).',
        'Antiemetics (Ondansetron 4mg IV).'
      ],
      clinicalGuidelines: [
        {
          organization: 'American College of Surgeons (ACS) & WSES',
          recommendation: 'Laparoscopic appendectomy within 24 hours of admission is the gold standard treatment for acute uncomplicated appendicitis.'
        },
        {
          organization: 'American College of Radiology (ACR) Appropriateness Criteria',
          recommendation: 'CT Abdomen and Pelvis with IV contrast is first-line imaging in adult men and non-pregnant women (sensitivity >95%). In children and pregnant women, Grayscale and Color Doppler Ultrasound is first-line; MRI is second-line if ultrasound is non-diagnostic.'
        }
      ],
      firstYearFocus: 'Pharmacology: Beta-lactams bind penicillin-binding proteins (PBPs) preventing peptidoglycan transpeptidation. Metronidazole enters cells and is reduced by pyruvate-ferredoxin oxidoreductase, producing free nitro radicals that fracture bacterial helical DNA.',
      fourthYearFocus: 'CODA Trial Clinical Pearls: Antibiotics-first strategy is successful in ~70% of uncomplicated appendicitis at 90 days, but ~29% undergo appendectomy within 90 days and appendicoliths confer high risk of treatment failure and perforation (41%).'
    },

    flowchart: [
      {
        id: 'flow-app-1',
        stepNumber: 1,
        title: 'Luminal Obstruction',
        cellularChange: {
          mechanism: 'Mechanical blockage by appendicolith or lymphoid follicular hyperplasia behind rigid serosa',
          molecularMediator: 'Mucin-2 hypersecretion, barrier stagnation',
          firstYearDetail: 'Mucus retention increases intraluminal pressure beyond capillary perfusion pressure (~60 mmHg), triggering tissue hypoperfusion.'
        },
        clinicalSymptom: {
          symptom: 'Vague, dull periumbilical cramping pain and anorexia',
          anatomicPathway: 'Visceral afferent C-fibers travel retrograde along sympathetic plexus entering dorsal horn at spinal segment T10.',
          fourthYearPresentation: 'Patient reports nausea and non-localized central abdominal discomfort starting around the navel.'
        },
        targetedDrug: {
          drugName: 'Intravenous Crystalloids (Lactated Ringer\'s)',
          drugClass: 'Isotonic balanced electrolyte resuscitation',
          mechanismOfAction: 'Restores microvascular capillary bed perfusion pressure and counters third-space fluid sequestration.',
          fourthYearRegimen: 'Bolus 1-2L IV followed by maintenance hydration; maintain strict NPO.'
        }
      },
      {
        id: 'flow-app-2',
        stepNumber: 2,
        title: 'Bacterial Translocation & Somatic Irritation',
        cellularChange: {
          mechanism: 'Epithelial hypoxia causes tight junction breakdown; polymicrobial anaerobic/aerobic wall invasion and neutrophil recruitment.',
          molecularMediator: 'IL-1β, IL-6, TNF-α, Neutrophil Elastase, Matrix Metalloproteinases (MMP-9)',
          firstYearDetail: 'PMNs cross into muscularis propria. Inflammatory exudate extends to serosa, contacting adjacent somatic parietal peritoneum.'
        },
        clinicalSymptom: {
          symptom: 'Sharp, localized Right Lower Quadrant pain with McBurney\'s tenderness and guarding',
          anatomicPathway: 'Somatic sensory A-delta & C fibers in parietal peritoneum (T11-L1 spinal nerves), well-localized somatotopic mapping.',
          fourthYearPresentation: 'Patient walks bent forward, winces when vehicle hits road bumps (Dunphy\'s sign), positive Rovsing and Psoas signs.'
        },
        targetedDrug: {
          drugName: 'Cefoxitin / Cefotetan OR Ceftriaxone + Metronidazole',
          drugClass: 'Cephamycin or 3rd Gen Cephalosporin + Nitroimidazole',
          mechanismOfAction: 'Inhibits bacterial cell wall transpeptidation (E. coli, Klebsiella) and generates DNA-damaging free radicals (B. fragilis).',
          fourthYearRegimen: 'Cefoxitin 2g IV push single dose 30-60 min prior to incision; if allergic: Cipro 400mg IV + Flagyl 500mg IV.'
        }
      },
      {
        id: 'flow-app-3',
        stepNumber: 3,
        title: 'Ischemic Gangrene & Peritoneal Defect',
        cellularChange: {
          mechanism: 'Arteriolar thrombosis of the appendicular end-artery -> transmural coagulative necrosis and structural rupture.',
          molecularMediator: 'Endotoxin (LPS), Caspase-3 mediated cell apoptosis, high lactate',
          firstYearDetail: 'Full thickness loss of appendiceal wall integrity; free spill of colonic bacteria into peritoneal cavity.'
        },
        clinicalSymptom: {
          symptom: 'Diffuse peritoneal rigidity ("washboard abdomen"), high spiking fever, tachycardia, or temporary pain relief followed by severe peritonitis',
          anatomicPathway: 'Generalized somatic peritoneal nociceptor firing across multiple abdominal dermatomes (T7-L1).',
          fourthYearPresentation: 'Systemic Inflammatory Response Syndrome (SIRS): temp >38.5°C, HR >110 bpm, leukocytosis >15,000/µL with left shift (bandemia >10%).'
        },
        targetedDrug: {
          drugName: 'Laparoscopic Appendectomy + Piperacillin-Tazobactam',
          drugClass: 'Definitive Surgical Extirpation + Extended-Spectrum Beta-Lactamase Inhibitor',
          mechanismOfAction: 'Surgically removes the necrotic nidus; Zosyn covers Pseudomonas, Enterobacteriaceae, and anaerobes with peritoneal lavage.',
          fourthYearRegimen: 'Emergent laparoscopy within 12-24 hours; postoperative IV antibiotics continued for 3-5 days in complicated/perforated cases.'
        }
      }
    ],

    citations: [
      {
        id: 'cit-app-1',
        title: 'A Randomized Trial Comparing Antibiotics with Appendectomy for Appendicitis (The CODA Trial)',
        authors: 'CODA Collaborative, Flum DR, Davidson GH, et al.',
        journal: 'New England Journal of Medicine (NEJM)',
        year: 2020,
        pmid: '33017772',
        doi: '10.1056/NEJMoa2014320',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33017772/',
        sourceType: 'Landmark Clinical Trial',
        highYieldTakeaway: 'In 1,552 patients, antibiotics were noninferior to appendectomy at 30 days based on quality of life, but 29% in the antibiotic group underwent appendectomy by 90 days. Patients with appendicolith had an increased risk of complications (41% underwent appendectomy).'
      },
      {
        id: 'cit-app-2',
        title: 'Acute Appendicitis - StatPearls Clinical Compendium',
        authors: 'Jones MW, Lopez RA, Deppen JG',
        journal: 'StatPearls Publishing / National Center for Biotechnology Information (NCBI Bookshelf)',
        year: 2024,
        pmid: '29630245',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK441887/',
        sourceType: 'NIH StatPearls',
        highYieldTakeaway: 'Comprehensive guide on Alvarado score stratification, anatomic variants (retrocecal, pelvic), Doppler ultrasonography criteria (outer diameter >6mm with non-compressibility), and laparoscopic intervention standards.'
      },
      {
        id: 'cit-app-3',
        title: 'Diagnosis and management of acute appendicitis. WSES Jerusalem guidelines',
        authors: 'Di Saverio S, Podda M, De Simone B, et al.',
        journal: 'World Journal of Emergency Surgery (WJES)',
        year: 2020,
        pmid: '32698822',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32698822/',
        sourceType: 'PubMed',
        highYieldTakeaway: 'World Society of Emergency Surgery consensus: Laparoscopic appendectomy is the primary recommended treatment for acute appendicitis; ultrasound first in pediatrics/pregnancy, CT with IV contrast in general adult populations.'
      }
    ]
  },

  {
    id: 'type-2-diabetes',
    name: 'Type 2 Diabetes Mellitus',
    commonName: 'T2DM',
    icd10: 'E11.9',
    organSystem: 'Endocrine / Metabolic',
    bodyRegion: 'Endocrine & Systemic',
    acuity: 'Chronic',
    oneLineSummary: 'Metabolic disorder characterized by peripheral insulin resistance, impaired insulin secretion from progressive pancreatic beta-cell dysfunction, and uninhibited hepatic gluconeogenesis.',
    
    etiology: {
      primaryTrigger: 'Progressive peripheral insulin resistance (skeletal muscle, adipose, liver) combined with relative secretory defect and gradual apoptosis of pancreatic islet beta-cells.',
      epidemiology: 'Affects over 530 million adults globally (~10.5% of world population; >38 million in the US). Strongly correlated with adiposity, visceral obesity, physical inactivity, and advancing age.',
      keyRiskFactors: [
        'Visceral adiposity (Body Mass Index BMI ≥25 kg/m², ≥23 in Asian-Americans; elevated waist circumference)',
        'Physical inactivity and sedentary lifestyle',
        'First-degree relative with T2DM (strong concordance: ~70-90% in monozygotic twins)',
        'High-risk ethnicities (Hispanic/Latino, Black/African American, Asian, Native American, Pacific Islander)',
        'History of Gestational Diabetes Mellitus (GDM) or delivery of an infant >9 lbs (4.1 kg)',
        'Polycystic Ovary Syndrome (PCOS) and Metabolic Syndrome (hypertension, hypertriglyceridemia, low HDL)'
      ],
      geneticOrEnvironmental: 'Complex polygenic inheritance involving over 400 genetic loci (TCF7L2, PPARG, KCNJ11, SLC30A8) interacting with obesogenic environmental triggers (high refined carbohydrate diet, sedentary screen time).',
      firstYearFocus: 'Master insulin receptor tyrosine kinase signaling: IRS-1/2 phosphorylation, PI3K/Akt pathway, and downstream translocation of GLUT4 storage vesicles to the plasma membrane in skeletal myocytes and adipocytes.',
      fourthYearFocus: 'ADA/EASD Clinical Management Guidelines: HbA1c diagnostic cutoffs (≥6.5%), fasting plasma glucose (≥126 mg/dL), 2-hr OGTT (≥200 mg/dL). Comprehensive cardiorenal protection strategies utilizing SGLT2 inhibitors and GLP-1 receptor agonists independent of baseline HbA1c.'
    },

    vindicate: [
      {
        letter: 'V',
        category: 'Vascular',
        roleInDisease: 'T2DM is the quintessential vascular disease. Chronic hyperglycemia causes advanced glycation end-products (AGEs), protein kinase C (PKC) activation, and sorbitol accumulation, creating microvascular disease (retinopathy, nephropathy, neuropathy) and macrovascular disease (atherosclerosis, MI, stroke, peripheral artery disease).',
        highYieldDifferential: ['Atherosclerotic Peripheral Artery Disease (PAD) without DM', 'Hypertensive Nephrosclerosis', 'Hypertensive Retinopathy'],
        clinicalPearl: {
          firstYear: 'AGEs bind RAGE receptors on vascular endothelial cells, upregulating NF-κB, which increases endothelin-1, decreases endothelial nitric oxide synthase (eNOS), and promotes monocyte adhesion.',
          fourthYear: 'In any diabetic patient with microalbuminuria (urine albumin-to-creatinine ratio UACR 30-300 mg/g), initiate an ACE inhibitor, ARB, or SGLT2i immediately to retard progression to end-stage renal disease (ESRD).'
        },
        relevanceScore: 'primary'
      },
      {
        letter: 'I',
        category: 'Infectious',
        roleInDisease: 'Hyperglycemia impairs neutrophil chemotaxis, phagocytosis, and intracellular bactericidal killing. T2DM patients have dramatically increased risk for invasive infections: diabetic foot osteomyelitis, necrotizing fasciitis (Fournier\'s gangrene), malignant otitis externa (Pseudomonas), and mucormycosis (Rhizopus).',
        highYieldDifferential: ['Diabetic Foot Ulcer with secondary osteomyelitis', 'Emphysematous Pyelonephritis', 'Mucormycosis in hyperglycemic state'],
        clinicalPearl: {
          firstYear: 'Hyperosmolarity inhibits complement opsonization and neutrophil diapedesis, paralyzing first-line innate immune defenses.',
          fourthYear: 'In a diabetic with ear drainage and severe deep ear canal pain unresponsive to standard topical drops, evaluate for malignant external otitis caused by Pseudomonas aeruginosa, which can invade the temporal bone.'
        },
        relevanceScore: 'secondary'
      },
      {
        letter: 'N',
        category: 'Neoplastic',
        roleInDisease: 'Hyperinsulinemia and high levels of Insulin-like Growth Factor 1 (IGF-1) exert mitogenic stimulation. T2DM increases risk for pancreatic, colorectal, endometrial, liver, and breast cancers.',
        highYieldDifferential: ['Pancreatic Adenocarcinoma (new-onset diabetes in patient >50 can be herald sign)', 'Endometrial Carcinoma', 'Colorectal Carcinoma'],
        clinicalPearl: {
          firstYear: 'Insulin and IGF-1 cross-activate the Ras/MAPK signaling cascade, stimulating cellular proliferation while inhibiting apoptosis.',
          fourthYear: 'Sudden, unexplained new-onset diabetes or rapidly worsening glycemic control in an elderly patient without family history or weight gain warrants abdominal imaging to exclude occult pancreatic adenocarcinoma.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'D',
        category: 'Degenerative',
        roleInDisease: 'Islet amyloid polypeptide (IAPP / Amylin) aggregates and forms insoluble beta-sheet fibrils within pancreatic islets of Langerhans, causing progressive amyloid degeneration and apoptotic loss of beta-cells.',
        highYieldDifferential: ['Age-related neurodegenerative dementia (often dubbed "Type 3 Diabetes")', 'Diabetic Charcot Neuroarthropathy'],
        clinicalPearl: {
          firstYear: 'Amylin is co-secreted with insulin by beta cells; under hypersecretory stress, monomeric amylin misfolds into cytotoxic oligomers that deposit as Congo-red-positive, apple-green birefringent amyloid.',
          fourthYear: 'Recognize early Charcot arthropathy: an erythematous, warm, edematous rocker-bottom foot in a neuropathic patient, easily misdiagnosed as cellulitis or gout.'
        },
        relevanceScore: 'primary'
      },
      {
        letter: 'I2',
        category: 'Iatrogenic / Idiopathic',
        roleInDisease: 'Medications that induce insulin resistance or impair beta-cell secretion: Systemic glucocorticoids (prednisone, dexamethasone), atypical antipsychotics (olanzapine, clozapine), thiazide diuretics, calcineurin inhibitors (tacrolimus), and statins.',
        highYieldDifferential: ['Steroid-induced Hyperglycemia', 'Antipsychotic-induced Metabolic Syndrome', 'Checkpoint inhibitor (PD-1/CTLA-4) induced auto-destruction'],
        clinicalPearl: {
          firstYear: 'Glucocorticoids induce hepatic enzymes Phosphoenolpyruvate carboxykinase (PEPCK) and Glucose-6-Phosphatase, dramatically stimulating gluconeogenesis while inhibiting GLUT4 translocation.',
          fourthYear: 'Steroid-induced hyperglycemia characteristically spares the fasting morning glucose and spikes dramatically in the afternoon and evening (following diurnal peak of oral prednisone).'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'C',
        category: 'Congenital',
        roleInDisease: 'Monogenic forms of diabetes can mimic young-onset T2DM: Maturity-Onset Diabetes of the Young (MODY, e.g. HNF1A, Glucokinase GCK mutations) or Maternally Inherited Diabetes and Deafness (MIDD, mitochondrial DNA mutations).',
        highYieldDifferential: ['MODY 2 (Glucokinase sensor defect, mild lifelong non-progressive fasting hyperglycemia)', 'MODY 3 (HNF-1α mutation, severe progressive beta-cell dysfunction, exquisite sulfonylurea sensitivity)', 'Neonatal Diabetes (KCNJ11/ABCC8)'],
        clinicalPearl: {
          firstYear: 'Glucokinase serves as the molecular glucose sensor in pancreatic beta cells; heterozygous loss-of-function shifts the threshold for insulin release to a higher blood glucose setpoint.',
          fourthYear: 'Suspect MODY in young patients (<25 yrs), non-obese, autosomal dominant pedigree across 3 consecutive generations, negative islet autoantibodies, and detectable C-peptide.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'A',
        category: 'Autoimmune',
        roleInDisease: 'Must be differentiated from Type 1 Diabetes Mellitus (T1DM) and Latent Autoimmune Diabetes in Adults (LADA). LADA presents in adults >30 often misdiagnosed as T2DM until oral agents fail rapidly.',
        highYieldDifferential: ['Latent Autoimmune Diabetes in Adults (LADA)', 'Type 1 Diabetes Mellitus (T1DM)', 'Autoimmune Polyglandular Syndrome (APS) Type 1 or 2'],
        clinicalPearl: {
          firstYear: 'T1DM/LADA is mediated by autoreactive CD4+ and CD8+ T lymphocytes targeting glutamic acid decarboxylase (GAD65), islet antigen 2 (IA-2), and zinc transporter 8 (ZnT8).',
          fourthYear: 'In any lean adult presumed to have T2DM who progresses to insulin dependence within 1-2 years or has personal/family history of autoimmune thyroiditis, order anti-GAD65 antibodies and fasting C-peptide.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'T',
        category: 'Trauma / Toxic',
        roleInDisease: 'Chronic pancreatitis secondary to chronic alcohol use (toxic) or recurrent necrotizing pancreatitis causes extensive fibro-calcific destruction of both exocrine and endocrine parenchyma (Type 3c Diabetes). Hemochromatosis ("bronze diabetes") produces iron deposition in beta-cells.',
        highYieldDifferential: ['Type 3c Pancreatogenic Diabetes (Chronic calcific pancreatitis)', 'Hereditary Hemochromatosis (HFE C282Y mutation)', 'Post-pancreatectomy diabetes'],
        clinicalPearl: {
          firstYear: 'In pancreatogenic (Type 3c) diabetes, loss of alpha cells leads to concurrent glucagon deficiency, creating high risk for severe, brittle hypoglycemia.',
          fourthYear: 'Suspect hemochromatosis in a patient presenting with new hyperglycemia, bronze skin hyperpigmentation, pseudogout (chondrocalcinosis), and elevated transferrin saturation >45% and ferritin >1000 ng/mL.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'E',
        category: 'Endocrine / Metabolic',
        roleInDisease: 'The core definition: Severe metabolic endocrinopathy. Secondary endocrine causes of insulin antagonism include Cushing\'s syndrome (excess cortisol), Acromegaly (excess Growth Hormone / IGF-1), Pheochromocytoma (excess catecholamines), and Glucagonoma.',
        highYieldDifferential: ['Cushing\'s Syndrome (Hypercortisolemia)', 'Acromegaly (GH/IGF-1 hypersecretion)', 'Pheochromocytoma (Epinephrine/Norepinephrine)', 'Glucagonoma (Necrolytic migratory erythema)'],
        clinicalPearl: {
          firstYear: 'Cortisol stimulates hormone-sensitive lipase in adipose and activates hepatic PEPCK; Growth Hormone antagonizes insulin receptor IRS-1 tyrosine phosphorylation via SOCS3 induction.',
          fourthYear: 'Rule out secondary endocrine causes in patients with resistant hypertension, hypokalemia, facial plethora, buffalo hump, purple abdominal striae, or coarse facial enlargement.'
        },
        relevanceScore: 'primary'
      }
    ],

    pathophysiology: {
      overview: 'Type 2 Diabetes involves DeFronzo\'s "Ominous Octet": 1) Decreased insulin secretion (beta-cell failure), 2) Decreased incretin effect (GLP-1 / GIP resistance), 3) Increased lipolysis (elevated free fatty acids), 4) Increased renal glucose reabsorption (upregulated SGLT2), 5) Decreased muscle glucose uptake (GLUT4 defect), 6) Neurotransmitter dysfunction (altered satiety signaling), 7) Increased hepatic glucose production (uninhibited gluconeogenesis), and 8) Increased glucagon secretion (alpha-cell hyperresponsiveness).',
      cellularProgression: [
        {
          stage: '1. Peripheral Insulin Resistance & Compensatory Hyperinsulinemia',
          cellularEvent: 'Ectopic lipid accumulation (diacylglycerol, ceramides) activates novel protein kinase C (PKC-theta), causing serine/threonine phosphorylation of IRS-1. This blunts downstream PI3K/Akt activation, inhibiting GLUT4 translocation.',
          histology: 'Pancreatic islets demonstrate prominent hyperplastic and hypertrophic beta-cells attempting to compensate for peripheral resistance.'
        },
        {
          stage: '2. Endoplasmic Reticulum (ER) Stress & Islet Amyloid Deposition',
          cellularEvent: 'Chronic hypersecretory demand overloads beta-cell protein folding machinery, activating the Unfolded Protein Response (UPR via PERK, IRE1, ATF6). Amylin misfolds and forms toxic oligomers that perforate beta-cell membranes.',
          histology: 'Progressive deposition of amorphous, pink acellular amyloid within islet architecture; Congo red staining displays characteristic apple-green birefringence under polarized microscopy.'
        },
        {
          stage: '3. Beta-Cell Exhaustion & Apoptosis',
          cellularEvent: 'Prolonged glucotoxicity and lipotoxicity generate reactive oxygen species (ROS), triggering mitochondrial cytochrome c release and caspase-9/3 activation, driving selective beta-cell apoptosis (~50% loss at clinical diagnosis).',
          histology: 'Severe reduction in islet density; remaining islets are atrophic, heavily sclerosed, and replaced by dense amyloid and interstitial collagen.'
        },
        {
          stage: '4. Chronic End-Organ Microvascular & Macrovascular Complications',
          cellularEvent: 'Excess intracellular glucose shunted to Polyol (aldose reductase -> sorbitol -> fructose, depleting NADPH and glutathione), Hexosamine (UDP-GlcNAc), and AGE pathways, resulting in endothelial basement membrane thickening and pericyte loss.',
          histology: 'Kidneys show diffuse mesangial matrix expansion and pathognomonic nodular glomerulosclerosis (Kimmelstiel-Wilson lesions); retina displays microaneurysms and cotton-wool spots.'
        }
      ],
      histopathologySummary: 'Hallmarks: Islet amyloid deposition (IAPP/amylin), beta-cell reduction with preserved alpha-cells. In kidneys: thickened glomerular basement membrane (GBM) and PAS-positive nodular mesangial expansion (Kimmelstiel-Wilson nodules).',
      firstYearFocus: 'Biochemistry: Hexokinase IV (Glucokinase) in beta-cells has high Km (~10 mM) and no product inhibition by G6P, functioning as a metabolic rate-limiter. Glycolysis generates ATP, which closes ATP-sensitive potassium channels (K-ATP: Kir6.2/SUR1), depolarizing the membrane and opening L-type voltage-gated Ca2+ channels, triggering insulin exocytosis.',
      fourthYearFocus: 'Recognize Hyperosmolar Hyperglycemic State (HHS): Severe hyperglycemia (>600 mg/dL), serum osmolality >320 mOsm/kg, dehydration (average 9-10L deficit), altered sensorium, but MINIMAL OR ABSENT KETOACIDOSIS (because trace residual basal insulin is sufficient to suppress adipose lipolysis, unlike in T1DM).'
    },

    clinicalPresentation: {
      classicPresentation: 'Often insidious and entirely asymptomatic for 4 to 7 years prior to diagnosis. When symptomatic, patients present with the classic "3 Ps" (Polyuria, Polydipsia, Polyphagia), fatigue, blurred vision (due to osmotic changes in the crystalline lens), and slow-healing skin or fungal infections (vulvovaginal candidiasis).',
      cardinalSymptoms: [
        'Polyuria (osmotic diuresis once serum glucose exceeds renal threshold of ~180 mg/dL)',
        'Polydipsia (secondary to hyperosmolar state stimulating hypothalamic thirst center)',
        'Polyphagia (cellular starvation despite circulating hyperglycemia due to lack of intracellular glucose transport)',
        'Unintentional weight loss (advanced catabolic state with glycosuria)',
        'Blurred vision (hyperglycemia-induced sorbitol accumulation swelling lens curvature)',
        'Recurrent fungal/bacterial infections (candidal balanitis, vulvovaginitis, tinea pedis)'
      ],
      physicalExamSigns: [
        {
          signName: 'Acanthosis Nigricans',
          maneuverOrFinding: 'Hyperpigmented, velvety, papillomatous plaques located in the axillae, posterior neck (nape), groin, and knuckles.',
          mechanism: 'Hyperinsulinemia cross-activates Insulin-like Growth Factor 1 (IGF-1) receptors on dermal fibroblasts and epidermal keratinocytes.',
          diagnosticValue: 'High specificity for profound peripheral insulin resistance.'
        },
        {
          signName: 'Diabetic Peripheral Neuropathy (10-g Monofilament / 128-Hz Tuning Fork)',
          maneuverOrFinding: 'Loss of protective light touch sensation using Semmes-Weinstein 10-g monofilament at plantar surfaces; impaired vibratory sense at great toe distal IP joint.',
          mechanism: 'Length-dependent distal symmetric polyneuropathy ("stocking-glove" pattern) due to microvascular endoneurial ischemia and sorbitol nerve toxicity.',
          diagnosticValue: 'Sensitivity: ~85% for predicting diabetic foot ulceration risk.'
        },
        {
          signName: 'Diabetic Retinopathy (Dilated Fundoscopy)',
          maneuverOrFinding: 'Microaneurysms, dot-and-blot hemorrhages, hard exudates (lipid deposits), and cotton-wool spots (nerve fiber layer infarctions).',
          mechanism: 'Retinal capillary pericyte apoptosis, endothelial proliferation, and VEGF overexpression in response to retinal ischemia.',
          diagnosticValue: 'Leading cause of preventable adult blindness in working-age individuals.'
        },
        {
          signName: 'Orthostatic Hypotension & Resting Tachycardia',
          maneuverOrFinding: 'Drop in systolic BP ≥20 mmHg or diastolic BP ≥10 mmHg upon standing without appropriate baroreceptor compensation, or fixed resting heart rate >90-100 bpm.',
          mechanism: 'Diabetic Autonomic Neuropathy (DAN) affecting vagal and sympathetic cardiac innervation.',
          diagnosticValue: 'Predicts high 5-year cardiovascular mortality.'
        }
      ],
      atypicalPresentations: [
        'Completely asymptomatic presentation discovered on routine screening BMP or lipid panel.',
        'Initial presentation with severe Hyperosmolar Hyperglycemic State (HHS) precipitated by infection (pneumonia, UTI) or steroid therapy.',
        'Severe, non-healing foot ulcer or gangrene without any preceding pain due to sensory neuropathy.',
        'Diabetic amyotrophy: acute, asymmetric, severe proximal lower extremity pain and weakness (quadriceps wasting).'
      ],
      firstYearFocus: 'The renal threshold for glucose is ~180 mg/dL (10 mmol/L). When tubular fluid glucose exceeds the transport maximum (TmG ~375 mg/min) of SGLT2 and SGLT1, unreabsorbed glucose acts as an osmotic diuretic in the collecting ducts.',
      fourthYearFocus: 'Diagnostic criteria (requires 2 abnormal test results from same sample or 2 separate test samples): 1) Fasting Plasma Glucose (FPG) ≥126 mg/dL (7.0 mmol/L) after 8h fast; OR 2) HbA1c ≥6.5% (48 mmol/mol); OR 3) 2-hour 75g Oral Glucose Tolerance Test (OGTT) ≥200 mg/dL (11.1 mmol/L); OR 4) Random glucose ≥200 mg/dL in a patient with classic hyperglycemic crisis.'
    },

    treatment: {
      firstLineMedical: [
        {
          drug: 'Metformin (Biguanide)',
          class: 'Biguanides (AMP-activated protein kinase activator)',
          dosingConcept: 'Start 500mg PO daily with meals, titrate to 1000mg PO BID (max 2000-2550 mg/day)',
          rationale: 'Activates AMPK, inhibits hepatic mitochondrial glycerophosphate dehydrogenase (mGPD), suppresses hepatic gluconeogenesis, increases peripheral insulin sensitivity without hypoglycemia or weight gain. Check eGFR; contraindicated if eGFR <30 mL/min due to lactic acidosis risk.'
        },
        {
          drug: 'SGLT2 Inhibitors (Empagliflozin, Dapagliflozin)',
          class: 'Sodium-Glucose Cotransporter 2 Inhibitors',
          dosingConcept: 'Empagliflozin 10-25mg PO once daily in morning',
          rationale: 'Inhibits SGLT2 in renal proximal convoluted tubule, inducing glucosuria (~70g/day) and natriuresis. Proven to reduce Heart Failure hospitalization, progression of Chronic Kidney Disease (CKD), and cardiovascular death independent of glycemic efficacy.'
        },
        {
          drug: 'GLP-1 Receptor Agonists (Semaglutide, Tirzepatide [dual GIP/GLP-1])',
          class: 'Incretin Mimetics (GLP-1 RA / Dual Incretin)',
          dosingConcept: 'Semaglutide 0.25mg subQ weekly, titrate to 0.5mg -> 1.0mg -> 2.0mg weekly',
          rationale: 'Potentiates glucose-dependent insulin secretion, suppresses inappropriate glucagon secretion, delays gastric emptying, promotes central hypothalamic satiety with marked weight loss (10-20%) and major adverse cardiovascular event (MACE) reduction.'
        }
      ],
      surgicalOrDefinitive: 'Metabolic / Bariatric Surgery (Roux-en-Y Gastric Bypass or Sleeve Gastrectomy): Recommended by ADA in individuals with BMI ≥35 kg/m² (or ≥30 kg/m² with poorly controlled diabetes). Achieves complete remission or dramatic improvement of T2DM in >70% of patients through rapid weight loss and dramatic neurohormonal gut shifts (immediate post-op surges in GLP-1, PYY, and bile acids).',
      supportiveCare: [
        'Medical Nutrition Therapy (MNT): Mediterranean or DASH dietary pattern, reduction in refined carbohydrates and sugar-sweetened beverages.',
        'Structured Physical Activity: At least 150 minutes/week of moderate-to-vigorous aerobic exercise combined with 2-3 sessions of resistance training.',
        'Continuous Glucose Monitoring (CGM) or self-monitoring blood glucose (SMBG) to achieve Time-in-Range (TIR >70%).',
        'Comprehensive ABCDE screening: A1c (<7% for most non-pregnant adults), Blood Pressure (<130/80 mmHg), Cholesterol (high-intensity statin if age 40-75 with ASCVD risk), Diet/Exercise, Eye exam (annual dilated fundoscopy), Foot exam (annual monofilament).'
      ],
      clinicalGuidelines: [
        {
          organization: 'ADA Standards of Care in Diabetes (2025/2026)',
          recommendation: 'First-line pharmacotherapy includes Metformin and comprehensive lifestyle. In patients with established ASCVD, Heart Failure (HFrEF/HFpEF), or CKD, initiate an SGLT2 inhibitor and/or GLP-1 RA with proven cardiorenal benefit regardless of whether HbA1c is at target.'
        },
        {
          organization: 'KDIGO 2024 Clinical Practice Guideline for Diabetes Management in CKD',
          recommendation: 'Treat patients with T2DM, CKD (eGFR ≥20), and albuminuria with an SGLT2 inhibitor and an ACEi or ARB at maximally tolerated doses, plus nonsteroidal mineralocorticoid receptor antagonist (Finerenone) if albuminuria persists.'
        }
      ],
      firstYearFocus: 'Pharmacology: SGLT2 cotransporters in segment S1 of the proximal tubule reabsorb ~90% of filtered glucose in a 1:1 stoichiometry with sodium. Blocking SGLT2 increases distal sodium delivery to the macula densa, restoring tubuloglomerular feedback, constricting afferent arterioles, and reducing hyperfiltration intraglomerular pressure.',
      fourthYearFocus: 'Avoid Metformin in severe sepsis, acute kidney injury (AKI), or hypoperfusion states due to lactic acidosis risk. Warn patients on SGLT2i about Euglycemic Diabetic Ketoacidosis (euDKA) and mycotic genital infections. Stop SGLT2i 3-4 days before scheduled major elective surgery.'
    },

    flowchart: [
      {
        id: 'flow-t2d-1',
        stepNumber: 1,
        title: 'Receptor Resistance & Hepatic Gluconeogenesis',
        cellularChange: {
          mechanism: 'Intracellular diacylglycerol accumulation triggers PKC-theta to phosphorylate IRS-1 serine residues, preventing PI3K recruitment.',
          molecularMediator: 'Serine-phosphorylated IRS-1, elevated PEPCK and Glucose-6-Phosphatase transcription via FoxO1',
          firstYearDetail: 'Uninhibited FoxO1 translocates to nucleus, continuously transcribing gluconeogenic enzymes despite elevated circulating insulin.'
        },
        clinicalSymptom: {
          symptom: 'Fasting Hyperglycemia and Acanthosis Nigricans',
          anatomicPathway: 'Persistent hepatic glucose output elevates fasting plasma glucose >126 mg/dL; excess insulin stimulates epidermal IGF-1 receptors.',
          fourthYearPresentation: 'Elevated morning fasting fingerstick glucose, dark velvety skin changes over skin folds, central visceral adiposity.'
        },
        targetedDrug: {
          drugName: 'Metformin',
          drugClass: 'Biguanide (AMPK Activator)',
          mechanismOfAction: 'Inhibits complex I of mitochondrial respiratory chain -> increases AMP:ATP ratio -> activates AMPK -> suppresses FoxO1 and gluconeogenesis.',
          fourthYearRegimen: 'Titrate from 500mg PO daily to 1000mg PO BID with meals; check eGFR annually (reduce dose if eGFR 30-44, discontinue if <30).'
        }
      },
      {
        id: 'flow-t2d-2',
        stepNumber: 2,
        title: 'Glucosuria & Renal Hyperfiltration',
        cellularChange: {
          mechanism: 'Circulating glucose exceeds tubular reabsorptive capacity (~180 mg/dL); filtered glucose overloads proximal convoluted tubule.',
          molecularMediator: 'SGLT2 (SLC5A2) and SGLT1 upregulation; impaired tubuloglomerular feedback',
          firstYearDetail: 'Low sodium delivery to macula densa dilates afferent arteriole, raising intraglomerular capillary hydrostatic pressure and damaging podocytes.'
        },
        clinicalSymptom: {
          symptom: 'Polyuria, Polydipsia, and Microalbuminuria',
          anatomicPathway: 'Unreabsorbed glucose exerts intraluminal osmotic pull, causing water diuresis; glomerular hyperfiltration leads to progressive nephron sclerosis.',
          fourthYearPresentation: 'Frequent nocturia, severe thirst, elevated Urine Albumin-to-Creatinine Ratio (UACR >30 mg/g).'
        },
        targetedDrug: {
          drugName: 'Empagliflozin / Dapagliflozin',
          drugClass: 'SGLT2 Inhibitor',
          mechanismOfAction: 'Selectively blocks SGLT2 cotransporters, excreting 60-80g glucose/day; restores macula densa tubuloglomerular feedback and reduces glomerular pressure.',
          fourthYearRegimen: '10mg PO once daily; proven cardiorenal protection in CKD and Heart Failure regardless of ejection fraction.'
        }
      },
      {
        id: 'flow-t2d-3',
        stepNumber: 3,
        title: 'Beta-Cell Exhaustion & Amylin Cytotoxicity',
        cellularChange: {
          mechanism: 'Chronic hypersecretory stress triggers ER unfolded protein response; amylin monomer oligomerization forms toxic pore-forming amyloid.',
          molecularMediator: 'Islet Amyloid Polypeptide (IAPP), Caspase-3, CHOP (C/EBP homologous protein)',
          firstYearDetail: 'Pro-apoptotic transcription factor CHOP initiates beta-cell apoptosis, decreasing functional endocrine mass by >50%.'
        },
        clinicalSymptom: {
          symptom: 'Refractory Postprandial Hyperglycemia, Rapid Catabolism, and Elevated HbA1c',
          anatomicPathway: 'Lack of pulsatile first-phase and second-phase insulin release permits profound post-meal glycemic spikes (>200 mg/dL).',
          fourthYearPresentation: 'Rising HbA1c >9.0% despite dual oral therapy; symptomatic catabolism with unintentional weight loss.'
        },
        targetedDrug: {
          drugName: 'Semaglutide / Tirzepatide (or Basal Insulin Glargine)',
          drugClass: 'GLP-1 RA / Dual GIP-GLP-1 Agonist',
          mechanismOfAction: 'Activates beta-cell GLP-1 receptors -> increases cAMP/PKA -> augments glucose-dependent insulin secretion and protects beta-cells from ER stress.',
          fourthYearRegimen: 'Semaglutide 0.5-2.0mg subQ weekly; if HbA1c remains >10%, add basal insulin glargine starting at 10 units or 0.1-0.2 units/kg.'
        }
      }
    ],

    citations: [
      {
        id: 'cit-t2d-1',
        title: 'Standards of Care in Diabetes—2025/2026',
        authors: 'American Diabetes Association (ADA) Professional Practice Committee',
        journal: 'Diabetes Care',
        year: 2025,
        pmid: '38085127',
        doi: '10.2337/dc24-S001',
        url: 'https://pubmed.ncbi.nlm.nih.gov/38085127/',
        sourceType: 'CDC / WHO Guideline',
        highYieldTakeaway: 'Landmark management standard: Early combination therapy with cardioprotective agents (SGLT2 inhibitors and GLP-1 RAs) is recommended in high-risk patients with ASCVD, HF, or CKD regardless of baseline HbA1c.'
      },
      {
        id: 'cit-t2d-2',
        title: 'Type 2 Diabetes - Pathophysiology and Clinical Management',
        authors: 'Goyal R, Singhal M, Jialal I',
        journal: 'StatPearls Publishing / NCBI Bookshelf',
        year: 2024,
        pmid: '30020625',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK513253/',
        sourceType: 'NIH StatPearls',
        highYieldTakeaway: 'Comprehensive review of the "Ominous Octet", diagnostic cutoffs (HbA1c ≥6.5%, FPG ≥126 mg/dL), microvascular vs macrovascular disease biology, and prevention of hyperosmolar hyperglycemic state (HHS).'
      },
      {
        id: 'cit-t2d-3',
        title: 'Effects of Intensive Blood-Glucose Control with Metformin on Complications in Overweight Patients with Type 2 Diabetes (UKPDS 34)',
        authors: 'UK Prospective Diabetes Study (UKPDS) Group',
        journal: 'The Lancet',
        year: 1998,
        pmid: '9742977',
        doi: '10.1016/S0140-6736(98)07019-6',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9742977/',
        sourceType: 'Landmark Clinical Trial',
        highYieldTakeaway: 'Landmark trial demonstrating that intensive glucose control with Metformin decreased diabetes-related endpoints by 32%, diabetes-related death by 42%, and all-cause mortality by 36% compared with conventional dietary therapy.'
      }
    ]
  },

  {
    id: 'stemi-myocardial-infarction',
    name: 'ST-Elevation Myocardial Infarction (STEMI)',
    commonName: 'STEMI / Acute Coronary Syndrome',
    icd10: 'I21.3',
    organSystem: 'Cardiovascular',
    bodyRegion: 'Thorax & Precordium',
    acuity: 'Acute',
    oneLineSummary: 'Complete transmural acute occlusion of an epicardial coronary artery, typically caused by atherosclerotic plaque rupture and supervening occlusive thrombus.',
    
    etiology: {
      primaryTrigger: 'Rupture or erosion of an unstable, thin-cap fibroatheroma (TCFA) in a coronary artery, exposing subendothelial collagen and von Willebrand factor to platelets and precipitating occlusive thrombus.',
      epidemiology: 'Affects over 750,000 individuals annually in the US. Leading cause of morbidity and sudden cardiac death globally.',
      keyRiskFactors: [
        'Dyslipidemia (elevated ApoB, LDL-C, low HDL)',
        'Hypertension and cigarette smoking (endothelial shear stress and oxidative injury)',
        'Diabetes mellitus (coronary microvascular dysfunction and advanced glycation)',
        'Family history of premature CAD (males <55 yrs, females <65 yrs)'
      ],
      geneticOrEnvironmental: 'Polygenic risk involving PCSK9, LDLR, 9p21 locus combined with Western diet, sedentary lifestyle, and psychosocial stress.',
      firstYearFocus: 'Biochemistry of cardiac biomarkers (cardiac Troponin I/T and CK-MB release kinetics) and coronary anatomy (LAD supplying anterior 2/3 of septum; RCA supplying SA/AV nodes and inferior wall).',
      fourthYearFocus: 'Door-to-balloon time goal <90 minutes for primary percutaneous coronary intervention (PCI), or door-to-needle time <30 minutes for fibrinolytic therapy (Alteplase/Tenecteplase) if PCI transfer >120 min.'
    },

    vindicate: [
      {
        letter: 'V',
        category: 'Vascular',
        roleInDisease: 'Primary vascular event: Acute coronary artery thrombosis leading to transmural ischemia of ventricular myocardium.',
        highYieldDifferential: ['Aortic Dissection (Stanford Type A involving right coronary ostium)', 'Coronary Vasospasm (Prinzmetal Angina)', 'Spontaneous Coronary Artery Dissection (SCAD)'],
        clinicalPearl: {
          firstYear: 'Myocyte contraction ceases within 60 seconds of ischemia; irreversible coagulative necrosis begins after 20-30 minutes.',
          fourthYear: 'Always rule out acute aortic dissection prior to giving antiplatelets, heparin, or fibrinolytics (check bilateral arm blood pressures and chest X-ray for widened mediastinum).'
        },
        relevanceScore: 'primary'
      },
      {
        letter: 'I',
        category: 'Infectious',
        roleInDisease: 'Acute viral or bacterial pericarditis/myocarditis can present with severe chest pain and diffuse ST elevations mimicking STEMI.',
        highYieldDifferential: ['Acute Pericarditis (Coxsackie B, Echo, Parvovirus B19)', 'Infective Endocarditis with septic coronary embolus'],
        clinicalPearl: {
          firstYear: 'Pericarditis produces PR depression and diffuse, upward concave ST elevation across almost all leads, with reciprocal ST depression in aVR.',
          fourthYear: 'Pericarditic chest pain is sharp, pleuritic, and dramatically improves when leaning forward, unlike the crushing pressure of myocardial infarction.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'N',
        category: 'Neoplastic',
        roleInDisease: 'Cardiac metastasis (melanoma, lung, breast) or mediastinal tumors compressing coronary arteries or inducing malignant pericardial effusion.',
        highYieldDifferential: ['Cardiac Myxoma (left atrial embolization)', 'Mediastinal Lymphoma compressing LCA'],
        clinicalPearl: {
          firstYear: 'Left atrial myxomas are characterized by gelatinous, glycosaminoglycan-rich stroma and can produce "tumor plop" on auscultation.',
          fourthYear: 'Suspect cardiac myxoma in a young patient presenting with stroke or embolization plus systemic symptoms (fevers, weight loss, elevated ESR).'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'D',
        category: 'Degenerative',
        roleInDisease: 'Longstanding calcific fibrocalcific atherosclerosis and calcific aortic stenosis causing severe myocardial supply/demand mismatch.',
        highYieldDifferential: ['Severe Calcific Aortic Stenosis with exertional angina', 'Hypertrophic Cardiomyopathy (HCM)'],
        clinicalPearl: {
          firstYear: 'Concentric left ventricular hypertrophy increases wall tension (Laplace\'s law: T = P*r/2h), compressing subendocardial arterioles during systole.',
          fourthYear: 'Do NOT administer nitroglycerin to patients with severe aortic stenosis or hypertrophic cardiomyopathy, as preload reduction causes catastrophic syncope.'
        },
        relevanceScore: 'secondary'
      },
      {
        letter: 'I2',
        category: 'Iatrogenic / Idiopathic',
        roleInDisease: 'Acute stent thrombosis after cessation of dual antiplatelet therapy (DAPT), coronary artery bypass graft (CABG) spasm, or Takotsubo cardiomyopathy ("broken heart syndrome").',
        highYieldDifferential: ['Subacute In-Stent Thrombosis', 'Takotsubo Cardiomyopathy (Apical ballooning syndrome)'],
        clinicalPearl: {
          firstYear: 'Takotsubo is driven by excessive sympathetic surge and catecholamine toxicity causing microvascular spasm and myocardial stunning.',
          fourthYear: 'If a patient underwent stent placement 2 weeks ago and presents with STEMI after stopping clopidogrel, the diagnosis is catastrophic acute stent thrombosis.'
        },
        relevanceScore: 'primary'
      },
      {
        letter: 'C',
        category: 'Congenital',
        roleInDisease: 'Anomalous origin of left coronary artery from pulmonary artery (ALCAPA / Bland-White-Garland syndrome) or myocardial bridging.',
        highYieldDifferential: ['ALCAPA Syndrome', 'Myocardial Bridging with systolic compression'],
        clinicalPearl: {
          firstYear: 'In ALCAPA, pulmonary artery pressures drop postnatally, causing retrograde steal of oxygenated blood away from myocardium into the pulmonary circulation.',
          fourthYear: 'Sudden cardiac death in a young competitive athlete during exertion warrants evaluation for anomalous coronary origin or HCM.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'A',
        category: 'Autoimmune',
        roleInDisease: 'Vasculitis of the coronary vessels: Kawasaki disease in pediatrics (coronary artery aneurysms), Takayasu arteritis, or Polyarteritis Nodosa (PAN).',
        highYieldDifferential: ['Kawasaki Disease coronary aneurysm thrombosis', 'Takayasu Arteritis of aortic root', 'Systemic Lupus Erythematosus (Libman-Sacks endocarditis)'],
        clinicalPearl: {
          firstYear: 'Kawasaki disease is a necrotizing vasculitis of medium-sized arteries with predilection for coronary vessels.',
          fourthYear: 'Give IVIG and high-dose aspirin immediately in Kawasaki disease to prevent coronary aneurysm formation.'
        },
        relevanceScore: 'differential-ruleout'
      },
      {
        letter: 'T',
        category: 'Trauma / Toxic',
        roleInDisease: 'Cocaine or methamphetamine abuse (intense alpha-1 adrenergic coronary vasoconstriction and platelet aggregation) or blunt cardiac contusion (steering wheel trauma).',
        highYieldDifferential: ['Cocaine-Induced Coronary Vasospasm & MI', 'Myocardial Contusion'],
        clinicalPearl: {
          firstYear: 'Cocaine blocks reuptake of norepinephrine and dopamine at presynaptic terminals and blocks fast sodium channels.',
          fourthYear: 'AVOID pure beta-blockers in acute cocaine-induced myocardial ischemia to prevent unopposed alpha-1 stimulation that worsens coronary spasm; administer benzodiazepines and nitroglycerin.'
        },
        relevanceScore: 'primary'
      },
      {
        letter: 'E',
        category: 'Endocrine / Metabolic',
        roleInDisease: 'Familial Hypercholesterolemia (FH: LDLR, PCSK9 mutation) producing tendon xanthomas and premature myocardial infarction before age 30; Severe Thyrotoxicosis causing high-output ischemia.',
        highYieldDifferential: ['Homozygous/Heterozygous Familial Hypercholesterolemia', 'Thyrotoxic storm with myocardial ischemia'],
        clinicalPearl: {
          firstYear: 'Homozygous FH lacks functional LDL receptors, causing plasma LDL >500 mg/dL and atherosclerosis in early adolescence.',
          fourthYear: 'Screen family members and initiate high-potency statins plus Ezetimibe and PCSK9 inhibitors (Evolocumab) early.'
        },
        relevanceScore: 'secondary'
      }
    ],

    pathophysiology: {
      overview: 'Rupture of vulnerable plaque -> exposure of subendothelial collagen and tissue factor -> platelet adhesion (GP Ia/IIa, Ib-IX) and activation -> thromboxane A2 and ADP release -> fibrin cross-linking (GP IIb/IIIa) -> complete coronary occlusion -> cessation of aerobic glycolysis within seconds -> depletion of ATP and intracellular acidosis -> intracellular calcium overload -> irreversible cell death (after 20-30 min) spreading wave-like from subendocardium to subepicardium.',
      cellularProgression: [
        {
          stage: '0 - 4 hours (Early Ischemia)',
          cellularEvent: 'Depletion of glycogen reserves, mitochondrial swelling, membrane blebbing, potassium efflux, and sodium/calcium influx.',
          histology: 'Minimal light microscopic changes; wavy myocardial fibers at borders of ischemic zone.'
        },
        {
          stage: '4 - 24 hours (Coagulative Necrosis)',
          cellularEvent: 'Nuclear pyknosis, karyorrhexis, and karyolysis; enzyme leakage (troponin and CK-MB release into circulation).',
          histology: 'Early coagulative necrosis, contraction band necrosis (if reperfused), early neutrophil infiltration, edema.'
        },
        {
          stage: '1 - 3 days (Peak Inflammation)',
          cellularEvent: 'Dense neutrophilic infiltration to digest necrotic cardiomyocytes; risk of fibrinous pericarditis.',
          histology: 'Extensive coagulative necrosis with loss of nuclei and striations, interstitial infiltration of neutrophils.'
        },
        {
          stage: '3 - 7 days (Macrophage Infiltration & Tissue Softening)',
          cellularEvent: 'Macrophages phagocytose necrotic debris; structural wall is at its weakest mechanical strength, creating peak risk for free wall rupture, interventricular septal defect, or papillary muscle rupture.',
          histology: 'Disintegration of dead fibers, abundant macrophages, early capillary sprout formation at margins.'
        }
      ],
      histopathologySummary: 'Wavefront phenomenon: necrosis starts in the subendocardium (highest metabolic demand and intramyocardial pressure) and spreads to become transmural over 4-6 hours unless reperfused.',
      firstYearFocus: 'Contraction band necrosis occurs upon reperfusion when influx of extracellular calcium hyper-contracts remaining myofibrils into dense eosinophilic bands.',
      fourthYearFocus: 'Identify mechanical complications at days 3-7: New holosystolic murmur with pulmonary edema = Papillary muscle rupture (posteromedial papillary muscle supplied solely by PDA); Sudden hypotension with jugular venous distention and electrical alternans = Free wall rupture with cardiac tamponade.'
    },

    clinicalPresentation: {
      classicPresentation: 'Crushing, substernal retrosternal chest pressure ("elephant sitting on my chest") radiating to the left arm, neck, or jaw, accompanied by diaphoresis, dyspnea, nausea, and lightheadedness, lasting >20 minutes and not relieved by rest or sublingual nitroglycerin.',
      cardinalSymptoms: [
        'Crushing substernal retrosternal pressure / tight squeezing',
        'Radiation to left arm, ulnar nerve distribution, neck, or jaw',
        'Profuse cold diaphoresis (sympathetic nervous surge)',
        'Dyspnea / air hunger (due to elevated left ventricular end-diastolic pressure)',
        'Nausea and lightheadedness (frequently prominent in inferior wall MI due to vagal stimulation / Bezold-Jarisch reflex)'
      ],
      physicalExamSigns: [
        {
          signName: 'Levine\'s Sign',
          maneuverOrFinding: 'Patient clenches a fist over the sternum when describing the chest discomfort.',
          mechanism: 'Universal somatosensory gesture expressing deep visceral ischemic pressure.',
          diagnosticValue: 'Classic clinical sign of ischemic cardiac pain.'
        },
        {
          signName: 'S4 Gallop (Atrial Gallop)',
          maneuverOrFinding: 'Low-frequency presystolic heart sound heard best with the bell of the stethoscope at the cardiac apex in left lateral decubitus.',
          mechanism: 'Atria contracting against a non-compliant, stiff ischemic left ventricle.',
          diagnosticValue: 'Very common in acute acute ischemia.'
        },
        {
          signName: 'New Holosystolic Murmur at Apex',
          maneuverOrFinding: 'Blowing holosystolic murmur radiating to the left axilla.',
          mechanism: 'Acute mitral regurgitation from ischemia or rupture of papillary muscle.',
          diagnosticValue: 'Emergent sign of mechanical catastrophe; requires urgent surgical consult.'
        }
      ],
      atypicalPresentations: [
        'Diabetic patients: "Silent MI" without chest pain due to sensory autonomic neuropathy; presents with isolated shortness of breath or fatigue.',
        'Elderly patients: sudden unexplained delirium, acute heart failure, or syncope.',
        'Females: frequent presentation with indigestion, nausea, fatigue, or interscapular back discomfort rather than classic substernal pressure.'
      ],
      firstYearFocus: 'Innervation: Visceral cardiac afferents travel along middle and inferior cervical and thoracic sympathetic cardiac nerves to enter spinal cord segments T1-T4, referring pain to corresponding dermatomes (left medial arm, axilla, precordium).',
      fourthYearFocus: 'ECG Localization: Anterior/Septal (LAD) = V1-V4; Lateral (LCx) = I, aVL, V5-V6; Inferior (RCA) = II, III, aVF. In inferior STEMI, obtain Right-Sided ECG (V4R) to check for Right Ventricular Infarction. In RV infarction, PRELOAD DEPENDENCE is critical: DO NOT give Nitroglycerin, Morphine, or Diuretics; give IV fluid boluses!'
    },

    treatment: {
      firstLineMedical: [
        {
          drug: 'Aspirin (Chewed) + P2Y12 Inhibitor (Ticagrelor or Prasugrel)',
          class: 'Dual Antiplatelet Therapy (DAPT)',
          dosingConcept: 'Aspirin 325mg non-enteric chewed immediately + Ticagrelor 180mg loading dose',
          rationale: 'Irreversibly inhibits COX-1 (thromboxane A2) and blocks ADP P2Y12 receptors to halt propagation of coronary arterial thrombus.'
        },
        {
          drug: 'Unfractionated Heparin (UFH)',
          class: 'Anticoagulant (Antithrombin III activator)',
          dosingConcept: '60 units/kg IV bolus (max 4000 units) followed by 12 units/kg/hr infusion, target aPTT 50-70 seconds',
          rationale: 'Accelerates antithrombin III inhibition of factors IIa (thrombin) and Xa, preventing re-occlusion during PCI.'
        },
        {
          drug: 'High-Intensity Statin (Atorvastatin 80mg)',
          class: 'HMG-CoA Reductase Inhibitor',
          dosingConcept: '80mg PO once daily initiated prior to catheterization',
          rationale: 'Exerts pleiotropic plaque-stabilizing, anti-inflammatory, and endothelial-protective effects within hours.'
        }
      ],
      surgicalOrDefinitive: 'Primary Percutaneous Coronary Intervention (PCI): Emergent balloon angioplasty and drug-eluting stent (DES) placement in cardiac catheterization lab. Goal: Door-to-balloon time ≤90 minutes from first medical contact. If transfer time to PCI center exceeds 120 minutes, administer IV fibrinolytics (Tenecteplase) within 30 minutes unless contraindicated.',
      supportiveCare: [
        'Supplemental Oxygen ONLY if SaO2 <90% (routine hyperoxia increases coronary vascular resistance and infarct size).',
        'Sublingual Nitroglycerin 0.4mg q5min (up to 3 doses) for ischemic discomfort; CONTRAINDICATED if SBP <90, HR <50, RV infarction, or phosphodiesterase-5 inhibitor (Sildenafil) use within 24-48 hrs.',
        'Oral Beta-Blocker (Metoprolol tartrate) initiated within 24 hours if hemodynamically stable without signs of cardiogenic shock.'
      ],
      clinicalGuidelines: [
        {
          organization: 'ACC/AHA Guidelines for STEMI Management',
          recommendation: 'Emergency coronary angiography and primary PCI is the reperfusion treatment of choice (Door-to-Balloon <90 minutes).'
        },
        {
          organization: 'ESC European Society of Cardiology STEMI Guidelines',
          recommendation: 'Dual antiplatelet therapy (Aspirin + potent P2Y12 inhibitor) maintained for minimum 12 months after drug-eluting stent placement.'
        }
      ],
      firstYearFocus: 'Pharmacology: Aspirin irreversibly acetylates serine 529 on platelet COX-1, permanently disabling thromboxane A2 synthesis for the 8-10 day lifespan of the anucleate platelet.',
      fourthYearFocus: 'Post-MI Discharge Meds Checklist ("BASH"): B = Beta-blocker, A = ACE-inhibitor/ARB (reduces LV remodeling), S = Statin (high-intensity), H = Heparin/antiplatelets (DAPT: Aspirin + P2Y12 inhibitor).'
    },

    flowchart: [
      {
        id: 'flow-stemi-1',
        stepNumber: 1,
        title: 'Atheromatous Plaque Rupture',
        cellularChange: {
          mechanism: 'Macrophage metalloproteinases degrade fibrous cap; subendothelial collagen is exposed to circulating blood.',
          molecularMediator: 'Tissue Factor, von Willebrand factor, Thromboxane A2, ADP',
          firstYearDetail: 'Platelet glycoprotein Ib binds vWF; GP IIb/IIIa receptors undergo conformational activation to bind fibrinogen.'
        },
        clinicalSymptom: {
          symptom: 'Sudden onset substernal chest pressure with cold diaphoresis',
          anatomicPathway: 'Sympathetic hyperactivity stimulates eccrine sweat glands via acetylcholine, visceral cardiac nerves to T1-T4.',
          fourthYearPresentation: 'Crushing 10/10 substernal pressure, diaphoresis, pallor, elevated blood pressure.'
        },
        targetedDrug: {
          drugName: 'Aspirin (chewed) + Ticagrelor',
          drugClass: 'Dual Antiplatelet Therapy (COX-1 Inhibitor + P2Y12 Antagonist)',
          mechanismOfAction: 'Inhibits thromboxane A2 synthesis and blocks ADP-mediated platelet GP IIb/IIIa activation.',
          fourthYearRegimen: 'Chew Aspirin 325mg non-enteric + Ticagrelor 180mg PO loading dose immediately.'
        }
      },
      {
        id: 'flow-stemi-2',
        stepNumber: 2,
        title: 'Transmural Ischemia & Potassium Efflux',
        cellularChange: {
          mechanism: 'Complete coronary occlusion causes cessation of oxidative phosphorylation; failure of Na+/K+ ATPase leads to extracellular K+ accumulation.',
          molecularMediator: 'ATP depletion, lactate accumulation, extracellular hyperkalemia',
          firstYearDetail: 'Creates a voltage gradient between depolarized ischemic myocardium and normal tissue, altering phase 2/3 action potential.'
        },
        clinicalSymptom: {
          symptom: 'ST-Segment Elevation on 12-Lead ECG & Progressive Dyspnea',
          anatomicPathway: 'Injury current vector directed toward epicardium produces ST elevation in leads looking directly at the infarct.',
          fourthYearPresentation: 'Convex "tombstone" ST elevations ≥1 mm in two contiguous limb leads or ≥2 mm in precordial leads; reciprocal depressions.'
        },
        targetedDrug: {
          drugName: 'Unfractionated Heparin (UFH)',
          drugClass: 'Anticoagulant',
          mechanismOfAction: 'Binds antithrombin III, accelerating inactivation of thrombin (IIa) and factor Xa to prevent thrombus extension.',
          fourthYearRegimen: '60 units/kg IV bolus (max 4000 U) followed by 12 U/kg/hr drip; titrate to aPTT 50-70 seconds.'
        }
      },
      {
        id: 'flow-stemi-3',
        stepNumber: 3,
        title: 'Microvascular Reflow & Reperfusion',
        cellularChange: {
          mechanism: 'Mechanical displacement of occlusive thrombus and deployment of metal stent scaffold to restore epicardial flow.',
          molecularMediator: 'Restoration of mitochondrial oxidative phosphorylation; washout of anaerobic metabolites',
          firstYearDetail: 'Risk of reperfusion injury mediated by reactive oxygen species (ROS) and calcium overload.'
        },
        clinicalSymptom: {
          symptom: 'Rapid resolution of chest pain and >50% ST-segment reduction',
          anatomicPathway: 'Restoration of myocardial perfusion terminates ischemic nociception.',
          fourthYearPresentation: 'TIMI grade 3 flow established in culprit vessel; resolution of ST elevations on continuous telemetry.'
        },
        targetedDrug: {
          drugName: 'Primary Percutaneous Coronary Intervention (PCI) + Statin',
          drugClass: 'Endovascular Mechanical Revascularization + HMG-CoA Reductase Inhibitor',
          mechanismOfAction: 'Drug-eluting stent (everolimus/zotarolimus) prevents vessel recoil and neointimal hyperplasia; Atorvastatin stabilizes endothelium.',
          fourthYearRegimen: 'Balloon angioplasty with DES within 90 minutes of first medical contact; Atorvastatin 80mg PO daily.'
        }
      }
    ],

    citations: [
      {
        id: 'cit-stemi-1',
        title: '2023 ESC Guidelines for the management of acute coronary syndromes',
        authors: 'Byrne RA, Rossello X, Coughlan JJ, et al.',
        journal: 'European Heart Journal',
        year: 2023,
        pmid: '37622654',
        doi: '10.1093/eurheartj/ehad191',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37622654/',
        sourceType: 'PubMed',
        highYieldTakeaway: 'Immediate angiography and primary PCI recommended for STEMI within 12 hours of symptom onset (door-to-balloon <90 min); potent P2Y12 inhibitors (Prasugrel/Ticagrelor) preferred over clopidogrel.'
      },
      {
        id: 'cit-stemi-2',
        title: 'Acute Myocardial Infarction - StatPearls Clinical Guide',
        authors: 'Lu L, Liu M, Sun R, et al.',
        journal: 'StatPearls / NCBI Bookshelf',
        year: 2024,
        pmid: '29489249',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK537076/',
        sourceType: 'NIH StatPearls',
        highYieldTakeaway: 'Defines diagnostic criteria, lead groupings for coronary territory, cardiac troponin release curves, and management of cardiogenic shock.'
      }
    ]
  }
];
