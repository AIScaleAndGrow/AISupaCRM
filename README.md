# AISupaCRM

A modern, AI-powered CRM system built with React, TypeScript, and Firebase.

## Features

- **Secure Authentication**: Google OAuth integration for seamless sign-in
- **Smart Onboarding**: Multi-step onboarding flow with progress tracking
- **Comprehensive Settings**: Manage user profiles, company details, and preferences
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Real-time Updates**: Firebase integration for live data synchronization
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Location Services**: Google Maps integration for address autocomplete
- **State Management**: Efficient state handling with Zustand
- **Form Handling**: Type-safe forms with React Hook Form and Zod validation

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

1. Clone the repository:
```bash
git clone https://github.com/AIScaleAndGrow/AISupaCRM.git
cd AISupaCRM
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend & Auth**: Firebase
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Maps Integration**: Google Maps Places API
- **Deployment**: Firebase Hosting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
