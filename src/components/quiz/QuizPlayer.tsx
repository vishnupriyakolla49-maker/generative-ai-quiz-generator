import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Flag,
  HelpCircle,
  Eye,
  Check,
  X,
  FileText
} from 'lucide-react';
import { Quiz, Question, QuizAttempt } from '../../types';
import { submitQuizAttempt, toggleSaveQuestion } from '../../services/api';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQ: Question = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const currentAnswer = answers[currentQ.id] || '';

  const handleSelectAnswer = (ans: string) => {
    setAnswers({ ...answers, [currentQ.id]: ans });
  };

  const handleToggleFlag = () => {
    setFlagged({ ...flagged, [currentQ.id]: !flagged[currentQ.id] });
  };

  const handleToggleSave = async () => {
    const next = !saved[currentQ.id];
    setSaved({ ...saved, [currentQ.id]: next });
    try {
      await toggleSaveQuestion(currentQ, quiz.title);
    } catch (err) {
      console.error(err);
    }
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim().length > 0).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    setIsSubmitting(true);
    try {
      const attempt = await submitQuizAttempt({
        quizId: quiz.id,
        answers,
        timeSpentSeconds: secondsElapsed
      });
      onComplete(attempt);
    } catch (err: any) {
      alert('Failed to submit quiz: ' + (err.message || 'Error'));
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ----------------- TOP BAR ----------------- */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#11182B] border border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{quiz.title}</h1>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="capitalize">{quiz.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{quiz.topic}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Practice mode toggle */}
          <label className="hidden sm:flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={practiceMode}
              onChange={(e) => setPracticeMode(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
            />
            <span>Practice Feedback Mode</span>
          </label>

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="py-1.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Submit Quiz
          </button>
        </div>
      </div>

      {/* ----------------- PROGRESS BAR ----------------- */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
          <span>{answeredCount} of {totalQuestions} Answered</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ----------------- MAIN QUESTION CARD (3 cols) ----------------- */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#11182B] border border-white/10 space-y-6 shadow-xl">
            {/* Header badges */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-violet-400 uppercase tracking-wider font-mono">
                  {currentQ.questionType.replace('_', ' ')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{currentQ.difficulty}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleFlag}
                  title="Flag for review"
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    flagged[currentQ.id]
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{flagged[currentQ.id] ? 'Flagged' : 'Flag'}</span>
                </button>
                <button
                  onClick={handleToggleSave}
                  title="Bookmark question"
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    saved[currentQ.id]
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{saved[currentQ.id] ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentQ.questionText}
            </div>

            {/* Answer Controls */}
            {currentQ.questionType === 'multiple_choice' && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer === opt;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectAnswer(opt)}
                      className={`w-full p-4 rounded-xl border text-sm text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-violet-600/25 border-violet-500 text-white shadow-sm'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-slate-400 flex-shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-violet-400" />}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.questionType === 'true_false' && (
              <div className="grid grid-cols-2 gap-4">
                {['True', 'False'].map((tf) => {
                  const isSelected = currentAnswer.toLowerCase() === tf.toLowerCase();
                  return (
                    <button
                      key={tf}
                      onClick={() => handleSelectAnswer(tf)}
                      className={`p-5 rounded-xl border text-base font-semibold text-center transition-all ${
                        isSelected
                          ? 'bg-violet-600/25 border-violet-500 text-white shadow-sm'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300 hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQ.questionType === 'fill_in_blank' && (
              <div className="space-y-2">
                <label className="block text-xs text-slate-400">Type the missing term or phrase:</label>
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder="Enter answer..."
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            )}

            {currentQ.questionType === 'short_answer' && (
              <div className="space-y-2">
                <label className="block text-xs text-slate-400">Provide a concise 1-2 sentence response:</label>
                <textarea
                  rows={4}
                  value={currentAnswer}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder="Type your explanation or answer..."
                  className="w-full px-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed font-sans"
                />
              </div>
            )}

            {/* Practice Mode Instant Feedback */}
            {practiceMode && currentAnswer && (
              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-slate-200 space-y-2 animate-fade-in">
                <div className="font-semibold text-violet-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Practice Hint &amp; Explanation:</span>
                </div>
                <p>{currentQ.explanation}</p>
                {currentQ.sourcePassage && (
                  <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 italic">
                    Grounded source: &quot;{currentQ.sourcePassage}&quot;
                  </div>
                )}
              </div>
            )}

            {/* Bottom Nav buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5 disabled:opacity-30"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="py-2 px-5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="py-2 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Finish &amp; Submit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ----------------- QUESTION NAVIGATOR SIDEBAR (1 col) ----------------- */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#11182B] border border-white/10 space-y-4">
            <h3 className="text-xs font-semibold text-white">Question Navigator</h3>

            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, idx) => {
                const hasAnswer = Boolean(answers[q.id]?.trim());
                const isFlag = flagged[q.id];
                const isCurrent = idx === currentIndex;

                let btnStyle = 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20';
                if (isCurrent) {
                  btnStyle = 'border-violet-500 text-white ring-2 ring-violet-500/20 font-bold';
                }
                if (hasAnswer) {
                  btnStyle += ' bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-mono relative transition-all flex items-center justify-center ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlag && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/5 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/60 inline-block" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-white/5 border border-white/10 inline-block" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
                <span>Flagged for Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- SUBMISSION CONFIRMATION MODAL ----------------- */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#11182B] border border-white/10 rounded-2xl p-6 space-y-5 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white">Confirm Quiz Submission</h3>

            {unansweredCount > 0 ? (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Unanswered Questions Remaining</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    You have left <strong>{unansweredCount}</strong> question{unansweredCount > 1 ? 's' : ''} blank. These will be marked incorrect.
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300">
                You have answered all {totalQuestions} questions! Are you ready to submit your attempt and calculate results?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
              >
                Return to Quiz
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="py-2 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Confirm &amp; Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
