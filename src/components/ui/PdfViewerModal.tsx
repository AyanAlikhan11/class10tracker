"use client";

import React, { useState } from "react";
import { X, Download, ExternalLink, Maximize2, Minimize2, FileText, CheckCircle2 } from "lucide-react";

export interface GenericPdfDocument {
  id: string;
  title: string;
  pdfUrl?: string;
  localPdfUrl?: string;
  fileName: string;
  type?: string;
  session?: string;
  fileSizeBytes?: string;
  officialSourceUrl?: string;
}

interface PdfViewerModalProps {
  paper: GenericPdfDocument | null;
  onClose: () => void;
}

export function PdfViewerModal({ paper, onClose }: PdfViewerModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!paper) return null;

  const resolvedUrl = paper.localPdfUrl || paper.pdfUrl || "";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullScreen
            ? "w-full h-full rounded-none"
            : "w-full max-w-5xl h-[88vh] border border-[#CBD5E1]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Toolbar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-[#F8FAFC]">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shrink-0 shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-2 py-0.5 rounded-full">
                  {paper.type === "question_paper"
                    ? "Question Paper"
                    : paper.type === "marking_scheme"
                    ? "Marking Scheme & Solutions"
                    : "Chapter Revision Notes"}
                </span>
                <span className="text-xs text-[#64748B] font-medium">
                  {paper.session || "CBSE Class 10 Board Companion"}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] truncate mt-0.5 font-heading">
                {paper.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Download Button */}
            <a
              href={resolvedUrl}
              download={paper.fileName}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-sm transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            {/* Open in New Window */}
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl border border-slate-200 bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* Toggle Full Screen */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors hidden sm:inline-flex"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-[#64748B] hover:text-black hover:bg-slate-200 transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* In-browser PDF Preview Iframe */}
        <div className="flex-1 bg-[#525659] relative">
          <iframe
            src={`${resolvedUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-full border-0"
            title={paper.title}
          />
        </div>

        {/* Bottom Status Ribbon */}
        <div className="px-5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Verified CBSE Class 10 Educational Resource</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>Free student access</span>
            {paper.officialSourceUrl && (
              <a
                href={paper.officialSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563EB] hover:underline"
              >
                Official Board Source ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
