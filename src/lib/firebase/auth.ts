import { auth } from "./config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged,
} from "firebase/auth";

export const signIn = async (email: string, pass: string) => {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured. Please add your Firebase credentials to .env.local.");
  }
  return signInWithEmailAndPassword(auth, email, pass);
};

export const signUp = async (email: string, pass: string, displayName?: string) => {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured. Please add your Firebase credentials to .env.local.");
  }
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName?.trim()) {
    await updateProfile(cred.user, { displayName: displayName.trim() });
  }
  return cred;
};

export const signOut = async () => {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured.");
  }
  return firebaseSignOut(auth);
};

export const resetPassword = async (email: string) => {
  if (!auth) {
    throw new Error("Firebase Authentication is not configured. Please add your Firebase credentials to .env.local.");
  }
  return sendPasswordResetEmail(auth, email);
};

export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error("Google Sign-In is not configured. Please add your Firebase credentials to .env.local.");
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
};

export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export function getFirebaseAuthErrorMessage(err: unknown, fallback = "Authentication failed. Please try again."): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please verify your credentials and try again.";
    case "auth/email-already-in-use":
      return "This email address is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few minutes or reset your password.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before finishing. Please try again.";
    case "auth/popup-blocked":
      return "Google sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for OAuth. Add it under Firebase Console → Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Console → Authentication → Sign-in method.";
    case "auth/network-request-failed":
      return "Network error while contacting authentication servers. Check your internet connection.";
    default:
      return (err as { message?: string })?.message || fallback;
  }
}
