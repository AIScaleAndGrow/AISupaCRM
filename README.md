# AISupaCRM

A modern, AI-powered CRM system built with React, TypeScript, and Tailwind CSS.

## Project Structure

```bash
src/
├── api/           # API routes/controllers
├── components/    # Reusable UI components
│   ├── Auth/     # Authentication components
│   └── ui/       # Shared UI components
├── hooks/         # Custom React hooks
├── pages/
│   ├── auth/       # Authentication pages
│   ├── onboarding/ # Multi-step onboarding flow
│   ├── settings/   # Settings pages
│   │   ├── your-account/     # User profile settings
│   │   ├── company-details/  # Company settings
│   │   ├── permissions/      # Access controls
│   │   ├── integrations/     # Third-party integrations
│   │   └── notifications/    # Notification preferences
│   ├── dashboard/  # Main CRM dashboard
│   ├── leads/      # Lead management
│   ├── opportunities/ # Sales opportunities
│   ├── tasks/      # Task management
│   └── reports/    # Analytics & reporting
├── styles/        # Global styles
├── utils/         # Helper functions
├── config/        # Configuration files
└── lib/          # Shared libraries
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Vite
