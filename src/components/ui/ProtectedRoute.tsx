import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    logger.info('Protected route check', { path: location.pathname });
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if onboarding is complete
  const isOnboardingComplete = localStorage.getItem('onboarding_complete') === 'true';
  if (!isOnboardingComplete && location.pathname !== '/onboarding') {
    logger.info('User has not completed onboarding, redirecting...');
    return <Navigate to="/onboarding" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
