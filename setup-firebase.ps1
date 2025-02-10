# Ensure firebase-tools is installed globally
npm install -g firebase-tools

# Login to Firebase (should already be logged in)
firebase login --no-localhost

# Initialize Firebase with all features
Write-Output "y`naisupacrm`nn`nn`ndist`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`ny`n" | firebase init hosting,firestore,storage,emulators

# Deploy Firebase configuration
firebase deploy
