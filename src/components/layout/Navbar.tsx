"use client";

import Link from "next/link";
import { LogIn, Menu, X, FileDown, Sparkles, LayoutDashboard, Play, BookOpen, Layers } from "lucide-react";
import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all shadow-xs">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group shrink-0 flex items-center">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation (Balanced & Properly Aligned) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-bold text-slate-600">
          <Link
            href="/#questions"
            className="hover:text-blue-600 transition-colors py-2 px-1"
          >
            3 Core Questions
          </Link>

          <Link
            href="/syllabus"
            className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 px-1"
          >
            <span>Notes & Videos</span>
            <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full font-black tracking-wider">
              NEW
            </span>
          </Link>

          <Link
            href="/sprint"
            className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 px-1"
          >
            <FileDown className="h-4 w-4 text-blue-600" />
            <span>CBSE PDFs</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-black tracking-wider">
              {user ? "FREE" : "LOGIN"}
            </span>
          </Link>

          <Link
            href="/#features"
            className="hover:text-blue-600 transition-colors py-2 px-1"
          >
            Study Tools
          </Link>

          <Link
            href="/#how"
            className="hover:text-blue-600 transition-colors py-2 px-1"
          >
            How It Works
          </Link>

          <Link
            href="/#faq"
            className="hover:text-blue-600 transition-colors py-2 px-1"
          >
            FAQs
          </Link>
        </nav>

        {/* Action CTAs (Auth-Aware) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs xl:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to Dashboard →</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs xl:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs xl:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
              >
                Start Free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-5 py-5 space-y-3.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/#questions"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100"
          >
            3 Core Questions
          </Link>
          <Link
            href="/syllabus"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-800 hover:text-blue-600 py-2 border-b border-slate-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4 text-rose-600 fill-rose-600" />
              Chapter Notes & Videos
            </span>
            <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full font-black">
              NEW
            </span>
          </Link>
          <Link
            href="/sprint"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-blue-600 py-2 border-b border-slate-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <FileDown className="h-4 w-4 text-blue-600" />
              Official CBSE PDFs
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-black border border-blue-200">
              {user ? "FREE ACCESS" : "FREE • LOGIN"}
            </span>
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100"
          >
            Study Tools
          </Link>
          <Link
            href="/#how"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100"
          >
            How It Works
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-slate-700 hover:text-blue-600 py-2"
          >
            FAQs
          </Link>

          <div className="pt-3 flex flex-col gap-2.5 border-t border-slate-100">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Go to Student Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-2xl border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md shadow-blue-500/20"
                >
                  Start Free (CBSE Class 10) →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
