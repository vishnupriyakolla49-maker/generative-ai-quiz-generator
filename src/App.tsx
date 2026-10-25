import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/dashboard/OnboardingModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { MaterialsPage } from './components/materials/MaterialsPage';
import { GenerateQuizWizard } from './components/generate/GenerateQuizWizard';
import { QualityEvaluationDashboard } from './components/evaluation/QualityEvaluationDashboard';
import { QuizPlayer } from './components/quiz/QuizPlayer';
import { QuizResults } from './components/quiz/QuizResults';
import { MyQuizzesPage } from './components/quiz/MyQuizzesPage';
import { SavedQuestionsPage } from './components/saved/SavedQuestionsPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { ExportModal } from './components/export/ExportModal';
import { Quiz, QuizAttempt, StudyMaterial } from './types';
import { fetchQuiz, fetchAttempt, fetchQuizzes } from './services/api';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, user, openAuthModal, isAuthenticated } = useAuth();

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Active entities in view
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null);
  const [selectedMaterialForGen, setSelectedMaterialForGen] = useState<StudyMaterial | null>(null);

  // Export Modal state
  const [exportQuiz, setExportQuiz] = useState<Quiz | null>(null);

  const handleStartGenerate = () => {
    if (isAuthenticated) {
      setActiveTab('generate');
      setCurrentView('dashboard');
    } else {
      openAuthModal('signup');
    }
  };

  const handleTrySampleQuiz = async () => {
    try {
      const quizzes = await fetchQuizzes();
      if (quizzes.length > 0) {
        setActiveQuiz(quizzes[0]);
        setCurrentView('take-quiz');
      } else {
        setActiveTab('generate');
        setCurrentView('dashboard');
      }
    } catch {
      setActiveTab('generate');
      setCurrentView('dashboard');
    }
  };

  const handleTakeQuiz = async (quizId: string) => {
    try {
      const q = await fetchQuiz(quizId);
      setActiveQuiz(q);
      setCurrentView('take-quiz');
    } catch (err) {
      console.error(err);
    }
  };

  const handleInspectQuality = async (quizId: string) => {
    try {
      const q = await fetchQuiz(quizId);
      setActiveQuiz(q);
      setCurrentView('quality-evaluation');
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResults = async (attemptId: string) => {
    try {
      const att = await fetchAttempt(attemptId);
      const q = await fetchQuiz(att.quizId);
      setActiveAttempt(att);
      setActiveQuiz(q);
      setCurrentView('results');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateFromMaterial = (material: StudyMaterial) => {
    setSelectedMaterialForGen(material);
    setActiveTab('generate');
  };

  const handleQuizGenerated = (newQuiz: Quiz) => {
    setActiveQuiz(newQuiz);
    setCurrentView('quality-evaluation');
  };

  const handleQuizCompleted = (attempt: QuizAttempt) => {
    setActiveAttempt(attempt);
    setCurrentView('results');
  };

  return (
    <>
      {/* ----------------- PAGE 1: LANDING PAGE ----------------- */}
      {currentView === 'landing' && (
        <LandingPage
          onStartQuiz={handleStartGenerate}
          onExploreFeatures={() => {
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onTrySample={handleTrySampleQuiz}
        />
      )}

      {/* ----------------- ONBOARDING ----------------- */}
      {currentView === 'onboarding' && (
        <OnboardingModal
          onComplete={(action) => {
            if (action === 'upload') {
              setActiveTab('materials');
              setCurrentView('dashboard');
            } else if (action === 'sample') {
              handleTrySampleQuiz();
            } else {
              setActiveTab('overview');
              setCurrentView('dashboard');
            }
          }}
        />
      )}

      {/* ----------------- DASHBOARD VIEWS ----------------- */}
      {currentView === 'dashboard' && (
        <DashboardLayout currentTab={activeTab} setCurrentTab={setActiveTab}>
          {activeTab === 'overview' && (
            <OverviewView
              onNavigate={(tab) => setActiveTab(tab)}
              onTakeQuiz={handleTakeQuiz}
              onInspectQuality={handleInspectQuality}
              onViewResults={handleViewResults}
            />
          )}

          {activeTab === 'generate' && (
            <GenerateQuizWizard
              initialMaterial={selectedMaterialForGen}
              onQuizGenerated={handleQuizGenerated}
              onCancel={() => {
                setSelectedMaterialForGen(null);
                setActiveTab('overview');
              }}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsPage
              onGenerateQuizFromMaterial={handleGenerateFromMaterial}
            />
          )}

          {activeTab === 'quizzes' && (
            <MyQuizzesPage
              onTakeQuiz={handleTakeQuiz}
              onInspectQuality={handleInspectQuality}
              onCreateNew={() => setActiveTab('generate')}
            />
          )}

          {activeTab === 'saved' && <SavedQuestionsPage />}

          {activeTab === 'analytics' && <AnalyticsPage />}

          {activeTab === 'settings' && <SettingsPage />}
        </DashboardLayout>
      )}

      {/* ----------------- TAKE QUIZ EXPERIENCE ----------------- */}
      {currentView === 'take-quiz' && activeQuiz && (
        <div className="min-h-screen bg-[#0B1020] p-4 sm:p-6 lg:p-8">
          <QuizPlayer
            quiz={activeQuiz}
            onComplete={handleQuizCompleted}
            onExit={() => setCurrentView('dashboard')}
          />
        </div>
      )}

      {/* ----------------- QUIZ RESULTS & REVIEW ----------------- */}
      {currentView === 'results' && activeQuiz && activeAttempt && (
        <div className="min-h-screen bg-[#0B1020] p-4 sm:p-6 lg:p-8">
          <QuizResults
            quiz={activeQuiz}
            attempt={activeAttempt}
            onRetake={() => setCurrentView('take-quiz')}
            onInspectQuality={() => setCurrentView('quality-evaluation')}
            onDashboard={() => setCurrentView('dashboard')}
            onExport={() => setExportQuiz(activeQuiz)}
          />
        </div>
      )}

      {/* ----------------- QUALITY EVALUATION DASHBOARD ----------------- */}
      {currentView === 'quality-evaluation' && activeQuiz && (
        <div className="min-h-screen bg-[#0B1020] p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <QualityEvaluationDashboard
              quiz={activeQuiz}
              onTakeQuiz={(qId) => handleTakeQuiz(qId)}
              onBack={() => setCurrentView('dashboard')}
              onExport={() => setExportQuiz(activeQuiz)}
            />
          </div>
        </div>
      )}

      {/* ----------------- AUTH MODAL ----------------- */}
      <AuthModal />

      {/* ----------------- EXPORT MODAL ----------------- */}
      {exportQuiz && (
        <ExportModal
          quiz={exportQuiz}
          onClose={() => setExportQuiz(null)}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
