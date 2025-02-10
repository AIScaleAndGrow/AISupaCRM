const { spawn } = require('child_process');

const runCommand = (command, args, input) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['pipe', 'inherit', 'inherit'] });
    
    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
};

const setupFirebase = async () => {
  try {
    // Initialize Firebase features
    const initInput = [
      'y', // Proceed?
      'aisupacrm', // Select project
      'y', // Set up Hosting
      'dist', // Public directory
      'y', // Configure as SPA
      'y', // Set up Firestore
      'y', // Use Firestore rules
      'y', // Use Firestore indexes
      'y', // Set up Storage
      'y', // Use Storage rules
      'y', // Set up Emulators
      'y', // Firestore Emulator
      '8080', // Firestore port
      'y', // Auth Emulator
      '9099', // Auth port
      'y', // Storage Emulator
      '9199', // Storage port
      'y', // Hosting Emulator
      '5000', // Hosting port
      'y', // Download emulators
    ].join('\n');

    await runCommand('firebase', ['init'], initInput);
    console.log('Firebase initialization completed');

    // Deploy to Firebase
    await runCommand('firebase', ['deploy']);
    console.log('Firebase deployment completed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setupFirebase();
