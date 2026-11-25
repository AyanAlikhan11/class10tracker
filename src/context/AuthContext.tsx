"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  signIn as fbSignIn,
  signUp as fbSignUp,
  signOut as fbSignOut,
  resetPassword as fbResetPassword,
  signInWithGoogle as fbSignInWithGoogle,
  subscribeToAuthState,
} from "@/lib/firebase/auth";
import { isFirebaseConfigured, auth } from "@/lib/firebase/config";
import { UserService } from "@/services";
import { StudentAcademicProfile, UserProfile, UserRole } from "@/types";

const ADMIN_ROLES: string[] = ["admin", "super_admin", "content_admin", "support_admin"];

function getConfiguredAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().replace(/^["']|["']$/g, "").toLowerCase())
    .filter(Boolean);
}

interface AuthContextType {
  user: User | null;
  studentProfile: StudentAcademicProfile | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isFirebaseActive: boolean;
  isAdmin: boolean;
  adminRole: UserRole | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  verifyAdminUser: (targetUser?: User | null) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentAcademicProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminRole, setAdminRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const verifyAdminUser = async (targetUser?: User | null, loadedUserProfile?: UserProfile | null): Promise<boolean> => {
    const activeUser = targetUser ?? auth?.currentUser ?? user;
    if (!activeUser) {
      setIsAdmin(false);
      setAdminRole(null);
      return false;
    }

    try {
      // 1. Check Firebase ID Token Custom Claims
      const tokenResult = await activeUser.getIdTokenResult();
      const claimRole = typeof tokenResult.claims.role === "string" ? tokenResult.claims.role.toLowerCase() : undefined;
      if (tokenResult.claims.admin === true || (claimRole && ADMIN_ROLES.includes(claimRole))) {
        setIsAdmin(true);
        setAdminRole((claimRole as UserRole) || "super_admin");
        return true;
      }
    } catch (err) {
      console.error("Error reading ID token claims:", err);
    }

    // 2. Check Firestore UserProfile role (handle gracefully if Firestore rules block or doc is missing)
    try {
      const prof = loadedUserProfile !== undefined ? loadedUserProfile : await UserService.getUserProfile(activeUser.uid);
      const profRole = typeof prof?.role === "string" ? prof.role.toLowerCase() : undefined;
      if (profRole && ADMIN_ROLES.includes(profRole)) {
        setIsAdmin(true);
        setAdminRole(profRole as UserRole);
        return true;
      }
    } catch (err) {
      console.warn("Could not read Firestore user profile for role check:", err);
    }

    // 3. Check configured admin emails allowlist in .env.local
    const email = activeUser.email?.toLowerCase();
    if (email && getConfiguredAdminEmails().includes(email)) {
      setIsAdmin(true);
      setAdminRole("super_admin");
      return true;
    }

    setIsAdmin(false);
    setAdminRole(null);
    return false;
  };

  // Load profiles from Firestore and evaluate admin claims
  const fetchProfiles = async (uid: string, currentUser?: User | null) => {
    try {
      const [uProf, sProf] = await Promise.all([
        UserService.getUserProfile(uid),
        UserService.getStudentProfile(uid),
      ]);
      setUserProfile(uProf);
      setStudentProfile(sProf);
      await verifyAdminUser(currentUser, uProf);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      await verifyAdminUser(currentUser, null);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Clear any stale local session and require real Firebase configuration
      localStorage.removeItem("boardprep_demo_user");
      localStorage.removeItem("boardprep_demo_student_profile");
      setUser(null);
      setStudentProfile(null);
      setUserProfile(null);
      setIsAdmin(false);
      setAdminRole(null);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfiles(currentUser.uid, currentUser);
      } else {
        setStudentProfile(null);
        setUserProfile(null);
        setIsAdmin(false);
        setAdminRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    if (!isFirebaseConfigured) {
      throw new Error("Authentication is not configured. Please add your Firebase credentials to .env.local.");
    }
    setLoading(true);
    try {
      const cred = await fbSignIn(email, pass);
      setUser(cred.user);
      await fetchProfiles(cred.user.uid, cred.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    if (!isFirebaseConfigured) {
      throw new Error("Registration is not configured. Please add your Firebase credentials to .env.local.");
    }
    setLoading(true);
    try {
      const cred = await fbSignUp(email, pass, name);
      setUser(cred.user);
      const now = new Date().toISOString();
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName: name.trim(),
        role: "student",
        createdAt: now,
        updatedAt: now,
      };
      try {
        await UserService.saveUserProfile(newProfile);
      } catch (profileErr) {
        console.warn("User created in Auth, but Firestore profile save failed:", profileErr);
      }
      setUserProfile(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error("Google Sign-In is not configured. Please add your Firebase credentials to .env.local.");
    }
    setLoading(true);
    try {
      const cred = await fbSignInWithGoogle();
      setUser(cred.user);

      // Ensure a UserProfile exists for first-time Google Sign-In users
      try {
        const existingProfile = await UserService.getUserProfile(cred.user.uid);
        if (!existingProfile) {
          const now = new Date().toISOString();
          const newProfile: UserProfile = {
            uid: cred.user.uid,
            email: cred.user.email || "",
            displayName: cred.user.displayName || cred.user.email?.split("@")[0] || "Student",
            role: "student",
            photoURL: cred.user.photoURL || undefined,
            createdAt: now,
            updatedAt: now,
          };
          await UserService.saveUserProfile(newProfile);
        }
      } catch (profileErr) {
        console.warn("Google sign-in succeeded, but Firestore profile sync failed:", profileErr);
      }

      await fetchProfiles(cred.user.uid, cred.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await fbSignOut();
    }
    setUser(null);
    setStudentProfile(null);
    setUserProfile(null);
    setIsAdmin(false);
    setAdminRole(null);
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseConfigured) {
      throw new Error("Password reset is not configured. Please add your Firebase credentials to .env.local.");
    }
    await fbResetPassword(email);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfiles(user.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        userProfile,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        isAdmin,
        adminRole,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        refreshProfile,
        verifyAdminUser: (targetUser?: User | null) => verifyAdminUser(targetUser),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
