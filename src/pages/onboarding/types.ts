export interface UserInformationInputs {
  fullName: string;
  email: string;
  picture?: string;
  phoneNumber: string;
  jobTitle: string;
  department: string;
}

export interface UserPreferencesInputs {
  role: string;
  department: string;
  interests: string[];
}

export interface CompanyDetailsInputs {
  companyName: string;
  website?: string;
  industry: string;
  companySize: string;
  address: {
    formattedAddress: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface ConfirmationInputs {
  termsAccepted: boolean;
  marketingConsent?: boolean;
}

export interface StepProps<T> {
  data: T;
  onComplete: (data: T) => void;
  onBack: () => void;
}

export interface OnboardingData {
  currentStep: number;
  steps: {
    userInfo: UserInformationInputs;
    preferences: UserPreferencesInputs;
    companyDetails: CompanyDetailsInputs;
    confirmation: ConfirmationInputs;
  };
  completedSteps: number[];
  lastUpdated: string;
}
