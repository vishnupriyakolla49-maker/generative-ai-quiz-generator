import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  GraduationCap,
  ShieldCheck,
  Moon,
  Sun,
  Globe,
  Sliders,
  CheckCircle2,
  Trash2,
  LogOut,
  Save
} from 'lucide-react';
import { Difficulty } from '../../types';

export const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, theme, toggleTheme, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [role, setRole] = useState<'student' | 'educator'>(user?.role || 'student');
  const [difficulty, setDifficulty] = useState<Difficulty>(user?.preferredDifficulty || 'mixed');
  const [language, setLanguage] = useState<string>(user?.preferredLanguage || 'English');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      fullName,
      role,
      preferredDifficulty: difficulty,
      preferredLanguage: language
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Account &amp; Learning Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure your personal profile, assessment difficulty preferences, and interface theme.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#11182B] space-y-6">
        {savedMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              disabled
              value={user?.email || 'user@example.com'}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/40 border border-white/5 rounded-lg text-xs text-slate-400 cursor-not-allowed font-mono"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Managed via authentication provider</p>
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Account Role</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                role === 'student'
                  ? 'bg-violet-600/20 border-violet-500 text-white'
                  : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <div>
                <div className="font-semibold text-white">Student</div>
                <div className="text-[10px] text-slate-400">Personal study &amp; practice</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('educator')}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-2.5 ${
                role === 'educator'
                  ? 'bg-violet-600/20 border-violet-500 text-white'
                  : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-semibold text-white">Educator / Teacher</div>
                <div className="text-[10px] text-slate-400">Exam generation &amp; quality audits</div>
              </div>
            </button>
          </div>
        </div>

        {/* Preferred Difficulty */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Default Assessment Difficulty</label>
          <div className="grid grid-cols-4 gap-2">
            {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`py-2 px-3 text-xs capitalize font-medium rounded-lg border transition-all ${
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

        {/* Language */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Generation Language</label>
          <div className="relative">
            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
              <option value="Japanese">Japanese (日本語)</option>
            </select>
          </div>
        </div>

        {/* Theme */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <div className="text-xs font-medium text-slate-300">Interface Theme</div>
            <div className="text-[11px] text-slate-500">Toggle dark or light workspace palette</div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="py-1.5 px-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center gap-1.5"
          >
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-violet-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span className="capitalize">{theme} Theme</span>
          </button>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/5">
          <button
            type="button"
            onClick={logout}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            className="py-2 px-5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
