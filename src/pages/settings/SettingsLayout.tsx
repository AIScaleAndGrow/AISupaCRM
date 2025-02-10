import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const settingsNavItems = [
  {
    path: '/settings/your-account',
    label: 'Your Account',
    description: 'Manage your personal information and preferences',
  },
  {
    path: '/settings/company-details',
    label: 'Company Details',
    description: 'Update your company information and branding',
  },
  {
    path: '/settings/permissions',
    label: 'Permissions',
    description: 'Configure user roles and access controls',
  },
  {
    path: '/settings/integrations',
    label: 'Integrations',
    description: 'Connect with third-party services and tools',
  },
  {
    path: '/settings/notifications',
    label: 'Notifications',
    description: 'Customize your notification preferences',
  },
];

export function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {settingsNavItems.map(({ path, label, description }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'block p-3 rounded-lg transition-colors',
                  location.pathname === path
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-500">{description}</div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
