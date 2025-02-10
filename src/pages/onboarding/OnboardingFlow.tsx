import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInformationStep from './steps/UserInformationStep';
import PreferencesStep from './steps/PreferencesStep';
import CompanyDetailsStep from './steps/CompanyDetailsStep';
import ConfirmationStep from './steps/ConfirmationStep';
import { logger } from '@/utils/logger';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Check if onboarding is already complete
  useEffect(() => {
    const isComplete = localStorage.getItem('onboarding_complete') === 'true';
    if (isComplete) {
      logger.info('Onboarding already complete, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Load saved progress
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      const { currentStep: savedStep } = JSON.parse(savedData);
      setCurrentStep(savedStep);
    }
  }, [navigate]);

  const completeOnboarding = () => {
    // Mark onboarding as complete first
    localStorage.setItem('onboarding_complete', 'true');
    logger.info('Onboarding marked as complete');

    // Small delay to ensure localStorage is updated
    setTimeout(() => {
      logger.info('Redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }, 100);
  };

  const handleStepComplete = (stepData: any) => {
    const savedData = localStorage.getItem('onboarding_data') || '{}';
    const onboardingData = JSON.parse(savedData);
    
    const updatedData = {
      ...onboardingData,
      currentStep: currentStep + 1,
      steps: {
        ...onboardingData.steps,
        [getStepKey(currentStep)]: stepData,
      },
      completedSteps: [...(onboardingData.completedSteps || []), currentStep],
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem('onboarding_data', JSON.stringify(updatedData));
    logger.info(`Step ${currentStep} completed`, { stepData });

    if (currentStep === 3) {
      completeOnboarding();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const savedData = localStorage.getItem('onboarding_data') || '{}';
      const onboardingData = JSON.parse(savedData);
      
      const updatedData = {
        ...onboardingData,
        currentStep: currentStep - 1,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem('onboarding_data', JSON.stringify(updatedData));
      setCurrentStep(currentStep - 1);
      logger.info(`Navigated back to step ${currentStep - 1}`);
    }
  };

  const getStepKey = (step: number): string => {
    switch (step) {
      case 0:
        return 'userInfo';
      case 1:
        return 'preferences';
      case 2:
        return 'companyDetails';
      case 3:
        return 'confirmation';
      default:
        return '';
    }
  };

  const renderStep = () => {
    const commonProps = {
      onComplete: handleStepComplete,
      onBack: handleBack,
      savedData: JSON.parse(localStorage.getItem('onboarding_data') || '{}'),
    };

    switch (currentStep) {
      case 0:
        return <UserInformationStep {...commonProps} />;
      case 1:
        return <PreferencesStep {...commonProps} />;
      case 2:
        return <CompanyDetailsStep {...commonProps} />;
      case 3:
        return <ConfirmationStep {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to AISupaCRM</h1>
        <p className="text-gray-600">Let's get your account set up</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['User Info', 'Preferences', 'Company', 'Confirm'].map((label, index) => (
            <div
              key={label}
              className={`flex items-center ${
                index < currentStep
                  ? 'text-blue-600'
                  : index === currentStep
                  ? 'text-gray-900'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? 'bg-blue-600 text-white'
                    : index === currentStep
                    ? 'bg-white border-2 border-blue-600'
                    : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingFlow;
