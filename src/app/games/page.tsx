"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentService, GameService } from "@/services";
import { GameQuestion, GameDifficulty, Subject } from "@/types";
import {
  Brain,
  Trophy,
  Timer,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Play,
  Target,
  Zap,
} from "lucide-react";

type Phase = "setup" | "playing" | "result";

const DIFFICULTIES: Array<{ id: GameDifficulty | "all"; label: string; note: string }> = [
  { id: "all", label: "Mixed", note: "All difficulty levels" },
  { id: "tricky", label: "Tricky", note: "Trap answers ahead" },
  { id: "hard", label: "Hard", note: "Board-level application" },
  { id: "medium", label: "Medium", note: "Concept checks" },
  { id: "easy", label: "Easy", note: "Warm-up round" },
];

const QUESTION_SECONDS = 30;
const ROUND_SIZE = 10;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function BrainSprintGamePage() {
  const { user } = useAuth();
  const uid = user?.uid || "";

  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty | "all">("all");

  const [deck, setDeck] = useState<GameQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUESTION_SECONDS);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const [bestScore, setBestScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [qs, subs] = await Promise.all([
          ContentService.getGameQuestions(),
          ContentService.getSubjects(),
        ]);
        if (!cancelled) {
          setQuestions(qs);
          setSubjects(subs);
        }
      } catch (err) {
        console.warn("Could not load game questions:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    GameService.getScore(uid)
      .then((record) => {
        if (!cancelled && record) {
          setBestScore(record.bestScore || 0);
          setGamesPlayed(record.gamesPlayed || 0);
        }
      })
      .catch((err) => console.warn("Could not load game score:", err));
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const subjectName = (subjectId: string) =>
    subjects.find((s) => s.id === subjectId)?.name || "General";

  const availableSubjects = useMemo(() => {
    const ids = new Set(questions.map((q) => q.subjectId));
    return subjects.filter((s) => ids.has(s.id));
  }, [questions, subjects]);

  const pool = useMemo(
    () =>
      questions.filter(
        (q) =>
          (selectedSubject === "all" || q.subjectId === selectedSubject) &&
          (selectedDifficulty === "all" || q.difficulty === selectedDifficulty)
      ),
    [questions, selectedSubject, selectedDifficulty]
  );

  const currentQuestion = deck[index];

  const startGame = () => {
    if (pool.length === 0) return;
    const nextDeck = shuffle(pool).slice(0, Math.min(ROUND_SIZE, pool.length));
    setDeck(nextDeck);
    setIndex(0);
    setSelectedOption(null);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setSecondsLeft(QUESTION_SECONDS);
    setScoreSaved(false);
    setPhase("playing");
  };

  const chooseOption = (optionIndex: number) => {
    if (selectedOption !== null || !currentQuestion) return;
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + currentQuestion.points + secondsLeft);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => {
        const next = prev + 1;
        setMaxStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  // Countdown timer for the current question.
  useEffect(() => {
    if (phase !== "playing" || selectedOption !== null) return;
    if (secondsLeft <= 0) {
      setSelectedOption(-1);
      setStreak(0);
      return;
    }
    const timeout = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timeout);
  }, [phase, selectedOption, secondsLeft]);

  const saveResult = async (finalScore: number, finalCorrect: number) => {
    if (!uid) return;
    const newBest = Math.max(bestScore, finalScore);
    setBestScore(newBest);
    setGamesPlayed((prev) => prev + 1);
    try {
      await GameService.saveScore({
        id: uid,
        studentId: uid,
        bestScore: newBest,
        gamesPlayed: gamesPlayed + 1,
        correctAnswers: finalCorrect,
        totalAnswers: deck.length,
        updatedAt: new Date().toISOString(),
      });
      setScoreSaved(true);
    } catch (err) {
      console.warn("Could not save game score:", err);
    }
  };

  const goNext = () => {
    if (index + 1 < deck.length) {
      setIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSecondsLeft(QUESTION_SECONDS);
      return;
    }
    setPhase("result");
    saveResult(score, correctCount);
  };

  const accuracy = deck.length ? Math.round((correctCount / deck.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
              <Brain className="h-3.5 w-3.5" /> Learn with Fun • Brain Sprint
            </div>
            <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
              Tricky Questions. Real Concepts.
            </h1>
            <p className="max-w-xl text-sm text-blue-100">
              Beat the clock, dodge the trap answers, and master board-level concepts.
              Every question comes with an explanation so you learn while you play.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/25 bg-white/15 px-5 py-3 text-center backdrop-blur">
              <div className="flex items-center justify-center gap-1 text-2xl font-black">
                <Trophy className="h-5 w-5 text-amber-300" /> {bestScore}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
                Best Score
              </div>
            </div>
            <div className="rounded-2xl border border-white/25 bg-white/15 px-5 py-3 text-center backdrop-blur">
              <div className="text-2xl font-black">{gamesPlayed}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-100">
                Rounds Played
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SETUP */}
      {phase === "setup" && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-lg font-black font-heading text-[#0F172A]">Choose your round</h2>
              <p className="text-sm text-slate-500">
                {pool.length} question{pool.length === 1 ? "" : "s"} match your filters.
                Each round serves up to {ROUND_SIZE} questions.
              </p>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Subject
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubject("all")}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
                    selectedSubject === "all"
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All Subjects
                </button>
                {availableSubjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
                      selectedSubject === subject.id
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {subject.name.replace(/\s*\(.*\)$/, "")}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                Difficulty
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DIFFICULTIES.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`rounded-2xl border p-3 text-left transition-all ${
                      selectedDifficulty === difficulty.id
                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-sm font-bold text-[#0F172A]">{difficulty.label}</div>
                    <div className="text-[11px] text-slate-500">{difficulty.note}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-violet-600 hover:bg-violet-700"
              disabled={pool.length === 0}
              onClick={startGame}
            >
              <Play className="mr-2 h-4 w-4" />
              {pool.length === 0 ? "No questions available yet" : "Start Brain Sprint"}
            </Button>
          </Card>

          <Card className="p-6 space-y-4 bg-white">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500">
              How scoring works
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>Correct answer = question points + remaining seconds as a speed bonus.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Flame className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                <span>Build a streak for momentum. A wrong answer resets it.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Timer className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span>{QUESTION_SECONDS} seconds per question. Time out and the round moves on.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                <span>Read the explanation after every answer — that is where the real learning happens.</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* PLAYING */}
      {phase === "playing" && currentQuestion && (
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Badge variant="primary">
                Question {index + 1} / {deck.length}
              </Badge>
              <span className="rounded-full bg-violet-50 px-2.5 py-1 font-bold text-violet-700">
                {subjectName(currentQuestion.subjectId)}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 capitalize text-slate-600">
                {currentQuestion.difficulty}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                <Flame className="h-4 w-4" /> {streak} streak
              </span>
              <span className="flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <Trophy className="h-4 w-4" /> {score}
              </span>
              <span
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black ${
                  secondsLeft <= 10 ? "bg-rose-100 text-rose-700" : "bg-blue-50 text-blue-700"
                }`}
              >
                <Timer className="h-4 w-4" /> {secondsLeft}s
              </span>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${((index + (selectedOption !== null ? 1 : 0)) / deck.length) * 100}%` }}
            />
          </div>

          <Card className="space-y-5 p-6">
            <h2 className="text-lg font-bold leading-relaxed text-[#0F172A] sm:text-xl">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-2.5">
              {currentQuestion.options.map((option, optionIndex) => {
                const isChosen = selectedOption === optionIndex;
                const isCorrect = optionIndex === currentQuestion.correctIndex;
                const revealed = selectedOption !== null;
                let className =
                  "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40";
                if (revealed && isCorrect) {
                  className = "border-emerald-400 bg-emerald-50";
                } else if (revealed && isChosen && !isCorrect) {
                  className = "border-rose-400 bg-rose-50";
                } else if (revealed) {
                  className = "border-slate-200 bg-white opacity-70";
                }
                return (
                  <button
                    key={optionIndex}
                    type="button"
                    disabled={revealed}
                    onClick={() => chooseOption(optionIndex)}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left text-sm font-semibold text-[#0F172A] transition-all ${className}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-600">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      {option}
                    </span>
                    {revealed && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    {revealed && isChosen && !isCorrect && <XCircle className="h-5 w-5 text-rose-600" />}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div
                className={`rounded-2xl border p-4 text-sm ${
                  selectedOption === currentQuestion.correctIndex
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                <div className="mb-1 font-black">
                  {selectedOption === currentQuestion.correctIndex
                    ? "Correct!"
                    : selectedOption === -1
                    ? "Time's up!"
                    : "Not quite."}
                </div>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                className="bg-violet-600 hover:bg-violet-700"
                disabled={selectedOption === null}
                onClick={goNext}
              >
                {index + 1 < deck.length ? "Next Question" : "See Results"}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* RESULT */}
      {phase === "result" && (
        <div className="mx-auto max-w-2xl space-y-5">
          <Card className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-black text-[#0F172A]">
                {accuracy >= 80 ? "Outstanding!" : accuracy >= 50 ? "Good effort!" : "Keep practicing!"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                You answered {correctCount} of {deck.length} questions correctly.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-black text-violet-600">{score}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Score</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-black text-emerald-600">{accuracy}%</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Accuracy</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-black text-orange-500">{maxStreak}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Best Streak</div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button variant="outline" size="md" onClick={() => setPhase("setup")}>
                <Target className="mr-1.5 h-4 w-4" /> Change Round
              </Button>
              <Button
                variant="primary"
                size="md"
                className="bg-violet-600 hover:bg-violet-700"
                onClick={startGame}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" /> Play Again
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
              <Zap className="h-3.5 w-3.5" />
              {scoreSaved ? "Best score saved to your profile." : "Saving your score..."}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
