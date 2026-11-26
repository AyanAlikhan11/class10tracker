"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressService, TaskService, ExamService, ContentService } from "@/services";
import { StudentChapterProgress, StudyTask, ExamRecord, Chapter, Subject } from "@/types";
import { getDaysRemaining } from "@/lib/utils";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldAlert,
  Layers,
  ChevronRight,
  BookOpen,
  FileDown,
  Calculator,
  Atom,
  Globe,
  Languages,
  Play,
  FileText,
} from "lucide-react";

const SUBJECT_STYLES = [
  { color: "text-blue-600", bg: "bg-blue-500" },
  { color: "text-emerald-600", bg: "bg-emerald-500" },
  { color: "text-amber-600", bg: "bg-amber-500" },
  { color: "text-rose-600", bg: "bg-rose-500" },
  { color: "text-violet-600", bg: "bg-violet-500" },
  { color: "text-pink-600", bg: "bg-pink-500" },
];

function iconForSubject(subjectId: string) {
  if (subjectId.includes("maths")) return Calculator;
  if (subjectId.includes("science")) return Atom;
  if (subjectId.includes("social")) return Globe;
  if (subjectId.includes("english")) return Languages;
  return BookOpen;
}

export default function StudentDashboardPage() {
  const { user, studentProfile } = useAuth();
  const uid = user?.uid || "";
  const todayStr = new Date().toISOString().split("T")[0];

  const [progressList, setProgressList] = useState<StudentChapterProgress[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const seededRef = useRef(false);

  const studentName = user?.displayName ? user.displayName.split(" ")[0] : "Student";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const daysToExam = getDaysRemaining(studentProfile?.boardExamDate || "2027-02-15");

  // Load admin-managed curriculum content once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [subs, chs] = await Promise.all([
          ContentService.getSubjects(),
          ContentService.getAllChapters(),
        ]);
        if (!cancelled) {
          setSubjects(subs);
          setChapters(chs);
        }
      } catch (err) {
        console.warn("Could not load curriculum content:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Realtime, per-user subscriptions. No shared/demo identifiers are used.
  useEffect(() => {
    if (!uid) {
      setProgressList([]);
      setTasks([]);
      setExams([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubProgress = ProgressService.subscribeStudentProgress(uid, setProgressList);
    const unsubTasks = TaskService.subscribeDailyTasks(uid, todayStr, (rows) => {
      setTasks(rows.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || "")));
      setLoading(false);
    });
    const unsubExams = ExamService.subscribeStudentExams(uid, (rows) => {
      setExams(rows.sort((a, b) => (b.date || "").localeCompare(a.date || "")));
    });

    return () => {
      unsubProgress();
      unsubTasks();
      unsubExams();
    };
  }, [uid, todayStr]);

  // Create a small starter plan from the student's own subjects when they have
  // no tasks yet. Tasks are saved with user-scoped ids so they never collide.
  useEffect(() => {
    if (!uid || loading || seededRef.current || tasks.length > 0) return;
    if (!subjects.length || !chapters.length) return;

    const subjectIds = studentProfile?.selectedSubjectIds?.length
      ? studentProfile.selectedSubjectIds
      : subjects.map((s) => s.id);

    const starterTasks: StudyTask[] = [];
    for (const subjectId of subjectIds) {
      if (starterTasks.length >= 3) break;
      const subject = subjects.find((s) => s.id === subjectId);
      const chapter = chapters.find((c) => c.subjectId === subjectId);
      if (!subject || !chapter) continue;
      const index = starterTasks.length + 1;
      starterTasks.push({
        id: `${uid}_${todayStr}_task-${index}`,
        studentId: uid,
        date: todayStr,
        subjectId,
        chapterId: chapter.id,
        title: `Study ${chapter.title} — ${subject.name}`,
        description: `Work through Chapter ${chapter.chapterNumber} topics and mark your syllabus progress.`,
        estimatedMinutes: 20,
        priority: index === 1 ? "high" : "medium",
        reason: "syllabus_backlog",
        reasonExplanation: "Starter focus generated from your selected subjects.",
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (starterTasks.length > 0) {
      seededRef.current = true;
      TaskService.saveTasks(starterTasks).catch((err) =>
        console.warn("Could not save starter tasks:", err)
      );
    }
  }, [uid, loading, tasks.length, subjects, chapters, studentProfile, todayStr]);

  const toggleTask = async (task: StudyTask) => {
    const nextValue = !task.isCompleted;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, isCompleted: nextValue } : t))
    );
    try {
      await TaskService.toggleTaskCompletion(task.id, nextValue);
    } catch (err) {
      console.error("Could not save task completion:", err);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, isCompleted: task.isCompleted } : t))
      );
    }
  };

  const selectedSubjectIds = useMemo(
    () =>
      studentProfile?.selectedSubjectIds?.length
        ? studentProfile.selectedSubjectIds
        : subjects.map((s) => s.id),
    [studentProfile, subjects]
  );

  const visibleSubjects = useMemo(
    () => subjects.filter((s) => selectedSubjectIds.includes(s.id)),
    [subjects, selectedSubjectIds]
  );

  const totalChaptersAcrossSubjects = chapters.filter((c) =>
    selectedSubjectIds.includes(c.subjectId)
  ).length;

  const completedChaptersCount = progressList.filter(
    (p) =>
      selectedSubjectIds.includes(p.subjectId) &&
      (p.status === "mastered" || p.status === "pyqs_solved")
  ).length;

  const progressPercent = totalChaptersAcrossSubjects
    ? Math.round((completedChaptersCount / totalChaptersAcrossSubjects) * 100)
    : 0;

  const averageExamPercentage = exams.length
    ? Math.round(exams.reduce((sum, exam) => sum + exam.percentage, 0) / exams.length)
    : 0;

  const readinessScore = exams.length
    ? Math.round(progressPercent * 0.7 + averageExamPercentage * 0.3)
    : progressPercent;

  const remainingMinutes = tasks
    .filter((t) => !t.isCompleted)
    .reduce((sum, t) => sum + t.estimatedMinutes, 0);

  const subjectMeta = visibleSubjects.map((subject, index) => {
    const style = SUBJECT_STYLES[index % SUBJECT_STYLES.length];
    const total = chapters.filter((c) => c.subjectId === subject.id).length;
    const done = progressList.filter(
      (p) =>
        p.subjectId === subject.id &&
        (p.status === "mastered" || p.status === "pyqs_solved")
    ).length;
    return {
      id: subject.id,
      name: subject.name.replace(/\s*\(.*\)$/, ""),
      icon: iconForSubject(subject.id),
      total,
      done,
      ...style,
    };
  });

  return (
    <div className="space-y-7 pb-10">
      {/* 1. WELCOME & GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            {getGreeting()} • Class 10 CBSE
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A]">
            {studentName}, let&apos;s make today count.
          </h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            Targeting {studentProfile?.targetPercentage || 90}% in CBSE Boards. Focus on one small milestone at a time.
          </p>
        </div>

        {daysToExam !== null && (
          <div className="inline-flex items-center gap-3.5 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Board Exam</div>
              <div className="text-base font-black font-heading text-blue-600">
                {daysToExam} days remaining
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. THE THREE CORE QUESTIONS (HERO SUMMARY ROW) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Q1: How is my preparation going? */}
        <Card className="p-5 flex flex-col justify-between border-l-4 border-l-blue-600 hover:shadow-md transition-shadow bg-white rounded-2xl border-slate-200/80">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Preparation Status</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                {progressPercent}% Done
              </span>
            </div>
            <div className="font-heading text-2xl font-black text-[#0F172A]">
              {completedChaptersCount}{" "}
              <span className="text-sm font-sans font-medium text-slate-500">
                of {totalChaptersAcrossSubjects} Chapters Mastered
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 mt-3 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${Math.max(progressPercent, 12)}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Readiness Score: <strong className="text-slate-900 font-bold">{readinessScore}/100</strong></span>
            <Link
              href="/syllabus"
              className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
            >
              View Syllabus <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Q2: What should I study today? */}
        <Card className="p-5 flex flex-col justify-between border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow bg-white rounded-2xl border-slate-200/80">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Today&apos;s Focus</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {tasks.filter((t) => t.isCompleted).length} / {tasks.length} Done
              </span>
            </div>
            <div className="font-heading text-2xl font-black text-[#0F172A]">
              {tasks.filter((t) => !t.isCompleted).length > 0 ? (
                <>
                  {tasks.filter((t) => !t.isCompleted).length}{" "}
                  <span className="text-sm font-sans font-medium text-slate-500">
                    Tasks Remaining Today
                  </span>
                </>
              ) : (
                <span className="text-base font-bold text-emerald-600">
                  All tasks done for today! 🎉
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-1">
              Top priority: {tasks.find((t) => !t.isCompleted)?.title || "Great job!"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Est. Time: <strong className="text-slate-900 font-bold">{remainingMinutes} mins</strong></span>
            <Link
              href="/planner"
              className="font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5"
            >
              Start Plan <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Q3: What should I do next? (Rescue Mode) */}
        <Card className="p-5 flex flex-col justify-between border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50/30 hover:shadow-md transition-shadow rounded-2xl border-slate-200/80">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Next Action</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                <Zap className="h-3 w-3 text-amber-600" /> 15-min Rescue
              </span>
            </div>
            <div className="text-base font-bold text-[#0F172A] leading-snug">
              Busy or low on energy this evening?
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Preserve your study streak with 1 quick 15-min high-impact formula review.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Zero guilt.</span>
            <Link
              href="/planner?rescue=true"
              className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
            >
              Launch 15-min Rescue
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. PROMINENT CBSE PYQ PAPERS, SYLLABUS & CHAPTER NOTES CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PYQ Papers Card */}
        <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 p-5 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shrink-0 shadow-md shadow-blue-500/20">
              <FileDown className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black font-heading text-[#0F172A]">
                  Official Board Papers
                </h3>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                  Free PDFs
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                CBSE sample question papers, marking schemes, and 2026-27 model tests.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/sprint"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-all"
            >
              <span>Open Papers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Official 2026-27 Syllabus & Comprehensive Key Notes Card */}
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 p-5 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shrink-0 shadow-md shadow-emerald-600/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black font-heading text-[#0F172A]">
                  2026–27 Syllabus & Notes
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  12 New PDFs
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                Official CBSE curriculum guides and comprehensive chapter-wise key notes.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/syllabus"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-all"
            >
              <span>Access 12 PDFs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Chapter Notes & YouTube Video Lessons Card */}
        <div className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/60 via-white to-rose-50/30 p-5 flex flex-col justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white shrink-0 shadow-md shadow-rose-600/20">
              <Play className="h-5 w-5 fill-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black font-heading text-[#0F172A]">
                  Chapter Notes & Videos
                </h3>
                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                  One-Shots
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                Curated YouTube one-shot lessons & downloadable formula cheat-sheets.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/syllabus"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-xs transition-all"
            >
              <span>Watch Videos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. SUBJECT MASTERY GLANCE (Dual-Tone Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-heading text-[#0F172A]">Subject Mastery Progress</h2>
            <span className="text-xs text-slate-500 font-medium">(Class 10 CBSE)</span>
          </div>
          <Link href="/syllabus" className="text-xs font-bold text-blue-600 hover:underline">
            Full Syllabus Tracker →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectMeta.map((info) => {
            const Icon = info.icon;
            const pct = info.total ? Math.round((info.done / info.total) * 100) : 0;
            return (
              <Link
                key={info.id}
                href={`/syllabus?subject=${info.id}`}
                className="group rounded-2xl border border-slate-200/80 bg-white p-4 hover:border-blue-400 hover:shadow-md transition-all block"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 ${info.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black font-heading text-slate-900">
                    {pct}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                  {info.name}
                </h4>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  {info.done} of {info.total} chapters completed
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 mt-3 overflow-hidden">
                  <div
                    className={`h-full ${info.bg} rounded-full transition-all`}
                    style={{ width: `${Math.max(pct, 8)}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. TODAY'S TASKS & QUICK SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Today's Tasks */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-heading text-[#0F172A]">Today&apos;s Study Tasks</h2>
              <span className="text-xs text-slate-500 font-medium">
                (Max 3 focused tasks)
              </span>
            </div>
            <Link
              href="/planner"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Manage Planner →
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  task.isCompleted
                    ? "bg-slate-50/70 border-slate-200/60 opacity-80"
                    : "bg-white border-slate-200/90 shadow-sm hover:border-blue-300"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleTask(task)}
                    className={`mt-0.5 h-5 w-5 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                      task.isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white hover:border-blue-500"
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-blue-600">
                        {task.subjectId.includes("maths")
                          ? "Maths"
                          : task.subjectId.includes("science")
                          ? "Science"
                          : "Social Science"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        • {task.reasonExplanation}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold ${
                        task.isCompleted
                          ? "line-through text-slate-400"
                          : "text-[#0F172A]"
                      }`}
                    >
                      {task.title}
                    </h4>

                    <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {task.estimatedMinutes}m
                  </span>

                  {!task.isCompleted && (
                    <Link
                      href={`/planner?timer=${task.id}`}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Start Timer
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Shortcuts & Recent Marks */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <Card className="p-5 space-y-3.5 bg-white rounded-2xl border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/syllabus"
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 text-left transition-all group"
              >
                <Play className="h-5 w-5 text-rose-600 mb-1.5 group-hover:scale-110 transition-transform fill-rose-600" />
                <div className="text-xs font-bold text-[#0F172A]">Notes & Videos</div>
                <span className="text-[11px] text-slate-500 font-medium">Watch & revise</span>
              </Link>

              <Link
                href="/sprint"
                className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50/70 text-left transition-all group"
              >
                <FileDown className="h-5 w-5 text-blue-600 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#0F172A]">PYQ PDFs</div>
                <span className="text-[11px] text-blue-600 font-bold">Free Papers</span>
              </Link>

              <Link
                href="/exams"
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 text-left transition-all group"
              >
                <TrendingUp className="h-5 w-5 text-amber-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#0F172A]">Test Marks</div>
                <span className="text-[11px] text-slate-500 font-medium">Record score</span>
              </Link>

              <Link
                href="/mistakes"
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 text-left transition-all group"
              >
                <ShieldAlert className="h-5 w-5 text-rose-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-[#0F172A]">Mistakes</div>
                <span className="text-[11px] text-slate-500 font-medium">Question slips</span>
              </Link>
            </div>
          </Card>

          {/* Latest Exam Record */}
          <Card className="p-5 bg-white rounded-2xl border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Score</h3>
              <Link href="/exams" className="text-xs font-bold text-blue-600 hover:underline">
                All Marks →
              </Link>
            </div>

            {exams.length > 0 ? (
              <div className="rounded-2xl border border-slate-200/80 p-3.5 bg-slate-50/70">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      {exams[0].examName}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A] mt-0.5">
                      {subjects.find((s) => s.id === exams[0].subjectId)?.name || "Subject"}
                    </h4>
                  </div>
                  <span className="font-heading text-lg font-black text-emerald-600">
                    {exams[0].percentage}%
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 font-medium flex justify-between">
                  <span>Score: {exams[0].obtainedMarks}/{exams[0].maximumMarks}</span>
                  <span>{exams[0].date}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-3 text-center">
                No exam recorded yet. Record your latest school test to track improvement.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
