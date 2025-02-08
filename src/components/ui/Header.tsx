import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/api/auth';
import { logger } from '@/utils/logger';

export default function Header() {
  const { user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await signOutUser();
      // No need to navigate, signOutUser will handle it
    } catch (error) {
      logger.error('Error signing out', error);
      alert('Failed to sign out. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">AISupaCRM</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {user.email}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </header>
  );
}
