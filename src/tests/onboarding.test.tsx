import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OnboardingFlow from '@/pages/onboarding/OnboardingFlow';
import { logger } from '@/utils/logger';

// Mock dependencies
vi.mock('@/utils/logger');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('OnboardingFlow', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset mocks
    vi.clearAllMocks();
    vi.mocked(logger.info).mockImplementation(() => {});
    
    // Mock navigate
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
  });

  it('should load saved progress from localStorage', () => {
    // Setup
    const mockOnboardingData = {
      currentStep: 2,
      steps: {
        userInfo: { fullName: 'John Doe', email: 'john@example.com' },
        preferences: { role: 'Developer' },
      },
      completedSteps: [0, 1],
    };
    localStorage.setItem('onboarding_data', JSON.stringify(mockOnboardingData));

    // Render
    render(
      <BrowserRouter>
        <OnboardingFlow />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('should complete onboarding and redirect to dashboard', async () => {
    // Setup
    const mockOnboardingData = {
      currentStep: 3,
      steps: {
        userInfo: { fullName: 'John Doe', email: 'john@example.com' },
        preferences: { role: 'Developer' },
        companyDetails: { companyName: 'Test Corp' },
      },
      completedSteps: [0, 1, 2],
    };
    localStorage.setItem('onboarding_data', JSON.stringify(mockOnboardingData));

    // Render
    render(
      <BrowserRouter>
        <OnboardingFlow />
      </BrowserRouter>
    );

    // Accept terms and complete onboarding
    const termsCheckbox = screen.getByLabelText(/accept the terms/i);
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByText(/complete setup/i);
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(localStorage.getItem('onboarding_complete')).toBe('true');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      expect(logger.info).toHaveBeenCalledWith('Onboarding completed, redirecting to dashboard');
    });
  });

  it('should prevent navigation to dashboard if onboarding is not complete', () => {
    // Setup - no onboarding data in localStorage

    // Render
    render(
      <BrowserRouter>
        <OnboardingFlow />
      </BrowserRouter>
    );

    // Assert we're on the first step
    expect(screen.getByText('User Info')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith('/dashboard');
  });
});
