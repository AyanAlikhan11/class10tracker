"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PdfViewerModal, GenericPdfDocument } from "@/components/ui/PdfViewerModal";
import { VideoPlayerModal } from "@/components/ui/VideoPlayerModal";
import { AuthGateModal } from "@/components/ui/AuthGateModal";
import { ProgressService, ContentService } from "@/services";
import {
  Chapter,
  ChapterStatus,
  StudentChapterProgress,
  ChapterVideoLesson,
  Subject,
} from "@/types";
import { CBSE_CLASS_10_CURRICULUM_RESOURCES } from "@/constants/curriculum";
import {
  Layers,
  CheckCircle2,
  BookOpen,
  Filter,
  Check,
  Clock,
  Sparkles,
  ChevronDown,
  X,
  FileText,
  Play,
  Lock,
  Download,
  ExternalLink,
  ChevronRight,
  Calculator,
  Atom,
  Globe,
  Languages,
  Eye,
  FileDown,
} from "lucide-react";

export default function SyllabusTrackerPage() {
  const { user } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("cbse-10-maths-std");
  const [filterStatus, setFilterStatus] = useState<"all" | "not_started" | "in_progress" | "completed">("all");
  const [progressMap, setProgressMap] = useState<Record<string, StudentChapterProgress>>({});
  const [activeChapterForDrawer, setActiveChapterForDrawer] = useState<Chapter | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"topics" | "notes" | "videos" | "personal">("topics");
  const [notesInput, setNotesInput] = useState<string>("");

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);

  // Modals
  const [activePdfModal, setActivePdfModal] = useState<GenericPdfDocument | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<{ chapter: Chapter; video?: ChapterVideoLesson } | null>(null);
  const [authGateDoc, setAuthGateDoc] = useState<GenericPdfDocument | null>(null);
  const [allResourcesModalOpen, setAllResourcesModalOpen] = useState(false);

  const uid = user?.uid || "";

  // Load admin-managed curriculum content.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [subs, chs] = await Promise.all([
          ContentService.getSubjects(),
          ContentService.getAllChapters(),
        ]);
        if (cancelled) return;
        setSubjects(subs);
        setAllChapters(chs);
        if (subs.length && !subs.some((s) => s.id === selectedSubjectId)) {
          setSelectedSubjectId(subs[0].id);
        }
      } catch (err) {
        console.warn("Could not load curriculum content:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime, per-user progress.
  useEffect(() => {
    if (!uid) {
      setProgressMap({});
      return;
    }
    const unsubscribe = ProgressService.subscribeStudentProgress(uid, (progressList) => {
      const map: Record<string, StudentChapterProgress> = {};
      progressList.forEach((p) => {
        map[p.chapterId] = p;
      });
      setProgressMap(map);
    });
    return () => unsubscribe();
  }, [uid]);

  const activeSubject =
    subjects.find((s) => s.id === selectedSubjectId) ||
    subjects[0] || {
      id: selectedSubjectId,
      boardId: "CBSE",
      classGrade: "Class 10",
      name: "Loading curriculum...",
      code: "",
      iconName: "BookOpen",
      color: "#2563EB",
      isOptional: false,
      displayOrder: 0,
    };
  const chapters = allChapters.filter((c) => c.subjectId === selectedSubjectId);

  const handleOpenCurriculumPdf = (title: string, localPdfUrl: string, fileName: string, fileSizeBytes?: string) => {
    const doc: GenericPdfDocument = {
      id: fileName,
      title,
      pdfUrl: localPdfUrl,
      localPdfUrl,
      fileName,
      fileSizeBytes,
      session: "CBSE Class 10 (2026-2027)",
      type: "official_curriculum",
    };
    if (!user) {
      setAuthGateDoc(doc);
    } else {
      setActivePdfModal(doc);
    }
  };

  const handleDownloadCurriculumPdf = (e: React.MouseEvent, title: string, localPdfUrl: string, fileName: string) => {
    if (!user) {
      e.preventDefault();
      setAuthGateDoc({
        id: fileName,
        title,
        pdfUrl: localPdfUrl,
        localPdfUrl,
        fileName,
        session: "CBSE Class 10 (2026-2027)",
      });
    }
  };

  const handleOpenNotesPdf = (chapter: Chapter) => {
    if (!chapter.notesDocument) return;
    const doc: GenericPdfDocument = {
      id: chapter.notesDocument.id,
      title: chapter.notesDocument.title,
      pdfUrl: chapter.notesDocument.pdfUrl,
      fileName: chapter.notesDocument.fileName,
      fileSizeBytes: chapter.notesDocument.fileSizeBytes,
      session: "CBSE Class 10 Chapter Revision Notes",
      type: "chapter_notes",
      officialSourceUrl: chapter.notesDocument.officialNcertChapterUrl,
    };

    if (!user) {
      setAuthGateDoc(doc);
    } else {
      setActivePdfModal(doc);
    }
  };

  const handleOpenVideo = (chapter: Chapter, video?: ChapterVideoLesson) => {
    if (!user) {
      setAuthGateDoc({
        id: chapter.id,
        title: video ? `${video.title}` : `${chapter.title} — Video Lessons`,
        pdfUrl: "",
        fileName: "",
        session: "CBSE Class 10 Video Lessons",
      });
      return;
    }
    setActiveVideoModal({ chapter, video });
  };

  const requireStudent = () => {
    if (!user) {
      window.location.href = "/login?redirect=/syllabus";
      return false;
    }
    return true;
  };

  const updateStatus = async (chapterId: string, status: ChapterStatus) => {
    if (!requireStudent()) return;
    const existing = progressMap[chapterId];
    const updated: StudentChapterProgress = {
      id: `${uid}_${chapterId}`,
      studentId: uid,
      chapterId,
      subjectId: selectedSubjectId,
      status,
      completedTopicIds: existing?.completedTopicIds || [],
      personalNotes: existing?.personalNotes || "",
      lastStudiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProgressMap((prev) => ({ ...prev, [chapterId]: updated }));
    await ProgressService.updateChapterProgress(
      uid,
      chapterId,
      selectedSubjectId,
      status,
      updated.completedTopicIds,
      updated.personalNotes
    );
  };

  const toggleTopic = async (chapter: Chapter, topicId: string) => {
    if (!requireStudent()) return;
    const existing = progressMap[chapter.id];
    const currentCompleted = existing?.completedTopicIds || [];
    const newCompleted = currentCompleted.includes(topicId)
      ? currentCompleted.filter((t) => t !== topicId)
      : [...currentCompleted, topicId];

    let newStatus: ChapterStatus = existing?.status || "not_started";
    if (newCompleted.length === chapter.topics.length && newStatus !== "mastered") {
      newStatus = "pyqs_solved";
    } else if (newCompleted.length > 0 && newStatus === "not_started") {
      newStatus = "ncert_read";
    }

    const updated: StudentChapterProgress = {
      id: `${uid}_${chapter.id}`,
      studentId: uid,
      chapterId: chapter.id,
      subjectId: selectedSubjectId,
      status: newStatus,
      completedTopicIds: newCompleted,
      personalNotes: existing?.personalNotes || "",
      lastStudiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProgressMap((prev) => ({ ...prev, [chapter.id]: updated }));
    await ProgressService.updateChapterProgress(
      uid,
      chapter.id,
      selectedSubjectId,
      newStatus,
      newCompleted,
      updated.personalNotes
    );
  };

  const saveNotes = async (chapterId: string) => {
    if (!requireStudent()) return;
    const existing = progressMap[chapterId];
    const updated: StudentChapterProgress = {
      id: `${uid}_${chapterId}`,
      studentId: uid,
      chapterId,
      subjectId: selectedSubjectId,
      status: existing?.status || "not_started",
      completedTopicIds: existing?.completedTopicIds || [],
      personalNotes: notesInput,
      lastStudiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProgressMap((prev) => ({ ...prev, [chapterId]: updated }));
    await ProgressService.updateChapterProgress(
      uid,
      chapterId,
      selectedSubjectId,
      updated.status,
      updated.completedTopicIds,
      notesInput
    );
    setActiveChapterForDrawer(null);
  };

  const filteredChapters = chapters.filter((ch) => {
    const status = progressMap[ch.id]?.status || "not_started";
    if (filterStatus === "not_started") return status === "not_started";
    if (filterStatus === "in_progress") return status === "ncert_read" || status === "pyqs_solved";
    if (filterStatus === "completed") return status === "mastered";
    return true;
  });

  const completedCount = chapters.filter((ch) => {
    const s = progressMap[ch.id]?.status;
    return s === "mastered" || s === "pyqs_solved";
  }).length;

  const subjectPercent = Math.round((completedCount / (chapters.length || 1)) * 100);

  const getStatusBadge = (status: ChapterStatus) => {
    switch (status) {
      case "mastered":
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Mastered</span>;
      case "pyqs_solved":
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">PYQs Solved</span>;
      case "ncert_read":
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">NCERT Read</span>;
      default:
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Not Started</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subject Tabs */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-2">
          <BookOpen className="h-3.5 w-3.5 text-blue-600" />
          CBSE Class 10 Syllabus & Learning Hub
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-[#0F172A]">
          My Syllabus Tracker & Resources
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1 max-w-3xl">
          Track syllabus milestones, watch high-yield YouTube video lessons, and download official chapter revision notes PDFs with key formulas.
        </p>

        {/* Subjects horizontal selector */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-4 no-scrollbar">
          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "border-blue-600 bg-white text-blue-600 shadow-sm ring-2 ring-blue-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: sub.color }}
                />
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Summary Progress Banner */}
      <Card className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/70 via-white to-emerald-50/40 border-slate-200/80 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {activeSubject.name} • Class 10 CBSE
            </span>
            <div className="text-xl sm:text-2xl font-black font-heading text-[#0F172A] mt-0.5">
              {completedCount} of {chapters.length} Chapters Mastered
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Includes chapter concept video lessons & downloadable revision notes PDFs.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black font-heading text-blue-600">{subjectPercent}%</div>
              <div className="text-xs font-bold text-slate-400">Syllabus Done</div>
            </div>
            <div className="w-28 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${Math.max(subjectPercent, 8)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Official 2026-27 Syllabus & Comprehensive Key Notes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs">
              ★
            </span>
            <h2 className="text-base sm:text-lg font-bold font-heading text-[#0F172A]">
              Official 2026–27 Syllabus & Comprehensive Key Notes
            </h2>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Free PDFs
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAllResourcesModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-200/80 hover:border-blue-400 px-3 py-1.5 rounded-xl shadow-xs transition-all"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Browse All 12 Syllabi & Notes</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 2-Card Row for Currently Selected Subject */}
        {(() => {
          const res = CBSE_CLASS_10_CURRICULUM_RESOURCES[selectedSubjectId];
          if (!res) return null;
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Official Syllabus */}
              <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/60 via-white to-blue-50/20 p-5 flex flex-col justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/80 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      <BookOpen className="h-3 w-3" /> Official CBSE Board Syllabus
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">Session 2026-27</span>
                  </div>

                  {res.syllabus.map((syl) => (
                    <div key={syl.id} className="space-y-1.5 mb-2.5 last:mb-0">
                      <h4 className="text-sm sm:text-base font-bold font-heading text-[#0F172A]">
                        {syl.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {syl.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 pt-0.5">
                        <span>Size: <strong className="text-slate-800">{syl.fileSizeBytes}</strong></span>
                        <span>•</span>
                        <span>{syl.pageCount} Pages</span>
                        {syl.code && (
                          <>
                            <span>•</span>
                            <span className="text-blue-700 font-bold">Code: {syl.code}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-blue-100/70 flex items-center justify-end gap-2 flex-wrap">
                  {res.syllabus.map((syl) => (
                    <React.Fragment key={syl.id}>
                      <button
                        type="button"
                        onClick={() => handleOpenCurriculumPdf(syl.title, syl.localPdfUrl, syl.fileName, syl.fileSizeBytes)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Syllabus</span>
                      </button>
                      <a
                        href={syl.localPdfUrl}
                        download={syl.fileName}
                        onClick={(e) => handleDownloadCurriculumPdf(e, syl.title, syl.localPdfUrl, syl.fileName)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-500" />
                        <span>Download PDF</span>
                      </a>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Card 2: Comprehensive Key Notes */}
              {res.keyNotes && (
                <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/20 p-5 flex flex-col justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <FileText className="h-3 w-3" /> Comprehensive Key Notes
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">Session 2026-27</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold font-heading text-[#0F172A]">
                      {res.keyNotes.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {res.keyNotes.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 pt-2">
                      <span>Size: <strong className="text-slate-800">{res.keyNotes.fileSizeBytes}</strong></span>
                      <span>•</span>
                      <span>{res.keyNotes.pageCount} Pages</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">All Chapters Included</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-100/70 flex items-center justify-end gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleOpenCurriculumPdf(res.keyNotes!.title, res.keyNotes!.localPdfUrl, res.keyNotes!.fileName, res.keyNotes!.fileSizeBytes)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Key Notes</span>
                    </button>
                    <a
                      href={res.keyNotes.localPdfUrl}
                      download={res.keyNotes.fileName}
                      onClick={(e) => handleDownloadCurriculumPdf(e, res.keyNotes!.title, res.keyNotes!.localPdfUrl, res.keyNotes!.fileName)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto pb-1">
        <span className="text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        {[
          { id: "all", label: `All Chapters (${chapters.length})` },
          { id: "not_started", label: "Not Started" },
          { id: "in_progress", label: "In Progress" },
          { id: "completed", label: "Mastered" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id as any)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterStatus === f.id
                ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* CHAPTERS LIST */}
      <div className="space-y-4">
        {filteredChapters.map((chapter) => {
          const progress = progressMap[chapter.id];
          const currentStatus: ChapterStatus = progress?.status || "not_started";
          const completedTopicsCount = progress?.completedTopicIds?.length || 0;
          const videoCount = chapter.videoLessons?.length || 0;

          return (
            <Card
              key={chapter.id}
              className="p-5 sm:p-6 hover:border-blue-200/90 transition-all bg-white rounded-2xl border-slate-200/80 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left: Info & Badges */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Chapter {chapter.chapterNumber}
                      {chapter.unitName && ` • ${chapter.unitName}`}
                    </span>
                    {getStatusBadge(currentStatus)}
                    {chapter.officialWeightageMarks && (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        ~{chapter.officialWeightageMarks} Marks
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-heading text-[#0F172A]">
                    {chapter.title}
                  </h3>

                  {/* Quick Topics & Stats */}
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" /> ~{chapter.estimatedStudyHours || 5} hours study
                    </span>
                    <span>
                      {completedTopicsCount} of {chapter.topics.length} topics finished
                    </span>
                    {progress?.personalNotes && (
                      <span className="text-blue-600 flex items-center gap-1 font-bold">
                        <FileText className="h-3.5 w-3.5" /> Has personal notes
                      </span>
                    )}
                  </div>

                  {/* Resource Action Pills */}
                  <div className="flex items-center gap-2.5 pt-1.5 flex-wrap">
                    {/* Watch Video Lessons Button (Auth Gated) */}
                    {videoCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleOpenVideo(chapter)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors group"
                      >
                        {user ? (
                          <Play className="h-3.5 w-3.5 fill-rose-600 text-rose-600 group-hover:scale-110 transition-transform" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                        )}
                        <span>{user ? `Watch Video Lessons (${videoCount})` : `Login to Watch Videos (${videoCount})`}</span>
                      </button>
                    )}

                    {/* Chapter Notes PDF Button */}
                    {chapter.notesDocument && (
                      <button
                        type="button"
                        onClick={() => handleOpenNotesPdf(chapter)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors group"
                      >
                        <FileText className="h-3.5 w-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span>Chapter Notes (PDF)</span>
                      </button>
                    )}

                    {/* Official NCERT Chapter Link */}
                    {chapter.notesDocument?.officialNcertChapterUrl && (
                      <a
                        href={chapter.notesDocument.officialNcertChapterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors"
                      >
                        <span>NCERT Book PDF</span>
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Milestone Progression & Details Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                  <div className="grid grid-cols-4 gap-1 bg-slate-100/90 p-1 rounded-2xl text-xs font-bold">
                    {[
                      { status: "not_started" as ChapterStatus, label: "Unread" },
                      { status: "ncert_read" as ChapterStatus, label: "NCERT" },
                      { status: "pyqs_solved" as ChapterStatus, label: "PYQs" },
                      { status: "mastered" as ChapterStatus, label: "Master" },
                    ].map((step) => {
                      const isCurrent = currentStatus === step.status;
                      return (
                        <button
                          key={step.status}
                          type="button"
                          onClick={() => updateStatus(chapter.id, step.status)}
                          className={`px-3 py-2 rounded-xl transition-all ${
                            isCurrent
                              ? "bg-white text-blue-600 shadow-xs font-black"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {step.label}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-xs"
                    onClick={() => {
                      setActiveChapterForDrawer(chapter);
                      setActiveDrawerTab("topics");
                      setNotesInput(progress?.personalNotes || "");
                    }}
                  >
                    <span>Full Chapter Details</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* DETAILED CHAPTER DRAWER / MODAL WITH TABS */}
      {activeChapterForDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          onClick={() => setActiveChapterForDrawer(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Chapter {activeChapterForDrawer.chapterNumber} • {activeSubject.name}
                </span>
                <h3 className="text-xl font-black font-heading text-[#0F172A] mt-0.5">
                  {activeChapterForDrawer.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveChapterForDrawer(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveDrawerTab("topics")}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeDrawerTab === "topics"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                Topics Checklist ({activeChapterForDrawer.topics.length})
              </button>
              <button
                onClick={() => setActiveDrawerTab("notes")}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeDrawerTab === "notes"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                Chapter Notes (PDF)
              </button>
              {activeChapterForDrawer.videoLessons && activeChapterForDrawer.videoLessons.length > 0 && (
                <button
                  onClick={() => setActiveDrawerTab("videos")}
                  className={`pb-2.5 transition-colors border-b-2 ${
                    activeDrawerTab === "videos"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Video Lessons ({activeChapterForDrawer.videoLessons.length})
                </button>
              )}
              <button
                onClick={() => setActiveDrawerTab("personal")}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeDrawerTab === "personal"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                My Revision Notes
              </button>
            </div>

            {/* Tab 1: Topics Checklist */}
            {activeDrawerTab === "topics" && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 font-medium">
                  Tick each topic as you read the NCERT theory and practice exercise questions:
                </div>
                <div className="space-y-2">
                  {activeChapterForDrawer.topics.map((t) => {
                    const isChecked =
                      progressMap[activeChapterForDrawer.id]?.completedTopicIds?.includes(t.id) || false;
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTopic(activeChapterForDrawer, t.id)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-50/70 border-emerald-200"
                            : "bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className={`text-sm ${isChecked ? "font-bold text-emerald-950" : "font-medium text-slate-700"}`}>
                          {t.title}
                        </span>
                        <div
                          className={`h-5 w-5 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Chapter Notes & PDF */}
            {activeDrawerTab === "notes" && (
              <div className="space-y-4">
                {activeChapterForDrawer.notesDocument ? (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Official PDF Resource
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A] mt-1.5">
                          {activeChapterForDrawer.notesDocument.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Size: {activeChapterForDrawer.notesDocument.fileSizeBytes} • {activeChapterForDrawer.notesDocument.pageCount} Pages • Formatted for CBSE Class 10
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenNotesPdf(activeChapterForDrawer)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Read in App</span>
                      </button>
                    </div>

                    {/* Key formulas / Takeaways */}
                    {activeChapterForDrawer.notesDocument.keyFormulas && (
                      <div className="border-t border-blue-100 pt-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1.5">
                          Key Formulas & Core Rules
                        </div>
                        <ul className="space-y-1">
                          {activeChapterForDrawer.notesDocument.keyFormulas.map((f, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-blue-100">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-4 text-center">
                    Notes PDF is being updated for this chapter.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Video Lessons */}
            {activeDrawerTab === "videos" && activeChapterForDrawer.videoLessons && (
              <div className="space-y-3">
                <div className="text-xs text-slate-500 font-medium">
                  Watch top-rated Class 10 YouTube video lessons without algorithmic distraction:
                </div>
                <div className="space-y-2.5">
                  {activeChapterForDrawer.videoLessons.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-rose-200 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shrink-0 shadow-xs">
                          <Play className="h-4 w-4 fill-white ml-0.5" />
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                            {v.title}
                          </h5>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>{v.channelName}</span>
                            <span>•</span>
                            <span>~{v.durationMinutes} mins</span>
                            {v.isOneShot && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                                One Shot
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenVideo(activeChapterForDrawer, v)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                      >
                        Play Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Personal Revision Notes */}
            {activeDrawerTab === "personal" && (
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Personal Revision Notes & Tricky Questions
                </label>
                <textarea
                  rows={4}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Remember to check condition p divides a in real numbers. Re-solve exercise 1.2 question 3."
                  className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-slate-400">
                  Your notes are saved in your personal student profile and offline cache.
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200"
                onClick={() => setActiveChapterForDrawer(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                onClick={() => saveNotes(activeChapterForDrawer.id)}
              >
                Save My Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ALL 12 SYLLABUS & KEY NOTES MODAL */}
      {allResourcesModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={() => setAllResourcesModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-[#0F172A]">
                    Official CBSE 2026–27 Syllabus & Comprehensive Key Notes
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    12 Free Official Board PDFs • Read in browser or download offline
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAllResourcesModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {Object.values(CBSE_CLASS_10_CURRICULUM_RESOURCES).map((res) => (
                <div
                  key={res.subjectId}
                  className="rounded-2xl border border-slate-200/80 p-4 sm:p-5 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-base font-bold font-heading text-[#0F172A] flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                      {res.subjectName}
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Session 2026-27
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Syllabi */}
                    {res.syllabus.map((syl) => (
                      <div
                        key={syl.id}
                        className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 flex flex-col justify-between gap-2.5"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                              CBSE Syllabus
                            </span>
                            <span className="text-[10px] font-medium text-slate-500">
                              {syl.fileSizeBytes} • {syl.pageCount} pgs
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-[#0F172A] leading-snug">
                            {syl.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {syl.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-100/60">
                          <button
                            type="button"
                            onClick={() => {
                              setAllResourcesModalOpen(false);
                              handleOpenCurriculumPdf(syl.title, syl.localPdfUrl, syl.fileName, syl.fileSizeBytes);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-2xs"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </button>
                          <a
                            href={syl.localPdfUrl}
                            download={syl.fileName}
                            onClick={(e) => handleDownloadCurriculumPdf(e, syl.title, syl.localPdfUrl, syl.fileName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold transition-all"
                          >
                            <Download className="h-3 w-3 text-slate-500" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}

                    {/* Key Notes */}
                    {res.keyNotes && (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 flex flex-col justify-between gap-2.5">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Key Notes
                            </span>
                            <span className="text-[10px] font-medium text-slate-500">
                              {res.keyNotes.fileSizeBytes} • {res.keyNotes.pageCount} pgs
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-[#0F172A] leading-snug">
                            {res.keyNotes.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            {res.keyNotes.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-100/60">
                          <button
                            type="button"
                            onClick={() => {
                              setAllResourcesModalOpen(false);
                              handleOpenCurriculumPdf(res.keyNotes!.title, res.keyNotes!.localPdfUrl, res.keyNotes!.fileName, res.keyNotes!.fileSizeBytes);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-2xs"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </button>
                          <a
                            href={res.keyNotes.localPdfUrl}
                            download={res.keyNotes.fileName}
                            onClick={(e) => handleDownloadCurriculumPdf(e, res.keyNotes!.title, res.keyNotes!.localPdfUrl, res.keyNotes!.fileName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold transition-all"
                          >
                            <Download className="h-3 w-3 text-slate-500" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setAllResourcesModalOpen(false)}
              >
                Close Library
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PDF VIEWER MODAL */}
      <PdfViewerModal
        paper={activePdfModal}
        onClose={() => setActivePdfModal(null)}
      />

      {/* VIDEO PLAYER MODAL (Authenticated Students Only) */}
      {user && activeVideoModal && (
        <VideoPlayerModal
          chapter={activeVideoModal.chapter}
          initialVideo={activeVideoModal.video}
          onClose={() => setActiveVideoModal(null)}
        />
      )}

      {/* AUTH GATE MODAL */}
      <AuthGateModal
        isOpen={!!authGateDoc}
        onClose={() => setAuthGateDoc(null)}
        paperTitle={authGateDoc?.title}
        paperSession={authGateDoc?.session || "CBSE Class 10"}
      />
    </div>
  );
}
