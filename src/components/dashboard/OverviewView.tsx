import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  FileUp,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Quiz, QuizAttempt, StudyMaterial } from '../../types';
import { fetchQuizzes, fetchAttempts, fetchMaterials, fetchAnalytics } from '../../services/api';

interface OverviewViewProps {
  onNavigate: (tab: string) => void;
  onTakeQuiz: (quizId: string) => void;
  onInspectQuality: (quizId: string) => void;
  onViewResults: (attemptId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onTakeQuiz,
  onInspectQuality,
  onViewResults
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [qList, aList, mList, aData] = await Promise.all([
          fetchQuizzes(),
          fetchAttempts(),
          fetchMaterials(),
          fetchAnalytics()
        ]);
        setQuizzes(qList);
        setAttempts(aList);
        setMaterials(mList);
        setAnalytics(aData);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  const totalQuizzes = quizzes.length;
  const totalAttempts = attempts.length;
  const avgScore = analytics?.averageScore || 0;
  const totalMaterials = materials.length;
  const totalQuestionsAnswered = analytics?.totalQuestionsAnswered || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ----------------- SUMMARY CARDS ----------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quizzes Created</span>
            <div className="p-2 rounded-lg bg-violet-600/20 text-violet-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white tracking-tight">{totalQuizzes}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span>{materials.length} linked study source{materials.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Questions Answered</span>
            <div className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white tracking-tight">{totalQuestionsAnswered}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span>{totalAttempts} completed attempt{totalAttempts !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Quiz Score</span>
            <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-400 tracking-tight">
            {avgScore > 0 ? `${avgScore}%` : 'N/A'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span>Across all completed tests</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Study Materials</span>
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
              <FileUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-white tracking-tight">{totalMaterials}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            <span>PDF, DOCX &amp; notes</span>
          </div>
        </div>
      </div>

      {/* ----------------- QUICK ACTIONS ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('generate')}
          className="p-5 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/30 to-indigo-950/20 hover:border-violet-500/60 text-left transition-all group flex items-start justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-violet-600/30 text-violet-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Generate New Quiz</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Use Gemini 3.8 Flash to synthesize grounded questions from your notes.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform mt-1" />
        </button>

        <button
          onClick={() => onNavigate('materials')}
          className="p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-slate-900/40 hover:border-cyan-500/60 text-left transition-all group flex items-start justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-cyan-600/30 text-cyan-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Upload Study Material</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Extract and chunk PDF textbooks, lecture slides, or Word documents.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform mt-1" />
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-left transition-all group flex items-start justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Performance Analytics</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Review topic accuracy, difficulty trends, and personalized recommendations.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform mt-1" />
        </button>
      </div>

      {/* ----------------- RECENT QUIZZES & PERFORMANCE SPLIT ----------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quizzes (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Available Quizzes</h2>
            <button
              onClick={() => onNavigate('quizzes')}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all ({quizzes.length})
            </button>
          </div>

          {quizzes.length === 0 ? (
            <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center space-y-3">
              <BrainCircuit className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-medium text-white">No quizzes generated yet</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your study material or select a pre-loaded topic to create your first intelligent quiz.
              </p>
              <button
                onClick={() => onNavigate('generate')}
                className="mt-2 py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium"
              >
                Create Your First Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.slice(0, 4).map((quiz) => {
                const latestAttempt = attempts.find(a => a.quizId === quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span className="text-slate-300 font-medium">{quiz.topic}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{quiz.difficulty}</span>
                        <span aria-hidden="true">·</span>
                        <span>{quiz.questionCount} questions</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate">{quiz.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Sliders className="w-3 h-3" />
                          Quality Index: {quiz.qualityOverallScore}/100
                        </span>
                        {latestAttempt && (
                          <span className="text-cyan-400 font-medium">
                            Last Score: {latestAttempt.percentage}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => onInspectQuality(quiz.id)}
                        className="py-1.5 px-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                      >
                        Inspect Quality
                      </button>
                      <button
                        onClick={() => onTakeQuiz(quiz.id)}
                        className="py-1.5 px-3.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <Play className="w-3 h-3" />
                        <span>Take Quiz</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Attempts & Activity (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Recent Attempts</h2>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Analytics
            </button>
          </div>

          {attempts.length === 0 ? (
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center text-xs text-slate-400">
              No quiz attempts recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.slice(0, 3).map((att) => {
                const targetQuiz = quizzes.find(q => q.id === att.quizId);
                const scoreColor = att.percentage >= 80 ? 'text-emerald-400' : att.percentage >= 60 ? 'text-amber-400' : 'text-red-400';
                return (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate max-w-[180px]">
                        {targetQuiz?.title || 'Quiz Assessment'}
                      </span>
                      <span className={`font-bold font-mono ${scoreColor}`}>
                        {att.percentage}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>{att.correctCount} / {att.maxScore} correct</span>
                      <span>{Math.round(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s</span>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {new Date(att.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <button
                        onClick={() => onViewResults(att.id)}
                        className="text-violet-400 hover:text-violet-300 font-medium text-[11px] flex items-center gap-1"
                      >
                        Review Answers <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
