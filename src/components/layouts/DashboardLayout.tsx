import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Target,
  CheckSquare,
  BarChart2,
  LogOut,
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      logger.error('Error signing out', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/opportunities', label: 'Opportunities', icon: Target },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && <span className="font-bold text-xl">AISupaCRM</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-4 py-2 mb-1 text-gray-700 hover:bg-gray-100 ${
                location.pathname === path ? 'bg-gray-100' : ''
              }`}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t p-4">
          {!isCollapsed && (
            <div className="mb-2 text-sm text-gray-600">{user?.email}</div>
          )}
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Sign out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
