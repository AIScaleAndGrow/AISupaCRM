import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Double-check onboarding completion
    const onboardingData = localStorage.getItem('onboarding_data');
    if (!onboardingData) {
      logger.info('No onboarding data found, redirecting to onboarding');
      navigate('/onboarding');
      return;
    }

    try {
      const { completedSteps } = JSON.parse(onboardingData);
      if (!completedSteps.includes(3)) {
        logger.info('Onboarding not completed, redirecting');
        navigate('/onboarding');
      }
    } catch (error) {
      logger.error('Error parsing onboarding data', error);
      navigate('/onboarding');
    }
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      logger.error('Error signing out', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Welcome, {user?.displayName || 'User'}!</h2>
          <p className="text-muted-foreground">
            Your dashboard is ready. Start managing your business with AISupaCRM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Recent Leads</h3>
            <p className="text-muted-foreground">No leads yet</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Active Opportunities</h3>
            <p className="text-muted-foreground">No opportunities yet</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-2">Tasks</h3>
            <p className="text-muted-foreground">No tasks yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
