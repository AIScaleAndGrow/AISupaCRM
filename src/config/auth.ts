export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: import.meta.env.VITE_GOOGLE_CLIENT_SECRET as string,
  JWT_SECRET: import.meta.env.VITE_JWT_SECRET || 'your-development-secret',
  AUTH_REDIRECT_URL: import.meta.env.VITE_AUTH_REDIRECT_URL || 'http://localhost:5173/auth/callback',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};
