"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function ForgotPasswordPage() {
  const { resetPassword, isFirebaseActive } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err: unknown) {
      setError(getFirebaseAuthErrorMessage(err, "Failed to send reset email. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#F7F9FC]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <Logo size="lg" />
          </Link>
          <h2 className="text-2xl font-black font-heading tracking-tight text-[#0F172A] mt-5">
            Reset Password
          </h2>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            We will send you a secure link to recover your account.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-sm">
          {!isFirebaseActive && (
            <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-950 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Firebase Auth Required:</strong> Configure <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> to enable password reset emails.
              </span>
            </div>
          )}
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF7F1] text-[#37A779]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#243247]">Check your inbox</h3>
              <p className="text-sm text-[#718096] leading-relaxed">
                If an account exists for <strong className="text-[#243247]">{email}</strong>, you will receive password reset instructions shortly.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#3978E8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2b63cb] transition-colors mt-2"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Registered Email Address"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                disabled={!isFirebaseActive || loading}
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </Button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#718096] hover:text-[#3978E8]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
