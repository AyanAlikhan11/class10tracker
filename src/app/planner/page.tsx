"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskService } from "@/services";
import { StudyTask } from "@/types";
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

  const { user } = useAuth();
  const uid = user?.uid || "demo-student-101";

  const [isRescueMode, setIsRescueMode] = useState<boolean>(rescueQuery);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [activeTimerTask, setActiveTimerTask] = useState<StudyTask | null>(null);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(2);

  // Today's date formatted
  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  useEffect(() => {
    // Normal 3 daily tasks
    const normalTasks: StudyTask[] = [
      {
        id: "plan-task-1",
        studentId: uid,
        date: new Date().toISOString().split("T")[0],
        subjectId: "cbse-10-maths-std",
        chapterId: "math-ch-1",
        title: "Practice 5 PYQ Questions on Real Numbers",
        description: "Solve proofs of irrational numbers (√2, √3, √5) from past board papers.",
        estimatedMinutes: 25,
        priority: "high",
        reason: "upcoming_exam",
        reasonExplanation: "Repeated 3-mark question in 2020-2023 CBSE board papers.",
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "plan-task-2",
        studentId: uid,
        date: new Date().toISOString().split("T")[0],
        subjectId: "cbse-10-science",
        chapterId: "sci-ch-1",
        title: "Chemical Reactions Key Concepts & Balancing",
        description: "Read NCERT summary and balance 5 redox and decomposition reactions.",
        estimatedMinutes: 20,
        priority: "high",
        reason: "weak_chapter",
        reasonExplanation: "Identified in recent unit test as an area for improvement.",
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "plan-task-3",
        studentId: uid,
        date: new Date().toISOString().split("T")[0],
        subjectId: "cbse-10-social-science",
        chapterId: "sst-ch-1",
        title: "Rise of Nationalism in Europe Flashcards",
        description: "Review key dates, Treaty of Vienna, and Frankfurt Parliament.",
        estimatedMinutes: 15,
        priority: "medium",
        reason: "revision_due",
        reasonExplanation: "Scheduled spaced repetition review.",
        isCompleted: true,
        createdAt: new Date().toISOString(),
      },
    ];

    // Rescue mode tasks (short, high-yield, 15-minute quick win)
    const rescueTasks: StudyTask[] = [
      {
        id: "rescue-task-1",
        studentId: uid,
        date: new Date().toISOString().split("T")[0],
        subjectId: "cbse-10-science",
        chapterId: "sci-ch-2",
        title: "15-Min Quick Formula & Reaction Scan",
        description: "Quick revision of pH definitions and Plaster of Paris / Bleaching powder chemical formulas.",
        estimatedMinutes: 15,
        priority: "high",
        reason: "rescue_mode",
        reasonExplanation: "Low energy quick-win to preserve your preparation momentum.",
        isCompleted: false,
        isRescueTask: true,
        createdAt: new Date().toISOString(),
      },
    ];

    setTasks(isRescueMode ? rescueTasks : normalTasks);

    if (timerQuery) {
      const match = normalTasks.find((t) => t.id === timerQuery);
      if (match) {
        startTaskTimer(match);
      }
    }
  }, [isRescueMode, uid, timerQuery]);

  // Focus Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        setTimerSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setCompletedSessionsCount((prev) => prev + 1);
      if (activeTimerTask) {
        toggleComplete(activeTimerTask.id);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsRemaining, activeTimerTask]);

  const toggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  const startTaskTimer = (task: StudyTask) => {
    setActiveTimerTask(task);
    setTimerSecondsRemaining(task.estimatedMinutes * 60);
    setIsTimerRunning(true);
  };

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
          <span>5-Day Consistency Streak</span>
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
                toggleComplete(activeTimerTask.id);
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
                    onClick={() => toggleComplete(task.id)}
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
