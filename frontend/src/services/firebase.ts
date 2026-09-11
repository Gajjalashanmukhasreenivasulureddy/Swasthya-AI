import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId,
];

export const isFirebaseConfigured = requiredConfig.every(Boolean);

const app = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : undefined;

export const auth = app ? getAuth(app) : undefined;

export function getFirebaseSetupMessage() {
  return 'Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local and restart the app.';
}

export function getFirebaseAuthErrorMessage(reason: unknown): string {
  if (!isFirebaseConfigured || !auth) return getFirebaseSetupMessage();

  const message = reason instanceof Error ? reason.message : '';
  if (message.includes('auth/api-key-not-valid')) {
    return 'Firebase rejected the API key. Verify VITE_FIREBASE_API_KEY in .env.local, then restart the app.';
  }
  if (message.includes('auth/invalid-credential')) return 'Incorrect email or password.';
  if (message.includes('auth/email-already-in-use')) return 'An account already exists for this email.';
  if (message.includes('auth/weak-password')) return 'Use a password with at least 6 characters.';

  return message ? message.replace('Firebase: ', '') : 'Unable to authenticate. Please try again.';
}
