"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWatchlist, WatchlistItem } from "@/lib/api";
import { Dna, Sparkles, Award, Zap, TrendingUp, Flame, Film, Star, Heart } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function EntertainmentDNAPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    getWatchlist().then(setItems);
  }, []);

  const radarData = [
    { genre: "Action & Shonen", score: 92 },
    { genre: "Sci-Fi & Cyberpunk", score: 88 },
    { genre: "Psychological Thriller", score: 95 },
    { genre: "Dark Fantasy", score: 85 },
    { genre: "Mystery & Mind-Bending", score: 90 },
    { genre: "Drama & Romance", score: 78 },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Flagship Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950 via-indigo-950 to-slate-950 border border-violet-500/30 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Personality Profile</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Personal Entertainment DNA
          </h1>
          <p className="text-violet-200/80 text-sm md:text-base leading-relaxed">
            Deep algorithmic analysis of your watching history, genre preferences, rating distributions, and media archetype.
          </p>
        </div>
      </div>

      {/* Entertainment Archetype Badge */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#18181B] border border-[#27272A] rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Media Archetype</span>
              <h2 className="text-2xl font-bold text-white">The Mind-Bending Sci-Fi Strategist</h2>
            </div>
          </div>

          <p className="text-[#A1A1AA] text-sm leading-relaxed">
            Your viewing habits strongly lean towards psychological thrillers, dark fantasy, and high-concept sci-fi (*Interstellar*, *Attack on Titan*, *Death Note*). You appreciate complex narratives with high episode completion rates.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#27272A]">
            <div>
              <p className="text-[11px] text-[#A1A1AA] uppercase font-bold">Top Genre</p>
              <p className="text-base font-bold text-violet-400 mt-1">Psychological</p>
            </div>
            <div>
              <p className="text-[11px] text-[#A1A1AA] uppercase font-bold">Completion Rate</p>
              <p className="text-base font-bold text-emerald-400 mt-1">94.2%</p>
            </div>
            <div>
              <p className="text-[11px] text-[#A1A1AA] uppercase font-bold">Watch Streak</p>
              <p className="text-base font-bold text-amber-400 mt-1">14 Days 🔥</p>
            </div>
          </div>
        </div>

        {/* Media Wrapped Card */}
        <div className="bg-gradient-to-b from-indigo-950/60 to-[#18181B] border border-indigo-500/30 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Media Wrapped 2026</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-3xl font-black text-white">453 Titles</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Movies, Anime & Series Finished</p>
            </div>
            <div>
              <p className="text-3xl font-black text-indigo-400">921 Hours</p>
              <p className="text-xs text-[#A1A1AA] mt-1">Total Watch Time</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#09090B]/60 border border-white/10 text-xs text-[#A1A1AA]">
            Favorite Director: <span className="text-white font-bold">Christopher Nolan</span>
          </div>
        </div>
      </section>

      {/* Genre Radar Chart */}
      <section className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-400" />
            <span>Genre Preference Radar</span>
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Visual affinity spectrum computed across your ratings and watch history.
          </p>
        </div>

        <div className="h-80 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#27272A" />
              <PolarAngleAxis dataKey="genre" stroke="#A1A1AA" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#27272A" />
              <Radar name="Affinity Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
