import {
  UserProfile,
  StudyMaterial,
  Quiz,
  Question,
  QuizAttempt,
  SavedQuestion,
  QuizGenerationSettings
} from '../types';

export const API_BASE = '/api';

export async function loginUser(email: string, password?: string): Promise<{ success: boolean; profile: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to sign in');
  }
  return await res.json();
}

export async function signupUser(
  fullName: string,
  email: string,
  password?: string,
  role: 'student' | 'educator' = 'student'
): Promise<{ success: boolean; profile: UserProfile }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, role })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to register account');
  }
  return await res.json();
}

export async function fetchProfile(identifier: string = 'usr-demo-student'): Promise<UserProfile> {
  const param = identifier.includes('@')
    ? `email=${encodeURIComponent(identifier)}`
    : `userId=${encodeURIComponent(identifier)}`;
  const res = await fetch(`${API_BASE}/profile?${param}`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  const data = await res.json();
  return data.profile;
}

export async function updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const data = await res.json();
  return data.profile;
}

export async function fetchMaterials(userId: string = 'usr-demo-student'): Promise<StudyMaterial[]> {
  const res = await fetch(`${API_BASE}/materials?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch study materials');
  const data = await res.json();
  return data.materials;
}

export async function extractDocument(payload: {
  title: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'pasted';
  base64Content?: string;
  rawText?: string;
  userId?: string;
}): Promise<StudyMaterial> {
  const res = await fetch(`${API_BASE}/materials/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to extract document');
  }
  const data = await res.json();
  return data.material;
}

export async function deleteMaterial(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/materials/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete material');
}

export async function generateQuiz(settings: QuizGenerationSettings & { userId?: string }): Promise<Quiz> {
  const res = await fetch(`${API_BASE}/quizzes/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate quiz');
  }
  const data = await res.json();
  return data.quiz;
}

export async function refineQuestion(payload: {
  questionId: string;
  quizId: string;
  targetImprovement?: string;
}): Promise<{ question: Question; quizQualityScore: number }> {
  const res = await fetch(`${API_BASE}/questions/${payload.questionId}/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to refine question');
  }
  return await res.json();
}

export async function fetchQuizzes(userId: string = 'usr-demo-student'): Promise<Quiz[]> {
  const res = await fetch(`${API_BASE}/quizzes?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch quizzes');
  const data = await res.json();
  return data.quizzes;
}

export async function fetchQuiz(id: string): Promise<Quiz> {
  const res = await fetch(`${API_BASE}/quizzes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch quiz');
  const data = await res.json();
  return data.quiz;
}

export async function deleteQuiz(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/quizzes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete quiz');
}

export async function submitQuizAttempt(payload: {
  quizId: string;
  userId?: string;
  answers: Record<string, string>;
  timeSpentSeconds: number;
}): Promise<QuizAttempt> {
  const res = await fetch(`${API_BASE}/attempts/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit quiz attempt');
  }
  const data = await res.json();
  return data.attempt;
}

export async function fetchAttempts(userId: string = 'usr-demo-student'): Promise<QuizAttempt[]> {
  const res = await fetch(`${API_BASE}/attempts?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch quiz attempts');
  const data = await res.json();
  return data.attempts;
}

export async function fetchAttempt(id: string): Promise<QuizAttempt> {
  const res = await fetch(`${API_BASE}/attempts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch attempt');
  const data = await res.json();
  return data.attempt;
}

export async function fetchSavedQuestions(userId: string = 'usr-demo-student'): Promise<SavedQuestion[]> {
  const res = await fetch(`${API_BASE}/saved-questions?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch saved questions');
  const data = await res.json();
  return data.savedQuestions;
}

export async function toggleSaveQuestion(
  question: Question,
  quizTitle: string,
  userId: string = 'usr-demo-student'
): Promise<{ saved: boolean }> {
  const res = await fetch(`${API_BASE}/saved-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, quizTitle, userId })
  });
  if (!res.ok) throw new Error('Failed to bookmark question');
  return await res.json();
}

export async function fetchAnalytics(userId: string = 'usr-demo-student'): Promise<any> {
  const res = await fetch(`${API_BASE}/analytics?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  const data = await res.json();
  return data.analytics;
}
