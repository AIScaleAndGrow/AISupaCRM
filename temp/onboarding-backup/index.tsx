import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import UserInformationStep from './steps/UserInformationStep';
import PreferencesStep from './steps/PreferencesStep';
import CompanyDetailsStep from './steps/CompanyDetailsStep';
import ConfirmationStep from './steps/ConfirmationStep';
import OnboardingProgress from './components/OnboardingProgress';
import { OnboardingData } from './types';
import { logger } from '@/utils/logger';

const STORAGE_KEY = 'onboarding_data';

const initialData: OnboardingData = {
  currentStep: 0,
  steps: {
    userInfo: {
      fullName: '',
      email: '',
      phoneNumber: '',
      jobTitle: '',
      department: '',
    },
    preferences: {
      role: '',
      department: '',
      interests: [],
    },
    companyDetails: {
      companyName: '',
      website: '',
      industry: '',
      companySize: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
    confirmation: {
      termsAccepted: false,
      marketingConsent: false,
    },
  },
  completedSteps: [],
  lastUpdated: new Date().toISOString(),
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      currentStep: 0,
      completedSteps: [0], 
      steps: {
        userInfo: {} as any,
        preferences: {} as any,
        companyDetails: {} as any,
        confirmation: {} as any,
      },
      lastUpdated: new Date().toISOString(),
    };
  });
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        logger.error('Error loading saved onboarding data', error);
      }
    }
  }, []);

  const saveData = (newData: OnboardingData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      logger.error('Error saving onboarding data', error);
    }
  };

  const handleStepComplete = async (stepData: any) => {
    const newData = { ...data };
    
    switch (data.currentStep) {
      case 0:
        newData.steps.userInfo = stepData;
        break;
      case 1:
        newData.steps.preferences = stepData;
        break;
      case 2:
        newData.steps.companyDetails = stepData;
        break;
      case 3:
        newData.steps.confirmation = stepData;
        if (!newData.completedSteps.includes(data.currentStep)) {
          newData.completedSteps.push(data.currentStep);
        }
        // Save the final state first
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          ...newData,
          currentStep: 3,
          completedSteps: [...newData.completedSteps],
          lastUpdated: new Date().toISOString()
        }));
        // Then navigate
        navigate('/dashboard', { replace: true });
        return;
    }

    if (!newData.completedSteps.includes(data.currentStep)) {
      newData.completedSteps.push(data.currentStep);
    }
    newData.currentStep += 1;
    newData.lastUpdated = new Date().toISOString();
    setDirection(1);
    saveData(newData);
  };

  const handleOnboardingComplete = async (finalData: OnboardingData) => {
    try {
      logger.info('Starting onboarding completion process', finalData);
      
      // Save final data to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...finalData,
        isComplete: true
      }));

      // TODO: Here you would typically make an API call to save the data
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logger.info('Onboarding completed successfully');
      
      // Clear onboarding data from localStorage since we're done
      localStorage.removeItem(STORAGE_KEY);
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      logger.error('Error completing onboarding:', error);
      // Handle error appropriately
      // For now, we'll still redirect to dashboard
      navigate('/dashboard', { replace: true });
    }
  };

  const handleBack = () => {
    if (data.currentStep > 0) {
      setDirection(-1);
      setData(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        lastUpdated: new Date().toISOString(),
      }));
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const stepTransition = {
    duration: 0.3,
    ease: "easeInOut"
  };

  const progressVariants = {
    initial: { width: '0%' },
    animate: (progress: number) => ({
      width: `${progress}%`,
      backgroundColor: 'hsl(222.2, 47.4%, 11.2%)',
    }),
  };

  const stepVariants = {
    active: {
      scale: 1.1,
      backgroundColor: 'hsl(222.2, 47.4%, 11.2%)',
      color: 'hsl(210, 40%, 98%)',
    },
    inactive: {
      scale: 1,
      backgroundColor: 'hsl(210, 40%, 98%)',
      color: 'hsl(222.2, 47.4%, 11.2%)',
    },
    completed: {
      scale: 1,
      backgroundColor: 'hsl(222.2, 47.4%, 11.2%)',
      color: 'hsl(210, 40%, 98%)',
    },
  };

  const renderStep = () => {
    switch (data.currentStep) {
      case 0:
        return (
          <UserInformationStep
            data={data.steps.userInfo}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <PreferencesStep
            data={data.steps.preferences}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <CompanyDetailsStep
            data={data.steps.companyDetails}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            data={data.steps.confirmation}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container max-w-screen-lg mx-auto px-4 py-8">
        <OnboardingProgress
          currentStep={data.currentStep}
          completedSteps={data.completedSteps}
          progressVariants={progressVariants}
          stepVariants={stepVariants}
        />
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={data.currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
            className="mt-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
