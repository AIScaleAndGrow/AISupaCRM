import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { OnboardingFlow } from '@/pages/onboarding/OnboardingFlow';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { SettingsLayout } from '@/pages/settings/SettingsLayout';
import AccountSettingsPage from '@/pages/settings/your-account';
import CompanySettingsPage from '@/pages/settings/company-details';
import { PermissionsSettingsPage } from '@/pages/settings/permissions/PermissionsSettingsPage';
import { IntegrationsSettingsPage } from '@/pages/settings/integrations/IntegrationsSettingsPage';
import { NotificationsSettingsPage } from '@/pages/settings/notifications/NotificationsSettingsPage';
import LoginPage from '@/pages/auth/login';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/onboarding/*" element={<OnboardingFlow />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route path="your-account" element={<AccountSettingsPage />} />
              <Route path="company-details" element={<CompanySettingsPage />} />
              <Route path="permissions" element={<PermissionsSettingsPage />} />
              <Route path="integrations" element={<IntegrationsSettingsPage />} />
              <Route path="notifications" element={<NotificationsSettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
