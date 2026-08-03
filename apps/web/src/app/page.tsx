"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getWatchlist, WatchlistItem } from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import {
  Play,
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
  Activity as ActivityIcon,
} from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchlist().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const watching = useMemo(
    () => items.filter((i) => i.status === "WATCHING"),
    [items]
  );
  const completed = useMemo(
    () => items.filter((i) => i.status === "COMPLETED"),
    [items]
  );
  const planToWatch = useMemo(
    () => items.filter((i) => i.status === "PLAN_TO_WATCH"),
    [items]
  );

  const totalHours = useMemo(
    () => completed.length * 2.5 + watching.length * 1.2,
    [completed.length, watching.length]
  );

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/20 p-8 md:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Back</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Good Evening, Ayush 👋
          </h1>
          <p className="text-[#A1A1AA] text-sm md:text-base leading-relaxed">
            You have <span className="text-[#3B82F6] font-semibold">{watching.length} titles</span> currently in progress and <span className="text-emerald-400 font-semibold">{completed.length} completed</span>.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/search"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-medium text-sm shadow-lg shadow-blue-500/25 transition-all duration-150"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Explore New Titles</span>
            </Link>
            <Link
              href="/watchlist"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#FAFAFA] font-medium text-sm transition-all duration-150"
            >
              <Bookmark className="w-4 h-4 text-[#A1A1AA]" />
              <span>View Watchlist</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Watching"
          value={watching.length}
          icon={<Play className="w-5 h-5 text-[#3B82F6]" />}
          accentColorClass="text-[#3B82F6]"
          hoverBorderClass="hover:border-[#3B82F6]/50"
          bgIconClass="bg-[#3B82F6]/10 border-[#3B82F6]/20"
        />
        <StatCard
          label="Completed"
          value={completed.length}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          accentColorClass="text-emerald-400"
          hoverBorderClass="hover:border-emerald-500/50"
          bgIconClass="bg-emerald-500/10 border-emerald-500/20"
        />
        <StatCard
          label="Plan to Watch"
          value={planToWatch.length}
          icon={<Bookmark className="w-5 h-5 text-amber-400" />}
          accentColorClass="text-amber-400"
          hoverBorderClass="hover:border-amber-500/50"
          bgIconClass="bg-amber-500/10 border-amber-500/20"
        />
        <StatCard
          label="Hours Tracked"
          value={`${totalHours.toFixed(0)}h`}
          icon={<Clock className="w-5 h-5 text-violet-400" />}
          accentColorClass="text-violet-400"
          hoverBorderClass="hover:border-rose-500/50"
          bgIconClass="bg-violet-500/10 border-violet-500/20"
        />
      </section>

      {/* Continue Watching Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-xl font-bold text-white tracking-tight">Continue Watching</h2>
          </div>
          <Link href="/watchlist" className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 font-medium">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {watching.length === 0 ? (
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-[#A1A1AA]">No active titles in progress right now.</p>
            <Link
              href="/search"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-semibold hover:bg-[#3B82F6]/20 transition"
            >
              Search & Add Media
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {watching.map((item) => (
              <div
                key={item.id}
                className="group bg-[#18181B] border border-[#27272A] rounded-2xl p-4 flex space-x-4 hover:border-[#3B82F6]/40 transition-all duration-200 shadow-sm"
              >
                {item.mediaPoster ? (
                  <img
                    src={item.mediaPoster}
                    alt={item.mediaTitle}
                    className="w-20 h-28 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-20 h-28 bg-[#27272A] rounded-xl flex items-center justify-center text-xs text-[#A1A1AA]">
                    No Poster
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 inline-block mb-1.5">
                      {item.mediaType}
                    </span>
                    <h3 className="font-semibold text-sm text-[#FAFAFA] truncate group-hover:text-[#3B82F6] transition-colors">
                      {item.mediaTitle}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-[#A1A1AA]">
                      <span>Progress</span>
                      <span className="font-bold text-white">{item.progress} Ep/Ch</span>
                    </div>
                    <div className="w-full bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (item.progress / 24) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity Timeline Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ActivityIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
          </div>
          <Link href="/activity" className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 font-medium">
            Full Log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 space-y-4">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-[#27272A]/60 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <div>
                  <p className="text-sm font-medium text-[#FAFAFA]">
                    Updated <span className="font-bold text-[#3B82F6]">{item.mediaTitle}</span>
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    Status set to <span className="text-emerald-400 font-semibold">{item.status}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#A1A1AA]">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-[#A1A1AA] text-center py-4">No recent activity recorded.</p>
          )}
        </div>
      </section>
    </div>
  );
}
