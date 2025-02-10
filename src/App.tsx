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
import SettingsLayout from '@/pages/settings/SettingsLayout';
import AccountSettingsPage from '@/pages/settings/your-account';
import CompanySettingsPage from '@/pages/settings/company-details';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
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

              {/* Settings Routes */}
              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="/settings/your-account" replace />} />
                <Route path="your-account" element={<AccountSettingsPage />} />
                <Route path="company-details" element={<CompanySettingsPage />} />
                <Route path="permissions" element={<div>Permissions Settings (Coming Soon)</div>} />
                <Route path="integrations" element={<div>Integrations Settings (Coming Soon)</div>} />
                <Route path="notifications" element={<div>Notifications Settings (Coming Soon)</div>} />
              </Route>
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
