import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!loading) {
          if (!user) {
            // User is not authenticated, redirect to login
            navigate('/auth/login', { state: { from: location.pathname } });
            return;
          }

          if (requireOnboarding) {
            // Check if onboarding is complete
            const isOnboardingComplete = localStorage.getItem('onboarding_complete') === 'true';
            
            if (!isOnboardingComplete && location.pathname !== '/onboarding') {
              logger.info('User has not completed onboarding, redirecting...');
              navigate('/onboarding');
              return;
            }
          }
        }
      } catch (error) {
        logger.error('Error in auth check', error);
        navigate('/auth/login');
      }
    };

    checkAuth();
  }, [user, loading, navigate, location, requireOnboarding]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
