export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_in_blank' | 'short_answer';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'educator';
  preferredDifficulty: Difficulty;
  preferredLanguage: string;
  themePreference: 'dark' | 'light';
  onboardingCompleted: boolean;
  avatarSeed?: string;
  createdAt: string;
}

export interface DocumentChunk {
  id: string;
  materialId: string;
  chunkIndex: number;
  content: string;
  pageNumber?: number;
  wordCount: number;
  keyConcepts: string[];
}

export interface StudyMaterial {
  id: string;
  userId: string;
  title: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'pasted';
  fileSize: number;
  charCount: number;
  extractedText: string;
  chunks: DocumentChunk[];
  processingStatus: 'ready' | 'processing' | 'error';
  createdAt: string;
}

export interface CriterionScores {
  relevance: number;             // Weight: 20%
  answerCorrectness: number;     // Weight: 20%
  sourceFaithfulness: number;    // Weight: 15%
  clarity: number;               // Weight: 10%
  completeness: number;          // Weight: 10%
  difficultyAlignment: number;   // Weight: 10%
  distractorQuality: number;     // Weight: 5%
  grammar: number;               // Weight: 5%
  diversity: number;             // Weight: 5%
}

export interface CriticalFlags {
  hasUnsupportedClaim: boolean;
  hasIncorrectAnswer: boolean;
  hasAmbiguousOptions: boolean;
  isUnanswerable: boolean;
  notes: string[];
}

export interface QuestionEvaluation {
  questionId: string;
  criterionScores: CriterionScores;
  weightedScore: number;         // 0 - 100
  semanticSimilarity: number;    // 0 - 1.0 (Transformer similarity to source chunk)
  criticalFlags: CriticalFlags;
  evaluatorExplanation: string;
  modelIdentifier: string;
  status: 'excellent' | 'good' | 'needs_review' | 'refined' | 'rejected';
  revisedFromPreviousScore?: number;
  revisionNotes?: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: QuestionType;
  options: string[];             // Populated for multiple_choice & true_false
  correctAnswer: string;
  explanation: string;
  sourcePassage: string;
  sourceChunkId?: string;
  difficulty: Difficulty;
  keyConcept: string;
  evaluation?: QuestionEvaluation;
  isFlagged?: boolean;
  isSaved?: boolean;
  originalText?: string;
  refinedCount?: number;
}

export interface QuizGenerationSettings {
  materialId?: string;
  rawText?: string;
  topic: string;
  questionCount: number;
  questionTypes: QuestionType[];
  difficulty: Difficulty;
  language: string;
  includeExplanations: boolean;
  includeSourceReferences: boolean;
  randomizeOrder: boolean;
}

export interface Quiz {
  id: string;
  userId: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
  questionTypes: QuestionType[];
  qualityOverallScore: number;
  status: 'ready' | 'draft' | 'generating';
  materialId?: string;
  materialTitle?: string;
  questions: Question[];
  createdAt: string;
}

export interface AttemptAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  answers: Record<string, string>;
  details: AttemptAnswer[];
  completedAt: string;
}

export interface SavedQuestion {
  id: string;
  userId: string;
  question: Question;
  quizTitle: string;
  savedAt: string;
}

export interface GenerationProgress {
  stage: number;
  stageName: string;
  detail: string;
  percentage: number;
}
