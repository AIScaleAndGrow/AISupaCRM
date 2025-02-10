import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    logger.info('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Special case: Don't check onboarding status for these paths
  const bypassPaths = ['/onboarding', '/login'];
  if (bypassPaths.includes(location.pathname)) {
    return children || <Outlet />;
  }

  // Check onboarding status
  const isOnboardingComplete = localStorage.getItem('onboarding_complete') === 'true';
  if (!isOnboardingComplete) {
    logger.info('Onboarding incomplete, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
