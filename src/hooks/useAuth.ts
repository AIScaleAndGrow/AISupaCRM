import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthUser } from '../api/auth';
import { logger } from '../utils/logger';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          fullName: firebaseUser.displayName || '',
          picture: firebaseUser.photoURL || undefined,
        };
        setUser(authUser);
        logger.info('Auth state changed: User logged in', { uid: authUser.uid });
      } else {
        setUser(null);
        logger.info('Auth state changed: User logged out');
      }
      setLoading(false);
    }, (error) => {
      logger.error('Auth state change error', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
  };
};
