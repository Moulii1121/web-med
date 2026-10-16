import React, { useState } from 'react';
import { 
  Layers, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Activity, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles,
  Info,
  ChevronRight,
  Stethoscope,
  Heart,
  Eye
} from 'lucide-react';
import { QubitsDiseaseEntry } from '../types/disease';

export type AnatomicalLayer = 'skin' | 'muscle' | 'organs' | 'skeleton' | 'vessels_nerves';

interface BodySimulationStudioProps {
  entry: QubitsDiseaseEntry;
  onSelectRegion?: (region: string) => void;
}

export const BodySimulationStudio: React.FC<BodySimulationStudioProps> = ({
  entry,
  onSelectRegion
}) => {
  const [activeLayer, setActiveLayer] = useState<AnatomicalLayer>('organs');
  const [selectedOrganId, setSelectedOrganId] = useState<string>('appendix');
  const [severityLevel, setSeverityLevel] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [stimulusActive, setStimulusActive] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Anatomical Organs & Regions Data Model
  const anatomicalEntities = [
    {
      id: 'appendix',
      name: 'Vermiform Appendix / Cecum',
      region: 'Right Lower Quadrant Abdomen',
      layer: 'organs',
      x: 320,
      y: 290,
      pathology: 'Luminal obstruction leading to bacterial proliferation, ischemia, and transmural gangrene.',
      referredPain: 'Initially T10 periumbilical dermatome via visceral sympathetic afferents, shifting to localized somatic RLQ parietal peritoneum (McBurney point).',
      triggers: ['Fecalith / Coprolith', 'Lymphoid Hyperplasia', 'Foreign Body'],
      severityAnimation: {
        mild: 'Mucosal hyperemia and mild distension (diameter 6-7 mm)',
        moderate: 'Transmural neutrophil infiltration, wall thickening (> 7 mm), periappendiceal fat stranding',
        severe: 'Micro-perforation, transmural gangrene, free extraluminal appendicolith or localized abscess'
      }
    },
    {
      id: 'gallbladder',
      name: 'Gallbladder & Biliary Tree',
      region: 'Epigastrium & RUQ',
      layer: 'organs',
      x: 310,
      y: 230,
      pathology: 'Cystic duct impaction with bile stasis, mucosal ischemia, and chemical/bacterial cholecystitis.',
      referredPain: 'Right Upper Quadrant radiating to right scapula / inferior tip of right scapula (via phrenic nerve and T7-T9 spinal nerves).',
      triggers: ['Cholelithiasis', 'Fatty Meal Trigger', 'Prolonged Fasting'],
      severityAnimation: {
        mild: 'Biliary colic without mural edema or systemic fever',
        moderate: 'Calculous cholecystitis, gallbladder hydrops, Murphy sign positive, wall > 3 mm',
        severe: 'Emphysematous cholecystitis, gangrenous perforation, biliary peritonitis'
      }
    },
    {
      id: 'heart',
      name: 'Myocardium & Coronary Arteries',
      region: 'Thorax & Precordium',
      layer: 'organs',
      x: 285,
      y: 165,
      pathology: 'Atherosclerotic plaque rupture with acute thrombosis resulting in subendocardial or transmural ischemia.',
      referredPain: 'Substernal chest pressure radiating to left arm (inner aspect), neck, jaw, or epigastrium (T1-T4 cardiac sympathetic afferents).',
      triggers: ['Physical Exertion', 'Cold Exposure', 'Sympathomimetic Stimulants'],
      severityAnimation: {
        mild: 'Stable angina on exertion; subendocardial demand ischemia without necrosis',
        moderate: 'NSTEMI; subendocardial coagulative necrosis; elevated troponin; T-wave inversions',
        severe: 'Transmural STEMI; cardiogenic shock, papillary muscle rupture, or lethal arrhythmia'
      }
    },
    {
      id: 'lungs',
      name: 'Bronchopulmonary & Pleura',
      region: 'Thorax & Precordium',
      layer: 'organs',
      x: 240,
      y: 155,
      pathology: 'Alveolar consolidation, microvascular thrombosis, or hyperreactive airway constriction.',
      referredPain: 'Pleuritic chest pain localized to chest wall; diaphragmatic pleura referral to shoulder tip (C3-C5 phrenic).',
      triggers: ['Allergens / Dust', 'Respiratory Syncytial / Viral Infection', 'Venous Stasis'],
      severityAnimation: {
        mild: 'Mild wheeze or non-pleuritic dry cough; oxygen saturation > 95%',
        moderate: 'Segmental consolidation, pleuritic rub, tachypnea (RR 22-26), SpO2 91-94%',
        severe: 'Acute Respiratory Distress Syndrome (ARDS), severe V/Q mismatch, SpO2 < 88%'
      }
    },
    {
      id: 'pancreas',
      name: 'Pancreas & Retroperitoneum',
      region: 'Epigastrium & RUQ',
      layer: 'organs',
      x: 290,
      y: 220,
      pathology: 'Premature intra-acinar trypsinogen activation causing autodigestion, microvascular leakage, and fat necrosis.',
      referredPain: 'Epigastric pain boring through directly to the mid-back (T5-T9 splanchnic nerves), partially relieved by leaning forward.',
      triggers: ['Alcohol Surge', 'Gallstone Migration', 'Severe Hypertriglyceridemia'],
      severityAnimation: {
        mild: 'Interstitial edematous pancreatitis without organ failure',
        moderate: 'Necrotizing pancreatitis with transient organ failure (< 48 hrs)',
        severe: 'Infected pancreatic necrosis with persistent multisystem organ failure'
      }
    },
    {
      id: 'brain',
      name: 'Cerebrovascular & Meninges',
      region: 'Central Nervous System',
      layer: 'organs',
      x: 285,
      y: 65,
      pathology: 'Meningeal irritation, subarachnoid hemorrhage, or focal thromboembolic occlusion.',
      referredPain: 'Sudden thunderclap occipital headache or diffuse holo-cranial throbbing with photophobia.',
      triggers: ['Valsalva Strain', 'Uncontrolled Hypertension', 'Nasopharyngeal Colonization'],
      severityAnimation: {
        mild: 'Tension headache or transient aura without meningismus',
        moderate: 'Nuchal rigidity, Kernig/Brudzinski signs, cranial nerve palsy',
        severe: 'Uncal herniation, blown pupil, Cushing reflex, coma'
      }
    }
  ];

  const currentOrgan = anatomicalEntities.find(o => o.id === selectedOrganId) || anatomicalEntities[0];

  const layerTitles: Record<AnatomicalLayer, string> = {
    skin: '1. Integumentary (Skin / Dermis)',
    muscle: '2. Musculoskeletal (Muscle Wall)',
    organs: '3. Visceral Organs (Cardiopulmonary / GI)',
    skeleton: '4. Skeletal (Thorax / Spine / Pelvis)',
    vessels_nerves: '5. Neurovascular (Arteries & Nerves)'
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-850">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Interactive Body-Part Simulation</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              5 Anatomical Strata • Referred Pain Mapping
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif-medical text-slate-900 dark:text-white">
            Human Anatomical & Pathophysiology Simulation
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mt-0.5">
            Explore 5 anatomical strata from skin to deep neurovasculature. Click organs to inspect referred pain patterns, trigger cascades, and animated severity changes.
          </p>
        </div>

        {/* Severity Slider for Pathophysiology Animation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Acuity:
          </span>
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {(['mild', 'moderate', 'severe'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityLevel(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  severityLevel === sev
                    ? sev === 'mild' ? 'bg-emerald-600 text-white' : sev === 'moderate' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {(['skin', 'muscle', 'organs', 'skeleton', 'vessels_nerves'] as AnatomicalLayer[]).map((layer) => {
          const isActive = activeLayer === layer;
          return (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{layerTitles[layer]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Viewport (Canvas + Deep Clinical Insight Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive 2D/3D Body Canvas */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[440px]">
          {/* Top Canvas Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-teal-300 text-[11px] font-mono font-bold border border-teal-800/60 backdrop-blur-md">
              Layer: {activeLayer.toUpperCase()} • Severity: {severityLevel.toUpperCase()}
            </span>

            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRotationAngle(r => (r + 45) % 360)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                title="Rotate 45°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(z => Math.min(z + 0.15, 1.6))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomScale(z => Math.max(z - 0.15, 0.7))}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Anatomical Mannequin with Hotspots */}
          <div 
            className="w-full max-w-[380px] h-[380px] transition-transform duration-500 relative flex items-center justify-center"
            style={{ 
              transform: `scale(${zoomScale}) rotate(${rotationAngle}deg)`,
              transformOrigin: 'center center'
            }}
          >
            <svg viewBox="0 0 560 480" className="w-full h-full select-none">
              {/* Silhouette Body Framework */}
              <g className="text-slate-800 fill-current opacity-80">
                {/* Head */}
                <ellipse cx="280" cy="65" rx="36" ry="42" fill="#1E293B" stroke="#334155" strokeWidth="2" />
                {/* Neck */}
                <rect x="264" y="104" width="32" height="22" rx="4" fill="#1E293B" />
                {/* Torso */}
                <path d="M 220,126 L 340,126 L 325,320 L 235,320 Z" fill="#1E293B" stroke="#334155" strokeWidth="2" />
                {/* Arms */}
                <path d="M 220,130 L 175,230 L 190,235 L 225,150 Z" fill="#1E293B" />
                <path d="M 340,130 L 385,230 L 370,235 L 335,150 Z" fill="#1E293B" />
                {/* Legs */}
                <path d="M 235,320 L 225,460 L 255,460 L 270,320 Z" fill="#1E293B" />
                <path d="M 290,320 L 305,460 L 335,460 L 325,320 Z" fill="#1E293B" />
              </g>

              {/* Layer Specific Graphic Overlays */}
              {activeLayer === 'skeleton' && (
                <g stroke="#94A3B8" strokeWidth="1.5" fill="none" opacity="0.6">
                  {/* Ribcage */}
                  <ellipse cx="280" cy="170" rx="45" ry="30" />
                  <ellipse cx="280" cy="195" rx="48" ry="32" />
                  <ellipse cx="280" cy="220" rx="42" ry="28" />
                  {/* Spine */}
                  <line x1="280" y1="110" x2="280" y2="310" strokeDasharray="3,3" />
                  {/* Pelvic girdle */}
                  <path d="M 240,290 Q 280,310 320,290" />
                </g>
              )}

              {activeLayer === 'vessels_nerves' && (
                <g stroke="#EF4444" strokeWidth="1.5" fill="none" opacity="0.7">
                  {/* Aorta & Iliac */}
                  <path d="M 280,160 L 280,270 L 255,340" />
                  <path d="M 280,270 L 305,340" />
                  {/* Vena Cava */}
                  <path d="M 272,160 L 272,270" stroke="#3B82F6" strokeWidth="2" />
                </g>
              )}

              {/* Interactive Organ Nodes */}
              {anatomicalEntities.map((organ) => {
                const isSelected = selectedOrganId === organ.id;
                const isPrimaryForDisease = organ.name.toLowerCase().includes(entry.system.toLowerCase()) || 
                                           entry.regions.some(r => r.toLowerCase().includes(organ.region.toLowerCase().slice(0, 8)));
                
                return (
                  <g 
                    key={organ.id}
                    onClick={() => {
                      setSelectedOrganId(organ.id);
                      if (onSelectRegion) onSelectRegion(organ.region);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Heatmap Ring */}
                    <circle
                      cx={organ.x}
                      cy={organ.y}
                      r={isSelected ? 22 : 16}
                      fill={severityLevel === 'severe' ? '#EF4444' : severityLevel === 'moderate' ? '#F59E0B' : '#10B981'}
                      fillOpacity={isSelected ? 0.35 : 0.18}
                      className={isSelected ? 'animate-ping' : ''}
                    />

                    {/* Core Hotspot Marker */}
                    <circle
                      cx={organ.x}
                      cy={organ.y}
                      r={isSelected ? 10 : 7}
                      fill={isSelected ? '#3DD6D0' : '#14B8A6'}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="group-hover:scale-125 transition-transform"
                    />

                    {/* Label Tag */}
                    <text
                      x={organ.x}
                      y={organ.y - 12}
                      textAnchor="middle"
                      fill="#E2E8F0"
                      fontSize="9px"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-sm font-sans"
                    >
                      {organ.name.split('/')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Hotspot Quick Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-2 text-[11px] max-w-full no-scrollbar z-10">
            {anatomicalEntities.map((organ) => (
              <button
                key={organ.id}
                onClick={() => setSelectedOrganId(organ.id)}
                className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedOrganId === organ.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {organ.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Pathophysiology & Referred Pain Breakdown Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold uppercase">
                  Region: {currentOrgan.region}
                </span>
                <h3 className="text-lg font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
                  {currentOrgan.name}
                </h3>
              </div>
            </div>

            {/* Pathophysiology at Current Severity Level */}
            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>Pathophysiology at {severityLevel.toUpperCase()} Acuity:</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  {currentOrgan.severityAnimation[severityLevel]}
                </p>
              </div>

              {/* Referred-Pain Patterns */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Neuroanatomical Referred Pain Pattern:</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  {currentOrgan.referredPain}
                </p>
              </div>

              {/* Clinical Stimuli & Triggers */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Stimulus & Trigger Sensitivity:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentOrgan.triggers.map((trig, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800 text-[11px]"
                    >
                      ⚡ {trig}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
