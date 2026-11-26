"use client";

/**
 * /quiz — Quiz Challenge page
 * Redirects to the full Brain Sprint game at /games, which provides
 * timed MCQ quiz gameplay with scoring and admin-managed question bank.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/games");
  }, [router]);
  return null;
}
