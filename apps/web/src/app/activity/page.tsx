"use client";

import { useEffect, useState } from "react";
import { getActivities, ActivityItem } from "@/lib/api";
import { Activity as ActivityIcon, CheckCircle2, Play, Star, Plus } from "lucide-react";

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    getActivities().then(setActivities);
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <ActivityIcon className="w-8 h-8 text-[#3B82F6]" />
          <span>Activity Timeline</span>
        </h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          Event-driven audit stream fetched directly from PostgreSQL database.
        </p>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 space-y-6">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-[#27272A]/60 last:border-0 last:pb-0">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] shrink-0 mt-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#FAFAFA]">{item.mediaTitle}</h3>
                <span className="text-xs text-[#A1A1AA]">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Event: <span className="text-[#3B82F6] font-semibold">{item.type}</span> • {item.details || "Watchlist action logged"}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12 text-[#A1A1AA]">
            No activity events recorded in PostgreSQL yet. Add titles from Search to populate the log.
          </div>
        )}
      </div>
    </div>
  );
}
