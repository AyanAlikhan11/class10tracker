"use client";

import Link from "next/link";
import { LogIn, Menu, X, FileDown, LayoutDashboard, Play, Brain, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/90 backdrop-blur-md transition-all shadow-2xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group shrink-0 flex items-center pr-2">
          <Logo size="sm" />
        </Link>

        {/* Minimal Desktop Navigation with tight, clean spacing */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-slate-600">
          <Link
            href="/#questions"
            className="px-2.5 py-1 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-all"
          >
            3 Core Questions
          </Link>

          <Link
            href="/syllabus"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-blue-600 hover:bg-rose-50/70 transition-all"
          >
            <span>Notes & Videos</span>
            <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200/80 px-1.5 py-0.2 rounded-full font-extrabold tracking-wider">
              NEW
            </span>
          </Link>

          <Link
            href="/sprint"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-all"
          >
            <FileDown className="h-3.5 w-3.5 text-blue-600" />
            <span>CBSE PDFs</span>
            <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200/80 px-1.5 py-0.2 rounded-full font-extrabold tracking-wider">
              12 NEW
            </span>
          </Link>

          <Link
            href="/games"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-violet-600 hover:bg-violet-50/70 transition-all"
          >
            <Brain className="h-3.5 w-3.5 text-violet-600" />
            <span>Brain Sprint</span>
            <span className="text-[9px] bg-violet-50 text-violet-700 border border-violet-200/80 px-1.5 py-0.2 rounded-full font-extrabold tracking-wider">
              QUIZ
            </span>
          </Link>

          <Link
            href="/#features"
            className="px-2.5 py-1 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-all"
          >
            Study Tools
          </Link>

          <Link
            href="/#how"
            className="px-2.5 py-1 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-all"
          >
            How It Works
          </Link>

          <Link
            href="/#faq"
            className="px-2.5 py-1 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-all"
          >
            FAQs
          </Link>
        </nav>

        {/* Minimal Action CTAs */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:shadow-sm transition-all"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard →</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:shadow-sm transition-all"
              >
                Start Free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-2.5 shadow-xl animate-in slide-in-from-top-1 duration-150">
          <Link
            href="/#questions"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 hover:text-blue-600 py-1.5 border-b border-slate-100"
          >
            3 Core Questions
          </Link>
          <Link
            href="/syllabus"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-800 hover:text-blue-600 py-1.5 border-b border-slate-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Play className="h-3.5 w-3.5 text-rose-600 fill-rose-600" />
              Chapter Notes & Videos
            </span>
            <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.2 rounded-full font-black">
              NEW
            </span>
          </Link>
          <Link
            href="/sprint"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-blue-600 py-1.5 border-b border-slate-100 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <FileDown className="h-3.5 w-3.5 text-blue-600" />
              Official CBSE PDFs
            </span>
            <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded-full font-black border border-blue-200">
              {user ? "FREE" : "FREE • LOGIN"}
            </span>
          </Link>
          <Link
            href="/games"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-xs font-bold text-slate-800 hover:text-blue-600 py-1.5 border-b border-slate-100"
          >
            <span className="flex items-center gap-2">
              <Brain className="h-3.5 w-3.5 text-violet-600" />
              Brain Sprint Game
            </span>
            <span className="text-[9px] bg-violet-50 text-violet-700 border border-violet-200 px-1.5 py-0.2 rounded-full font-black">
              QUIZ
            </span>
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 hover:text-blue-600 py-1.5 border-b border-slate-100"
          >
            Study Tools
          </Link>
          <Link
            href="/#how"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 hover:text-blue-600 py-1.5 border-b border-slate-100"
          >
            How It Works
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 hover:text-blue-600 py-1.5"
          >
            FAQs
          </Link>

          <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Go to Student Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
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
