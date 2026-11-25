import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-[#2563EB]/10 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Logo size="sm" />
            </Link>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mt-2">
              India&apos;s clean, student-first CBSE Class 10 preparation platform. Free forever. No ads.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Study Tools</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#64748B]">
              <li><Link href="/syllabus" className="hover:text-[#2563EB]">Syllabus Milestones</Link></li>
              <li><Link href="/planner" className="hover:text-[#2563EB]">Daily 3-Task Planner</Link></li>
              <li><Link href="/planner?rescue=true" className="hover:text-[#2563EB]">15-Min Rescue Mode</Link></li>
              <li><Link href="/mistakes" className="hover:text-[#2563EB]">Mistake Notebook</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">CBSE Board Papers</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#64748B]">
              <li><Link href="/sprint" className="hover:text-[#2563EB]">Maths Standard 2024 (PDF)</Link></li>
              <li><Link href="/sprint" className="hover:text-[#2563EB]">Science Sample Paper (PDF)</Link></li>
              <li><Link href="/sprint" className="hover:text-[#2563EB]">Social Science Answers (PDF)</Link></li>
              <li><Link href="/sprint" className="hover:text-[#2563EB]">Maths Basic Paper (PDF)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Student Pledge</h4>
            <div className="space-y-2 text-xs text-[#64748B]">
              <div className="inline-flex items-center gap-1.5 bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 font-bold px-2.5 py-1 rounded-full">
                <span>✦ 100% Free Forever</span>
              </div>
              <p className="leading-relaxed">
                No paywalls, no aggressive sales calls, and zero advertising.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-4">
          <p>© {new Date().getFullYear()} BoardPrep. Designed for CBSE Class 10 Students across India.</p>
          <div className="flex gap-4 font-semibold">
            <Link href="/privacy" className="hover:text-[#2563EB]">Privacy</Link>
            <Link href="/login" className="hover:text-[#2563EB]">Student Login</Link>
            <Link href="/register" className="hover:text-[#2563EB]">Sign Up Free</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
