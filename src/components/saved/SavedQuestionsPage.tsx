import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Search,
  Trash2,
  FileText,
  Check,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SavedQuestion } from '../../types';
import { fetchSavedQuestions, toggleSaveQuestion } from '../../services/api';

export const SavedQuestionsPage: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAnswerFor, setShowAnswerFor] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const list = await fetchSavedQuestions();
      setSavedItems(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item: SavedQuestion) => {
    await toggleSaveQuestion(item.question, item.quizTitle);
    setSavedItems(savedItems.filter((s) => s.id !== item.id));
  };

  const toggleAnswer = (id: string) => {
    setShowAnswerFor({ ...showAnswerFor, [id]: !showAnswerFor[id] });
  };

  const filtered = savedItems.filter(
    (s) =>
      s.question.questionText.toLowerCase().includes(search.toLowerCase()) ||
      s.quizTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Saved Question Bank</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review bookmarked questions, verify key concepts, and reinforce tricky exam concepts.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search saved questions..."
          className="w-full pl-9 pr-4 py-2 bg-[#11182B] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl border border-white/5 bg-white/[0.02] text-center space-y-2">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-white">No saved questions found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You can bookmark tricky questions while taking quizzes or reviewing answer results.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const q = item.question;
            const isRevealed = showAnswerFor[item.id];
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-white/10 bg-[#11182B] space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-violet-400">{item.quizTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{q.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{q.questionType.replace('_', ' ')}</span>
                  </div>

                  <button
                    onClick={() => handleRemove(item)}
                    title="Remove from saved"
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-sm font-semibold text-white leading-relaxed">
                  {q.questionText}
                </div>

                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = isRevealed && opt === q.correctAnswer;
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
                          {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isRevealed ? (
                  <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-2 text-xs animate-fade-in">
                    <div>
                      <span className="font-semibold text-emerald-400">Correct Answer: </span>
                      <span className="text-white font-medium">{q.correctAnswer}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    {q.sourcePassage && (
                      <p className="text-[11px] text-slate-400 italic pt-1 border-t border-white/5">
                        Source Reference: &quot;{q.sourcePassage}&quot;
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleAnswer(item.id)}
                      className="py-1.5 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Show Answer &amp; Explanation
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
