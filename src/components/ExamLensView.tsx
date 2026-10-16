import React, { useState } from 'react';
import { 
  GraduationCap, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  Layers, 
  ListChecks, 
  BookMarked,
  FileText,
  Clock
} from 'lucide-react';
import { ExamLensData } from '../types/disease';

interface ExamLensViewProps {
  examData: ExamLensData;
}

export const ExamLensView: React.FC<ExamLensViewProps> = ({ examData }) => {
  const [activeTab, setActiveTab] = useState<'sba' | 'saq' | 'viva' | 'osce' | 'curriculum'>('sba');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [osceChecked, setOsceChecked] = useState<Record<number, boolean>>({});

  const toggleOsce = (idx: number) => {
    setOsceChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const [studentSaqAnswer, setStudentSaqAnswer] = useState<string>('');
  const [showSaqEvaluation, setShowSaqEvaluation] = useState<boolean>(false);

  const allRequiredKeywords = examData.answer_skeleton.flatMap(s => s.requiredKeywords);
  const matchedKeywords = allRequiredKeywords.filter(kw => 
    studentSaqAnswer.toLowerCase().includes(kw.toLowerCase())
  );
  const saqScore = Math.min(10, Math.round((matchedKeywords.length / (allRequiredKeywords.length || 1)) * 10));

  const sampleSba = examData.sample_stems[0];
  const totalOscePoints = examData.osce_checklist.reduce((sum, item) => sum + item.points, 0);
  const earnedOscePoints = examData.osce_checklist.reduce(
    (sum, item, idx) => (osceChecked[idx] ? sum + item.points : sum),
    0
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 md:p-6 mb-8 transition-colors">
      {/* Header and Provenance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wide">
              Module E: Exam Lens
            </span>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              {examData.frequency_tier}
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif-medical text-slate-900 dark:text-white mt-1">
            Standardized Assessment Engine
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Tested patterns across USMLE, NMC CBME, and UK MLA with marking schemes and viva ladders.
          </p>
        </div>

        {/* Provenance Badge */}
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 max-w-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200 block text-[11px]">Provenance:</span>
          {examData.provenance}
        </div>
      </div>

      {/* Exam Format Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('sba')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'sba'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>SBA / USMLE Vignette</span>
        </button>

        <button
          onClick={() => setActiveTab('saq')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'saq'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>5-10 Mark SAQ Marking Scheme</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'viva'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3-Step Viva Ladder</span>
        </button>

        <button
          onClick={() => setActiveTab('osce')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'osce'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          <span>OSCE Checklist Station</span>
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Curriculum Codes</span>
        </button>
      </div>

      {/* 1. SBA VIGNETTE TAB */}
      {activeTab === 'sba' && sampleSba && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{sampleSba.pattern}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Timed: 90s</span>
            </div>
            <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-serif-medical">
              {sampleSba.stem}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {sampleSba.options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = sampleSba.correctOptionIndex === idx;

              let btnStyle = 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
              if (showAnswer) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200';
              }

              return (
                <button
                  key={idx}
                  disabled={showAnswer}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {showAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                  {showAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-slate-500">
              {selectedOption === null ? 'Select an answer to reveal high-yield explanation' : ''}
            </span>
            {!showAnswer ? (
              <button
                disabled={selectedOption === null}
                onClick={() => setShowAnswer(true)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-40"
              >
                Submit & Reveal Answer
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setShowAnswer(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Try Again
              </button>
            )}
          </div>

          {/* Explanation Box */}
          {showAnswer && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  Detailed Diagnostic Explanation:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {sampleSba.explanation}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-850 text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                  Distractor Trap Analysis:
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  {sampleSba.keyDistractorAnalysis}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. 5-10 MARK SAQ MARKING SCHEME TAB */}
      {activeTab === 'saq' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">University & Royal College Standard: </span>
              Short Answer Question (SAQ)
            </div>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">Total: 10 Marks</span>
          </div>

          {/* Student Answer Writing Coach Input Area */}
          <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border-2 border-indigo-200 dark:border-indigo-800/80 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                Student Answer Writing Coach (Draft your response):
              </span>
              <span className="font-mono text-slate-500 text-[11px]">
                {studentSaqAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              value={studentSaqAnswer}
              onChange={(e) => setStudentSaqAnswer(e.target.value)}
              placeholder="Type your draft answer here (e.g. Define acute appendicitis, explain fecalith obstruction, note T10 dermatome pain, list McBurney and Rovsing signs, and specify pre-op antibiotics and laparoscopic appendectomy)..."
              rows={4}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2.5">
              <span className="text-[11px] text-slate-500">
                Hit keywords from: Definition, Aetiology, Pathophysiology, Presentation, Investigations, Management
              </span>
              <div className="flex gap-2">
                {studentSaqAnswer && (
                  <button
                    onClick={() => {
                      setStudentSaqAnswer('');
                      setShowSaqEvaluation(false);
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100"
                  >
                    Clear
                  </button>
                )}
                <button
                  disabled={!studentSaqAnswer.trim()}
                  onClick={() => setShowSaqEvaluation(true)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-40"
                >
                  Evaluate My Keywords & Score
                </button>
              </div>
            </div>

            {/* Keyword Evaluation Outcome */}
            {showSaqEvaluation && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Simulated Examiner Score:
                  </span>
                  <span className="font-mono text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {saqScore} / 10 Marks ({matchedKeywords.length} keywords matched)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                  {allRequiredKeywords.filter(k => !studentSaqAnswer.toLowerCase().includes(k.toLowerCase())).slice(0, 5).map((missing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200"
                    >
                      Missing: {missing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {examData.answer_skeleton.map((section, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {section.section}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    [{section.typicalMarks} Mark{section.typicalMarks > 1 ? 's' : ''}]
                  </span>
                </div>

                {/* Mandatory Keywords */}
                <div className="mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Examiner Required Keywords (Marking Criteria):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {section.requiredKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Model Points */}
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 mt-2">
                  {section.modelPoints.map((pt, i) => (
                    <li key={i} className="leading-relaxed">{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 3-STEP VIVA LADDER TAB */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Examiners assess clinical depth using escalating questions from simple recall to mechanism to surgical edge cases.
          </p>

          <div className="space-y-4">
            {examData.viva_ladder.map((rung) => (
              <div
                key={rung.rung}
                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 uppercase">
                    {rung.title}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 dark:text-white font-serif-medical mb-2">
                  Q: "{rung.examinerQuestion}"
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-750 text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block mb-0.5">
                    Ideal Candidate Response:
                  </span>
                  {rung.idealCandidateAnswer}
                </div>

                <div className="flex items-start gap-1.5 text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Common Examiner Trap: </span>
                    {rung.examinerTrap}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. OSCE CHECKLIST TAB */}
      {activeTab === 'osce' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                OSCE Clinical Station: Acute Abdomen Examination
              </span>
              <span className="text-[11px] text-indigo-700 dark:text-indigo-400">
                Passing mark: 8/12 with NO critical safety failures
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black font-mono text-indigo-700 dark:text-indigo-300">
                {earnedOscePoints} / {totalOscePoints}
              </span>
              <span className="text-[10px] text-slate-500 block">Points Earned</span>
            </div>
          </div>

          <div className="space-y-2">
            {examData.osce_checklist.map((item, idx) => {
              const isChecked = !!osceChecked[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleOsce(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOsce(idx)}
                      className="accent-indigo-600 rounded cursor-pointer"
                    />
                    <span className={`${isChecked ? 'line-through text-slate-400' : ''}`}>
                      {item.task}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.criticalFailCondition && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase">
                        Critical Safety
                      </span>
                    )}
                    <span className="font-mono font-bold text-slate-500">+{item.points} pt</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. CURRICULUM CODES TAB */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examData.curriculum_codes.map((curr, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 uppercase">
                {curr.system}
              </span>
              <div className="text-base font-black font-mono text-slate-900 dark:text-white mt-2">
                {curr.code}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {curr.competency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
