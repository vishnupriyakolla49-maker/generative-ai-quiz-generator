import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  FileUp,
  BrainCircuit,
  BookOpen,
  BarChart3,
  Bookmark,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Search,
  Bell,
  User,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

interface DashboardLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  setCurrentTab,
  children
}) => {
  const { user, logout, theme, toggleTheme, setCurrentView } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'generate', label: 'Generate Quiz', icon: BrainCircuit },
    { id: 'quizzes', label: 'My Quizzes', icon: BookOpen },
    { id: 'materials', label: 'Study Materials', icon: FileUp },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'saved', label: 'Saved Questions', icon: Bookmark },
    { id: 'settings', label: 'Profile Settings', icon: Settings }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex h-screen bg-[#0B1020] text-[#F8FAFC] overflow-hidden">
      {/* ----------------- SIDEBAR ----------------- */}
      <aside
        className={`relative flex flex-col border-r border-white/5 bg-[#11182B] transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 overflow-hidden text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-violet-500/20 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight text-white block">QuizGenius AI</span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">Quality Assessment</span>
              </div>
            )}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-white/5 bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 font-semibold text-xs flex-shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{user?.fullName || 'Active Learner'}</div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                    {user?.role === 'educator' ? (
                      <ShieldCheck className="w-3 h-3 text-cyan-400 inline" />
                    ) : (
                      <GraduationCap className="w-3 h-3 text-violet-400 inline" />
                    )}
                    <span>{user?.role || 'student'}</span>
                  </div>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#11182B]/60 backdrop-blur-md px-6 flex items-center justify-between z-20 flex-shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-white">
              {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Learner'}
            </h1>
            <p className="text-[11px] text-slate-400">
              Workspace calibrated for {user?.preferredDifficulty || 'mixed'} difficulty assessments
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick action button */}
            <button
              onClick={() => setCurrentTab('generate')}
              className="py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-violet-600/20 flex items-center gap-1.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Quiz</span>
            </button>
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
