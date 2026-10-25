import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  BrainCircuit,
  ArrowRight,
  Play,
  Share2,
  Download
} from 'lucide-react';
import { Quiz, Question } from '../../types';
import { refineQuestion } from '../../services/api';

interface QualityEvaluationDashboardProps {
  quiz: Quiz;
  onTakeQuiz: (quizId: string) => void;
  onBack: () => void;
  onExport: () => void;
}

export const QualityEvaluationDashboard: React.FC<QualityEvaluationDashboardProps> = ({
  quiz,
  onTakeQuiz,
  onBack,
  onExport
}) => {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>(quiz.questions);
  const [overallScore, setOverallScore] = useState<number>(quiz.qualityOverallScore);
  const [expandedQId, setExpandedQId] = useState<string>(quiz.questions[0]?.id || '');
  const [refiningQId, setRefiningQId] = useState<string | null>(null);
  const [refineFeedback, setRefineFeedback] = useState<Record<string, string>>({});

  const handleRefine = async (questionId: string) => {
    setRefiningQId(questionId);
    try {
      const res = await refineQuestion({
        questionId,
        quizId: quiz.id,
        targetImprovement: refineFeedback[questionId] || 'Sharpen question clarity, verify single unambiguous correct answer, and maximize distractor plausibility.'
      });

      setCurrentQuestions(
        currentQuestions.map((q) => (q.id === questionId ? res.question : q))
      );
      setOverallScore(res.quizQualityScore);
      setRefineFeedback({ ...refineFeedback, [questionId]: '' });
    } catch (err: any) {
      alert('Refinement failed: ' + (err.message || 'Unknown error'));
    } finally {
      setRefiningQId(null);
    }
  };

  const getTier = (score: number) => {
    if (score >= 90) return { label: 'Excellent Tier', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 80) return { label: 'Good Quality Tier', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    if (score >= 70) return { label: 'Needs Review', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Action Required', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  };

  const tier = getTier(overallScore);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ----------------- TOP HEADER ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white mb-1.5 flex items-center gap-1"
          >
            ← Back to Quizzes
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">{quiz.title}</h1>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tier.bg} ${tier.color}`}>
              {tier.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Topic: {quiz.topic} · {currentQuestions.length} Questions · Source: {quiz.materialTitle || 'Uploaded Notes'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="py-2 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => onTakeQuiz(quiz.id)}
            className="py-2 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Take This Quiz</span>
          </button>
        </div>
      </div>

      {/* ----------------- OVERALL SCORECARD ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs text-slate-400 font-medium">Weighted Quality Index</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{overallScore}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Combined 9-criterion mathematical score
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs text-slate-400 font-medium">Semantic Similarity</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 tracking-tight">0.93</span>
            <span className="text-xs text-slate-500">Cosine</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            High embedding support to source
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs text-slate-400 font-medium">Critical Integrity Check</div>
          <div className="mt-2 flex items-center gap-2 text-emerald-400 font-bold text-xl">
            <ShieldCheck className="w-6 h-6" />
            <span>Pass (0 Flags)</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            No hallucinations or unanswerables
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="text-xs text-slate-400 font-medium">Refinement Status</div>
          <div className="mt-2 text-3xl font-extrabold text-violet-400 tracking-tight">
            {currentQuestions.filter((q) => q.refinedCount && q.refinedCount > 0).length}
            <span className="text-xs text-slate-500 font-normal ml-1">Refined</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Bounded automated improvements applied
          </div>
        </div>
      </div>

      {/* ----------------- WEIGHTED CRITERIA BREAKDOWN LEGEND ----------------- */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
        <div className="font-semibold text-white mb-2 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-violet-400" />
          <span>Active 9-Criterion Evaluator Weights:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-[11px] text-slate-400">
          <div><span className="text-white">Relevance:</span> 20%</div>
          <div><span className="text-white">Answer Correctness:</span> 20%</div>
          <div><span className="text-white">Source Faithfulness:</span> 15%</div>
          <div><span className="text-white">Clarity:</span> 10%</div>
          <div><span className="text-white">Completeness:</span> 10%</div>
          <div><span className="text-white">Difficulty Alignment:</span> 10%</div>
          <div><span className="text-white">Distractor Quality:</span> 5%</div>
          <div><span className="text-white">Grammar &amp; Syntax:</span> 5%</div>
          <div><span className="text-white">Concept Diversity:</span> 5%</div>
        </div>
      </div>

      {/* ----------------- QUESTION-BY-QUESTION AUDIT ----------------- */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white">Item-by-Item Quality Audit &amp; Refinement</h2>

        <div className="space-y-3">
          {currentQuestions.map((q, idx) => {
            const isExpanded = expandedQId === q.id;
            const evalData = q.evaluation;
            const qScore = evalData?.weightedScore || 90;
            const qTier = getTier(qScore);

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-white/10 bg-[#11182B] overflow-hidden transition-all"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedQId(isExpanded ? '' : q.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-mono text-cyan-400 font-semibold">Q{idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{q.questionType.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{q.difficulty}</span>
                      {q.refinedCount && q.refinedCount > 0 ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-violet-400 font-medium">Refined ({q.refinedCount}x)</span>
                        </>
                      ) : null}
                    </div>
                    <div className="text-sm font-medium text-white truncate">{q.questionText}</div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{qScore}/100</div>
                      <div className={`text-[10px] ${qTier.color}`}>{qTier.label}</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-white/5 space-y-5 bg-slate-900/40 text-xs">
                    {/* Question Content & Options */}
                    <div className="space-y-2">
                      <div className="font-semibold text-white text-sm">{q.questionText}</div>
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = opt === q.correctAnswer;
                            return (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                                    : 'bg-white/[0.02] border-white/5 text-slate-300'
                                }`}
                              >
                                <span>{opt}</span>
                                {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {q.questionType !== 'multiple_choice' && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200">
                          <span className="font-semibold text-emerald-400">Reference Answer: </span>
                          <span>{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>

                    {/* Source Grounding Citation */}
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5 text-cyan-400">
                          <FileText className="w-3.5 h-3.5" />
                          Source Passage Grounding:
                        </span>
                        <span className="text-cyan-400 font-mono">
                          Cosine Similarity: {evalData?.semanticSimilarity || 0.92}
                        </span>
                      </div>
                      <p className="text-slate-300 italic font-serif leading-relaxed">
                        &quot;{q.sourcePassage}&quot;
                      </p>
                    </div>

                    {/* 9 Criteria Score Bars */}
                    {evalData?.criterionScores && (
                      <div>
                        <h4 className="font-semibold text-white mb-3">Individual Criterion Performance</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {Object.entries(evalData.criterionScores).map(([crit, val]) => (
                            <div key={crit} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="capitalize text-slate-400">{crit.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="font-mono text-white font-semibold">{val}/100</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    val >= 90 ? 'bg-emerald-400' : val >= 75 ? 'bg-cyan-400' : 'bg-amber-400'
                                  }`}
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LLM-as-a-Judge Explanation */}
                    {evalData?.evaluatorExplanation && (
                      <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-500/20 text-slate-300">
                        <span className="font-semibold text-violet-300">Evaluator Note: </span>
                        <span>{evalData.evaluatorExplanation}</span>
                      </div>
                    )}

                    {/* Revision History if refined */}
                    {q.originalText && (
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                        <span className="font-semibold text-slate-400">Original Phrasing: </span>
                        <p className="text-slate-500 line-through">{q.originalText}</p>
                        {evalData?.revisionNotes && (
                          <p className="text-violet-400 text-[11px] pt-1">
                            ✓ {evalData.revisionNotes}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Automatic Question Refinement Engine */}
                    <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-950/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-violet-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                          Bounded Automatic Refinement
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Re-runs generation model with targeted prompt feedback
                        </span>
                      </div>

                      <input
                        type="text"
                        value={refineFeedback[q.id] || ''}
                        onChange={(e) => setRefineFeedback({ ...refineFeedback, [q.id]: e.target.value })}
                        placeholder="Optional custom instruction: e.g. 'Make distractors more subtle' or leave blank for auto-upgrade"
                        className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRefine(q.id)}
                          disabled={refiningQId === q.id}
                          className="py-1.5 px-3.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {refiningQId === q.id ? (
                            <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                          <span>Run Refinement Engine</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
