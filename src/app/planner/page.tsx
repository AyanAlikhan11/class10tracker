"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskService, ContentService } from "@/services";
import { StudyTask, Chapter, Subject } from "@/types";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Zap,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

function StudyPlannerContent() {
  const searchParams = useSearchParams();
  const rescueQuery = searchParams.get("rescue") === "true";
  const timerQuery = searchParams.get("timer");

  const { user, studentProfile } = useAuth();
  const uid = user?.uid || "";
  const dateKey = new Date().toISOString().split("T")[0];

  const [isRescueMode, setIsRescueMode] = useState<boolean>(rescueQuery);
  const [allTasks, setAllTasks] = useState<StudyTask[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTimerTask, setActiveTimerTask] = useState<StudyTask | null>(null);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const seededRef = useRef(false);
  const rescueSeededRef = useRef(false);

  // Today's date formatted
  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Load curriculum content for generating a personalised plan.
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

  // Realtime, per-user task subscription.
  useEffect(() => {
    if (!uid) {
      setAllTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = TaskService.subscribeDailyTasks(uid, dateKey, (rows) => {
      setAllTasks(rows.sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || "")));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [uid, dateKey]);

  // Seed the student's own 3-task plan if none exists yet.
  useEffect(() => {
    if (!uid || loading || seededRef.current) return;
    if (allTasks.some((t) => !t.isRescueTask)) return;
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
        id: `${uid}_${dateKey}_task-${index}`,
        studentId: uid,
        date: dateKey,
        subjectId,
        chapterId: chapter.id,
        title: `Study ${chapter.title} — ${subject.name}`,
        description: `Cover the NCERT topics for Chapter ${chapter.chapterNumber} and mark them in your syllabus tracker.`,
        estimatedMinutes: 20,
        priority: index === 1 ? "high" : "medium",
        reason: "syllabus_backlog",
        reasonExplanation: "Personalised focus generated from your selected subjects.",
        isCompleted: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (starterTasks.length > 0) {
      seededRef.current = true;
      TaskService.saveTasks(starterTasks).catch((err) =>
        console.warn("Could not save starter plan:", err)
      );
    }
  }, [uid, loading, allTasks, subjects, chapters, studentProfile, dateKey]);

  // Create a 15-minute rescue task when rescue mode is activated.
  useEffect(() => {
    if (!isRescueMode || !uid || loading || rescueSeededRef.current) return;
    if (allTasks.some((t) => t.isRescueTask)) return;
    if (!subjects.length || !chapters.length) return;

    const subject = subjects.find((s) => s.id === "cbse-10-science") || subjects[0];
    const chapter = chapters.find((c) => c.subjectId === subject.id) || chapters[0];
    if (!subject || !chapter) return;

    const rescueTask: StudyTask = {
      id: `${uid}_${dateKey}_rescue-1`,
      studentId: uid,
      date: dateKey,
      subjectId: subject.id,
      chapterId: chapter.id,
      title: `15-Min Quick Review: ${chapter.title}`,
      description: `High-yield recap of key formulas and concepts from ${subject.name}.`,
      estimatedMinutes: 15,
      priority: "high",
      reason: "rescue_mode",
      reasonExplanation: "Low energy quick-win to preserve your preparation momentum.",
      isCompleted: false,
      isRescueTask: true,
      createdAt: new Date().toISOString(),
    };

    rescueSeededRef.current = true;
    TaskService.saveTasks([rescueTask]).catch((err) =>
      console.warn("Could not save rescue task:", err)
    );
  }, [isRescueMode, uid, loading, allTasks, subjects, chapters, dateKey]);

  const tasks = useMemo(
    () => allTasks.filter((t) => (isRescueMode ? t.isRescueTask : !t.isRescueTask)),
    [allTasks, isRescueMode]
  );

  const toggleComplete = async (task: StudyTask) => {
    const nextValue = !task.isCompleted;
    setAllTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, isCompleted: nextValue } : t))
    );
    try {
      await TaskService.toggleTaskCompletion(task.id, nextValue);
    } catch (err) {
      console.error("Could not save task completion:", err);
      setAllTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, isCompleted: task.isCompleted } : t))
      );
    }
  };

  const startTaskTimer = (task: StudyTask) => {
    setActiveTimerTask(task);
    setTimerSecondsRemaining(task.estimatedMinutes * 60);
    setIsTimerRunning(true);
  };

  // Focus Timer Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setCompletedSessionsCount((prev) => prev + 1);
      if (activeTimerTask) {
        toggleComplete(activeTimerTask);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, timerSecondsRemaining, activeTimerTask]);

  // Open the timer directly when arriving from the dashboard shortcut.
  useEffect(() => {
    if (!timerQuery) return;
    const match = allTasks.find((t) => t.id === timerQuery);
    if (match) startTaskTimer(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerQuery, allTasks.length]);

  const formatTimerTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalMinutes = tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#718096] uppercase tracking-wider">
            {todayStr}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243247]">
            Today&apos;s Study Plan
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            Focus on what matters today. Maximum 3 realistic milestones.
          </p>
        </div>

        {/* Consistency streak pill */}
        <div className="inline-flex items-center gap-2 rounded-2xl border border-[#FDE68A] bg-[#FEF3C7] px-4 py-2 text-xs font-bold text-[#92400E] shrink-0">
          <Flame className="h-4 w-4 text-[#D97706]" />
          <span>
            {completedCount} of {tasks.length} tasks done today
          </span>
        </div>
      </div>

      {/* 15-MINUTE RESCUE MODE BANNER */}
      {!isRescueMode ? (
        <div className="rounded-2xl border border-[#B2E6DE] bg-gradient-to-r from-[#EBF8F6] to-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#42B9A5] text-white shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#243247]">
                Only have 15 minutes today?
              </h3>
              <p className="text-xs text-[#718096] mt-0.5">
                Switch to 15-Minute Rescue Mode: one high-yield formula review that preserves your streak with zero guilt.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsRescueMode(true)}
            className="shrink-0"
          >
            Activate Rescue Mode
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#F2B84B] bg-[#FEFBF5] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2B84B] text-white shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#243247]">
                  15-Minute Rescue Mode Active
                </h3>
                <span className="text-[10px] font-bold text-[#D99A1C] bg-[#FEF3C7] px-2 py-0.5 rounded">
                  Guilt-Free
                </span>
              </div>
              <p className="text-xs text-[#718096] mt-0.5">
                Workload reduced to 1 short high-yield concept review.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRescueMode(false)}
            className="shrink-0"
          >
            Return to Standard Plan
          </Button>
        </div>
      )}

      {/* FOCUS TIMER CARD (IF ACTIVE OR CLICKED) */}
      {activeTimerTask && (
        <Card className="p-6 border-2 border-[#3978E8] bg-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3978E8]">
                Focus Session In Progress
              </span>
              <h3 className="text-lg font-bold text-[#243247]">
                {activeTimerTask.title}
              </h3>
            </div>
            <div className="text-4xl font-black font-mono text-[#3978E8]">
              {formatTimerTime(timerSecondsRemaining)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isTimerRunning ? "outline" : "primary"}
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-1" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" /> Resume
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSecondsRemaining(activeTimerTask.estimatedMinutes * 60);
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsTimerRunning(false);
                toggleComplete(activeTimerTask);
                setActiveTimerTask(null);
              }}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Finish Task
            </Button>
          </div>
        </Card>
      )}

      {/* SUMMARY STATS ROW */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-xs font-semibold text-[#718096]">Daily Goal</div>
          <div className="text-xl font-black text-[#243247] mt-1">{totalMinutes}m</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xs font-semibold text-[#718096]">Completed</div>
          <div className="text-xl font-black text-[#37A779] mt-1">
            {completedCount} / {tasks.length}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-xs font-semibold text-[#718096]">Focus Sessions</div>
          <div className="text-xl font-black text-[#3978E8] mt-1">
            {completedSessionsCount} today
          </div>
        </Card>
      </div>

      {/* TODAY'S TASKS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#243247]">
          {isRescueMode ? "Your Rescue Task" : "Today's Recommended Tasks"}
        </h2>

        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`p-5 transition-all ${
                task.isCompleted ? "bg-[#F8FAFC] opacity-75" : "bg-white hover:border-[#CBD5E1]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleComplete(task)}
                    className={`mt-1 h-5 w-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                      task.isCompleted
                        ? "bg-[#37A779] border-[#37A779] text-white"
                        : "border-[#CBD5E1] bg-white hover:border-[#3978E8]"
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-[#3978E8]">
                        {task.subjectId.includes("maths")
                          ? "Mathematics"
                          : task.subjectId.includes("science")
                          ? "Science"
                          : "Social Science"}
                      </span>
                      <span className="text-xs text-[#718096]">
                        • {task.reasonExplanation}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold ${
                        task.isCompleted ? "line-through text-[#718096]" : "text-[#243247]"
                      }`}
                    >
                      {task.title}
                    </h3>

                    <p className="text-sm text-[#718096] mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-xs font-bold text-[#718096] bg-[#F1F5F9] px-3 py-1.5 rounded-lg">
                    <Clock className="h-3.5 w-3.5" /> {task.estimatedMinutes} mins
                  </span>

                  {!task.isCompleted && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => startTaskTimer(task)}
                    >
                      <Play className="h-3.5 w-3.5 mr-1" /> Start Timer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudyPlannerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-[#718096]">Loading planner...</div>}>
      <StudyPlannerContent />
    </Suspense>
  );
}
