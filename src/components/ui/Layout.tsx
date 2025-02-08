import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/leads', label: 'Leads' },
    { path: '/opportunities', label: 'Opportunities' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/reports', label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-4 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
