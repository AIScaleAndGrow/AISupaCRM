import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/api/auth';
import { logger } from '@/utils/logger';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await signOutUser();
      navigate('/login', { replace: true });
    } catch (error) {
      logger.error('Error signing out', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            AISupaCRM
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {user.email}
            </div>
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="outline"
              size="sm"
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
