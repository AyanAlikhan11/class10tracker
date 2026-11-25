"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";
import { AuthGateModal } from "@/components/ui/AuthGateModal";
import { CBSE_CLASS_10_OFFICIAL_PAPERS } from "@/constants/curriculum";
import { PYQItem, PYQPaperDocument } from "@/types";
import { getDaysRemaining } from "@/lib/utils";
import {
  Award,
  Calendar,
  Sparkles,
  BookOpen,
  Filter,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Download,
  Search,
  ExternalLink,
  Layers,
  Clock,
  FileDown,
  Lock,
  ShieldCheck,
  ArrowRight,
  UserCheck,
} from "lucide-react";

export default function BoardSprintPage() {
  const { user, studentProfile } = useAuth();
  const daysRemaining = getDaysRemaining(studentProfile?.boardExamDate || "2027-02-15");

  const [activeTab, setActiveTab] = useState<"pdfs" | "questions">("pdfs");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDocType, setSelectedDocType] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePdfModal, setActivePdfModal] = useState<PYQPaperDocument | null>(null);
  const [authGateDoc, setAuthGateDoc] = useState<PYQPaperDocument | null>(null);

  // Question bank states
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [practicedQuestions, setPracticedQuestions] = useState<Record<string, boolean>>({
    "pyq-1": true,
  });

  const handleOpenPdf = (paper: PYQPaperDocument) => {
    if (!user) {
      setAuthGateDoc(paper);
    } else {
      setActivePdfModal(paper);
    }
  };

  const handleDownloadPdf = (e: React.MouseEvent, paper: PYQPaperDocument) => {
    if (!user) {
      e.preventDefault();
      setAuthGateDoc(paper);
    }
  };

  const pyqQuestions: PYQItem[] = [
    {
      id: "pyq-1",
      boardId: "CBSE",
      subjectId: "cbse-10-maths-std",
      chapterId: "Real Numbers",
      year: 2023,
      questionText: "Prove that √5 is an irrational number.",
      questionType: "short_answer",
      marks: 3,
      officialAnswerOrHint:
        "Assume √5 is rational, √5 = a/b where a and b are co-prime integers. 5b² = a² => 5 divides a². Therefore 5 divides a. Substitute a = 5c => 5b² = 25c² => b² = 5c² => 5 divides b. This contradicts that a and b are co-prime. Hence √5 is irrational.",
      sourceReference: "CBSE Board Exam 2023 (Set 1, 30/1/1)",
    },
    {
      id: "pyq-2",
      boardId: "CBSE",
      subjectId: "cbse-10-maths-std",
      chapterId: "Quadratic Equations",
      year: 2023,
      questionText: "Find the value of k for which the quadratic equation (k + 4)x² + (k + 1)x + 1 = 0 has equal real roots.",
      questionType: "short_answer",
      marks: 3,
      officialAnswerOrHint:
        "For equal real roots, Discriminant D = b² - 4ac = 0. Here a = k+4, b = k+1, c = 1. (k+1)² - 4(k+4)(1) = 0 => k² + 2k + 1 - 4k - 16 = 0 => k² - 2k - 15 = 0. Factoring: (k-5)(k+3) = 0 => k = 5 or k = -3.",
      sourceReference: "CBSE Board Exam 2023 (Set 2)",
    },
    {
      id: "pyq-3",
      boardId: "CBSE",
      subjectId: "cbse-10-science",
      chapterId: "Chemical Reactions",
      year: 2022,
      questionText:
        "2g of ferrous sulphate crystals are heated in a dry boiling tube. (a) Name the gases released with pungent smell. (b) Write balanced chemical equation. (c) What type of reaction is this?",
      questionType: "short_answer",
      marks: 3,
      officialAnswerOrHint:
        "(a) Sulphur dioxide (SO₂) and Sulphur trioxide (SO₃). (b) 2FeSO₄(s) --Heat--> Fe₂O₃(s) + SO₂(g) + SO₃(g). (c) Thermal decomposition reaction.",
      sourceReference: "CBSE Board Exam 2022 Term 2",
    },
    {
      id: "pyq-4",
      boardId: "CBSE",
      subjectId: "cbse-10-science",
      chapterId: "Life Processes",
      year: 2023,
      questionText:
        "Why is the rate of breathing in aquatic organisms much faster than in terrestrial organisms? Describe the pathway of air from nostrils to alveoli.",
      questionType: "long_answer",
      marks: 5,
      officialAnswerOrHint:
        "Aquatic organisms breathe dissolved oxygen in water, which is much lower than atmospheric oxygen concentration, hence they breathe faster. Pathway: Nostrils → Nasal passage → Pharynx → Larynx → Trachea → Bronchi → Bronchioles → Alveoli (site of gas exchange).",
      sourceReference: "CBSE Board Exam 2023 (Set 1)",
    },
  ];

  const filteredPapers = CBSE_CLASS_10_OFFICIAL_PAPERS.filter((p) => {
    if (selectedSubject !== "all" && p.subjectId !== selectedSubject) return false;
    if (selectedDocType !== "all" && p.type !== selectedDocType) return false;
    if (selectedSession !== "all" && p.session !== selectedSession) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.subjectName.toLowerCase().includes(q) ||
        p.session.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Sprint Hero Banner */}
      <div className="rounded-3xl border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0F172A] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -translate-x-10 translate-y-10 w-72 h-72 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#FBBF24]" /> CBSE Class 10 • Session 2026–2027 Sprint
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Official Board Papers, Notes & NCERT24 Materials
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl leading-relaxed">
              Read Session 2026–2027 model practice papers, NCERT24 question banks, official CBSE sample question papers, and marking schemes directly in your browser.
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 p-5 text-center shrink-0 min-w-[140px] shadow-sm">
            <div className="font-heading text-4xl sm:text-5xl font-black">{daysRemaining}</div>
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider block mt-1">
              Days to Boards
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("pdfs")}
          className={`flex items-center gap-2 py-3 px-5 font-bold text-sm border-b-2 transition-all ${
            activeTab === "pdfs"
              ? "border-[#2563EB] text-[#2563EB] bg-white rounded-t-2xl shadow-xs"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <FileText className="h-4 w-4" />
          Official CBSE Papers & PDFs ({CBSE_CLASS_10_OFFICIAL_PAPERS.length})
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className={`flex items-center gap-2 py-3 px-5 font-bold text-sm border-b-2 transition-all ${
            activeTab === "questions"
              ? "border-[#2563EB] text-[#2563EB] bg-white rounded-t-2xl shadow-xs"
              : "border-transparent text-[#64748B] hover:text-[#0F172A]"
          }`}
        >
          <Award className="h-4 w-4" />
          Interactive Question Bank ({pyqQuestions.length})
        </button>
      </div>

      {/* TAB 1: OFFICIAL QUESTION PAPERS & PDFS */}
      {activeTab === "pdfs" && (
        <div className="space-y-5">
          {/* Auth Access Banner */}
          {!user ? (
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-xs">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#0F172A] font-heading">
                      Student Account Required for PDFs
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#2563EB] text-white px-2 py-0.5 rounded-full">
                      100% Free
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Official CBSE question papers and step-by-step marking schemes are exclusively free for registered students. Sign in or register in 10s to read in-browser or download.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/login?redirect=/sprint"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#2563EB] bg-white border border-[#2563EB]/30 hover:bg-[#EFF6FF] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register?redirect=/sprint"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all"
                >
                  Register Free (10s) →
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-[#ECFDF5]/70 p-3.5 px-4 flex items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2.5 font-bold text-[#065F46]">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                <span>Free Student Access Active: You can read all verified CBSE Class 10 papers in the browser or download PDFs directly.</span>
              </div>
              <span className="text-[11px] font-semibold text-[#047857] bg-white border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ✓ Verified Candidate
              </span>
            </div>
          )}

          {/* Search & Filter Bar */}
          <Card className="p-4 bg-white shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search papers by subject or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-[#0F172A] placeholder:text-[#64748B]/60 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#64748B]">Subject:</span>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value="all">All Subjects</option>
                    <option value="cbse-10-maths-std">Maths (Standard)</option>
                    <option value="cbse-10-maths-basic">Maths (Basic)</option>
                    <option value="cbse-10-science">Science</option>
                    <option value="cbse-10-social-science">Social Science</option>
                    <option value="cbse-10-english">English (184)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#64748B]">Year:</span>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value="all">All Years</option>
                    <option value="2026-2027">2026-2027</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2023-2024">2023-2024</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#64748B]">Type:</span>
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="practice_paper">Model Practice Papers (2026-27)</option>
                    <option value="question_bank">Question Banks (NCERT24)</option>
                    <option value="question_paper">Question Papers</option>
                    <option value="marking_scheme">Marking Schemes</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPapers.map((paper) => {
              const getBadgeDetails = () => {
                switch (paper.type) {
                  case "practice_paper":
                    return { label: "2026-27 Model Paper", variant: "primary" as const };
                  case "question_bank":
                    return { label: "NCERT24 Question Bank", variant: "warning" as const };
                  case "question_paper":
                    return { label: "Official Sample Paper", variant: "primary" as const };
                  case "marking_scheme":
                    return { label: "Solutions & MS", variant: "secondary" as const };
                  default:
                    return { label: "Study Material", variant: "neutral" as const };
                }
              };
              const badge = getBadgeDetails();
              return (
                <Card
                  key={paper.id}
                  className="p-6 flex flex-col justify-between border border-slate-200 hover:border-[#2563EB] hover:shadow-lg transition-all group bg-white rounded-2xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1 rounded-full">
                        {paper.subjectName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {paper.session}
                        </span>
                        <Badge variant={badge.variant}>
                          {badge.label}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug font-heading">
                      {paper.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#64748B] pt-1">
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-[#10B981]" /> Max: {paper.maxMarks} marks
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#F59E0B]" /> {paper.durationHours} Hours
                      </span>
                      <span>Size: {paper.fileSizeBytes}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-100 gap-2">
                    {/* View in App (Auth Controlled) */}
                    <button
                      type="button"
                      onClick={() => handleOpenPdf(paper)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        user
                          ? "bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white border border-[#2563EB]/20"
                          : "bg-slate-100 text-[#0F172A] hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      {user ? <Eye className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5 text-[#2563EB]" />}
                      {user ? "Read in App" : "Login to Read"}
                    </button>

                    {/* Download PDF (Auth Controlled) */}
                    <a
                      href={user ? paper.localPdfUrl : "#"}
                      download={user ? paper.fileName : undefined}
                      onClick={(e) => handleDownloadPdf(e, paper)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white text-[#0F172A] hover:bg-[#EFF6FF] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors shadow-xs"
                    >
                      {user ? <Download className="h-4 w-4 text-[#64748B]" /> : <Lock className="h-3.5 w-3.5 text-[#64748B]" />}
                      {user ? "Download PDF" : "Download (Login)"}
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE QUESTION BANK */}
      {activeTab === "questions" && (
        <div className="space-y-4">
          {pyqQuestions.map((item) => {
            const isPracticed = Boolean(practicedQuestions[item.id]);
            const isSolutionOpen = Boolean(revealedSolutions[item.id]);

            return (
              <Card
                key={item.id}
                className={`p-6 transition-all rounded-2xl ${
                  isPracticed
                    ? "border-[#10B981]/30 bg-white"
                    : "border-slate-200 bg-white hover:border-[#2563EB]/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#2563EB]">
                        {item.subjectId.includes("maths") ? "Maths" : "Science"} • {item.chapterId}
                      </span>
                      <Badge variant="primary">{item.marks} Marks</Badge>
                      <Badge variant="neutral">{item.year}</Badge>
                      <span className="text-xs text-[#64748B]">
                        {item.sourceReference}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0F172A] leading-relaxed font-heading">
                      Q: {item.questionText}
                    </h3>

                    {/* Collapsible Solution / Hint */}
                    {isSolutionOpen && item.officialAnswerOrHint && (
                      <div className="rounded-2xl border border-[#2563EB]/20 bg-[#EFF6FF] p-4 text-xs text-[#0F172A] leading-relaxed space-y-1.5 animate-in fade-in">
                        <span className="font-bold text-[#2563EB] block uppercase tracking-wider text-[11px]">
                          Official CBSE Marking Scheme & Answer:
                        </span>
                        <p>{item.officialAnswerOrHint}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedSolutions((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                      >
                        {isSolutionOpen ? (
                          <>
                            <EyeOff className="h-3.5 w-3.5" /> Hide Solution
                          </>
                        ) : (
                          <>
                            <Eye className="h-3.5 w-3.5" /> View Solution & Hint
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPracticedQuestions((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }))
                      }
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isPracticed
                          ? "bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30"
                          : "bg-white border border-slate-200 text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#2563EB]/30"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isPracticed ? "Practiced" : "Mark as Done"}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* In-App PDF Viewer Modal (Authenticated Students) */}
      {activePdfModal && (
        <PdfViewerModal
          paper={activePdfModal}
          onClose={() => setActivePdfModal(null)}
        />
      )}

      {/* Auth Gate Modal (For Unauthenticated Visitors) */}
      <AuthGateModal
        isOpen={Boolean(authGateDoc)}
        onClose={() => setAuthGateDoc(null)}
        documentTitle={authGateDoc?.title}
      />
    </div>
  );
}
