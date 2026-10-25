import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  Layers,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  FileUp,
  Zap,
  Activity,
  Award,
  Search,
  BookOpen,
  Sliders,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onStartQuiz: () => void;
  onExploreFeatures: () => void;
  onTrySample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuiz,
  onExploreFeatures,
  onTrySample
}) => {
  const { openAuthModal, isAuthenticated, setCurrentView, theme, toggleTheme } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Interactive sample question state on landing page
  const [sampleAnswer, setSampleAnswer] = useState<string | null>(null);
  const [showSampleExplanation, setShowSampleExplanation] = useState<boolean>(false);

  const sampleQuestion = {
    question: "During eukaryotic cellular respiration, which metabolic stage occurs in the cytosol without requiring oxygen?",
    options: ["Pyruvate Oxidation", "Glycolysis", "Citric Acid Cycle", "Oxidative Phosphorylation"],
    correct: "Glycolysis",
    explanation: "Glycolysis occurs in the cytosol and yields a net of 2 ATP and 2 NADH per glucose without molecular oxygen."
  };

  const faqs = [
    {
      q: "How does QuizGenius AI verify that questions are accurate and grounded?",
      a: "Every generated question undergoes a dual-layer evaluation: first, a Transformer embedding model measures semantic similarity between the question/answer and source chunks; second, an LLM-as-a-Judge pipeline scores 9 distinct dimensions (including factual faithfulness, distractor quality, and unambiguous truth assignment) before clearing the question for use."
    },
    {
      q: "What file formats can I upload for quiz generation?",
      a: "You can upload PDF documents, Microsoft Word files (.docx), plain text files (.txt), or paste your study notes and lecture slides directly into the workspace."
    },
    {
      q: "Can I customize the question types and difficulty levels?",
      a: "Yes. You can configure multiple-choice questions (MCQs), true/false items, short-answer questions, and fill-in-the-blanks across Easy, Medium, Hard, or Mixed difficulty tiers."
    },
    {
      q: "What happens if a generated question fails quality checks?",
      a: "QuizGenius AI executes a bounded refinement cycle: it pinpoints the failing criteria (such as weak distractors or unsupported claims), requests an automated revision grounded in the source text, and audits the revised version before inclusion."
    },
    {
      q: "Can educators export quizzes for classroom exams?",
      a: "Yes. Quizzes can be exported as printable PDF exam sheets (with or without answer keys), CSV spreadsheets, JSON files, or full quality evaluation audit reports."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F8FAFC]">
      {/* ----------------- STICKY NAVIGATION ----------------- */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B1020]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">QuizGenius AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#technology" className="hover:text-white transition-colors">AI Architecture</a>
            <a href="#sample-quiz" className="hover:text-white transition-colors">Sample Quiz</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-md shadow-violet-600/20 flex items-center gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="py-2 px-3 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="py-2 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-violet-600/20"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Unboxed natural kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-cyan-400 mb-4 tracking-wide uppercase">
            <span>Generative AI for Academic Assessments</span>
            <span aria-hidden="true">·</span>
            <span>LLM-as-a-Judge Evaluation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Turn Your Study Material Into <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Intelligent Quizzes</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your notes, textbooks, or study guides and let AI transform them into personalized quizzes with intelligent quality evaluation, instant feedback, and performance insights.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-semibold text-sm shadow-xl shadow-violet-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Generate Your First Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreFeatures}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-medium transition-all"
            >
              Explore Features
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Questions are strictly grounded and checked against your uploaded study material</span>
          </div>

          {/* ----------------- DASHBOARD LIVE PREVIEW CARD ----------------- */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#11182B]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-md text-left">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-3 text-xs font-mono text-slate-400">quizgenius://assessment-workspace</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Pipeline Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Upload Card Preview */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Source Material</span>
                  <span className="text-violet-400 font-mono">PDF · 48 KB</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold text-white truncate">Cellular_Respiration.pdf</div>
                    <div className="text-xs text-slate-400 mt-0.5">2 Chunks · 1,420 words extracted</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-medium">✓ Normalized</span> · Chunk boundaries validated
                </div>
              </div>

              {/* Card 2: AI Question & Options */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 md:col-span-2">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-cyan-400 font-medium">Question 1 of 5 · Multiple Choice</span>
                  <span className="text-slate-400 font-mono">Target: Medium</span>
                </div>
                <div className="text-sm font-medium text-white mb-3">
                  Where does glycolysis take place within eukaryotic cells?
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-500/40 text-violet-200 flex items-center justify-between">
                    <span>A. Cytosol</span>
                    <Check className="w-3.5 h-3.5 text-violet-300" />
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400">
                    <span>B. Mitochondrial matrix</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400">
                    <span>C. Inner membrane</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400">
                    <span>D. Intermembrane space</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Score Breakdown Preview */}
            <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-slate-400 text-[11px]">Quality Index</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">96.2 / 100</div>
                <div className="text-[10px] text-slate-500 mt-0.5">9-Criterion Weighted Score</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-slate-400 text-[11px]">Semantic Similarity</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">0.94 Cosine</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Transformer Vector Dot</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-slate-400 text-[11px]">Answer Correctness</div>
                <div className="text-xl font-bold text-violet-400 mt-1">100% Verified</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Independent Grounding Check</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-slate-400 text-[11px]">Critical Flags</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">0 Warnings</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Zero Unverified Claims</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FEATURES SECTION ----------------- */}
      <section id="features" className="py-20 border-t border-white/5 bg-[#11182B]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-violet-400 tracking-wider uppercase">
              Engineered for Academic Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
              Everything Needed for Automated, High-Fidelity Assessments
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              QuizGenius AI goes beyond standard LLM outputs with semantic embedding validation, LLM-as-a-judge scoring, and bounded refinement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Generation",
                desc: "Transforms lectures, textbooks, and notes into pedagogically structured questions in seconds."
              },
              {
                icon: Sliders,
                title: "9-Criterion Quality Evaluation",
                desc: "Evaluates relevance, answer correctness, source faithfulness, clarity, distractors, and grammar."
              },
              {
                icon: BrainCircuit,
                title: "Transformer Semantic Analysis",
                desc: "Computes embedding vector similarity to measure question-to-source grounding and prevent redundancy."
              },
              {
                icon: Layers,
                title: "Multiple Question Types",
                desc: "Supports single-answer MCQs, true/false, concise short answers, and context-recoverable fill-in-the-blanks."
              },
              {
                icon: BarChart3,
                title: "Personalized Analytics",
                desc: "Tracks accuracy trends, topic mastery, difficulty performance, and historical progression."
              },
              {
                icon: ShieldCheck,
                title: "Source-Grounded Answers",
                desc: "Every item references the exact paragraph or sentence from your notes supporting the answer."
              },
              {
                icon: Zap,
                title: "Instant Explanations",
                desc: "Provides clear pedagogical rationales so learners understand the reasoning behind every option."
              },
              {
                icon: FileText,
                title: "Quiz History & Reports",
                desc: "Review past attempts, bookmark difficult items, and export exam-ready PDF or CSV assessments."
              }
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/40 hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">{f.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS ----------------- */}
      <section id="how-it-works" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              The 4-Step Pipeline
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
              How QuizGenius AI Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: "01",
                title: "Upload Study Material",
                desc: "Provide lecture notes, textbook chapters, or articles as PDF, DOCX, or text."
              },
              {
                step: "02",
                title: "Extract & Chunk Content",
                desc: "System normalizes whitespace, separates logical paragraphs, and maps key factual concepts."
              },
              {
                step: "03",
                title: "Generate & Evaluate",
                desc: "Gemini 3.8 Flash synthesizes questions while the LLM-as-a-judge scores 9 quality criteria."
              },
              {
                step: "04",
                title: "Practice & Master",
                desc: "Take interactive quizzes, review instant feedback, and inspect exact source references."
              }
            ].map((s, idx) => (
              <div key={idx} className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-left">
                <span className="text-2xl font-bold font-mono text-violet-400/80 mb-3 block">{s.step}</span>
                <h3 className="text-base font-semibold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- AI TECHNOLOGY & LLM ARCHITECTURE ----------------- */}
      <section id="technology" className="py-20 border-t border-white/5 bg-[#11182B]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-violet-400 tracking-wider uppercase">
                Technical Architecture
              </span>
              <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
                Generative AI Coupled With Quality Assurance
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Standard AI quiz makers blindly output raw text that often includes hallucinated answers, ambiguous distractors, or trivia outside the syllabus. QuizGenius AI solves this with an integrated verification loop:
              </p>

              <div className="mt-6 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <BrainCircuit className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Gemini 3.8 Flash Question Generator:</strong> Formats questions strictly according to structured JSON schemas with difficulty constraints.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Activity className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Sentence Transformer Semantic Matching:</strong> Vector similarity verifies that questions correlate with source paragraphs and flags duplicate concepts.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-white">LLM-as-a-Judge Evaluation:</strong> Weights 9 core criteria (20% Relevance, 20% Correctness, 15% Faithfulness, 10% Clarity, 10% Completeness, 10% Difficulty, 5% Distractors, 5% Grammar, 5% Diversity).
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Architecture Flow Diagram */}
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-white/10 shadow-xl space-y-3 font-mono text-xs">
              <div className="text-slate-400 text-[11px] mb-2 font-sans font-semibold text-center uppercase tracking-wider">
                End-to-End Pipeline Diagram
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-slate-200">
                <span>[1] Study Material (PDF / DOCX / Text)</span>
                <span className="text-violet-400 text-[10px]">Parser</span>
              </div>
              <div className="text-center text-slate-500">↓ Normalization & Chunking</div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-slate-200">
                <span>[2] Semantic Chunks & Key Concept Extraction</span>
                <span className="text-cyan-400 text-[10px]">Vector Anchor</span>
              </div>
              <div className="text-center text-slate-500">↓ Gemini 3.8 Flash Generation</div>

              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between text-violet-200">
                <span>[3] Candidate Questions (MCQ, T/F, Short, Blank)</span>
                <span className="text-violet-400 text-[10px]">Structured JSON</span>
              </div>
              <div className="text-center text-slate-500">↓ Dual Evaluation Filter</div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-cyan-200">
                <span>[4] LLM-as-a-Judge (9 Criteria) + Cosine Similarity</span>
                <span className="text-cyan-400 text-[10px]">Weighted Score</span>
              </div>
              <div className="text-center text-slate-500">↓ Bounded Refinement (if score &lt; 75)</div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-emerald-200">
                <span>[5] Approved Interactive Quiz & Audit Report</span>
                <span className="text-emerald-400 text-[10px]">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- INTERACTIVE SAMPLE QUIZ ----------------- */}
      <section id="sample-quiz" className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
            Hands-on Demonstration
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
            Try an AI-Generated Sample Question
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Derived directly from pre-loaded lecture notes on Cellular Bioenergetics.
          </p>

          <div className="mt-8 p-6 rounded-2xl bg-[#11182B] border border-white/10 text-left shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/5">
              <span>Question Type: Multiple Choice</span>
              <span className="text-emerald-400 font-medium">Quality Score: 96.2 / 100</span>
            </div>

            <p className="text-base font-semibold text-white mt-4">
              {sampleQuestion.question}
            </p>

            <div className="mt-4 space-y-2">
              {sampleQuestion.options.map((opt) => {
                const isSelected = sampleAnswer === opt;
                const isCorrect = opt === sampleQuestion.correct;
                let btnStyle = "bg-white/5 border-white/10 text-slate-200 hover:border-violet-500/50";
                if (showSampleExplanation) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-red-500/20 border-red-500 text-red-200";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-violet-600/30 border-violet-500 text-white";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => {
                      setSampleAnswer(opt);
                      setShowSampleExplanation(true);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-sm text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showSampleExplanation && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {showSampleExplanation && (
              <div className="mt-5 p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-slate-200 animate-fade-in">
                <div className="font-semibold text-violet-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Explanation:</span>
                </div>
                <p className="leading-relaxed">{sampleQuestion.explanation}</p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Source: Paragraph 2, Section &quot;Glycolysis and Cytosolic Reactions&quot;</span>
                  <button
                    onClick={onTrySample}
                    className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
                  >
                    Take Full 5-Question Quiz <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ----------------- FAQ SECTION ----------------- */}
      <section id="faq" className="py-20 border-t border-white/5 bg-[#11182B]/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-violet-400 tracking-wider uppercase">
              Common Inquiries
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left font-medium text-sm text-white flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------- FINAL CALL TO ACTION ----------------- */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Generate Rigorous Study Quizzes?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Upload your materials now or experiment with pre-loaded topics in our interactive workspace.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-violet-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTrySample}
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-medium transition-all"
            >
              Try Demo Quiz
            </button>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="py-8 border-t border-white/5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="font-semibold text-slate-300">QuizGenius AI</span>
            <span>· Automatic Quiz Generation with LLM & Transformer Quality Evaluation</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Built with Gemini 3.8 Flash</span>
            <span>© 2026 QuizGenius AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
