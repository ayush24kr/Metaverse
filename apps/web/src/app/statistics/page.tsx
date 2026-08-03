"use client";

import { useEffect, useState, useMemo } from "react";
import { getDetailedStats, DetailedStats } from "@/lib/api";
import { BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";
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
  const [stats, setStats] = useState<DetailedStats | null>(null);

  useEffect(() => {
    getDetailedStats().then(setStats);
  }, []);

  const typeData = useMemo(() => {
    if (!stats || !stats.typeDistribution) return [];
    return Object.entries(stats.typeDistribution).map(([type, count]) => ({
      genre: type,
      count,
    }));
  }, [stats]);

  const statusData = useMemo(() => {
    if (!stats || !stats.statusDistribution) return [];
    const colorMap: Record<string, string> = {
      COMPLETED: "#22C55E",
      WATCHING: "#3B82F6",
      PLAN_TO_WATCH: "#F59E0B",
      DROPPED: "#EF4444",
      ON_HOLD: "#A855F7",
    };
    return Object.entries(stats.statusDistribution).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || "#6B7280",
    }));
  }, [stats]);

  const watchTimeData = useMemo(() => {
    if (!stats || !stats.monthlyActivity || stats.monthlyActivity.length === 0) {
      return [{ month: "Current", hours: stats?.totalHours || 0 }];
    }
    return stats.monthlyActivity.map((item) => ({
      month: item.month,
      hours: item.events * 2,
    }));
  }, [stats]);

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-[#3B82F6]" />
          <span>Analytics & Statistics</span>
        </h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          Detailed metrics computed live from your API database.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Watch Time Trend Area Chart */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
              <span>Activity Volume</span>
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
            {statusData.length === 0 ? (
              <p className="text-xs text-[#A1A1AA]">No status data recorded in database.</p>
            ) : (
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
            )}
          </div>
        </div>

        {/* Top Genre / Type Bar Chart */}
        <div className="lg:col-span-2 bg-[#18181B] border border-[#27272A] rounded-3xl p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-bold text-[#FAFAFA] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <span>Media Type Breakdown</span>
          </h2>
          <div className="h-64 w-full">
            {typeData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#A1A1AA]">
                Add media to watchlist to see breakdown.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <XAxis dataKey="genre" stroke="#A1A1AA" fontSize={12} />
                  <YAxis stroke="#A1A1AA" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181B", borderColor: "#27272A", borderRadius: "12px", color: "#FAFAFA" }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
