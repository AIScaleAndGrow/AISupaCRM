import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginPage from '@/pages/auth/login';
import OnboardingLayout from '@/components/layouts/OnboardingLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import OnboardingFlow from '@/pages/onboarding/OnboardingFlow';
import Dashboard from '@/pages/dashboard';
import LeadsPage from '@/pages/leads';
import OpportunitiesPage from '@/pages/opportunities';
import TasksPage from '@/pages/tasks';
import ReportsPage from '@/pages/reports';
import ProtectedRoute from '@/components/ui/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Onboarding Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<OnboardingLayout />}>
              <Route path="/onboarding/*" element={<OnboardingFlow />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
          </Route>

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
