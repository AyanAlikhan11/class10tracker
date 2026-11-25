"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { AuthGateModal } from "@/components/ui/AuthGateModal";
import { VideoPlayerModal } from "@/components/ui/VideoPlayerModal";
import { PdfViewerModal, GenericPdfDocument } from "@/components/ui/PdfViewerModal";
import { INITIAL_SAMPLE_CHAPTERS } from "@/constants/curriculum";
import { Chapter } from "@/types";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  ShieldAlert,
  Clock,
  Layers,
  Award,
  Zap,
  FileDown,
  Download,
  Eye,
  Check,
  Flame,
  HelpCircle,
  Lock,
  ShieldCheck,
  ChevronRight,
  Calculator,
  Microscope,
  Globe2,
  BookMarked,
  Play,
  FileText,
  Video,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [authGateDoc, setAuthGateDoc] = useState<{ title: string; url: string } | null>(null);
  const [activeVideoChapter, setActiveVideoChapter] = useState<Chapter | null>(null);
  const [activePdfDoc, setActivePdfDoc] = useState<GenericPdfDocument | null>(null);

  const handlePdfClick = (e: React.MouseEvent, paper: { title: string; url: string }) => {
    e.preventDefault();
    if (!user) {
      setAuthGateDoc(paper);
    } else {
      setActivePdfDoc({
        id: paper.title,
        title: paper.title,
        pdfUrl: paper.url,
        fileName: paper.url.split("/").pop() || "cbse-paper.pdf",
        session: "CBSE Class 10 Board Companion",
      });
    }
  };

  const handleOpenChapterVideo = (subjectId: string, chapterNumber: number) => {
    const chList = INITIAL_SAMPLE_CHAPTERS[subjectId] || [];
    const ch = chList.find((c) => c.chapterNumber === chapterNumber) || chList[0];
    if (!ch) return;

    if (!user) {
      setAuthGateDoc({ title: `${ch.title} — Video Lessons`, url: "/syllabus" });
    } else {
      setActiveVideoChapter(ch);
    }
  };

  const handleOpenChapterNotes = (e: React.MouseEvent, subjectId: string, chapterNumber: number) => {
    e.preventDefault();
    const chList = INITIAL_SAMPLE_CHAPTERS[subjectId] || [];
    const ch = chList.find((c) => c.chapterNumber === chapterNumber) || chList[0];
    if (!ch || !ch.notesDocument) return;

    if (!user) {
      setAuthGateDoc({ title: ch.notesDocument.title, url: ch.notesDocument.pdfUrl });
    } else {
      setActivePdfDoc({
        id: ch.notesDocument.id,
        title: ch.notesDocument.title,
        pdfUrl: ch.notesDocument.pdfUrl,
        fileName: ch.notesDocument.fileName,
        session: "CBSE Class 10 Chapter Revision Notes",
        type: "chapter_notes",
        officialSourceUrl: ch.notesDocument.officialNcertChapterUrl,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#2563EB]/20 selection:text-[#2563EB]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#EFF6FF] via-[#FFFFFF] to-[#ECFDF5]">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            
            {/* Top Product Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-white px-4 py-1.5 text-xs font-bold text-[#2563EB] shadow-[0_4px_20px_rgba(37,99,235,0.08)] mb-6 hover:scale-105 transition-transform">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white text-[10px]">
                ✦
              </span>
              <span>Student-First CBSE Class 10 Companion</span>
              <span className="bg-[#2563EB] text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-full">
                2026–27
              </span>
            </div>

            {/* Hero Headline (Original Product Tagline) */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl text-[#0F172A]">
              Your board exam preparation,{" "}
              <span className="text-[#2563EB] block sm:inline">made simpler.</span>
            </h1>

            {/* Hero Subtitle (Original Product Promise) */}
            <p className="text-base sm:text-xl text-[#64748B] max-w-2xl leading-relaxed mt-6 mb-8 font-normal">
              Know what to study, track your progress, and prepare for your boards one small step at a time. One day at a time. One chapter at a time. Your boards. Your pace. Your progress.
            </p>

            {/* Hero Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <Link
                href={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-8 py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all"
              >
                {user ? "Open My Dashboard" : "Start Preparing Free"}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/sprint"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#2563EB]/25 bg-white px-7 py-4 text-base font-bold text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FileDown className="h-4 w-4 text-[#2563EB]" />
                Official CBSE PYQ PDFs →
              </Link>
            </div>

            {/* Product Value Metrics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] overflow-hidden">
              <div className="p-4 sm:p-5 border-r border-slate-100 text-center">
                <div className="font-heading text-2xl sm:text-3xl font-black text-[#2563EB]">3</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mt-1">Daily Tasks Max</div>
              </div>
              <div className="p-4 sm:p-5 sm:border-r border-slate-100 text-center">
                <div className="font-heading text-2xl sm:text-3xl font-black text-[#F59E0B]">15m</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mt-1">Rescue Mode</div>
              </div>
              <div className="p-4 sm:p-5 border-r border-slate-100 text-center border-t sm:border-t-0">
                <div className="font-heading text-2xl sm:text-3xl font-black text-[#10B981]">4</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mt-1">Chapter Milestones</div>
              </div>
              <div className="p-4 sm:p-5 text-center border-t sm:border-t-0">
                <div className="font-heading text-2xl sm:text-3xl font-black text-[#0F172A]">Zero</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mt-1">Distractions or Ads</div>
              </div>
            </div>

          </div>
        </section>

        {/* CONTINUOUS TICKER TAPE */}
        <div className="overflow-hidden border-y border-slate-200/80 bg-white py-3.5">
          <div className="flex animate-marquee whitespace-nowrap">
            {[1, 2].map((iter) => (
              <div key={iter} className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-[#64748B] px-4">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Syllabus Milestones</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#10B981]" /> Official Board PYQ PDFs</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> 15-Minute Rescue Mode</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Daily Study Planner</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#F43F5E]" /> Mistake Notebook</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#10B981]" /> Focus Timer</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#2563EB]" /> Transparent Readiness Score</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> CBSE Class 10 (2026-27)</span>
              </div>
            ))}
          </div>
        </div>

        {/* THE THREE CORE QUESTIONS (Live Student Experience Mockup) */}
        <section id="questions" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1 rounded-full mb-3">
              ✦ The 5-Second Test
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Open the app. Know immediately:<br />
              <span className="text-[#2563EB]">What to do next.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-3">
              Students do not need complicated corporate analytics. They need clear answers to three simple questions:
            </p>
          </div>

          {/* Window Mockup */}
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
            {/* Window Header */}
            <div className="bg-[#F8FAFC] border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#F43F5E]" />
                <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                <span className="h-3 w-3 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-xs text-[#64748B] bg-white border border-slate-200 px-4 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="text-[#10B981]">🔒</span> app.boardprep.in/dashboard
              </div>
              <span className="text-xs font-bold text-[#2563EB]">Class 10 CBSE</span>
            </div>

            {/* 3 Core Questions Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Question 1 */}
              <div className="rounded-2xl border border-l-4 border-l-[#2563EB] border-slate-200 p-5 bg-[#F8FAFC] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Question 1
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A] mt-1 mb-2 font-heading">
                    How is my preparation going?
                  </h3>
                  <div className="font-heading text-2xl font-black text-[#0F172A]">
                    68% <span className="text-xs font-sans text-[#64748B] font-normal">Syllabus Mastered</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 mt-3 overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full w-[68%]" />
                  </div>
                  <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
                    26 of 38 chapters completed across Mathematics, Science, and Social Science.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs font-bold text-[#2563EB] flex items-center justify-between">
                  <span>Readiness: 74/100</span>
                  <span className="bg-[#EFF6FF] px-2 py-0.5 rounded-full text-[10px]">On Track</span>
                </div>
              </div>

              {/* Question 2 */}
              <div className="rounded-2xl border border-l-4 border-l-[#10B981] border-slate-200 p-5 bg-[#F8FAFC] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#10B981]">
                    Question 2
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A] mt-1 mb-2 font-heading">
                    What should I study today?
                  </h3>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <span className="text-[11px] font-bold text-[#2563EB]">
                      Maths • Quadratic Equations
                    </span>
                    <h4 className="text-xs font-bold text-[#0F172A] mt-0.5">
                      Solve 5 PYQ practice problems
                    </h4>
                    <span className="text-[10px] text-[#64748B] block mt-1">
                      Estimated: 25 minutes
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs font-bold text-[#10B981] flex items-center justify-between">
                  <span>Max 3 daily tasks</span>
                  <span className="bg-[#ECFDF5] px-2 py-0.5 rounded-full text-[10px]">No Overwhelm</span>
                </div>
              </div>

              {/* Question 3 */}
              <div className="rounded-2xl border border-l-4 border-l-[#F59E0B] border-slate-200 p-5 bg-[#F8FAFC] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">
                    Question 3
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A] mt-1 mb-2 font-heading">
                    What should I do next?
                  </h3>
                  <div className="rounded-xl border border-[#F59E0B]/30 bg-[#FFFBEB] p-3">
                    <span className="text-[11px] font-bold text-[#D97706] flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" /> 15-Minute Rescue Mode
                    </span>
                    <p className="text-xs text-[#0F172A] mt-1">
                      Low energy evening? 1 quick formula scan preserves your streak.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs font-bold text-[#D97706] flex items-center justify-between">
                  <span>Guilt-free consistency</span>
                  <span className="bg-[#FFFBEB] px-2 py-0.5 rounded-full text-[10px]">Streak Safe</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUM SUBJECT PROGRESS PREVIEW */}
        <section className="py-12 bg-white border-y border-slate-200/70">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1 rounded-full mb-2">
                ✦ Curriculum Coverage
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#0F172A]">
                Official CBSE Class 10 Subjects Mapped
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Mathematics (Std & Basic)",
                  code: "041 / 241",
                  chapters: "14 Chapters",
                  weight: "80 Marks Theory",
                  color: "border-blue-200 bg-blue-50/40 text-blue-700",
                  icon: Calculator,
                  progress: 75,
                },
                {
                  name: "Science",
                  code: "086",
                  chapters: "13 Chapters",
                  weight: "Physics, Chem, Bio",
                  color: "border-emerald-200 bg-emerald-50/40 text-emerald-700",
                  icon: Microscope,
                  progress: 68,
                },
                {
                  name: "Social Science",
                  code: "087",
                  chapters: "21 Chapters",
                  weight: "History, Geo, Civics, Eco",
                  color: "border-amber-200 bg-amber-50/40 text-amber-700",
                  icon: Globe2,
                  progress: 60,
                },
                {
                  name: "English Language & Lit",
                  code: "184",
                  chapters: "All Units & Grammar",
                  weight: "Reading & Writing Skills",
                  color: "border-indigo-200 bg-indigo-50/40 text-indigo-700",
                  icon: BookMarked,
                  progress: 82,
                },
              ].map((sub, i) => {
                const Icon = sub.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#2563EB] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl border ${sub.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {sub.code}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {sub.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#64748B] mt-1 mb-3">
                      <span>{sub.chapters}</span>
                      <span>{sub.weight}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full"
                        style={{ width: `${sub.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CHAPTER NOTES & YOUTUBE VIDEO LESSONS SHOWCASE */}
        <section id="chapter-resources" className="py-16 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full mb-2">
                  ✦ One-Shot Videos + Formula Sheets
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                  Chapter Notes PDFs & YouTube Concept Lessons
                </h2>
                <p className="text-sm sm:text-base text-[#64748B] mt-1 max-w-2xl">
                  Watch top-rated Class 10 board concept video lessons without distraction and download comprehensive chapter revision notes PDFs with key formulas.
                </p>
              </div>

              <Link
                href="/syllabus"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline shrink-0"
              >
                Browse All Chapters, Notes & Videos →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  subject: "Maths Standard",
                  chapter: "Real Numbers",
                  tag: "Chapter 1",
                  chapterNum: 1,
                  videos: 2,
                  notesSize: "5.4 KB PDF",
                  formulas: "HCF × LCM = a × b • Proof of √5",
                  subjectId: "cbse-10-maths-std",
                },
                {
                  subject: "Science",
                  chapter: "Chemical Reactions",
                  tag: "Chapter 1",
                  chapterNum: 1,
                  videos: 2,
                  notesSize: "5.6 KB PDF",
                  formulas: "Balancing equations • 5 reaction types",
                  subjectId: "cbse-10-science",
                },
                {
                  subject: "Science",
                  chapter: "Life Processes",
                  tag: "Chapter 5",
                  chapterNum: 5,
                  videos: 2,
                  notesSize: "6.8 KB PDF",
                  formulas: "Double circulation • Nephron structure",
                  subjectId: "cbse-10-science",
                },
                {
                  subject: "Social Science",
                  chapter: "Nationalism in Europe",
                  tag: "History Ch 1",
                  chapterNum: 1,
                  videos: 2,
                  notesSize: "5.3 KB PDF",
                  formulas: "Napoleonic Code 1804 • Unifications",
                  subjectId: "cbse-10-social-science",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-md transition-all hover:border-blue-400 bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {item.subject}
                      </span>
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] font-heading">
                      {item.chapter}
                    </h3>

                    <div className="mt-3.5 space-y-2 text-xs">
                      {/* Direct Watch Video Button (Auth Gated) */}
                      <button
                        type="button"
                        onClick={() => handleOpenChapterVideo(item.subjectId, item.chapterNum)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition-all group text-left"
                      >
                        <span className="flex items-center gap-2">
                          {user ? (
                            <Play className="h-3.5 w-3.5 fill-rose-600 text-rose-600 group-hover:scale-110 transition-transform" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                          )}
                          <span>{user ? `Watch Video Lessons (${item.videos})` : `Login to Watch (${item.videos})`}</span>
                        </span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-rose-200">
                          {user ? "Play ▶" : "Locked 🔒"}
                        </span>
                      </button>

                      {/* Direct Notes PDF Button */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenChapterNotes(e, item.subjectId, item.chapterNum)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition-all group text-left"
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                          <span>Revision Notes ({item.notesSize})</span>
                        </span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200">PDF 📄</span>
                      </button>

                      <p className="text-[11px] text-slate-500 line-clamp-1 pt-0.5 font-mono">
                        {item.formulas}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/syllabus?subject=${item.subjectId}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>All Topics & Exercises</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Free Access
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OFFICIAL CBSE CLASS 10 PDF PAPERS SHOWCASE (FREE ACCESS - AUTH GATED) */}
        <section id="pyq-papers" className="py-16 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1 rounded-full mb-2">
                  ✦ Session 2026–2027 Study Material & PYQs
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                  2026–27 Practice Papers, PYQs & Question Banks
                </h2>
                <p className="text-sm sm:text-base text-[#64748B] mt-1">
                  Access NCERT24 model practice papers, competency question banks, and CBSE board sample question papers with step-by-step marking schemes. Free for registered students.
                </p>
              </div>

              <Link
                href="/sprint"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2563EB] hover:underline shrink-0"
              >
                Browse All PDF Papers & Question Bank →
              </Link>
            </div>

            {/* Auth Notice Pill */}
            {!user && (
              <div className="mb-6 p-3.5 rounded-2xl border border-blue-200 bg-blue-50/70 text-xs text-blue-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#2563EB] shrink-0" />
                  <span>
                    <strong>Free Student Access:</strong> Sign in with your student account to read in-browser or download full 2026-2027 practice papers, NCERT24 question banks, and official CBSE PDFs.
                  </span>
                </div>
                <Link
                  href="/login?redirect=/sprint"
                  className="font-bold underline text-[#2563EB] shrink-0 hover:text-[#1D4ED8]"
                >
                  Sign In Now →
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: "Mathematics Standard (041) 2026-27 Practice Paper",
                  tag: "2026-27 Model Paper",
                  size: "1.2 MB",
                  url: "/pyq-pdfs/CBSE-Class10-MathsStandard-2027-PracticePaper.pdf",
                  badgeColor: "bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20",
                },
                {
                  title: "Mathematics Standard 2026-27 Step-by-Step Solutions",
                  tag: "Solutions & Marking Scheme",
                  size: "980 KB",
                  url: "/pyq-pdfs/CBSE-Class10-MathsStandard-2027-PracticeSolutions.pdf",
                  badgeColor: "bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20",
                },
                {
                  title: "Science (086) 2026-27 Model Practice Paper",
                  tag: "2026-27 Model Paper",
                  size: "1.1 MB",
                  url: "/pyq-pdfs/CBSE-Class10-Science-2027-PracticePaper.pdf",
                  badgeColor: "bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20",
                },
                {
                  title: "Science 2026-27 Marking Scheme & Answers",
                  tag: "Solutions & Marking Scheme",
                  size: "920 KB",
                  url: "/pyq-pdfs/CBSE-Class10-Science-2027-PracticeSolutions.pdf",
                  badgeColor: "bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/20",
                },
                {
                  title: "NCERT24 Maths Standard Competency Question Bank 2027",
                  tag: "NCERT24 Question Bank",
                  size: "850 KB",
                  url: "/pyq-pdfs/NCERT24-Class10-Maths-ImportantQuestions-2027.pdf",
                  badgeColor: "bg-[#FFFBEB] text-[#D97706] border border-[#F59E0B]/20",
                },
                {
                  title: "NCERT24 Science Competency Question Bank 2027",
                  tag: "NCERT24 Question Bank",
                  size: "910 KB",
                  url: "/pyq-pdfs/NCERT24-Class10-Science-CompetencyQuestionBank-2027.pdf",
                  badgeColor: "bg-[#FFF1F2] text-[#F43F5E] border border-[#F43F5E]/20",
                },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-[#2563EB]"
                >
                  <div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-3 ${p.badgeColor}`}>
                      {p.tag}
                    </span>
                    <h3 className="text-base font-bold text-[#0F172A] leading-snug font-heading">
                      {p.title}
                    </h3>
                    <span className="text-xs text-[#64748B] block mt-2">
                      Verified CBSE Academic PDF • {p.size}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 gap-3">
                    {/* Read in App */}
                    <Link
                      href="/sprint"
                      onClick={(e) => handlePdfClick(e, p)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                    >
                      {user ? <Eye className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5 text-[#2563EB]" />}
                      {user ? "Read in App" : "Login to Read"}
                    </Link>

                    {/* Download PDF */}
                    <a
                      href={user ? p.url : "#"}
                      download={user ? p.url.split("/").pop() : undefined}
                      onClick={(e) => handlePdfClick(e, p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F8FAFC] text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors border border-slate-200"
                    >
                      {user ? <Download className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {user ? "Download PDF" : "Download (Login)"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS (The 4 Step Journey) */}
        <section id="how" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1 rounded-full mb-3">
              ✦ The Method
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              How BoardPrep Works
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2">
              Four clear steps designed around how high-scoring board students prepare.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            {[
              {
                num: "1",
                numColor: "bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]",
                title: "Choose Your Subjects",
                desc: "Select Maths (Standard or Basic), Science, Social Science, English, and language options.",
              },
              {
                num: "2",
                numColor: "bg-[#ECFDF5] text-[#10B981] border-[#10B981]",
                title: "Follow Daily Study Plan",
                desc: "Receive at most 3 clear, prioritized study tasks every day tailored to your target.",
              },
              {
                num: "3",
                numColor: "bg-[#FFFBEB] text-[#D97706] border-[#F59E0B]",
                title: "Track Milestones",
                desc: "Update progress from NCERT reading to PYQs solved and chapter mastery in one tap.",
              },
              {
                num: "4",
                numColor: "bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]",
                title: "Get Ready for Boards",
                desc: "Turn on Sprint Mode with curated previous year papers, sample tests, and mistake reviews.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-8 text-center border-b sm:border-b-0 sm:border-r border-slate-100 last:border-r-0 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className={`h-12 w-12 rounded-full border-2 ${step.numColor} font-heading font-black text-lg flex items-center justify-center mx-auto mb-4`}>
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-[#0F172A] mb-2 font-heading">
                  {step.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#ECFDF5] border border-[#10B981]/20 px-3 py-1 rounded-full mb-3">
              ✦ Core Modules
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              Everything you need,<br />
              <span className="text-[#2563EB]">nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5 border border-[#2563EB]/20">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-heading">
                Dynamic Syllabus Tracker
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Break large textbooks into 4 tangible stages: Not Started, NCERT Read, PYQs Solved, and Mastered.
              </p>
              <span className="text-xs font-bold text-[#2563EB]">
                • Official CBSE 2026-27 syllabus mapped
              </span>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-5 border border-[#10B981]/20">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-heading">
                Daily Study Planner & Rescue
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Maximum 3 bite-sized daily tasks with built-in focus timers. Have a busy day? Switch to 15-minute Rescue Mode without breaking your streak.
              </p>
              <span className="text-xs font-bold text-[#10B981]">
                • Guilt-free, consistent habit building
              </span>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center mb-5 border border-[#F59E0B]/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-heading">
                Marks & Performance Tracker
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Record marks from unit tests to pre-boards. Understand percentage trends and see where you are making improvements.
              </p>
              <span className="text-xs font-bold text-[#D97706]">
                • Clear score trends, not complicated graphs
              </span>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#FFF1F2] text-[#F43F5E] flex items-center justify-center mb-5 border border-[#F43F5E]/20">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-heading">
                Mistake Notebook
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Log questions you got wrong, categorize why (calculation slip, forgot formula, concept gap), and review before exams.
              </p>
              <span className="text-xs font-bold text-[#F43F5E]">
                • Stop repeating the same errors in boards
              </span>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5 border border-[#2563EB]/20">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-heading">
                Board Sprint & PYQs
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Activates 90 days before your exams. Filter previous year board questions by subject, chapter, marks, and question type.
              </p>
              <span className="text-xs font-bold text-[#2563EB]">
                • Real CBSE papers from past years
              </span>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mb-5 border border-[#10B981]/20">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-heading">
                Transparent Readiness Score
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                Calculated from your verified chapter progress and test attempts. No magic AI predictions—pure mathematical clarity.
              </p>
              <span className="text-xs font-bold text-[#10B981]">
                • Clear breakdown of what to finish next
              </span>
            </div>
          </div>
        </section>

        {/* MOTIVATION / CONSISTENCY SECTION */}
        <section className="py-20 bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0F172A] text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#93C5FD] bg-white/10 px-3.5 py-1 rounded-full">
              ✦ CORE PRINCIPLE
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black leading-tight">
              Consistency beats last-minute panic every time.
            </h2>
            <p className="text-base sm:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
              You do not need to study 10 hours a day to score 90%+ in Class 10 boards. You only need to finish one topic today, solve 3 questions, and never let doubts linger.
            </p>
            <div className="pt-4">
              <Link
                href={user ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#2563EB] shadow-lg hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
              >
                {user ? "View Today's Plan" : "Start Preparing Today"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1 rounded-full mb-3">
              ✦ Common Questions
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Is BoardPrep really free for Class 10 students?",
                a: "Yes. All core preparation features—the Syllabus Tracker, Daily 3-Task Planner, Marks Tracker, Mistake Notebook, and CBSE PYQ PDFs—are completely free for CBSE Class 10 candidates.",
              },
              {
                q: "Why do I need to log in to access the PYQ PDFs?",
                a: "Official CBSE Papers and step-by-step marking schemes are unlocked for verified Class 10 student accounts. Creating an account takes 10 seconds, is 100% free forever, and enables you to save your progress, bookmark problems, and track practice history.",
              },
              {
                q: "Does this replace my school or tuition classes?",
                a: "No. BoardPrep is not a video-lecture platform. It is your personal academic companion that organizes what you need to study, tracks what you have finished, and shows what to do next.",
              },
              {
                q: "What if I miss a few days of study?",
                a: "We never penalize or shame you for missed days. Life happens! The planner automatically prioritizes your remaining tasks without overwhelming you.",
              },
              {
                q: "Can I view the PYQ PDFs on my phone without downloading?",
                a: "Yes! Once signed in, BoardPrep provides a built-in PDF viewer so you can read, practice, and check solutions on your mobile phone or computer directly in your browser without downloading huge files.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 p-6 bg-white shadow-xs"
              >
                <h3 className="text-base font-bold text-[#0F172A] mb-2 flex items-center gap-2 font-heading">
                  <HelpCircle className="h-4 w-4 text-[#2563EB] shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA CARD */}
        <section className="py-12 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0F172A] text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
            {/* Glowing gradient blobs */}
            <div className="absolute top-0 left-0 -translate-x-20 -translate-y-20 w-80 h-80 rounded-full bg-[#2563EB]/25 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-20 translate-y-20 w-80 h-80 rounded-full bg-[#10B981]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3.5 py-1 rounded-full">
                ✦ Your Boards. Your Pace. Your Progress.
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black leading-tight">
                Ready to take control of<br />
                <span className="text-[#60A5FA]">your board preparation?</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto">
                Join Class 10 candidates preparing one chapter at a time. Free forever. No ads. Just progress.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#2563EB] hover:bg-slate-100 shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {user ? "Go to Dashboard" : "Create Free Account"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sprint"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-7 py-3.5 text-sm font-bold text-white hover:border-white transition-all"
                >
                  Explore PYQ PDFs →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Auth Gate Modal for Unauthenticated PDF clicks */}
      <AuthGateModal
        isOpen={Boolean(authGateDoc)}
        onClose={() => setAuthGateDoc(null)}
        documentTitle={authGateDoc?.title}
      />

      {/* Video Player Modal (Authenticated Students Only) */}
      {user && activeVideoChapter && (
        <VideoPlayerModal
          chapter={activeVideoChapter}
          onClose={() => setActiveVideoChapter(null)}
        />
      )}

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        paper={activePdfDoc}
        onClose={() => setActivePdfDoc(null)}
      />

      <Footer />
    </div>
  );
}
