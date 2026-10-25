import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Compass,
  CheckCircle2,
  FileUp,
  BrainCircuit,
  Sliders
} from 'lucide-react';
import { Difficulty } from '../../types';

interface OnboardingModalProps {
  onComplete: (action: 'upload' | 'sample' | 'dashboard') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const { user, updateUserProfile } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<'student' | 'educator'>(user?.role || 'student');
  const [difficulty, setDifficulty] = useState<Difficulty>(user?.preferredDifficulty || 'mixed');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Biology', 'Physics']);

  const subjects = [
    'Biology & Medicine',
    'Physics & Quantum',
    'Computer Science & AI',
    'Mathematics & Statistics',
    'World History',
    'Literature & Philosophy'
  ];

  const toggleSubject = (s: string) => {
    if (selectedSubjects.includes(s)) {
      setSelectedSubjects(selectedSubjects.filter(item => item !== s));
    } else {
      setSelectedSubjects([...selectedSubjects, s]);
    }
  };

  const handleFinish = async (action: 'upload' | 'sample' | 'dashboard') => {
    await updateUserProfile({
      role,
      preferredDifficulty: difficulty,
      onboardingCompleted: true
    });
    onComplete(action);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#11182B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Step Indicator */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Step {step} of 3
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              {step === 1 && 'Welcome to QuizGenius AI'}
              {step === 2 && 'Personalize Your Experience'}
              {step === 3 && 'Choose Starting Point'}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-6 h-1 rounded-full transition-all ${
                  s === step ? 'bg-violet-500' : s < step ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-violet-500/25 animate-bounce-subtle">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Welcome to QuizGenius AI
                </h2>
                <p className="mt-2 text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  The automated assessment platform that converts your study materials, lecture slides, and notes into intelligent quizzes with LLM-as-a-judge quality assurance.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left pt-2">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center mb-2">
                    <FileUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">Upload Material</h4>
                  <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX, TXT or notes</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">AI Generation</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Grounded question synthesis</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-semibold text-white">Quality Audit</h4>
                  <p className="text-[11px] text-slate-400 mt-1">9-criterion LLM evaluation</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Tailor Your Learning Preferences</h3>
                <p className="text-xs text-slate-400 mt-1">
                  We use these settings to calibrate your generated quizzes and question difficulty.
                </p>
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">I am using QuizGenius AI as:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      role === 'student'
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <GraduationCap className={`w-5 h-5 mt-0.5 ${role === 'student' ? 'text-violet-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-semibold">Student / Self-Learner</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Focus on practice, mastery and instant explanations</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('educator')}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      role === 'educator'
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <BookOpen className={`w-5 h-5 mt-0.5 ${role === 'educator' ? 'text-violet-400' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-semibold">Teacher / Professor</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Generate exam-ready question banks with quality audit</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Target difficulty */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Default Target Difficulty:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`py-2 px-3 text-xs font-medium capitalize rounded-lg border transition-all ${
                        difficulty === d
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject categories */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Primary Subject Interests:</label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((sub) => {
                    const active = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`text-xs py-1.5 px-3 rounded-lg border transition-all ${
                          active
                            ? 'bg-violet-500/20 border-violet-400 text-violet-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs rounded-xl"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Next: Choose Action</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">How would you like to start?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select an action to launch your personalized workspace.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleFinish('upload')}
                  className="w-full p-4 rounded-xl border border-violet-500/40 bg-violet-950/20 hover:bg-violet-900/30 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/30 text-violet-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Upload Your Study Material</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Drag & drop your PDF, Word doc, or lecture notes</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleFinish('sample')}
                  className="w-full p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-900/30 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/30 text-cyan-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Try Pre-Loaded Biology Quiz</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Test cellular respiration questions & quality scores</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleFinish('dashboard')}
                  className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Explore Main Dashboard</h4>
                      <p className="text-xs text-slate-400 mt-0.5">View analytics, study materials, and past attempts</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => handleFinish('dashboard')}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Skip for now, go straight to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
