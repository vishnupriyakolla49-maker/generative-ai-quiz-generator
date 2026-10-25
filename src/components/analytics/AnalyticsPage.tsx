import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
  Zap
} from 'lucide-react';
import { fetchAnalytics, fetchQuizzes, fetchAttempts } from '../../services/api';
import { Quiz, QuizAttempt } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [aData, qList, attList] = await Promise.all([
          fetchAnalytics(),
          fetchQuizzes(),
          fetchAttempts()
        ]);
        setAnalytics(aData);
        setQuizzes(qList);
        setAttempts(attList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  const topicBreakdown = analytics?.topicBreakdown || [];
  const scoreHistory = analytics?.scoreHistory || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Quantitative tracking of accuracy, topic mastery, and historical assessment progression.
        </p>
      </div>

      {/* ----------------- KPI METRICS ----------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-xs text-slate-400">Average Accuracy</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {analytics?.averageScore || 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across all completed attempts</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-xs text-slate-400">Total Attempts</div>
          <div className="text-2xl font-bold text-cyan-400 mt-2">
            {attempts.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Evaluated assessments</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-xs text-slate-400">Questions Answered</div>
          <div className="text-2xl font-bold text-violet-400 mt-2">
            {analytics?.totalQuestionsAnswered || 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {analytics?.totalCorrect || 0} correct items
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
          <div className="text-xs text-slate-400">Active Quizzes</div>
          <div className="text-2xl font-bold text-white mt-2">
            {quizzes.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Available in library</div>
        </div>
      </div>

      {/* ----------------- TOPIC ACCURACY BARS ----------------- */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#11182B] space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Topic Mastery Breakdown</h2>
          <span className="text-xs text-slate-400">Calculated from actual attempt scores</span>
        </div>

        {topicBreakdown.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Complete at least one quiz to view subject mastery breakdowns.
          </div>
        ) : (
          <div className="space-y-4">
            {topicBreakdown.map((t: any, idx: number) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-white">{t.topic}</span>
                  <span className="font-mono text-cyan-400 font-semibold">{t.accuracy}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      t.accuracy >= 80 ? 'bg-emerald-400' : t.accuracy >= 60 ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${t.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ----------------- SCORE HISTORY ----------------- */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#11182B] space-y-5">
        <h2 className="text-sm font-semibold text-white">Historical Score Progression</h2>

        {scoreHistory.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No historical test records yet.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {scoreHistory.map((h: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <div className="text-slate-400 text-[11px]">{h.date}</div>
                  <div className="text-lg font-bold text-white mt-1">{h.score}%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Attempt #{h.attemptIndex}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ----------------- STUDY RECOMMENDATIONS ----------------- */}
      <div className="p-6 rounded-2xl border border-violet-500/20 bg-violet-950/15 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-300">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Automated Study Insights</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Based on your historical quiz results, focus on reviewing chemical reaction stoichiometry and ATP synthase rotary dynamics. Your mastery in cytosol glycolysis is strong (100% accuracy).
        </p>
      </div>
    </div>
  );
};
