"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import {
  LayoutDashboard,
  Layers,
  CalendarCheck,
  TrendingUp,
  ShieldAlert,
  Brain,
  LogOut,
  Menu,
  X,
  FileDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const PUBLIC_BROWSABLE_ROUTES = ["/syllabus", "/sprint"];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, studentProfile, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicBrowsable = PUBLIC_BROWSABLE_ROUTES.includes(pathname) || pathname.startsWith("/admin");

  useEffect(() => {
    if (isPublicBrowsable) return;

    if (!loading && !user) {
      window.location.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const handleHistoryRestore = () => {
      if (!auth?.currentUser) {
        window.location.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    };

    window.addEventListener("pageshow", handleHistoryRestore);
    window.addEventListener("popstate", handleHistoryRestore);
    return () => {
      window.removeEventListener("pageshow", handleHistoryRestore);
      window.removeEventListener("popstate", handleHistoryRestore);
    };
  }, [loading, user, isPublicBrowsable, pathname, router]);

  if (!isPublicBrowsable && (loading || !user)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="h-8 w-8 text-[#2563EB] animate-spin mb-3" />
        <p className="text-sm font-bold text-[#0F172A]">Checking student session...</p>
      </div>
    );
  }

  const navLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Syllabus & Notes", href: "/syllabus", icon: Layers, badge: "Notes + Videos" },
    { label: "Today's Plan", href: "/planner", icon: CalendarCheck },
    { label: "Official PYQ PDFs", href: "/sprint", icon: FileDown, badge: "Free PDFs" },
    { label: "Tests & Marks", href: "/exams", icon: TrendingUp },
    { label: "Mistake Notebook", href: "/mistakes", icon: ShieldAlert },
    { label: "Brain Sprint Game", href: "/games", icon: Brain, badge: "Play" },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.replace("/login");
  };

  const studentName = user?.displayName || "Student";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white p-5 justify-between shrink-0 h-screen sticky top-0 shadow-sm">
        <div>
          {/* Brand */}
          <Link href="/dashboard" className="block mb-7 px-1">
            <Logo size="sm" />
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                      : "text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#0F172A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#64748B]"}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && !isActive && (
                    <span className="text-[10px] font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#2563EB]/20">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] font-black text-sm border border-[#2563EB]/20">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-[#0F172A] truncate">
                {studentName}
              </h4>
              <p className="text-xs font-semibold text-[#10B981] truncate">
                Target: {studentProfile?.targetPercentage || 90}%
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#F43F5E] hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <Link href="/dashboard">
          <Logo size="sm" />
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* MOBILE POP-OUT MENU */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-xs h-full bg-white p-5 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="mb-6">
                <Logo size="sm" />
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                        isActive
                          ? "bg-[#2563EB] text-white"
                          : "text-[#64748B] hover:bg-[#EFF6FF]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && !isActive && (
                        <span className="text-[10px] font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#F43F5E] hover:bg-rose-50 rounded-xl"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around py-2 px-1">
        {navLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold ${
                isActive ? "text-[#2563EB]" : "text-[#64748B]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label.replace("Today's ", "").replace("My ", "").replace("Official ", "")}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
