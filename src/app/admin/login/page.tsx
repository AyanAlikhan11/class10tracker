"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, isFirebaseActive, login, loginWithGoogle, logout, verifyAdminUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already signed in as an admin, forward straight to /admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [authLoading, user, isAdmin, router]);

  const handleAdminCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your administrator email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      const allowed = await verifyAdminUser();
      if (!allowed) {
        await logout();
        setError("Access Denied: This account does not have Administrator privileges.");
        return;
      }
      router.push("/admin");
    } catch (err: unknown) {
      setError(getFirebaseAuthErrorMessage(err, "Unable to verify administrator credentials."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminGoogleLogin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      const allowed = await verifyAdminUser();
      if (!allowed) {
        await logout();
        setError("Access Denied: This Google account is not authorized as an Administrator.");
        return;
      }
      router.push("/admin");
    } catch (err: unknown) {
      setError(getFirebaseAuthErrorMessage(err, "Google administrator sign-in failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0F172A] text-white relative overflow-hidden">
      {/* Subtle dark security ambient backdrop */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Security Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-bold text-amber-400 shadow-sm">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span>Restricted Access • Admin Security Portal</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block bg-white px-4 py-2 rounded-2xl shadow-md hover:opacity-95 transition-opacity">
            <Logo size="md" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white mt-5">
            Administrator Sign In
          </h1>
          <p className="text-sm font-medium text-slate-400 mt-1.5">
            Authorized personnel only. All curriculum &amp; PYQ actions are audited.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900/95 p-7 sm:p-8 shadow-2xl">
          {!isFirebaseActive && (
            <div className="mb-5 rounded-2xl border border-amber-500/40 bg-amber-950/60 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="font-bold">Firebase Auth Required:</strong> Configure Firebase keys and <code className="font-mono bg-amber-900/60 px-1 py-0.5 rounded">NEXT_PUBLIC_ADMIN_EMAILS</code> (or Custom Claims) in <code className="font-mono bg-amber-900/60 px-1 py-0.5 rounded">.env.local</code>.
              </div>
            </div>
          )}

          {user && !isAdmin && !authLoading && (
            <div className="mb-5 rounded-2xl border border-rose-500/40 bg-rose-950/60 p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="leading-relaxed">
                Signed in as <strong>{user.email}</strong>, which lacks Admin role. Sign in with an authorized Administrator account below.
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-rose-500/40 bg-rose-950/70 p-3.5 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminCredentialLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <Input
                type="email"
                placeholder="admin@boardprep.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!isFirebaseActive || submitting}
                className="h-11 rounded-xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!isFirebaseActive || submitting}
                  className="h-11 pr-10 rounded-xl border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/25"
              disabled={!isFirebaseActive || submitting}
            >
              <Lock className="h-4 w-4 mr-2" />
              {submitting ? "Verifying Credentials..." : "Sign In to Admin Console"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-slate-900 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              or authenticate via SSO
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-11 rounded-xl border-slate-700 bg-slate-800/70 hover:bg-slate-800 font-bold text-slate-200"
            onClick={handleAdminGoogleLogin}
            disabled={!isFirebaseActive || submitting}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            Sign in with Authorized Google Account
          </Button>

          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors font-semibold">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Student Login →
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Role-Based Access Control (RBAC) Enforced</span>
        </div>
      </div>
    </div>
  );
}
