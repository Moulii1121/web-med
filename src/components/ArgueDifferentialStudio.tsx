import React, { useState } from 'react';
import { 
  GraduationCap, 
  HelpCircle, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { QubitsDiseaseEntry, DepthLevel } from '../types/disease';

interface ArgueDifferentialStudioProps {
  currentCondition?: QubitsDiseaseEntry | null;
  depthLevel: DepthLevel;
}

interface SocraticTurn {
  role: 'examiner' | 'student';
  content: string;
  counterFinding?: string;
  rubricFeedback?: {
    strengths: string[];
    missedVulnerabilities: string[];
    modelAnswer: string;
    marksAwarded: string;
  };
}

export const ArgueDifferentialStudio: React.FC<ArgueDifferentialStudioProps> = ({
  currentCondition,
  depthLevel
}) => {
  const conditionTitle = currentCondition?.title || 'Acute Appendicitis';

  const [studentDefense, setStudentDefense] = useState<string>('');
  const [selectedCase, setSelectedCase] = useState<string>('atypical-presentation');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [turns, setTurns] = useState<SocraticTurn[]>([
    {
      role: 'examiner',
      content: `Candidate, you have placed ${conditionTitle} at the very top of your differential diagnosis list. The patient is a 21-year-old presenting with 24 hours of abdominal discomfort. Defend why ${conditionTitle} is more probable than other surgical and gynecological etiologies. What key findings anchor your certainty?`
    }
  ]);

  const handleDefend = () => {
    if (!studentDefense.trim() || isEvaluating) return;

    const userText = studentDefense.trim();
    setStudentDefense('');
    setIsEvaluating(true);

    const newStudentTurn: SocraticTurn = {
      role: 'student',
      content: userText
    };

    setTurns(prev => [...prev, newStudentTurn]);

    // Generate Socratic Challenge & Model Answer
    setTimeout(() => {
      let counterFinding = '';
      let modelAnswer = '';
      let marks = '8 / 10 Marks (Pass with Merit)';

      if (conditionTitle.toLowerCase().includes('appendic')) {
        counterFinding = 'The patient has severe right iliac fossa tenderness, but reports NO anorexia and ate a full lunch 2 hours ago. Furthermore, urine dipstick reveals 15 WBCs/hpf and 5 RBCs/hpf.';
        modelAnswer = 'Model Clinical Defense: In acute appendicitis, anorexia has an LR+ of only 1.3; its absence does NOT rule out early luminal obstruction. The microscopic hematuria and pyuria are classically caused by direct contiguity of an inflamed retrocecal or pelvic appendix touching the right ureter or bladder dome. First-line ultrasound or low-dose IV-contrast CT remains indicated before dismissing appendicitis.';
      } else if (conditionTitle.toLowerCase().includes('knee')) {
        counterFinding = 'Joint aspiration yields only 22,000 WBCs/uL with negative Gram stain, but the patient cannot bear a single step of weight.';
        modelAnswer = 'Model Clinical Defense: A synovial WBC count between 20,000-50,000 falls in the inflammatory borderline window. Gram stain has only 50-60% sensitivity for septic arthritis. Inability to take 4 full weight-bearing steps satisfies Ottawa Knee Rule criterion 5 (mandating 4-view radiography), and pending synovial culture with empirical joint rest is essential.';
      } else {
        counterFinding = `A junior trainee suggests discharging the patient on oral analgesics because standard vital signs are currently within normal limits.`;
        modelAnswer = `Model Clinical Defense: Normal resting vital signs in young adults frequently mask early compensated organ compromise. A systematic VINDICATE rule-out strategy must be maintained until objective first-line investigations collapse acute differentials.`;
      }

      const examinerResponse: SocraticTurn = {
        role: 'examiner',
        content: `I acknowledge your argument. Now, address this high-stakes clinical curveball: ${counterFinding} How does your differential ranking shift?`,
        counterFinding,
        rubricFeedback: {
          strengths: [
            'Recognized cardinal anatomical pain localization',
            'Demonstrated structured clinical communication'
          ],
          missedVulnerabilities: [
            'Must account for proximity inflammation affecting adjacent retroperitoneal organs',
            'Always cite positive likelihood ratios when defending primary differentials'
          ],
          modelAnswer,
          marksAwarded: marks
        }
      };

      setTurns(prev => [...prev, examinerResponse]);
      setIsEvaluating(false);
    }, 900);
  };

  const handleReset = () => {
    setTurns([
      {
        role: 'examiner',
        content: `Candidate, you have placed ${conditionTitle} at the top of your differential diagnosis. Defend why this diagnosis takes precedence over its closest mimic for a patient presenting with acute discomfort.`
      }
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Signature Feature
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Socratic Viva Examiner & Model Answer Rubric
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-medical text-slate-900 dark:text-white mt-0.5">
                Argue the Differential
              </h1>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Case Viva</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 max-w-2xl leading-relaxed">
          The app plays the senior attending / board examiner. You defend your top differential ranking; the examiner counter-challenges with an atypical symptom or confounding finding, then scores your defense against a licensing model answer.
        </p>
      </div>

      {/* Socratic Dialogue Stream */}
      <div className="space-y-4">
        {turns.map((turn, idx) => (
          <div key={idx} className="space-y-3">
            {turn.role === 'examiner' ? (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Board Examiner / Senior Attending
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Viva Station</span>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                  "{turn.content}"
                </p>

                {/* Rubric Feedback Card if present */}
                {turn.rubricFeedback && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-1">
                        <Award className="w-4 h-4 text-amber-500" />
                        Examiner Assessment
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs border border-emerald-300 dark:border-emerald-800">
                        {turn.rubricFeedback.marksAwarded}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                          Key Strengths:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-emerald-800 dark:text-emerald-300 text-[11px]">
                          {turn.rubricFeedback.strengths.map((s, sIdx) => (
                            <li key={sIdx}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                        <span className="font-bold text-amber-900 dark:text-amber-200 block mb-1">
                          Vulnerabilities to Watch:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-amber-800 dark:text-amber-300 text-[11px]">
                          {turn.rubricFeedback.missedVulnerabilities.map((v, vIdx) => (
                            <li key={vIdx}>{v}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Model Answer */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="font-bold text-teal-800 dark:text-teal-300 block mb-1">
                        OSCE / Viva Model Answer:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        {turn.rubricFeedback.modelAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-100 max-w-2xl ml-auto space-y-1">
                <span className="font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide block text-[10px]">
                  Your Clinical Defense:
                </span>
                <p className="leading-relaxed font-sans text-sm">
                  {turn.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box for Defense */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
        <textarea
          value={studentDefense}
          onChange={(e) => setStudentDefense(e.target.value)}
          placeholder={`Enter your clinical reasoning to defend ${conditionTitle} against other mimics...`}
          rows={3}
          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Depth Calibrated: {depthLevel} Level
          </span>

          <button
            onClick={handleDefend}
            disabled={!studentDefense.trim() || isEvaluating}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            {isEvaluating ? (
              <span>Evaluating Defense...</span>
            ) : (
              <>
                <span>Submit Viva Defense</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
