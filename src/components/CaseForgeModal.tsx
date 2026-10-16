import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface CaseForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  diseaseTitle: string;
}

export const CaseForgeModal: React.FC<CaseForgeModalProps> = ({
  isOpen,
  onClose,
  diseaseTitle
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [stage, setStage] = useState<number>(1);
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const [socraticFeedback, setSocraticFeedback] = useState<string | null>(null);

  const [customHypothesis, setCustomHypothesis] = useState<string>('');
  const [customHypothesisFeedback, setCustomHypothesisFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCustomHypothesisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHypothesis.trim()) return;
    const lower = customHypothesis.toLowerCase();
    if (lower.includes('appendic') || lower.includes('appendix')) {
      setCustomHypothesisFeedback('✓ High-yield clinical alignment: Acute Appendicitis is indeed the primary surgical differential given migratory pain, anorexia, and peritoneal signs. Now determine next surgical step.');
      setStage(2);
    } else if (lower.includes('meckel') || lower.includes('divertic') || lower.includes('adenitis') || lower.includes('crohn')) {
      setCustomHypothesisFeedback(`✓ Valid differential thinking: "${customHypothesis}" is an important VINDICATE differential to hold until imaging or laparoscopy confirms the primary etiology.`);
    } else {
      setCustomHypothesisFeedback(`Socratic analysis of "${customHypothesis}": Consider how the classic migratory sequence (periumbilical T10 -> RLQ parietal peritoneum) and anorexia constrain the differential.`);
    }
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDecision = (idx: number, feedback: string, nextStage?: number) => {
    setSelectedDecision(idx);
    setSocraticFeedback(feedback);
    if (nextStage) {
      setTimeout(() => {
        setStage(nextStage);
        setSelectedDecision(null);
        setSocraticFeedback(null);
      }, 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Top bar with Board Mode Timer */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Case Forge: Virtual Patient Triage
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                  Socratic Sandbox
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Synthetic case linked to verified {diseaseTitle} library
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{formatTime(seconds)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Case Progression Flow */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Patient Stem */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
              Case Presentation:
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif-medical">
              "A 19-year-old male arrives in the emergency department at 02:00 AM. He woke up 14 hours ago with periumbilical abdominal cramping that has progressively intensified and shifted to his right lower quadrant. He states: 'Every bump in the car ride on the way here felt like a knife.' He vomited once after the pain worsened. Vital signs: Temperature 38.1°C (100.6°F), Pulse 102 bpm, BP 118/76 mmHg, SpO2 99%."
            </p>
          </div>

          {/* Socratic Free-Text Diagnostic Hypothesis Input */}
          <form onSubmit={handleCustomHypothesisSubmit} className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <label className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Enter Your Working Diagnosis or Clinical Differential:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customHypothesis}
                onChange={(e) => setCustomHypothesis(e.target.value)}
                placeholder="Type your differential (e.g. Acute Appendicitis, Meckel Diverticulum, Mesenteric Adenitis)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-indigo-200 dark:border-indigo-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
              <button
                type="submit"
                disabled={!customHypothesis.trim()}
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-40 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Submit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {customHypothesisFeedback && (
              <div className="mt-2.5 text-xs text-indigo-950 dark:text-indigo-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 animate-fade-in flex items-start justify-between gap-2">
                <span>{customHypothesisFeedback}</span>
                <button
                  type="button"
                  onClick={() => setCustomHypothesisFeedback(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>

          {/* STAGE 1: PHYSICAL EXAM CHOICE */}
          {stage === 1 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
                Step 1: Best Initial Examination Maneuver
              </h4>

              <div className="space-y-2">
                {[
                  {
                    text: 'Perform forceful deep palpation directly over the Right Lower Quadrant to verify rebound immediately',
                    feedback: 'Socratic Check: Palpating the tender quadrant forcefully first triggers patient guarding and invalidates the rest of your abdominal examination!',
                    correct: false
                  },
                  {
                    text: 'Ask the patient where the pain is worst, begin gentle light palpation in the LLQ (away from pain), and test for Dunphy\'s sign (voluntary cough)',
                    feedback: 'Excellent bedside technique: Starting far from pain and assessing cough tenderness preserves patient trust while confirming localized somatic peritoneal irritation.',
                    correct: true,
                    next: 2
                  },
                  {
                    text: 'Order an immediate upright abdominal radiograph without touching the patient',
                    feedback: 'Socratic Check: Plain abdominal X-rays have very poor sensitivity for appendicitis and delay essential physical exam triage.',
                    correct: false
                  }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDecision(idx, opt.feedback, opt.next)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                      selectedDecision === idx
                        ? opt.correct
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                          : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-100'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 2: DIAGNOSTIC & IMAGING CHOICE */}
          {stage === 2 && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200">
                ✓ Physical exam confirms McBurney\'s point tenderness, positive Rovsing\'s sign, and involuntary guarding. Alvarado score is calculated at 8/10.
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                Step 2: Diagnostic & Preoperative Protocol
              </h4>

              <div className="space-y-2">
                {[
                  {
                    text: 'Place strict NPO, start IV Lactated Ringer\'s resuscitation, draw CBC/electrolytes, administer single pre-op dose of Cefoxitin 2g IV, and request emergent surgical consult for Laparoscopic Appendectomy',
                    feedback: 'Gold standard surgical emergency triage! Alvarado score ≥8 with peritoneal signs in a young male justifies direct surgical consult with preoperative broad-spectrum prophylaxis.',
                    correct: true,
                    next: 3
                  },
                  {
                    text: 'Give a trial of oral ciprofloxacin and discharge home with 48h outpatient primary care follow-up',
                    feedback: 'Dangerous discharge! The patient has fever, leukocytosis, and peritoneal signs indicating high risk of gangrenous perforation within hours.',
                    correct: false
                  }
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDecision(idx, opt.feedback, opt.next)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                      selectedDecision === idx
                        ? opt.correct
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                          : 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-100'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 3: RESOLUTION & DEBRIEF */}
          {stage === 3 && (
            <div className="space-y-3 animate-fade-in text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold font-serif-medical text-slate-900 dark:text-white">
                Case Successfully Solved!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                The patient underwent an uneventful laparoscopic appendectomy within 4 hours. Pathology confirmed acute transmural suppurative appendicitis with mucosal ulceration and fecalith obstruction. Discharged home post-op day 1.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setStage(1);
                    setSeconds(0);
                    setSelectedDecision(null);
                    setSocraticFeedback(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart Case Simulation
                </button>
              </div>
            </div>
          )}

          {/* Socratic Feedback Notice */}
          {socraticFeedback && (
            <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed animate-fade-in">
              <span className="font-bold block mb-0.5">Socratic Clinical Reasoning:</span>
              {socraticFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
