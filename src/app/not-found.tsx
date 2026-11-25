import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC] text-center">
      <div className="mb-4">
        <Logo size="lg" />
      </div>
      <h1 className="font-heading text-3xl font-black text-[#0F172A] mt-2">Page Not Found</h1>
      <p className="text-sm text-[#64748B] mt-1.5 max-w-sm">
        The study page or resource you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#1D4ED8] transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
