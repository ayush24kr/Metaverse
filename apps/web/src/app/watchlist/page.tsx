"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWatchlist, updateWatchlist, deleteFromWatchlist, WatchlistItem } from "@/lib/api";
import {
  Bookmark,
  Plus,
  Trash2,
  Filter,
  CheckCircle2,
  Play,
  XCircle,
  Clock,
  LayoutGrid,
  Table as TableIcon,
  Star,
  ChevronDown,
} from "lucide-react";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const data = await getWatchlist();
    setItems(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateWatchlist(id, { status: newStatus });
    fetchItems();
  };

  const handleIncrementProgress = async (id: string, currentProgress: number) => {
    await updateWatchlist(id, { progress: currentProgress + 1 });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await deleteFromWatchlist(id);
    fetchItems();
  };

  const filteredItems = filterStatus === "ALL"
    ? items
    : items.filter((i) => i.status === filterStatus);

  const statusFilters = [
    { label: "All Items", value: "ALL", count: items.length },
    { label: "Watching", value: "WATCHING", count: items.filter((i) => i.status === "WATCHING").length },
    { label: "Completed", value: "COMPLETED", count: items.filter((i) => i.status === "COMPLETED").length },
    { label: "Plan to Watch", value: "PLAN_TO_WATCH", count: items.filter((i) => i.status === "PLAN_TO_WATCH").length },
    { label: "Dropped", value: "DROPPED", count: items.filter((i) => i.status === "DROPPED").length },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-[#3B82F6]" />
            <span>Personal Watchlist</span>
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-1">
            Notion-style tracking table with status filters and episode counters.
          </p>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#18181B] border border-[#27272A] p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "table" ? "bg-[#27272A] text-white" : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "grid" ? "bg-[#27272A] text-white" : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid</span>
            </button>
          </div>

          <Link
            href="/search"
            className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 font-semibold text-xs rounded-xl text-white shadow-md shadow-blue-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 flex items-center space-x-2 ${
              filterStatus === tab.value
                ? "bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6]"
                : "bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#27272A] text-[10px] text-white">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Rendering (Table vs Grid) */}
      {viewMode === "table" ? (
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#FAFAFA]">
              <thead className="bg-[#1F1F23] text-[11px] uppercase tracking-wider text-[#A1A1AA] border-b border-[#27272A]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Progress</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/60">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#27272A]/40 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      {item.mediaPoster ? (
                        <img
                          src={item.mediaPoster}
                          alt=""
                          className="w-10 h-14 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-[#27272A] rounded-lg flex items-center justify-center text-[10px] text-[#A1A1AA]">
                          No Image
                        </div>
                      )}
                      <span className="font-semibold text-[#FAFAFA]">{item.mediaTitle}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-bold text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 px-2 py-1 rounded-md">
                        {item.mediaType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-[#FAFAFA] focus:outline-none focus:border-[#3B82F6]"
                      >
                        <option value="WATCHING">WATCHING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="PLAN_TO_WATCH">PLAN TO WATCH</option>
                        <option value="DROPPED">DROPPED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{item.progress} Ep/Ch</span>
                        <button
                          onClick={() => handleIncrementProgress(item.id, item.progress)}
                          className="px-2.5 py-1 bg-[#27272A] hover:bg-[#3B82F6] text-white rounded-lg text-xs font-bold transition"
                        >
                          +1
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.rating ? (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {item.rating}
                        </span>
                      ) : (
                        <span className="text-[#A1A1AA] text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#A1A1AA]">
                      No media found matching current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden p-4 flex flex-col justify-between space-y-4"
            >
              {item.mediaPoster && (
                <img src={item.mediaPoster} alt="" className="w-full h-56 object-cover rounded-xl" />
              )}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded">
                  {item.mediaType}
                </span>
                <h3 className="font-semibold text-sm text-[#FAFAFA] line-clamp-1">{item.mediaTitle}</h3>
                <div className="flex justify-between text-xs text-[#A1A1AA]">
                  <span>{item.status}</span>
                  <span className="font-bold text-white">{item.progress} Ep/Ch</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
