"use client";

import React from "react";
import Link from "next/link";
import { X, Lock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  paperTitle?: string;
  paperSession?: string;
}

export function AuthGateModal({
  isOpen,
  onClose,
  documentTitle,
  paperTitle,
  paperSession,
}: AuthGateModalProps) {
  if (!isOpen) return null;

  const displayTitle = documentTitle || paperTitle || "Official CBSE Board Resource";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient */}
        <div className="h-2.5 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#10B981]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8 text-center">
          {/* Lock Emblem */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 mb-4 shadow-sm shadow-blue-500/10">
            <Lock className="h-7 w-7" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1 rounded-full mb-2">
            <Sparkles className="h-3.5 w-3.5" /> 100% Free Student Resource
          </span>

          <h3 className="font-heading text-2xl font-black text-[#0F172A] tracking-tight mt-1">
            Sign In to Access Board PDFs
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Verified CBSE Question Papers and official step-by-step Marking Schemes are exclusively available for registered Class 10 candidates.
          </p>

          {/* Document Preview Badge */}
          {documentTitle && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-left flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#0F172A] block truncate">{documentTitle}</span>
                <span className="text-[#64748B] text-[11px]">Free In-Browser Viewing & Direct PDF Download</span>
              </div>
            </div>
          )}

          {/* Value Highlights */}
          <div className="mt-5 space-y-2 text-left">
            {[
              "Official CBSE 2024 Sample Papers & Answer Keys",
              "In-browser interactive PDF viewer with zoom & search",
              "Chapter-by-chapter PYQ practice bank with hints",
              "Always 100% free with zero paywalls or advertisements",
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#334155] font-medium">
                <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-col gap-2.5">
            <Link
              href="/login?redirect=/sprint"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] py-3 px-4 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
            >
              Sign In to Read & Download
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/register?redirect=/sprint"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-bold text-[#0F172A] hover:bg-slate-50 hover:border-[#2563EB] transition-colors"
            >
              Create Free Account (10 seconds)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
