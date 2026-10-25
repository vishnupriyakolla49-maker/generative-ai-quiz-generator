import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Sliders,
  FileText,
  Download,
  ArrowRight,
  ChevronDown,
  Check,
  X,
  Share2
} from 'lucide-react';
import { Quiz, QuizAttempt, Question } from '../../types';

interface QuizResultsProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetake: () => void;
  onInspectQuality: () => void;
  onDashboard: () => void;
  onExport: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  attempt,
  onRetake,
  onInspectQuality,
  onDashboard,
  onExport
}) => {
  useEffect(() => {
    // Fire celebratory confetti if score >= 70%
    if (attempt.percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [attempt.percentage]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const getScoreColor = (p: number) => {
    if (p >= 80) return 'text-emerald-400';
    if (p >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* ----------------- SCORE HERO CARD ----------------- */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#151D33] to-[#0E1528] border border-white/10 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-violet-600/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>{quiz.title} · Assessment Complete</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className={`text-6xl sm:text-7xl font-extrabold tracking-tight ${getScoreColor(attempt.percentage)}`}>
              {attempt.percentage}%
            </span>
          </div>

          <p className="text-sm text-slate-300 max-w-md mx-auto">
            {attempt.percentage >= 80
              ? 'Outstanding performance! You have demonstrated strong mastery of the core concepts.'
              : attempt.percentage >= 60
              ? 'Solid effort! Review the grounded source passages below to reinforce difficult points.'
              : 'Keep practicing! Review the detailed explanations and retry this assessment.'}
          </p>

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] text-slate-400">Total Score</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {attempt.score} / {attempt.maxScore}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] text-slate-400">Correct Answers</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">
                {attempt.correctCount}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] text-slate-400">Incorrect / Blank</div>
              <div className="text-lg font-bold text-red-400 mt-0.5">
                {attempt.incorrectCount + attempt.unansweredCount}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[11px] text-slate-400">Time Elapsed</div>
              <div className="text-lg font-bold text-cyan-400 mt-0.5">
                {formatTime(attempt.timeSpentSeconds)}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onRetake}
              className="py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
            <button
              onClick={onInspectQuality}
              className="py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspect AI Quality Report</span>
            </button>
            <button
              onClick={onExport}
              className="py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Result Sheet</span>
            </button>
            <button
              onClick={onDashboard}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* ----------------- QUESTION-BY-QUESTION REVIEW ----------------- */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Item-by-Item Review &amp; Explanations</h2>

        <div className="space-y-4">
          {quiz.questions.map((q, idx) => {
            const detail = attempt.details.find((d) => d.questionId === q.id);
            const isCorrect = detail?.isCorrect || false;
            const userAnswer = detail?.userAnswer || '(No answer provided)';

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'bg-[#11182B] border-emerald-500/20'
                    : 'bg-[#11182B] border-red-500/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between text-xs pb-3 mb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">Q{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize text-slate-400">{q.questionType.replace('_', ' ')}</span>
                  </div>

                  <span
                    className={`flex items-center gap-1 font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </span>
                </div>

                {/* Question */}
                <div className="text-sm font-semibold text-white mb-4">{q.questionText}</div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                  <div className={`p-3 rounded-xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                    <div className="text-[11px] text-slate-400 mb-1">Your Submitted Answer:</div>
                    <div className={`font-semibold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                      {userAnswer}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[11px] text-slate-400 mb-1">Indisputable Correct Answer:</div>
                    <div className="font-semibold text-emerald-400">
                      {q.correctAnswer}
                    </div>
                  </div>
                </div>

                {/* Pedagogical Explanation */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1 mb-3">
                  <span className="font-semibold text-violet-300">Explanation: </span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>

                {/* Grounded Source Passage */}
                {q.sourcePassage && (
                  <div className="p-3 rounded-xl bg-violet-950/15 border border-violet-500/20 text-xs text-slate-300">
                    <span className="font-semibold text-cyan-300 flex items-center gap-1 mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      Grounded Source Passage in Your Notes:
                    </span>
                    <p className="italic text-slate-400 font-serif leading-relaxed">
                      &quot;{q.sourcePassage}&quot;
                    </p>
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
