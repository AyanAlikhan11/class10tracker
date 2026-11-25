"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExamService } from "@/services";
import { ExamRecord, ExamType } from "@/types";
import { INITIAL_CBSE_CLASS_10_SUBJECTS } from "@/constants/curriculum";
import {
  TrendingUp,
  Plus,
  Award,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ExamsTrackerPage() {
  const { user } = useAuth();
  const uid = user?.uid || "demo-student-101";

  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState<ExamType>("unit_test");
  const [subjectId, setSubjectId] = useState("cbse-10-maths-std");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [maxMarks, setMaxMarks] = useState<number>(80);
  const [obtainedMarks, setObtainedMarks] = useState<number>(68);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const records = await ExamService.getStudentExams(uid);
        if (records.length > 0) {
          setExams(records);
        } else {
          // Initial baseline records
          const seed: ExamRecord[] = [
            {
              id: "exam-seed-1",
              studentId: uid,
              examName: "Half-Yearly Examination",
              examType: "half_yearly",
              date: "2026-09-20",
              subjectId: "cbse-10-maths-std",
              maximumMarks: 80,
              obtainedMarks: 71,
              percentage: 88.75,
              remarks: "Lost 4 marks in quadratic equation word problem.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "exam-seed-2",
              studentId: uid,
              examName: "Unit Test 2",
              examType: "unit_test",
              date: "2026-08-14",
              subjectId: "cbse-10-science",
              maximumMarks: 40,
              obtainedMarks: 35,
              percentage: 87.5,
              remarks: "Need to memorize chemical reaction names.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          setExams(seed);
        }
      } catch (err) {
        console.error("Failed to load exams:", err);
      }
    };
    load();
  }, [uid]);

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const max = Number(maxMarks);
    const obt = Number(obtainedMarks);

    if (isNaN(max) || max <= 0) {
      setFormError("Maximum marks must be greater than 0.");
      return;
    }
    if (isNaN(obt) || obt < 0) {
      setFormError("Obtained marks cannot be negative.");
      return;
    }
    if (obt > max) {
      setFormError("Obtained marks cannot exceed maximum marks.");
      return;
    }

    const percentage = Math.round((obt / max) * 1000) / 10;
    const newRecord: ExamRecord = {
      id: `exam-${Date.now()}`,
      studentId: uid,
      examName,
      examType,
      date,
      subjectId,
      maximumMarks: max,
      obtainedMarks: obt,
      percentage,
      remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...exams];
    setExams(updated);
    await ExamService.saveExam(newRecord);

    setModalOpen(false);
    setExamName("");
    setRemarks("");
  };

  // Metrics
  const avgPercentage = exams.length > 0
    ? Math.round((exams.reduce((acc, e) => acc + e.percentage, 0) / exams.length) * 10) / 10
    : 0;

  const highestScore = exams.length > 0
    ? Math.max(...exams.map((e) => e.percentage))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243247]">
            Tests & Marks Tracker
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            Log school tests, half-yearlies, and pre-boards to track your genuine improvement.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Add Test Score
        </Button>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 border-l-4 border-l-[#3978E8]">
          <div className="text-xs font-bold text-[#718096] uppercase tracking-wider">
            Overall Average Score
          </div>
          <div className="text-3xl font-black text-[#243247] mt-1">
            {avgPercentage}%
          </div>
          <span className="text-xs text-[#37A779] font-medium mt-1 block">
            Across {exams.length} recorded tests
          </span>
        </Card>

        <Card className="p-5 border-l-4 border-l-[#37A779]">
          <div className="text-xs font-bold text-[#718096] uppercase tracking-wider">
            Personal Best
          </div>
          <div className="text-3xl font-black text-[#37A779] mt-1">
            {highestScore}%
          </div>
          <span className="text-xs text-[#718096] font-medium mt-1 block">
            Target benchmark: 90%
          </span>
        </Card>

        <Card className="p-5 border-l-4 border-l-[#42B9A5]">
          <div className="text-xs font-bold text-[#718096] uppercase tracking-wider">
            Latest Attempt
          </div>
          <div className="text-3xl font-black text-[#42B9A5] mt-1">
            {exams[0]?.percentage || 0}%
          </div>
          <span className="text-xs text-[#718096] font-medium mt-1 block">
            {exams[0]?.examName || "No tests yet"}
          </span>
        </Card>
      </div>

      {/* Records Table / List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#243247]">Examination Records</h2>

        {exams.map((exam) => {
          const sub = INITIAL_CBSE_CLASS_10_SUBJECTS.find((s) => s.id === exam.subjectId);
          return (
            <Card key={exam.id} className="p-5 hover:border-[#CBD5E1] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white font-bold text-xs shrink-0"
                    style={{ backgroundColor: sub?.color || "#3978E8" }}
                  >
                    {sub?.code || "10"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#718096]">
                        {exam.date}
                      </span>
                      <Badge variant="neutral">{exam.examType.replace("_", " ").toUpperCase()}</Badge>
                    </div>

                    <h3 className="text-base font-bold text-[#243247]">
                      {exam.examName} • {sub?.name || "Subject"}
                    </h3>

                    {exam.remarks && (
                      <p className="text-xs text-[#718096] mt-1 italic">
                        &ldquo;{exam.remarks}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F1F5F9]">
                  <div className="text-2xl font-black text-[#243247]">
                    {exam.percentage}%
                  </div>
                  <span className="text-xs text-[#718096] font-medium">
                    {exam.obtainedMarks} / {exam.maximumMarks} marks
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ADD EXAM MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="text-lg font-bold text-[#243247]">
                Record Test Score
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#718096] hover:text-[#243247]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddExam} className="space-y-3.5">
              <Input
                label="Examination Title"
                placeholder="e.g. Unit Test 3, Pre-Board 1"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#243247] mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#243247]"
                  >
                    {INITIAL_CBSE_CLASS_10_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#243247] mb-1.5">
                    Assessment Type
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#243247]"
                  >
                    <option value="unit_test">Unit Test</option>
                    <option value="class_test">Class Test</option>
                    <option value="half_yearly">Half-Yearly</option>
                    <option value="pre_board">Pre-Board</option>
                    <option value="mock_test">Mock Test</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Input
                    label="Max Marks"
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="Obtained"
                    type="number"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Input
                label="Personal Remarks / Weak Points"
                placeholder="e.g. Lost marks in calculations on question 14"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />

              <div className="flex justify-end gap-2.5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Score
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
