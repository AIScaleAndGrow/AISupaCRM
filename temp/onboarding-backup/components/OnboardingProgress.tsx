import { motion } from 'framer-motion';

interface OnboardingProgressProps {
  currentStep: number;
  completedSteps: number[];
}

const steps = [
  { number: 1, title: 'User Info' },
  { number: 2, title: 'Preferences' },
  { number: 3, title: 'Company' },
  { number: 4, title: 'Confirm' },
];

export default function OnboardingProgress({ currentStep, completedSteps }: OnboardingProgressProps) {
  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = completedSteps.includes(step.number);
          const showLine = index < steps.length - 1;

          return (
            <div key={step.number} className="flex-1 flex items-center">
              <div className="relative flex flex-col items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isActive || isCompleted
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive || isCompleted ? 'var(--primary)' : '#fff',
                    borderColor: isActive || isCompleted ? 'var(--primary)' : '#d1d5db',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </motion.div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {showLine && (
                <div className="flex-1 relative h-px">
                  <div className="absolute inset-0 bg-gray-200">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{
                        width:
                          currentStep > step.number
                            ? '100%'
                            : currentStep === step.number
                            ? '50%'
                            : '0%',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
