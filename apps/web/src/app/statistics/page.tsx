"use client";

import { useEffect, useState } from "react";
import { getWatchlist, WatchlistItem } from "@/lib/api";
import { BarChart3, PieChart as PieIcon, TrendingUp, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

export default function StatisticsPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    getWatchlist().then(setItems);
  }, []);

  const genreData = [
    { genre: "Action", count: 42 },
    { genre: "Sci-Fi", count: 38 },
    { genre: "Drama", count: 29 },
    { genre: "Fantasy", count: 35 },
    { genre: "Comedy", count: 21 },
    { genre: "Thriller", count: 31 },
  ];

  const statusData = [
    { name: "Completed", value: items.filter((i) => i.status === "COMPLETED").length || 18, color: "#22C55E" },
    { name: "Watching", value: items.filter((i) => i.status === "WATCHING").length || 6, color: "#3B82F6" },
    { name: "Plan to Watch", value: items.filter((i) => i.status === "PLAN_TO_WATCH").length || 12, color: "#F59E0B" },
    { name: "Dropped", value: items.filter((i) => i.status === "DROPPED").length || 2, color: "#EF4444" },
  ];

  const watchTimeData = [
    { month: "Jan", hours: 45 },
    { month: "Feb", hours: 58 },
    { month: "Mar", hours: 72 },
    { month: "Apr", hours: 64 },
    { month: "May", hours: 85 },
    { month: "Jun", hours: 92 },
    { month: "Jul", hours: 110 },
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-[#3B82F6]" />
          <span>Analytics & Statistics</span>
        </h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          Detailed metrics covering genre breakdown, watch time trends, and rating distribution.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Watch Time Trend Area Chart */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
              <span>Monthly Watch Time (Hours)</span>
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={watchTimeData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={12} />
                <YAxis stroke="#A1A1AA" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", borderRadius: "12px", color: "#FAFAFA" }} />
                <Area type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <span>Watch Status Distribution</span>
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", borderRadius: "12px", color: "#FAFAFA" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Genre Bar Chart */}
        <div className="lg:col-span-2 bg-[#18181B] border border-[#27272A] rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span>Genre Breakdown</span>
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreData}>
                <XAxis dataKey="genre" stroke="#A1A1AA" fontSize={12} />
                <YAxis stroke="#A1A1AA" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", borderRadius: "12px", color: "#FAFAFA" }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
