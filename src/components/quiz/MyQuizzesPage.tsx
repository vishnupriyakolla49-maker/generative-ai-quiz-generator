import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Search,
  Filter,
  Play,
  Sliders,
  Trash2,
  Calendar,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Quiz } from '../../types';
import { fetchQuizzes, deleteQuiz } from '../../services/api';

interface MyQuizzesPageProps {
  onTakeQuiz: (quizId: string) => void;
  onInspectQuality: (quizId: string) => void;
  onCreateNew: () => void;
}

export const MyQuizzesPage: React.FC<MyQuizzesPageProps> = ({
  onTakeQuiz,
  onInspectQuality,
  onCreateNew
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const list = await fetchQuizzes();
      setQuizzes(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this quiz?')) {
      await deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    }
  };

  const filtered = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Quizzes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, take, inspect quality audits, or manage your generated quiz assessments.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="py-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 self-start"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Generate New Quiz</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes by title or topic..."
            className="w-full pl-9 pr-4 py-2 bg-[#11182B] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-[#11182B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border border-white/5 bg-white/[0.02] text-center space-y-3">
          <BrainCircuit className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-white">No matching quizzes found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or create a brand new quiz using your study material.
          </p>
          <button
            onClick={onCreateNew}
            className="mt-2 py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
          >
            Generate Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((quiz) => (
            <div
              key={quiz.id}
              className="p-5 rounded-2xl border border-white/10 bg-[#11182B] hover:border-violet-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-violet-400 capitalize">{quiz.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>{quiz.questionCount} Questions</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(quiz.id, e)}
                    title="Delete quiz"
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{quiz.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">Topic: {quiz.topic}</p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" />
                    Quality: {quiz.qualityOverallScore}/100
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(quiz.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onInspectQuality(quiz.id)}
                  className="flex-1 py-2 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Quality Audit</span>
                </button>
                <button
                  onClick={() => onTakeQuiz(quiz.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Take Quiz</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
