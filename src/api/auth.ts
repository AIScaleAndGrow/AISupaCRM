import { AUTH_CONFIG } from '@/config/auth';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

interface AuthResponse {
  user: GoogleUser;
  token: string;
  isNewUser: boolean;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const auth = {
  /**
   * Initiates Google OAuth login flow
   */
  async initiateGoogleAuth(): Promise<string> {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    const params = {
      client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
      redirect_uri: AUTH_CONFIG.AUTH_REDIRECT_URL,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ].join(' '),
      prompt: 'select_account',
    };

    googleAuthUrl.search = new URLSearchParams(params).toString();
    return googleAuthUrl.toString();
  },

  /**
   * Handles the OAuth callback and exchanges code for tokens
   */
  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
          client_secret: AUTH_CONFIG.GOOGLE_CLIENT_SECRET,
          redirect_uri: AUTH_CONFIG.AUTH_REDIRECT_URL,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Token exchange failed:', errorData);
        throw new AuthError('Failed to exchange code for tokens');
      }

      const { access_token } = await tokenResponse.json();

      // Get user info using access token
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        console.error('User info fetch failed:', errorData);
        throw new AuthError('Failed to fetch user info');
      }

      const userData: GoogleUser = await userResponse.json();
      
      // Generate a token for our app
      const token = generateToken(userData);

      return {
        user: userData,
        token,
        isNewUser: true, // We'll always treat them as new for onboarding
      };
    } catch (error) {
      console.error('Auth error:', error);
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Authentication failed');
    }
  },

  /**
   * Validates token and returns user data
   */
  async validateToken(token: string): Promise<GoogleUser> {
    try {
      // Decode the token to get the user ID
      const userId = decodeToken(token);
      
      // Get user data from localStorage
      const userData = localStorage.getItem(`user_${userId}`);
      if (!userData) {
        throw new AuthError('User not found');
      }

      return JSON.parse(userData) as GoogleUser;
    } catch (error) {
      throw new AuthError('Invalid token');
    }
  },
};

// Simple token generation and validation
// In a real app, you would use proper JWT library
function generateToken(user: GoogleUser): string {
  // Create a simple base64 encoded token with user ID
  const payload = { id: user.id, timestamp: Date.now() };
  return btoa(JSON.stringify(payload));
}

function decodeToken(token: string): string {
  try {
    const decoded = JSON.parse(atob(token));
    // Check if token is expired (24 hours)
    if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
      throw new Error('Token expired');
    }
    return decoded.id;
  } catch {
    throw new Error('Invalid token');
  }
}
