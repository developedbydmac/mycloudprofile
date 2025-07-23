import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "mycloudprofile-demo.firebaseapp.com",
  projectId: "mycloudprofile-demo",
  storageBucket: "mycloudprofile-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo-app-id"
};

// Initialize Firebase (check if already initialized to prevent duplicate app error)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Authentication functions
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithGitHub = () => {
  return signInWithPopup(auth, githubProvider);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};

export default app;
