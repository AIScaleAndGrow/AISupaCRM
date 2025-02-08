import React from 'react';
import { Outlet } from 'react-router-dom';

const OnboardingLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default OnboardingLayout;
