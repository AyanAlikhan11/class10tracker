"use client";

import React, { useState, useEffect } from "react";
import { X, Play, ExternalLink, Sparkles, Clock, CheckCircle2, Tv, AlertCircle } from "lucide-react";
import { Chapter, ChapterVideoLesson } from "@/types";

interface VideoPlayerModalProps {
  chapter: Chapter | null;
  initialVideo?: ChapterVideoLesson | null;
  onClose: () => void;
}

export function VideoPlayerModal({ chapter, initialVideo, onClose }: VideoPlayerModalProps) {
  const videos = chapter?.videoLessons || [];
  
  const defaultVideo: ChapterVideoLesson = {
    id: "default-1",
    title: `${chapter?.title || "Class 10"} Complete One Shot Concept Revision`,
    youtubeId: "s7Y976auPwE",
    channelName: "Physics Wallah Foundation",
    durationMinutes: 58,
    isOneShot: true,
  };

  const [activeVideo, setActiveVideo] = useState<ChapterVideoLesson>(
    initialVideo || videos[0] || defaultVideo
  );

  // Sync state whenever props change
  useEffect(() => {
    if (initialVideo) {
      setActiveVideo(initialVideo);
    } else if (videos.length > 0) {
      setActiveVideo(videos[0]);
    }
  }, [chapter, initialVideo]);

  if (!chapter) return null;

  const directWatchUrl = `https://www.youtube.com/watch?v=${activeVideo.youtubeId}`;
  const searchBackupUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    activeVideo.title + " Physics Wallah Class 10"
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col w-full max-w-4xl max-h-[94vh] overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#1E293B]/80">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF0000] text-white shrink-0 shadow-lg shadow-red-600/30">
              <Play className="h-5 w-5 fill-white ml-0.5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Chapter {chapter.chapterNumber} Video Lesson
                </span>
                <span className="text-xs text-slate-400 font-medium truncate">
                  {chapter.title}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold font-heading text-white truncate mt-0.5">
                {activeVideo.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Primary Watch on YouTube Button */}
            <a
              href={directWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FF0000] text-white hover:bg-[#CC0000] shadow-md shadow-red-600/20 transition-all hover:scale-105"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player Embed (16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black shrink-0">
          <iframe
            key={activeVideo.youtubeId}
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={activeVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Bottom Playlist & Metadata */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#0F172A]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                Channel: <strong className="text-white">{activeVideo.channelName}</strong>
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                ~{activeVideo.durationMinutes} mins
              </span>
              {activeVideo.isOneShot && (
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                  One Shot Concept
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={searchBackupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-400 hover:text-white underline"
              >
                Search on YouTube ↗
              </a>
            </div>
          </div>

          {/* Video selector list if multiple videos */}
          {videos.length > 1 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                All Available Lessons in this Chapter ({videos.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {videos.map((vid) => {
                  const isCurrent = vid.id === activeVideo.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isCurrent
                          ? "bg-rose-950/50 border-rose-500/80 text-white shadow-sm ring-1 ring-rose-500/30"
                          : "bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                      }`}
                    >
                      <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${isCurrent ? "bg-[#FF0000] text-white" : "bg-slate-700 text-slate-400"}`}>
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold line-clamp-1 leading-snug">
                          {vid.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>{vid.channelName}</span>
                          <span>•</span>
                          <span>{vid.durationMinutes}m</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Note / Tip */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Distraction-Free Mode:</strong> Watch directly without algorithmic feeds or click <strong>&quot;Watch on YouTube&quot;</strong> anytime to switch to the YouTube app.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
