import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileUp,
  Layers,
  ShieldCheck,
  Activity,
  AlertCircle
} from 'lucide-react';
import { StudyMaterial, QuestionType, Difficulty, Quiz } from '../../types';
import { fetchMaterials, generateQuiz } from '../../services/api';

interface GenerateQuizWizardProps {
  initialMaterial?: StudyMaterial | null;
  onQuizGenerated: (quiz: Quiz) => void;
  onCancel: () => void;
}

export const GenerateQuizWizard: React.FC<GenerateQuizWizardProps> = ({
  initialMaterial,
  onQuizGenerated,
  onCancel
}) => {
  const [step, setStep] = useState<number>(1);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(initialMaterial?.id || '');
  const [customText, setCustomText] = useState<string>('');

  // Settings
  const [topic, setTopic] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'multiple_choice',
    'true_false',
    'fill_in_blank',
    'short_answer'
  ]);
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [language, setLanguage] = useState<string>('English');
  const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
  const [includeSources, setIncludeSources] = useState<boolean>(true);
  const [randomizeOrder, setRandomizeOrder] = useState<boolean>(false);

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials().then((list) => {
      setMaterials(list);
      if (!selectedMaterialId && list.length > 0) {
        setSelectedMaterialId(list[0].id);
      }
    });
  }, []);

  const toggleType = (t: QuestionType) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((item) => item !== t));
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenError(null);
    setCurrentStage(1);

    // Staged visual progress simulating the 7-phase pipeline
    const timer1 = setTimeout(() => setCurrentStage(2), 1200);
    const timer2 = setTimeout(() => setCurrentStage(3), 2600);
    const timer3 = setTimeout(() => setCurrentStage(4), 4200);
    const timer4 = setTimeout(() => setCurrentStage(5), 6500);
    const timer5 = setTimeout(() => setCurrentStage(6), 8500);

    try {
      const generatedQuiz = await generateQuiz({
        materialId: selectedMaterialId || undefined,
        rawText: customText.trim() || undefined,
        topic: topic.trim(),
        questionCount,
        questionTypes: selectedTypes,
        difficulty,
        language,
        includeExplanations,
        includeSourceReferences: includeSources,
        randomizeOrder
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);

      setCurrentStage(7);
      setTimeout(() => {
        onQuizGenerated(generatedQuiz);
      }, 800);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      setIsGenerating(false);
      setGenError(err.message || 'Generation failed. Please try again.');
    }
  };

  const stages = [
    { id: 1, name: 'Ingesting Study Material', desc: 'Validating file & passage encoding' },
    { id: 2, name: 'Extracting & Chunking Document Text', desc: 'Splitting into coherent semantic passages' },
    { id: 3, name: 'Identifying Key Concepts & Factual Anchors', desc: 'Extracting primary learning objectives' },
    { id: 4, name: 'Generating Structured Questions with Gemini 3.8 Flash', desc: 'Synthesizing options & explanations' },
    { id: 5, name: 'Executing 9-Criterion LLM-as-a-Judge Evaluation', desc: 'Auditing relevance, correctness & distractors' },
    { id: 6, name: 'Computing Transformer Semantic Similarity', desc: 'Verifying source support and deduplication' },
    { id: 7, name: 'Finalizing Approved Quiz & Quality Scorecard', desc: 'Packaging assessment ready for practice' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">AI Quiz Generation Engine</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure questions from your uploaded study materials with automated 9-criterion quality audit.
        </p>
      </div>

      {/* Wizard Progress steps */}
      {!isGenerating && (
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    s === step
                      ? 'bg-violet-600 text-white'
                      : s < step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs ${s === step ? 'font-semibold text-white' : 'text-slate-400'}`}>
                  {s === 1 && 'Select Material'}
                  {s === 2 && 'Quiz Parameters'}
                  {s === 3 && 'Review & Generate'}
                </span>
                {s < 3 && <div className="w-8 h-[1px] bg-white/10 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- STEP 1: SELECT SOURCE MATERIAL ----------------- */}
      {!isGenerating && step === 1 && (
        <div className="p-6 rounded-2xl border border-white/10 bg-[#11182B] space-y-6">
          <h2 className="text-base font-semibold text-white">Step 1: Choose Source Content</h2>

          {materials.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Select from Uploaded Study Materials:
              </label>
              <div className="space-y-2">
                {materials.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedMaterialId === m.id
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="material"
                        checked={selectedMaterialId === m.id}
                        onChange={() => {
                          setSelectedMaterialId(m.id);
                          setCustomText('');
                        }}
                        className="text-violet-600 focus:ring-violet-500"
                      />
                      <FileText className="w-4 h-4 text-violet-400" />
                      <div>
                        <div className="text-xs font-medium text-white">{m.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {m.chunks?.length || 1} passages · {Math.round(m.fileSize / 1024)} KB
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{m.fileType}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-slate-300">Or Paste Direct Notes / Excerpt:</span>
            </div>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                if (e.target.value.trim()) setSelectedMaterialId('');
              }}
              placeholder="Paste text here if not using an uploaded document..."
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/5">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedMaterialId && !customText.trim()}
              onClick={() => setStep(2)}
              className="py-2 px-5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-40"
            >
              <span>Next: Quiz Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ----------------- STEP 2: QUIZ PARAMETERS ----------------- */}
      {!isGenerating && step === 2 && (
        <div className="p-6 rounded-2xl border border-white/10 bg-[#11182B] space-y-6">
          <h2 className="text-base font-semibold text-white">Step 2: Quiz Configuration</h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Specific Topic Focus (Optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Glycolysis and ATP Synthase reactions (leave blank for broad coverage)"
              className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Number of Questions:</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                    questionCount === num
                      ? 'bg-violet-600/30 border-violet-500 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Question Types to Include:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'multiple_choice', label: 'Multiple Choice (MCQ)' },
                { id: 'true_false', label: 'True / False' },
                { id: 'fill_in_blank', label: 'Fill-in-the-blank' },
                { id: 'short_answer', label: 'Short Answer' }
              ].map((item) => {
                const isChecked = selectedTypes.includes(item.id as QuestionType);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleType(item.id as QuestionType)}
                    className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Difficulty Tier:</label>
            <div className="grid grid-cols-4 gap-2">
              {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 px-3 text-xs capitalize font-medium rounded-lg border transition-all ${
                    difficulty === d
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 space-y-2 border-t border-white/5 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeExplanations}
                onChange={(e) => setIncludeExplanations(e.target.checked)}
                className="rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
              />
              <span>Generate pedagogical explanations for every answer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSources}
                onChange={(e) => setIncludeSources(e.target.checked)}
                className="rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
              />
              <span>Extract exact supporting source sentence citations</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="py-2 px-5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-2"
            >
              <span>Next: Review &amp; Run</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ----------------- STEP 3: REVIEW SETTINGS ----------------- */}
      {!isGenerating && step === 3 && (
        <div className="p-6 rounded-2xl border border-white/10 bg-[#11182B] space-y-6">
          <h2 className="text-base font-semibold text-white">Step 3: Review Settings Before Generation</h2>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Source:</span>
              <span className="font-semibold text-white">
                {selectedMaterialId
                  ? materials.find((m) => m.id === selectedMaterialId)?.title || 'Selected Document'
                  : 'Custom Direct Text'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Topic Focus:</span>
              <span className="font-semibold text-white">{topic || 'Comprehensive Subject Coverage'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Questions:</span>
              <span className="font-semibold text-cyan-400">{questionCount} Items</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Question Types:</span>
              <span className="font-semibold text-white capitalize">{selectedTypes.join(', ')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Difficulty:</span>
              <span className="font-semibold text-violet-400 capitalize">{difficulty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Quality Evaluation:</span>
              <span className="font-semibold text-emerald-400">9-Criterion LLM-as-a-Judge Enabled</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-white/5">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleStartGeneration}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Quiz Generation &amp; Audit</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------- DEDICATED 7-STAGE LIVE GENERATION EXPERIENCE ----------------- */}
      {isGenerating && (
        <div className="p-8 rounded-2xl border border-violet-500/30 bg-[#11182B] space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 mx-auto flex items-center justify-center text-white shadow-xl shadow-violet-500/25 animate-pulse">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Synthesizing &amp; Auditing Quiz Questions
            </h2>
            <p className="text-xs text-slate-400">
              Generating grounded assessment items using Gemini 3.8 Flash and Transformer semantic similarity.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-medium">Stage {currentStage} of 7</span>
              <span className="font-mono text-slate-400">{Math.round((currentStage / 7) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${(currentStage / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* 7 Stages Checklist */}
          <div className="space-y-2.5 pt-2">
            {stages.map((st) => {
              const isPast = st.id < currentStage;
              const isCurrent = st.id === currentStage;
              return (
                <div
                  key={st.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-violet-600/15 border-violet-500 text-white'
                      : isPast
                      ? 'bg-white/[0.02] border-white/5 text-slate-400'
                      : 'bg-white/[0.01] border-transparent text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <div>
                      <div className={isCurrent ? 'font-semibold text-white' : ''}>{st.name}</div>
                      <div className="text-[11px] text-slate-400">{st.desc}</div>
                    </div>
                  </div>
                  {isPast && <span className="text-[10px] text-emerald-400 font-mono">Completed</span>}
                  {isCurrent && <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Running</span>}
                </div>
              );
            })}
          </div>

          {genError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{genError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
