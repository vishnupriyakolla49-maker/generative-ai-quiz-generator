import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    closeAuthModal,
    authMode,
    openAuthModal,
    login,
    signup,
    loginAsDemo
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>(authMode);
  const [email, setEmail] = useState('kollavishnu78@gmail.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [fullName, setFullName] = useState('Vishnu Kolla');
  const [role, setRole] = useState<'student' | 'educator'>('student');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setMode(authMode);
    setErrorMsg('');
    setSuccessMsg('');
  }, [authMode]);

  if (!showAuthModal) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      setIsSubmitting(true);
      const ok = await login(email.trim(), password.trim() || 'password123');
      setIsSubmitting(false);
      if (!ok) {
        setErrorMsg('Could not sign in with this email. Please try again.');
      }
    } else if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please provide your full name.');
        return;
      }
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      setIsSubmitting(true);
      const ok = await signup(fullName.trim(), email.trim(), password || 'password123', role);
      setIsSubmitting(false);
      if (!ok) {
        setErrorMsg('Registration encountered an error. Please try again.');
      }
    } else if (mode === 'forgot') {
      if (!email || !email.includes('@')) {
        setErrorMsg('Please enter your registered email address.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg(`If an account exists for ${email}, a password reset link has been dispatched.`);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#11182B] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">QuizGenius AI</h2>
              <p className="text-xs text-slate-400">
                {mode === 'login' && 'Sign in to access your study materials & quizzes'}
                {mode === 'signup' && 'Create your free account'}
                {mode === 'forgot' && 'Reset your account password'}
                {mode === 'verify' && 'Email Verification Status'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode !== 'verify' && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => login('kollavishnu78@gmail.com', 'password123')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600/30 to-cyan-600/30 hover:from-violet-600/40 hover:to-cyan-600/40 border border-violet-500/40 text-violet-200 hover:text-white font-medium text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>One-Click Sign In as kollavishnu78@gmail.com</span>
              </button>
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">or continue below</span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>
            </div>
          )}

          {mode === 'verify' ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/20">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white">Verification Link Sent</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We sent a secure verification email. Please click the link inside your inbox to activate full access.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-lg transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Chen"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                          role === 'student'
                            ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                            : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Student / Learner
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('educator')}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                          role === 'educator'
                            ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                            : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Educator / Teacher
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {mode === 'signup' && password.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1">
                        <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-red-500' : 'bg-slate-700'}`} />
                        <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-amber-500' : 'bg-slate-700'}`} />
                        <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                        <div className={`flex-1 rounded-full ${strength >= 4 ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {strength < 2 && 'Weak password'}
                        {strength === 2 && 'Fair password'}
                        {strength === 3 && 'Strong password'}
                        {strength >= 4 && 'Very strong password'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  <label className="flex items-start gap-2 mt-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-white/20 bg-slate-900 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-xs text-slate-400">
                      I agree to the <span className="text-slate-200 hover:underline">Terms of Service</span> and{' '}
                      <span className="text-slate-200 hover:underline">Privacy Policy</span>.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-xs rounded-lg transition-all shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'signup' && 'Create Account'}
                      {mode === 'forgot' && 'Send Recovery Email'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-[11px] text-center text-slate-400 mb-2.5 font-medium">
              Instant Demo Access (No password required)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo('student')}
                className="py-2 px-3 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Alex (Student)</span>
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo('educator')}
                className="py-2 px-3 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-200 hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Prof. Miller</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="mt-5 text-center text-xs text-slate-400">
            {mode === 'login' && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-violet-400 hover:text-violet-300 font-medium ml-1"
                >
                  Create one now
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-violet-400 hover:text-violet-300 font-medium ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-violet-400 hover:text-violet-300 font-medium ml-1"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
