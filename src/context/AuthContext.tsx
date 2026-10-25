import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { fetchProfile, updateProfile, loginUser, signupUser } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (fullName: string, email: string, pass: string, role: 'student' | 'educator') => Promise<boolean>;
  loginAsDemo: (role: 'student' | 'educator') => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  showAuthModal: boolean;
  authMode: 'login' | 'signup' | 'forgot' | 'verify';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot' | 'verify') => void;
  closeAuthModal: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>('login');
  const [currentView, setCurrentView] = useState<string>('landing');

  // Initialize from localStorage and backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedTheme = localStorage.getItem('quizgenius_theme') as 'dark' | 'light';
        if (storedTheme) {
          setTheme(storedTheme);
          applyTheme(storedTheme);
        } else {
          applyTheme('dark');
        }

        const savedEmail = localStorage.getItem('quizgenius_userEmail');
        const savedUserId = localStorage.getItem('quizgenius_userId');
        
        let profile = null;
        if (savedEmail) {
          profile = await fetchProfile(savedEmail);
        } else if (savedUserId) {
          profile = await fetchProfile(savedUserId);
        }

        if (profile) {
          setUser(profile);
          if (profile.themePreference) {
            setTheme(profile.themePreference);
            applyTheme(profile.themePreference);
          }
        }
      } catch (err) {
        console.warn('Profile fetch error, using fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const applyTheme = (t: 'dark' | 'light') => {
    if (t === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('quizgenius_theme', next);
    applyTheme(next);
    if (user) {
      updateProfile({ id: user.id, themePreference: next }).catch(console.error);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await loginUser(email, pass);
      if (res && res.profile) {
        setUser(res.profile);
        localStorage.setItem('quizgenius_userId', res.profile.id);
        localStorage.setItem('quizgenius_userEmail', res.profile.email);
        setShowAuthModal(false);
        setCurrentView('dashboard');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    fullName: string,
    email: string,
    pass: string,
    role: 'student' | 'educator'
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await signupUser(fullName, email, pass, role);
      if (res && res.profile) {
        setUser(res.profile);
        localStorage.setItem('quizgenius_userId', res.profile.id);
        localStorage.setItem('quizgenius_userEmail', res.profile.email);
        setShowAuthModal(false);
        setCurrentView('dashboard');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Signup error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role: 'student' | 'educator') => {
    setIsLoading(true);
    try {
      const id = role === 'educator' ? 'usr-demo-educator' : 'usr-demo-student';
      const prof = await fetchProfile(id);
      setUser(prof);
      localStorage.setItem('quizgenius_userId', prof.id);
      localStorage.setItem('quizgenius_userEmail', prof.email);
      setShowAuthModal(false);
      setCurrentView('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('quizgenius_userId');
    localStorage.removeItem('quizgenius_userEmail');
    setUser(null);
    setCurrentView('landing');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = await updateProfile({ id: user.id, ...data });
    setUser(updated);
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' | 'verify' = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        theme,
        toggleTheme,
        login,
        signup,
        loginAsDemo,
        logout,
        updateUserProfile,
        showAuthModal,
        authMode,
        openAuthModal,
        closeAuthModal,
        currentView,
        setCurrentView
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
