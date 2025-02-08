import { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      logger.info('Auth state changed', { user: user?.email });
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      logger.info('Successfully signed in with Google', { email: result.user.email });
    } catch (error) {
      logger.error('Error signing in with Google', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // First, clear all local storage data
      localStorage.clear();
      
      // Then sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear user state
      setUser(null);
      
      logger.info('Successfully signed out and cleared all data');
    } catch (error) {
      logger.error('Error signing out', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
