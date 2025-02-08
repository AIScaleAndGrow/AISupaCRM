import { AUTH_CONFIG } from '@/config/auth';
import { logger } from '@/utils/logger';
import { auth as firebaseAuth } from '@/config/firebase';
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string;
  fullName: string;
  picture?: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const signInWithGoogle = async (): Promise<void> => {
  try {
    logger.info('Initiating Google sign in');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(firebaseAuth, provider);
    logger.info('Successfully signed in with Google');
  } catch (error) {
    logger.error('Error signing in with Google', error);
    throw new AuthError('Failed to sign in with Google');
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    logger.info('Signing out user');
    await signOut(firebaseAuth);
    localStorage.removeItem('onboarding_data');
    logger.info('Successfully signed out');
  } catch (error) {
    logger.error('Error signing out', error);
    throw new AuthError('Failed to sign out');
  }
};
