"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { INITIAL_CBSE_CLASS_10_SUBJECTS } from "@/constants/curriculum";
import { UserService } from "@/services";
import { StudentAcademicProfile } from "@/types";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calculator,
  Atom,
  Globe,
  Languages,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refreshProfile } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.replace("/login?redirect=/onboarding");
      return;
    }
    const handleHistoryRestore = () => {
      if (!auth?.currentUser) {
        window.location.replace("/login?redirect=/onboarding");
      }
    };
    window.addEventListener("pageshow", handleHistoryRestore);
    window.addEventListener("popstate", handleHistoryRestore);
    return () => {
      window.removeEventListener("pageshow", handleHistoryRestore);
      window.removeEventListener("popstate", handleHistoryRestore);
    };
  }, [loading, user, router]);

  const [step, setStep] = useState<number>(1);
  const [board, setBoard] = useState<"CBSE" | "ICSE" | "STATE">("CBSE");
  const [academicSession] = useState("2026-2027");
  const [classGrade] = useState("Class 10");
  const [mathsType, setMathsType] = useState<"standard" | "basic">("standard");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([
    "cbse-10-maths-std",
    "cbse-10-science",
    "cbse-10-social-science",
    "cbse-10-english",
  ]);
  const [targetPercentage, setTargetPercentage] = useState<number>(90);
  const [dailyMinutes, setDailyMinutes] = useState<number>(120);
  const [preferredTime, setPreferredTime] = useState<
    "morning" | "afternoon" | "evening" | "night"
  >("evening");
  const [boardExamDate, setBoardExamDate] = useState<string>("2027-02-15");
  const [saving, setSaving] = useState(false);

  const toggleSubject = (subId: string) => {
    if (selectedSubjectIds.includes(subId)) {
      setSelectedSubjectIds(selectedSubjectIds.filter((id) => id !== subId));
    } else {
      setSelectedSubjectIds([...selectedSubjectIds, subId]);
    }
  };

  const handleFinishOnboarding = async () => {
    if (!user) {
      router.push("/login?redirect=/onboarding");
      return;
    }
    setSaving(true);
    const profile: StudentAcademicProfile = {
      uid: user.uid,
      board,
      academicSession,
      classGrade,
      selectedSubjectIds,
      targetPercentage: Number(targetPercentage) || undefined,
      dailyAvailableMinutes: Number(dailyMinutes) || 120,
      preferredStudyTime: preferredTime,
      boardExamDate: boardExamDate || "2027-02-15",
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await UserService.saveStudentProfile(profile);
      await refreshProfile();
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to save student profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F7F9FC]">
      <div className="w-full max-w-2xl">
        {/* Progress Bar & Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3978E8] text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-[#243247]">BoardPrep Setup</span>
          </div>
          <span className="text-xs font-semibold text-[#718096] bg-white border border-[#E2E8F0] px-3 py-1 rounded-full">
            Step {step} of 5
          </span>
        </div>

        {/* Step Progress Pill */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? "bg-[#3978E8]" : "bg-[#E2E8F0]"
              }`}
            />
          ))}
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <Card className="p-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EBF2FD] text-[#3978E8]">
              <Sparkles className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243247]">
                Welcome to BoardPrep!
              </h2>
              <p className="text-base text-[#718096] mt-2 max-w-lg mx-auto">
                Setting up takes less than 2 minutes. We will tailor your syllabus milestones and daily schedule to your pace and goals.
              </p>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-4 text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#243247]">
                <CheckCircle2 className="h-5 w-5 text-[#37A779] shrink-0" />
                <span>Verified CBSE Class 10 Syllabus (2026-27)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#243247]">
                <CheckCircle2 className="h-5 w-5 text-[#37A779] shrink-0" />
                <span>Smart 3-task daily planning with focus timer</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#243247]">
                <CheckCircle2 className="h-5 w-5 text-[#37A779] shrink-0" />
                <span>Private & safe — your academic records remain yours</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setStep(2)}
            >
              Let&apos;s Get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Card>
        )}

        {/* STEP 2: ACADEMIC DETAILS */}
        {step === 2 && (
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#243247]">
                Your Academic Details
              </h2>
              <p className="text-sm text-[#718096] mt-1">
                Select your examination board and academic session.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#243247] mb-2">
                  Examination Board
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "CBSE", label: "CBSE", sub: "Central Board" },
                    { id: "ICSE", label: "ICSE", sub: "Coming Soon" },
                    { id: "STATE", label: "State", sub: "Coming Soon" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={item.id !== "CBSE"}
                      onClick={() => setBoard(item.id as any)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        board === item.id
                          ? "border-[#3978E8] bg-[#EBF2FD] text-[#3978E8]"
                          : "border-[#E2E8F0] bg-white text-[#718096] hover:bg-[#F8FAFC]"
                      } ${item.id !== "CBSE" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="font-bold text-base">{item.label}</div>
                      <div className="text-xs text-[#718096] mt-0.5">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#243247] mb-1.5">
                    Class Grade
                  </label>
                  <input
                    type="text"
                    value={classGrade}
                    disabled
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] text-[#243247] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#243247] mb-1.5">
                    Academic Session
                  </label>
                  <input
                    type="text"
                    value={academicSession}
                    disabled
                    className="w-full h-11 px-3.5 rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] text-[#243247] font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="md" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(3)}>
                Continue <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: SUBJECTS */}
        {step === 3 && (
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#243247]">
                Select Your Subjects
              </h2>
              <p className="text-sm text-[#718096] mt-1">
                Choose the exact subjects you study for your Class 10 board exams.
              </p>
            </div>

            {/* Maths Standard vs Basic */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <label className="block text-sm font-semibold text-[#243247] mb-2">
                Mathematics Tier
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMathsType("standard");
                    setSelectedSubjectIds((prev) => [
                      ...prev.filter((id) => !id.includes("maths")),
                      "cbse-10-maths-std",
                    ]);
                  }}
                  className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                    mathsType === "standard"
                      ? "border-[#3978E8] bg-white text-[#3978E8] shadow-sm"
                      : "border-transparent bg-slate-200/50 text-[#718096]"
                  }`}
                >
                  Mathematics Standard (041)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMathsType("basic");
                    setSelectedSubjectIds((prev) => [
                      ...prev.filter((id) => !id.includes("maths")),
                      "cbse-10-maths-basic",
                    ]);
                  }}
                  className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                    mathsType === "basic"
                      ? "border-[#3978E8] bg-white text-[#3978E8] shadow-sm"
                      : "border-transparent bg-slate-200/50 text-[#718096]"
                  }`}
                >
                  Mathematics Basic (241)
                </button>
              </div>
            </div>

            {/* Subjects checklist */}
            <div className="space-y-2.5">
              {INITIAL_CBSE_CLASS_10_SUBJECTS.map((sub) => {
                const isSelected = selectedSubjectIds.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    onClick={() => toggleSubject(sub.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#3978E8] bg-[#EBF2FD]/40"
                        : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold"
                        style={{ backgroundColor: sub.color }}
                      >
                        {sub.code}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#243247]">
                          {sub.name}
                        </h4>
                        <span className="text-xs text-[#718096]">
                          {sub.isOptional ? "Optional / Additional" : "Core Subject"}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-[#3978E8] border-[#3978E8] text-white"
                          : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="md" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={selectedSubjectIds.length === 0}
                onClick={() => setStep(4)}
              >
                Continue <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: STUDY GOALS */}
        {step === 4 && (
          <Card className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#243247]">
                Study Habits & Goals
              </h2>
              <p className="text-sm text-[#718096] mt-1">
                Help us calibrate your daily task volume so you never burn out.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#243247] mb-1.5">
                  Target Board Percentage (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="40"
                    max="100"
                    value={targetPercentage}
                    onChange={(e) => setTargetPercentage(Number(e.target.value))}
                    className="max-w-[120px]"
                  />
                  <span className="text-sm font-bold text-[#243247]">%</span>
                  <span className="text-xs text-[#718096]">
                    Set an inspiring personal benchmark.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#243247] mb-2">
                  Daily Available Study Time
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { label: "60 mins", val: 60 },
                    { label: "90 mins", val: 90 },
                    { label: "2 hours", val: 120 },
                    { label: "3+ hours", val: 180 },
                  ].map((t) => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setDailyMinutes(t.val)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                        dailyMinutes === t.val
                          ? "border-[#3978E8] bg-[#EBF2FD] text-[#3978E8]"
                          : "border-[#E2E8F0] bg-white text-[#718096] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#243247] mb-2">
                  Preferred Time of Day to Focus
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { id: "morning", label: "Morning" },
                    { id: "afternoon", label: "Afternoon" },
                    { id: "evening", label: "Evening" },
                    { id: "night", label: "Night" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreferredTime(p.id as any)}
                      className={`p-3 rounded-xl border text-center text-xs font-bold capitalize transition-all ${
                        preferredTime === p.id
                          ? "border-[#42B9A5] bg-[#EBF8F6] text-[#42B9A5]"
                          : "border-[#E2E8F0] bg-white text-[#718096] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#243247] mb-1.5">
                  Board Exam Start Date
                </label>
                <Input
                  type="date"
                  value={boardExamDate}
                  onChange={(e) => setBoardExamDate(e.target.value)}
                />
                <span className="text-xs text-[#718096] mt-1 block">
                  Used to activate Board Sprint countdown 90 days before your first paper.
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="md" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(5)}>
                Review Setup <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 5: CONFIRMATION & COMPLETION */}
        {step === 5 && (
          <Card className="p-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EBF7F1] text-[#37A779]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243247]">
                You&apos;re All Set to Prepare!
              </h2>
              <p className="text-base text-[#718096] mt-2">
                Your syllabus is mapped and your daily study workspace is ready.
              </p>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-4 text-left space-y-2 text-sm text-[#243247] max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#718096]">Curriculum:</span>
                <span className="font-semibold">{board} {classGrade} ({academicSession})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Selected Subjects:</span>
                <span className="font-semibold">{selectedSubjectIds.length} Subjects</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Daily Study Target:</span>
                <span className="font-semibold">{dailyMinutes} minutes / day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#718096]">Target Score:</span>
                <span className="font-semibold">{targetPercentage}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(4)}>
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
              </Button>

              <Button
                variant="primary"
                size="lg"
                disabled={saving}
                onClick={handleFinishOnboarding}
              >
                {saving ? "Configuring Dashboard..." : "Enter Student Dashboard"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
