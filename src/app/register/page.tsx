"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, BookOpen, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { register, loginWithGoogle, isFirebaseActive } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(displayName.trim(), email.trim(), password);
      router.push(redirectUrl);
    } catch (err: unknown) {
      console.error(err);
      setError(getFirebaseAuthErrorMessage(err, "Failed to create account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push(redirectUrl);
    } catch (err: unknown) {
      setError(getFirebaseAuthErrorMessage(err, "Google registration was cancelled or failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Top Reassurance Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>CBSE Class 10 Board Candidate • Free Setup in 30s</span>
        </div>
      </div>

      {/* Brand & Title */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
          <Logo size="lg" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[#0F172A] mt-5">
          Create student account
        </h1>
        <p className="text-sm font-medium text-[#64748B] mt-1.5">
          100% free forever. Access official CBSE papers, syllabus tracker & daily planner.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-xl shadow-slate-200/50">
        {!isFirebaseActive && (
          <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold">Firebase Auth Configuration Required:</strong> Add your Firebase Web App credentials to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">.env.local</code> (from <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">.env.example</code>) and enable Email/Password &amp; Google Sign-In in Firebase Console.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Student First Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Aarav"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={!isFirebaseActive || loading}
              className="h-11 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!isFirebaseActive || loading}
              className="h-11 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!isFirebaseActive || loading}
                className="h-11 pr-10 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!isFirebaseActive || loading}
              className="h-11 rounded-xl border-slate-200 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-3 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
            disabled={!isFirebaseActive || loading}
          >
            {loading ? "Creating Account..." : "Continue to Dashboard"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            or register with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full h-11 rounded-xl border-slate-200 hover:bg-slate-50 font-bold text-slate-700"
          onClick={handleGoogleSignup}
          disabled={!isFirebaseActive || loading}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Sign up with Google
        </Button>

        <p className="mt-6 text-center text-xs sm:text-sm font-medium text-slate-500">
          Already have an account?{" "}
          <Link
            href={redirectUrl !== "/onboarding" ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {/* Trust micro-badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Free Forever
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-blue-600" /> Complete CBSE Class 10 Syllabus
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-slate-600" /> No Spam, No Card Required
        </span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#F8FAFC]">
      <Suspense fallback={<div className="text-sm font-bold text-slate-400">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
