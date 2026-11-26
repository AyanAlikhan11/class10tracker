"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentService } from "@/services";
import { AdminClient } from "@/lib/adminClient";
import {
  Subject,
  Chapter,
  PYQPaperDocument,
  GameQuestion,
  GameDifficulty,
} from "@/types";
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
  Trash2,
  X,
  Save,
  FileText,
  Video,
  Brain,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  dataResetVersion: number;
}

type Tab = "syllabus" | "chapters" | "pyqs" | "games" | "data";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[#0F172A] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function AdminModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-[#0F172A]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminPanelPage() {
  const router = useRouter();
  const { user, isAdmin, adminRole, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("syllabus");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [papers, setPapers] = useState<PYQPaperDocument[]>([]);
  const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [chapterFilter, setChapterFilter] = useState("all");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  const [modal, setModal] = useState<null | "subject" | "chapter" | "paper" | "game">(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingPaper, setEditingPaper] = useState<PYQPaperDocument | null>(null);
  const [editingGame, setEditingGame] = useState<GameQuestion | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated visitors to the dedicated admin login.
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

  const loadContent = async () => {
    setContentLoading(true);
    try {
      const [subs, chs, pps, games] = await Promise.all([
        ContentService.getSubjects(),
        ContentService.getAllChapters(),
        ContentService.getPapers(),
        ContentService.getGameQuestions(),
      ]);
      setSubjects(subs);
      setChapters(chs);
      setPapers(pps);
      setGameQuestions(games);
    } catch (err) {
      console.error("Could not load content:", err);
      setError("Could not load curriculum content.");
    } finally {
      setContentLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const result = await AdminClient.listUsers();
      setUsers((result.users || []) as unknown as AdminUser[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadContent();
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center p-6 text-center">
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#2563EB]" />
        <p className="text-sm font-bold text-[#0F172A]">Verifying Administrator Session...</p>
        <p className="mt-1 text-xs text-[#64748B]">Redirecting to secure Admin Login if unauthenticated.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center p-4">
        <Card className="w-full max-w-md space-y-5 border-rose-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <Badge variant="coral">403 • Access Denied</Badge>
            <h1 className="font-heading text-xl font-black text-[#0F172A]">
              Administrator Privileges Required
            </h1>
            <p className="text-xs leading-relaxed text-[#64748B] sm:text-sm">
              You are signed in as <strong className="text-[#0F172A]">{user.email}</strong>, which does
              not have Administrator permissions to access <code className="rounded bg-slate-100 px-1 py-0.5 font-mono">/admin</code>.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Student Dashboard
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/admin/login");
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
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

  const runSave = async (action: () => Promise<unknown>, successText: string) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      setMessage(successText);
      setModal(null);
      await loadContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContent = async (collection: string, id: string, label: string) => {
    if (!window.confirm(`Remove "${label}"? Students will no longer see it.`)) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await AdminClient.deleteContent(collection, id);
      setMessage(`Removed ${label}.`);
      await loadContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetStudent = async (target: AdminUser) => {
    if (
      !window.confirm(
        `Reset all academic data for ${target.displayName || target.email}? Their login credentials and profile will be kept.`
      )
    ) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const result = await AdminClient.resetStudent(target.uid);
      setMessage(`Reset ${result.deleted} record(s) for ${target.email}.`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetAll = async () => {
    if (
      !window.confirm(
        "Reset academic activity for ALL students? Credentials, profiles and curriculum content are preserved."
      )
    ) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const result = await AdminClient.resetAll();
      setMessage(`Reset ${result.deleted} student record(s) across the platform.`);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed.");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.displayName.toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const filteredChapters = useMemo(
    () =>
      chapterFilter === "all"
        ? chapters
        : chapters.filter((c) => c.subjectId === chapterFilter),
    [chapters, chapterFilter]
  );

  const subjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.name || id;

  const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: "syllabus", label: "Subjects", icon: Layers },
    { id: "chapters", label: "Chapters & Material", icon: FileText },
    { id: "pyqs", label: "PYQ Papers", icon: Award },
    { id: "games", label: "Game Questions", icon: Brain },
    { id: "data", label: "Users & Data Reset", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant="primary">Content &amp; Curriculum Administration</Badge>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#718096]">
              <Lock className="h-3 w-3 text-[#37A779]" /> Role: {adminRole || "super_admin"} ({user.email})
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#243247] sm:text-3xl">School Control Center</h1>
          <p className="mt-0.5 text-sm text-[#718096]">
            Add new subjects, chapters, notes, videos, papers and game questions. Changes go live for students instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadContent} disabled={contentLoading}>
            <RefreshCw className={`mr-1 h-3.5 w-3.5 ${contentLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleAdminSignOut}>
            <LogOut className="mr-1 h-3.5 w-3.5" /> Sign Out
          </Button>
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-[#E2E8F0]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold transition-colors ${
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

      {/* SUBJECTS */}
      {activeTab === "syllabus" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#243247]">
              {subjects.length} subjects configured for CBSE Class 10
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingSubject(null);
                setModal("subject");
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Subject
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjects.map((sub) => (
              <Card key={sub.id} className="flex items-start justify-between gap-4 p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: sub.color || "#3978E8" }}
                  >
                    {sub.code || "10"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#243247]">{sub.name}</h3>
                    <span className="text-xs text-[#718096]">
                      {sub.classGrade} • {sub.isOptional ? "Optional" : "Core"} • {sub.id}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSubject(sub);
                      setModal("subject");
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit subject"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContent("subjects", sub.id, sub.name)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    title="Remove subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CHAPTERS */}
      {activeTab === "chapters" && (
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter subject:</span>
              <select
                value={chapterFilter}
                onChange={(event) => setChapterFilter(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0F172A]"
              >
                <option value="all">All subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingChapter(null);
                setModal("chapter");
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Chapter / Material
            </Button>
          </div>

          <div className="space-y-3">
            {filteredChapters.map((chapter) => (
              <Card key={chapter.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">
                      {subjectName(chapter.subjectId)} • Ch {chapter.chapterNumber}
                    </span>
                    {chapter.notesDocument && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        PDF Notes
                      </span>
                    )}
                    {chapter.videoLessons && chapter.videoLessons.length > 0 && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        {chapter.videoLessons.length} Video
                      </span>
                    )}
                  </div>
                  <h3 className="truncate text-sm font-bold text-[#243247]">{chapter.title}</h3>
                  <p className="text-xs text-slate-500">
                    {chapter.topics?.length || 0} topics • {chapter.officialWeightageMarks || 0} marks weightage
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingChapter(chapter);
                      setModal("chapter");
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContent("chapters", chapter.id, chapter.title)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
            {filteredChapters.length === 0 && (
              <Card className="p-8 text-center text-sm text-slate-500">
                No chapters for this subject yet. Add one to get started.
              </Card>
            )}
          </div>
        </div>
      )}

      {/* PYQ PAPERS */}
      {activeTab === "pyqs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#243247]">{papers.length} papers & solutions in the library</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingPaper(null);
                setModal("paper");
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Paper
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {papers.map((paper) => (
              <Card key={paper.id} className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600">
                    {paper.subjectName} • {paper.session}
                  </div>
                  <h3 className="truncate text-sm font-bold text-[#243247]">{paper.title}</h3>
                  <p className="truncate text-xs text-slate-500">{paper.localPdfUrl}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPaper(paper);
                      setModal("paper");
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContent("pyq_papers", paper.id, paper.title)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* GAME QUESTIONS */}
      {activeTab === "games" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#243247]">{gameQuestions.length} tricky questions in Brain Sprint</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingGame(null);
                setModal("game");
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Game Question
            </Button>
          </div>
          <div className="space-y-3">
            {gameQuestions.map((question) => (
              <Card key={question.id} className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                    <span className="text-violet-700">{subjectName(question.subjectId)}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize text-slate-600">
                      {question.difficulty}
                    </span>
                    <span className="text-slate-400">{question.points} pts</span>
                  </div>
                  <h3 className="truncate text-sm font-bold text-[#243247]">{question.question}</h3>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGame(question);
                      setModal("game");
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContent("game_questions", question.id, question.question)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* USERS & DATA RESET */}
      {activeTab === "data" && (
        <div className="space-y-5">
          <Card className="space-y-3 border-amber-200 bg-amber-50/50 p-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-[#243247]">
              <Database className="h-4 w-4 text-amber-600" /> Reset Student Data (credentials stay safe)
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Resetting removes a student&apos;s progress, tasks, exams, mistakes and game scores only. Their
              login credentials and profile remain untouched, so they can sign in and start fresh. This is
              ideal for cleaning up accounts created before per-user data isolation was enforced.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={loadUsers} disabled={usersLoading}>
                <RefreshCw className={`mr-1 h-3.5 w-3.5 ${usersLoading ? "animate-spin" : ""}`} /> Reload users
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetAll}
                disabled={saving}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Reset ALL student activity
              </Button>
            </div>
          </Card>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Search by name, email or uid..."
              className={`${inputClass} pl-9`}
            />
          </div>

          <div className="space-y-2">
            {usersLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading registered users...
              </div>
            )}
            {!usersLoading && filteredUsers.length === 0 && (
              <Card className="p-6 text-center text-sm text-slate-500">No users found.</Card>
            )}
            {filteredUsers.map((account) => (
              <Card key={account.uid} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#243247]">{account.displayName}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                      {account.role}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{account.email}</p>
                  <p className="text-[11px] text-slate-400">
                    Last login: {account.lastLoginAt ? new Date(account.lastLoginAt).toLocaleString() : "Unknown"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetStudent(account)}
                  disabled={saving}
                  className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <RefreshCw className="mr-1 h-3.5 w-3.5" /> Reset data
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal === "subject" && (
        <SubjectModal
          initial={editingSubject}
          onClose={() => setModal(null)}
          onSave={(subject) =>
            runSave(
              () => AdminClient.saveContent("subjects", subject.id, subject as unknown as Record<string, unknown>),
              `Saved subject ${subject.name}.`
            )
          }
          saving={saving}
        />
      )}

      {modal === "chapter" && (
        <ChapterModal
          initial={editingChapter}
          subjects={subjects}
          onClose={() => setModal(null)}
          onSave={(chapter) =>
            runSave(
              () => AdminClient.saveContent("chapters", chapter.id, chapter as unknown as Record<string, unknown>),
              `Saved chapter ${chapter.title}.`
            )
          }
          saving={saving}
        />
      )}

      {modal === "paper" && (
        <PaperModal
          initial={editingPaper}
          subjects={subjects}
          onClose={() => setModal(null)}
          onSave={(paper) =>
            runSave(
              () => AdminClient.saveContent("pyq_papers", paper.id, paper as unknown as Record<string, unknown>),
              `Saved paper ${paper.title}.`
            )
          }
          saving={saving}
        />
      )}

      {modal === "game" && (
        <GameModal
          initial={editingGame}
          subjects={subjects}
          onClose={() => setModal(null)}
          onSave={(question) =>
            runSave(
              () => AdminClient.saveContent("game_questions", question.id, question as unknown as Record<string, unknown>),
              "Saved game question."
            )
          }
          saving={saving}
        />
      )}
    </div>
  );
}

/* ----------------------------- MODAL FORMS ----------------------------- */

function SubjectModal({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: Subject | null;
  onClose: () => void;
  onSave: (subject: Subject) => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [code, setCode] = useState(initial?.code || "");
  const [color, setColor] = useState(initial?.color || "#3978E8");
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder || 10);
  const [isOptional, setIsOptional] = useState(initial?.isOptional || false);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Subject name is required.");
      return;
    }
    const id = initial?.id || `subject-${slugify(name)}`;
    onSave({
      id,
      boardId: "CBSE",
      classGrade: "Class 10",
      name: name.trim(),
      code: code.trim(),
      iconName: initial?.iconName || "BookOpen",
      color,
      isOptional,
      displayOrder: Number(displayOrder) || 10,
    });
  };

  return (
    <AdminModal title={initial ? "Edit Subject" : "Add New Subject"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
        <div>
          <label className={labelClass}>Subject Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Computer Applications" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Code</label>
            <input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. 165" />
          </div>
          <div>
            <label className={labelClass}>Display Order</label>
            <input type="number" className={inputClass} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Accent Colour</label>
            <input type="color" className={`${inputClass} h-10 p-1`} value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input type="checkbox" checked={isOptional} onChange={(e) => setIsOptional(e.target.checked)} />
            Optional subject
          </label>
        </div>
        <ModalActions saving={saving} onClose={onClose} />
      </form>
    </AdminModal>
  );
}

function ChapterModal({
  initial,
  subjects,
  onClose,
  onSave,
  saving,
}: {
  initial: Chapter | null;
  subjects: Subject[];
  onClose: () => void;
  onSave: (chapter: Chapter) => void;
  saving: boolean;
}) {
  const [subjectId, setSubjectId] = useState(initial?.subjectId || subjects[0]?.id || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [chapterNumber, setChapterNumber] = useState(initial?.chapterNumber || 1);
  const [unitName, setUnitName] = useState(initial?.unitName || "");
  const [weightage, setWeightage] = useState(initial?.officialWeightageMarks || 0);
  const [studyHours, setStudyHours] = useState(initial?.estimatedStudyHours || 5);
  const [topicsText, setTopicsText] = useState((initial?.topics || []).map((t) => t.title).join("\n"));
  const [notesTitle, setNotesTitle] = useState(initial?.notesDocument?.title || "");
  const [notesUrl, setNotesUrl] = useState(initial?.notesDocument?.pdfUrl || "");
  const [notesFileName, setNotesFileName] = useState(initial?.notesDocument?.fileName || "");
  const [notesPages, setNotesPages] = useState(initial?.notesDocument?.pageCount || 0);
  const [formulasText, setFormulasText] = useState((initial?.notesDocument?.keyFormulas || []).join("\n"));
  const [ncertUrl, setNcertUrl] = useState(initial?.notesDocument?.officialNcertChapterUrl || "");
  const [videoTitle, setVideoTitle] = useState(initial?.videoLessons?.[0]?.title || "");
  const [youtubeId, setYoutubeId] = useState(initial?.videoLessons?.[0]?.youtubeId || "");
  const [videoChannel, setVideoChannel] = useState(initial?.videoLessons?.[0]?.channelName || "");
  const [videoMinutes, setVideoMinutes] = useState(initial?.videoLessons?.[0]?.durationMinutes || 0);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subjectId || !title.trim()) {
      setError("Subject and chapter title are required.");
      return;
    }
    const id = initial?.id || `chapter-${Date.now()}`;
    const topicTitles = topicsText
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    const topics = topicTitles.map((topicTitle, index) => ({
      id: `${id}-t${index + 1}`,
      chapterId: id,
      title: topicTitle,
      isImportantForBoard: index === 0,
      displayOrder: index + 1,
    }));

    const notesDocument = notesUrl.trim()
      ? {
          id: initial?.notesDocument?.id || `notes-${id}`,
          title: notesTitle.trim() || `${title.trim()} Revision Notes`,
          pdfUrl: notesUrl.trim(),
          fileName: notesFileName.trim() || `${slugify(title)}-notes.pdf`,
          fileSizeBytes: initial?.notesDocument?.fileSizeBytes || "1.0 MB",
          pageCount: Number(notesPages) || 0,
          keyFormulas: formulasText
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
          sourceName: initial?.notesDocument?.sourceName || "Admin Upload",
          officialNcertChapterUrl: ncertUrl.trim() || undefined,
        }
      : undefined;

    const videoLessons = youtubeId.trim()
      ? [
          {
            id: initial?.videoLessons?.[0]?.id || `vid-${id}`,
            title: videoTitle.trim() || `${title.trim()} Video Lesson`,
            youtubeId: youtubeId.trim(),
            channelName: videoChannel.trim() || "YouTube",
            durationMinutes: Number(videoMinutes) || 0,
            isOneShot: initial?.videoLessons?.[0]?.isOneShot || false,
          },
        ]
      : initial?.videoLessons;

    onSave({
      id,
      subjectId,
      unitName: unitName.trim() || undefined,
      title: title.trim(),
      chapterNumber: Number(chapterNumber) || 1,
      officialWeightageMarks: Number(weightage) || undefined,
      isWeightageEstimated: !weightage,
      estimatedStudyHours: Number(studyHours) || 5,
      syllabusOrder: Number(chapterNumber) || 1,
      topics,
      notesDocument,
      videoLessons,
      mindMapSummary: initial?.mindMapSummary,
    });
  };

  return (
    <AdminModal title={initial ? "Edit Chapter / Material" : "Add Chapter / Material"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Subject</label>
            <select className={inputClass} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Chapter Number</label>
            <input type="number" className={inputClass} value={chapterNumber} onChange={(e) => setChapterNumber(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Chapter Title</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Trigonometry" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Unit Name</label>
            <input className={inputClass} value={unitName} onChange={(e) => setUnitName(e.target.value)} placeholder="e.g. Trigonometry" />
          </div>
          <div>
            <label className={labelClass}>Weightage (marks)</label>
            <input type="number" className={inputClass} value={weightage} onChange={(e) => setWeightage(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Topics (one per line)</label>
          <textarea rows={3} className={inputClass} value={topicsText} onChange={(e) => setTopicsText(e.target.value)} />
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
            <FileText className="h-4 w-4" /> Notes PDF
          </div>
          <div className="space-y-3">
            <input className={inputClass} value={notesTitle} onChange={(e) => setNotesTitle(e.target.value)} placeholder="Notes title" />
            <input className={inputClass} value={notesUrl} onChange={(e) => setNotesUrl(e.target.value)} placeholder="PDF URL, e.g. /chapter-notes/ch3-notes.pdf or https://..." />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} value={notesFileName} onChange={(e) => setNotesFileName(e.target.value)} placeholder="File name (optional)" />
              <input type="number" className={inputClass} value={notesPages} onChange={(e) => setNotesPages(Number(e.target.value))} placeholder="Page count" />
            </div>
            <textarea rows={2} className={inputClass} value={formulasText} onChange={(e) => setFormulasText(e.target.value)} placeholder="Key formulas (one per line)" />
            <input className={inputClass} value={ncertUrl} onChange={(e) => setNcertUrl(e.target.value)} placeholder="Official NCERT chapter URL (optional)" />
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-700">
            <Video className="h-4 w-4" /> Video Lesson
          </div>
          <div className="space-y-3">
            <input className={inputClass} value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video title" />
            <input className={inputClass} value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="YouTube video id, e.g. s7Y976auPwE" />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} value={videoChannel} onChange={(e) => setVideoChannel(e.target.value)} placeholder="Channel name" />
              <input type="number" className={inputClass} value={videoMinutes} onChange={(e) => setVideoMinutes(Number(e.target.value))} placeholder="Duration (minutes)" />
            </div>
          </div>
        </div>

        <ModalActions saving={saving} onClose={onClose} />
      </form>
    </AdminModal>
  );
}

function PaperModal({
  initial,
  subjects,
  onClose,
  onSave,
  saving,
}: {
  initial: PYQPaperDocument | null;
  subjects: Subject[];
  onClose: () => void;
  onSave: (paper: PYQPaperDocument) => void;
  saving: boolean;
}) {
  const [subjectId, setSubjectId] = useState(initial?.subjectId || subjects[0]?.id || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [session, setSession] = useState(initial?.session || "2026-2027");
  const [year, setYear] = useState(initial?.year || new Date().getFullYear() + 1);
  const [type, setType] = useState<PYQPaperDocument["type"]>(initial?.type || "practice_paper");
  const [pdfUrl, setPdfUrl] = useState(initial?.localPdfUrl || "");
  const [sourceUrl, setSourceUrl] = useState(initial?.officialSourceUrl || "");
  const [fileName, setFileName] = useState(initial?.fileName || "");
  const [fileSize, setFileSize] = useState(initial?.fileSizeBytes || "");
  const [pageCount, setPageCount] = useState(initial?.pageCount || 0);
  const [maxMarks, setMaxMarks] = useState(initial?.maxMarks || 80);
  const [duration, setDuration] = useState(initial?.durationHours || 3);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!subjectId || !title.trim() || !pdfUrl.trim()) {
      setError("Subject, title and PDF URL are required.");
      return;
    }
    const subject = subjects.find((s) => s.id === subjectId);
    const id = initial?.id || `paper-${Date.now()}`;
    onSave({
      id,
      title: title.trim(),
      subjectId,
      subjectName: subject?.name || subjectId,
      year: Number(year) || new Date().getFullYear(),
      session,
      type,
      fileName: fileName.trim() || `${slugify(title)}.pdf`,
      localPdfUrl: pdfUrl.trim(),
      officialSourceUrl: sourceUrl.trim(),
      fileSizeBytes: fileSize.trim() || "1.0 MB",
      pageCount: Number(pageCount) || 0,
      maxMarks: Number(maxMarks) || 80,
      durationHours: Number(duration) || 3,
      isVerified: true,
    });
  };

  return (
    <AdminModal title={initial ? "Edit Paper" : "Add Paper / Marking Scheme"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. CBSE Class 10 Maths Model Paper 2027" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Subject</label>
            <select className={inputClass} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as PYQPaperDocument["type"])}>
              <option value="practice_paper">Practice Paper</option>
              <option value="question_paper">Question Paper</option>
              <option value="marking_scheme">Marking Scheme</option>
              <option value="question_bank">Question Bank</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Session</label>
            <input className={inputClass} value={session} onChange={(e) => setSession(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <input type="number" className={inputClass} value={year} onChange={(e) => setYear(Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Max Marks</label>
            <input type="number" className={inputClass} value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className={labelClass}>PDF URL</label>
          <input className={inputClass} value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="/pyq-pdfs/paper.pdf or https://..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className={inputClass} value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="File name (optional)" />
          <input className={inputClass} value={fileSize} onChange={(e) => setFileSize(e.target.value)} placeholder="File size, e.g. 1.2 MB" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" className={inputClass} value={pageCount} onChange={(e) => setPageCount(Number(e.target.value))} placeholder="Page count" />
          <input type="number" className={inputClass} value={duration} onChange={(e) => setDuration(Number(e.target.value))} placeholder="Duration (hours)" />
        </div>
        <input className={inputClass} value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="Official source URL (optional)" />
        <ModalActions saving={saving} onClose={onClose} />
      </form>
    </AdminModal>
  );
}

function GameModal({
  initial,
  subjects,
  onClose,
  onSave,
  saving,
}: {
  initial: GameQuestion | null;
  subjects: Subject[];
  onClose: () => void;
  onSave: (question: GameQuestion) => void;
  saving: boolean;
}) {
  const [subjectId, setSubjectId] = useState(initial?.subjectId || subjects[0]?.id || "");
  const [difficulty, setDifficulty] = useState<GameDifficulty>(initial?.difficulty || "tricky");
  const [question, setQuestion] = useState(initial?.question || "");
  const [optionsText, setOptionsText] = useState((initial?.options || ["", "", "", ""]).join("\n"));
  const [correctIndex, setCorrectIndex] = useState(initial?.correctIndex || 0);
  const [explanation, setExplanation] = useState(initial?.explanation || "");
  const [points, setPoints] = useState(initial?.points || 20);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const options = optionsText
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);
    if (!question.trim() || options.length < 2) {
      setError("Question and at least two options are required.");
      return;
    }
    onSave({
      id: initial?.id || `game-${Date.now()}`,
      subjectId,
      difficulty,
      question: question.trim(),
      options,
      correctIndex: Math.min(Number(correctIndex), options.length - 1),
      explanation: explanation.trim() || "Review this concept in your NCERT chapter.",
      points: Number(points) || 20,
    });
  };

  return (
    <AdminModal title={initial ? "Edit Game Question" : "Add Game Question"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Subject</label>
            <select className={inputClass} value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Difficulty</label>
            <select className={inputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value as GameDifficulty)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="tricky">Tricky</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Question</label>
          <textarea rows={2} className={inputClass} value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Options (one per line)</label>
          <textarea rows={4} className={inputClass} value={optionsText} onChange={(e) => setOptionsText(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Correct Option</label>
            <select className={inputClass} value={correctIndex} onChange={(e) => setCorrectIndex(Number(e.target.value))}>
              <option value={0}>A (first line)</option>
              <option value={1}>B (second line)</option>
              <option value={2}>C (third line)</option>
              <option value={3}>D (fourth line)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Points</label>
            <input type="number" className={inputClass} value={points} onChange={(e) => setPoints(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Explanation</label>
          <textarea rows={2} className={inputClass} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        </div>
        <ModalActions saving={saving} onClose={onClose} />
      </form>
    </AdminModal>
  );
}

function ModalActions({ saving, onClose }: { saving: boolean; onClose: () => void }) {
  return (
    <div className="flex justify-end gap-2.5 border-t border-slate-100 pt-3">
      <Button type="button" variant="outline" size="sm" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" size="sm" disabled={saving}>
        <Save className="mr-1 h-4 w-4" /> {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
