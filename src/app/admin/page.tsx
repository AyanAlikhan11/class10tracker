"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_CBSE_CLASS_10_SUBJECTS } from "@/constants/curriculum";
import {
  ShieldAlert,
  Layers,
  Award,
  Users,
  Plus,
  Edit2,
  Lock,
  LogOut,
  Loader2,
  ArrowLeft,
} from "lucide-react";

export default function AdminPanelPage() {
  const router = useRouter();
  const { user, isAdmin, adminRole, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"syllabus" | "pyqs" | "users">("syllabus");
  const [subjects] = useState(INITIAL_CBSE_CLASS_10_SUBJECTS);
  const [session] = useState("2026-2027");
  const [boardCode] = useState("CBSE");

  // Redirect unauthenticated visitors immediately to dedicated Admin Login (including bfcache Back navigation)
  useEffect(() => {
    if (!loading && !user) {
      window.location.replace("/admin/login");
      return;
    }

    const handleHistoryRestore = () => {
      if (!auth?.currentUser) {
        window.location.replace("/admin/login");
      }
    };

    window.addEventListener("pageshow", handleHistoryRestore);
    window.addEventListener("popstate", handleHistoryRestore);
    return () => {
      window.removeEventListener("pageshow", handleHistoryRestore);
      window.removeEventListener("popstate", handleHistoryRestore);
    };
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center text-center p-6">
        <Loader2 className="h-8 w-8 text-[#2563EB] animate-spin mb-3" />
        <p className="text-sm font-bold text-[#0F172A]">Verifying Administrator Session...</p>
        <p className="text-xs text-[#64748B] mt-1">Redirecting to secure Admin Login if unauthenticated.</p>
      </div>
    );
  }

  // Strictly block authenticated non-admin users (e.g. students)
  if (!isAdmin) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-5 border-rose-200 bg-white shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <Badge variant="coral">403 • Access Denied</Badge>
            <h1 className="text-xl font-black text-[#0F172A] font-heading">
              Administrator Privileges Required
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              You are signed in as <strong className="text-[#0F172A]">{user.email}</strong>, which does not have Administrator permissions to access <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/admin</code>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Student Dashboard
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/admin/login");
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Lock className="h-3.5 w-3.5" /> Admin Sign In
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const handleAdminSignOut = async () => {
    await logout();
    window.location.replace("/admin/login");
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="primary">Content &amp; Curriculum Administration</Badge>
            <span className="text-xs text-[#718096] flex items-center gap-1 font-semibold">
              <Lock className="h-3 w-3 text-[#37A779]" /> Role: {adminRole || "super_admin"} ({user.email})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243247]">
            Curriculum &amp; Content Management
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            Centrally manage board sessions, subjects, verified syllabus, and previous year papers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAdminSignOut}>
            <LogOut className="h-3.5 w-3.5 mr-1" /> Admin Sign Out
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Subject
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] gap-4">
        {[
          { id: "syllabus", label: "Centrally Managed Syllabus", icon: Layers },
          { id: "pyqs", label: "Verified PYQ Library", icon: Award },
          { id: "users", label: "Audit & Roles", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-2 border-b-2 text-sm font-bold transition-colors ${
                isActive
                  ? "border-[#3978E8] text-[#3978E8]"
                  : "border-transparent text-[#718096] hover:text-[#243247]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Syllabus Management */}
      {activeTab === "syllabus" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[#243247]">
              Board: <span className="text-[#3978E8]">{boardCode}</span> • Session: <span className="text-[#3978E8]">{session}</span>
            </div>
            <span className="text-xs text-[#718096]">
              {subjects.length} Subjects Configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub) => (
              <Card key={sub.id} className="p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-xs shrink-0"
                    style={{ backgroundColor: sub.color }}
                  >
                    {sub.code}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#243247]">{sub.name}</h3>
                    <span className="text-xs text-[#718096]">
                      {sub.classGrade} • {sub.isOptional ? "Optional" : "Core Curriculum"}
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: PYQ Management */}
      {activeTab === "pyqs" && (
        <Card className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF2FD] text-[#3978E8]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#243247]">
              CBSE Class 10 Verified Question Bank
            </h3>
            <p className="text-sm text-[#718096] max-w-md mx-auto mt-1">
              All questions are verified against official CBSE question papers and marking schemes from 2019 to 2026-2027.
            </p>
          </div>
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4 mr-1.5" /> Upload Verified Paper Set
          </Button>
        </Card>
      )}

      {/* Tab 3: Audit & Security */}
      {activeTab === "users" && (
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-[#243247]">
            Least-Privilege Role Enforcements
          </h3>
          <p className="text-xs text-[#718096] leading-relaxed">
            All administrative endpoints and Firestore collections (`/boards`, `/subjects`, `/chapters`, `/pyqs`) require verified Custom Claims. Client applications cannot self-assign privileged roles.
          </p>

          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-xs space-y-2 text-[#243247]">
            <div className="flex justify-between">
              <span className="font-semibold">Super Admin:</span>
              <span>Full platform and security access</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Content Admin:</span>
              <span>Syllabus, chapters, topics, and PYQ management</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Support Admin:</span>
              <span>Help requests and account verification</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
