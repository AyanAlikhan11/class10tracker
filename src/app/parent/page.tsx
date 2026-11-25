"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INITIAL_CBSE_CLASS_10_SUBJECTS } from "@/constants/curriculum";
import {
  Users,
  CheckCircle2,
  Calendar,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Award,
  Sparkles,
} from "lucide-react";

export default function ParentDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#42B9A5] uppercase tracking-wider">
              Parent Visibility Portal
            </span>
            <Badge variant="secondary">Verified Student: Aarav Sharma</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243247]">
            Academic Progress Overview
          </h1>
          <p className="text-sm text-[#718096] mt-0.5">
            Transparent academic visibility designed to encourage healthy support, not stress.
          </p>
        </div>

        <div className="rounded-2xl border border-[#BEE7D5] bg-[#EBF7F1] p-3 text-xs text-[#243247] flex items-center gap-2 shrink-0">
          <ShieldCheck className="h-5 w-5 text-[#37A779] shrink-0" />
          <span>Student Privacy Respected: Private study logs & drafts remain confidential.</span>
        </div>
      </div>

      {/* Weekly Digest Highlight */}
      <Card className="p-6 bg-gradient-to-r from-white to-[#F8FAFC] border-l-4 border-l-[#3978E8]">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#3978E8]">
          <Sparkles className="h-4 w-4" /> Weekly Preparation Digest (Past 7 Days)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
            <span className="text-xs text-[#718096]">Chapters Completed</span>
            <div className="text-xl font-black text-[#243247] mt-1">2 Chapters</div>
            <span className="text-[11px] text-[#37A779] font-medium">Maths & Science</span>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
            <span className="text-xs text-[#718096]">Study Consistency</span>
            <div className="text-xl font-black text-[#243247] mt-1">5 of 7 Days</div>
            <span className="text-[11px] text-[#718096] font-medium">Includes 2 scheduled rest days</span>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
            <span className="text-xs text-[#718096]">Tests Attempted</span>
            <div className="text-xl font-black text-[#243247] mt-1">1 Unit Test</div>
            <span className="text-[11px] text-[#37A779] font-medium">Scored 85%</span>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
            <span className="text-xs text-[#718096]">Readiness Indicator</span>
            <div className="text-xl font-black text-[#3978E8] mt-1">74 / 100</div>
            <span className="text-[11px] text-[#718096] font-medium">Board Exam Track</span>
          </div>
        </div>
      </Card>

      {/* Subject-Wise Mastery */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#243247]">
          Subject-Wise Syllabus Completion
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Mathematics (Standard)", pct: 68, chapters: "10 / 14 Chapters Mastered", color: "#3978E8" },
            { name: "Science", pct: 62, chapters: "8 / 13 Chapters Mastered", color: "#42B9A5" },
            { name: "Social Science", pct: 75, chapters: "15 / 20 Chapters Mastered", color: "#F2B84B" },
            { name: "English (Language & Lit)", pct: 80, chapters: "8 / 10 Chapters Mastered", color: "#8B5CF6" },
          ].map((sub, idx) => (
            <Card key={idx} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#243247]">{sub.name}</span>
                <span className="text-sm font-black" style={{ color: sub.color }}>{sub.pct}%</span>
              </div>
              <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${sub.pct}%`, backgroundColor: sub.color }}
                />
              </div>
              <span className="text-xs text-[#718096]">{sub.chapters}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Areas of Encouragement */}
      <Card className="p-5 border-l-4 border-l-[#37A779] bg-[#FBFDFB]">
        <h3 className="text-sm font-bold text-[#243247] mb-1">
          How you can support your child this week
        </h3>
        <p className="text-xs text-[#718096] leading-relaxed">
          Aarav completed challenging word problems in Quadratic Equations this week! A short encouraging word about their steady effort is far more impactful than checking exact study hours.
        </p>
      </Card>
    </div>
  );
}
