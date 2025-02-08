import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { logger } from '../utils/logger';

export interface AuthUser {
  uid: string;
  email: string;
  fullName: string;
  picture?: string;
}

export const googleAuth = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleAuth);
    const user = result.user;

    const authUser: AuthUser = {
      uid: user.uid,
      email: user.email || '',
      fullName: user.displayName || '',
      picture: user.photoURL || undefined,
    };

    logger.info('User signed in successfully', { uid: authUser.uid });
    return authUser;
  } catch (error) {
    logger.error('Google sign-in error', error);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    // First clear all application data
    localStorage.clear();
    sessionStorage.clear();

    // Then sign out from Firebase
    await signOut(auth);
    
    // Force reload the page to clear any in-memory state
    window.location.href = '/auth/login';
    
    logger.info('User signed out successfully');
  } catch (error) {
    logger.error('Sign-out error', error);
    throw error;
  }
};
