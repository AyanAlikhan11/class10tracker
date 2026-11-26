"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MistakeService } from "@/services";
import { MistakeRecord, MistakeCategory } from "@/types";
import { INITIAL_CBSE_CLASS_10_SUBJECTS } from "@/constants/curriculum";
import {
  ShieldAlert,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Filter,
  Check,
  RotateCcw,
} from "lucide-react";

export default function MistakeNotebookPage() {
  const { user } = useAuth();
  const uid = user?.uid || "";

  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Form inputs
  const [subjectId, setSubjectId] = useState("cbse-10-maths-std");
  const [chapterId, setChapterId] = useState("Quadratic Equations");
  const [questionText, setQuestionText] = useState("");
  const [whatWentWrong, setWhatWentWrong] = useState("");
  const [correctExplanation, setCorrectExplanation] = useState("");
  const [category, setCategory] = useState<MistakeCategory>("calculation_error");

  const categories = [
    { id: "concept_not_understood", label: "Concept Gap" },
    { id: "forgot_formula", label: "Forgot Formula" },
    { id: "calculation_error", label: "Calculation Error" },
    { id: "misread_question", label: "Misread Question" },
    { id: "time_management", label: "Time Management" },
    { id: "lack_of_revision", label: "Lack of Revision" },
  ];

  useEffect(() => {
    if (!uid) {
      setMistakes([]);
      return;
    }
    const unsubscribe = MistakeService.subscribeStudentMistakes(uid, (list) => {
      setMistakes(
        [...list].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      );
    });
    return () => unsubscribe();
  }, [uid]);

  const handleAddMistake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    const newRecord: MistakeRecord = {
      id: `mistake-${Date.now()}`,
      studentId: uid,
      subjectId,
      chapterId,
      questionText,
      whatWentWrong,
      correctExplanation,
      category,
      isUnderstood: false,
      revisionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...mistakes];
    setMistakes(updated);
    await MistakeService.saveMistake(newRecord);

    setModalOpen(false);
    setQuestionText("");
    setWhatWentWrong("");
    setCorrectExplanation("");
  };

  const toggleUnderstood = async (mistakeId: string) => {
    const updated = mistakes.map((m) =>
      m.id === mistakeId
        ? {
            ...m,
            isUnderstood: !m.isUnderstood,
            revisionCount: !m.isUnderstood ? m.revisionCount + 1 : m.revisionCount,
          }
        : m
    );
    setMistakes(updated);
    const target = updated.find((m) => m.id === mistakeId);
    if (target) {
      await MistakeService.toggleMistakeUnderstood(mistakeId, target.isUnderstood);
    }
  };

  const filteredMistakes = mistakes.filter((m) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "pending") return !m.isUnderstood;
    if (selectedCategory === "understood") return m.isUnderstood;
    return m.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243247]">
            Mistake Notebook
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            Top scorers don&apos;t practice till they get it right; they practice till they can&apos;t get it wrong.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Log a Mistake
        </Button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto pb-1">
        <span className="text-[#718096] flex items-center gap-1 mr-2">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        {[
          { id: "all", label: `All (${mistakes.length})` },
          { id: "pending", label: "To Review" },
          { id: "understood", label: "Understood" },
          { id: "calculation_error", label: "Calculation" },
          { id: "forgot_formula", label: "Formula" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedCategory(f.id)}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              selectedCategory === f.id
                ? "bg-[#3978E8] border-[#3978E8] text-white"
                : "bg-white border-[#E2E8F0] text-[#718096] hover:bg-[#F8FAFC]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mistake Cards */}
      <div className="space-y-4">
        {filteredMistakes.map((item) => (
          <Card
            key={item.id}
            className={`p-5 transition-all border-l-4 ${
              item.isUnderstood
                ? "border-l-[#37A779] bg-white"
                : "border-l-[#E53E3E] bg-[#FEFBFB]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#3978E8]">
                    {item.subjectId.includes("maths") ? "Maths" : "Science"} • {item.chapterId}
                  </span>
                  <Badge variant={item.isUnderstood ? "success" : "warning"}>
                    {item.category.replace(/_/g, " ")}
                  </Badge>
                  {item.revisionCount > 0 && (
                    <span className="text-xs text-[#718096]">
                      Reviewed {item.revisionCount} time{item.revisionCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#243247]">
                    Q: {item.questionText}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 text-xs">
                    <span className="font-bold text-red-800 block mb-0.5">
                      What went wrong?
                    </span>
                    <p className="text-red-900 leading-relaxed">
                      {item.whatWentWrong}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs">
                    <span className="font-bold text-emerald-800 block mb-0.5">
                      Correct Concept & Solution:
                    </span>
                    <p className="text-emerald-900 leading-relaxed">
                      {item.correctExplanation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex sm:flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleUnderstood(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    item.isUnderstood
                      ? "bg-[#EBF7F1] text-[#37A779] border border-[#BEE7D5]"
                      : "bg-[#3978E8] text-white hover:bg-[#2b63cb]"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  {item.isUnderstood ? "Marked Understood" : "Mark Understood"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ADD MISTAKE MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <h3 className="text-lg font-bold text-[#243247]">
                Log a Question Mistake
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#718096] hover:text-[#243247]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddMistake} className="space-y-3.5">
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
                    Mistake Reason
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#243247]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Chapter Name"
                placeholder="e.g. Quadratic Equations, Light Reflection"
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                required
              />

              <Input
                label="Question / Problem Description"
                placeholder="Write the question or problem prompt"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[#243247] mb-1.5">
                  What went wrong?
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-[#CBD5E1] p-3 text-sm text-[#243247] focus:border-[#3978E8] focus:outline-none focus:ring-2 focus:ring-[#3978E8]/20"
                  placeholder="e.g. Forgot minus sign in step 2; used wrong formula for volume"
                  value={whatWentWrong}
                  onChange={(e) => setWhatWentWrong(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#243247] mb-1.5">
                  Correct Explanation & Formula
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-[#CBD5E1] p-3 text-sm text-[#243247] focus:border-[#3978E8] focus:outline-none focus:ring-2 focus:ring-[#3978E8]/20"
                  placeholder="e.g. Correct formula is V = 1/3 π r² h. Remember to square radius first."
                  value={correctExplanation}
                  onChange={(e) => setCorrectExplanation(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Mistake
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
