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
    const provider = new GoogleAuthProvider();
    await signInWithPopup(firebaseAuth, provider);
    logger.info('User signed in successfully with Google');
  } catch (error) {
    logger.error('Error signing in with Google:', error);
    throw new AuthError('Failed to sign in with Google');
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(firebaseAuth);
    logger.info('User signed out successfully');
  } catch (error) {
    logger.error('Error signing out:', error);
    throw new AuthError('Failed to sign out');
  }
};
