"use client";

import { useEffect, useState, useMemo } from "react";
import { getWatchlist, WatchlistItem } from "@/lib/api";

export default function ProfilePage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    getWatchlist().then(setItems);
  }, []);

  const completed = useMemo(() => items.filter((i) => i.status === "COMPLETED"), [items]);

  const avgRating = useMemo(() => {
    const rated = items.filter((i) => i.rating && i.rating > 0);
    if (rated.length === 0) return "N/A";
    const sum = rated.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (sum / rated.length).toFixed(1);
  }, [items]);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Banner & Avatar */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border border-[#27272A] p-8 md:p-10 shadow-xl">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-4 border-[#09090B] flex items-center justify-center font-bold text-3xl text-white shadow-2xl">
            A
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-extrabold text-white">Ayush</h1>
            <p className="text-xs text-[#3B82F6] font-semibold">@ayush • Pro Entertainment Analyst</p>
            <p className="text-xs text-[#A1A1AA] pt-1">Passionate software engineer tracking movies, anime, and web series.</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
          <p className="text-xs font-semibold text-[#A1A1AA] uppercase">Total Tracked</p>
          <p className="text-2xl font-bold text-white mt-1">{items.length}</p>
        </div>
        <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
          <p className="text-xs font-semibold text-[#A1A1AA] uppercase">Completed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{completed.length}</p>
        </div>
        <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
          <p className="text-xs font-semibold text-[#A1A1AA] uppercase">Completion Rate</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {items.length > 0 ? Math.round((completed.length / items.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-2xl">
          <p className="text-xs font-semibold text-[#A1A1AA] uppercase">Avg Rating</p>
          <p className="text-2xl font-bold text-violet-400 mt-1">{avgRating} ★</p>
        </div>
      </div>
    </div>
  );
}
