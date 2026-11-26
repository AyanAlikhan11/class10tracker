import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ShieldCheck, Sparkles, BookOpen, FileDown, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white py-10 sm:py-14 text-slate-600">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Main Footer Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mb-10">
          {/* Brand & Purpose (Full width on mobile, 1 col on desktop) */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="inline-block">
              <Logo size="sm" />
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed text-justify sm:text-left">
              India&apos;s clean, student-first CBSE Class 10 preparation platform. Designed to eliminate board exam anxiety through daily milestones, official syllabus guides, chapter notes, and verified papers.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Free Forever • Zero Ads</span>
            </div>
          </div>

          {/* Column 1: Study Tools */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              <span>Study Tools</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/syllabus" className="hover:text-blue-600 transition-colors block py-0.5">
                  Syllabus Milestones
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-blue-600 transition-colors block py-0.5">
                  Daily 3-Task Planner
                </Link>
              </li>
              <li>
                <Link href="/planner?rescue=true" className="hover:text-blue-600 transition-colors block py-0.5">
                  15-Min Rescue Mode
                </Link>
              </li>
              <li>
                <Link href="/mistakes" className="hover:text-blue-600 transition-colors block py-0.5">
                  Mistake Notebook
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-violet-600 transition-colors block py-0.5">
                  Brain Sprint Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: CBSE 2026-27 Resources */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
              <FileDown className="h-3.5 w-3.5 text-blue-600" />
              <span>2026–27 PDFs</span>
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li>
                <Link href="/syllabus" className="hover:text-blue-600 transition-colors block py-0.5">
                  Official CBSE Syllabus
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="hover:text-blue-600 transition-colors block py-0.5">
                  Subject Key Notes
                </Link>
              </li>
              <li>
                <Link href="/sprint" className="hover:text-blue-600 transition-colors block py-0.5">
                  Model Practice Papers
                </Link>
              </li>
              <li>
                <Link href="/sprint" className="hover:text-blue-600 transition-colors block py-0.5">
                  NCERT24 Question Bank
                </Link>
              </li>
              <li>
                <Link href="/sprint" className="hover:text-blue-600 transition-colors block py-0.5">
                  Official PYQ Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Student Pledge */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Student Pledge</span>
            </h4>
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed text-justify sm:text-left">
                Every resource on BoardPrep is 100% free for CBSE Class 10 candidates. No paywalls, no aggressive sales calls, no coaching center advertisements, and no tracking of personal student data.
              </p>
              <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1 pt-0.5">
                <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                <span>Made for students across India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer: Properly aligned on mobile & desktop */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© {currentYear} BoardPrep. All curriculum rights reserved to CBSE & NCERT.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold text-slate-600">
            <Link href="/syllabus" className="hover:text-blue-600 transition-colors">
              Syllabus
            </Link>
            <Link href="/sprint" className="hover:text-blue-600 transition-colors">
              Official Papers
            </Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">
              Student Login
            </Link>
            <Link href="/register" className="hover:text-blue-600 transition-colors">
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
