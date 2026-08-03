import React from "react";
import { MediaItem } from "@/lib/api";
import { Plus, Check, Star } from "lucide-react";

interface MediaCardProps {
  media: MediaItem;
  isAdded?: boolean;
  onAdd?: (media: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  media,
  isAdded = false,
  onAdd,
}) => {
  return (
    <div className="group bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#3B82F6]/50 transition-all duration-200 shadow-md">
      <div className="relative aspect-[2/3] w-full bg-[#27272A] overflow-hidden">
        {media.posterPath ? (
          <img
            src={media.posterPath}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#A1A1AA]">
            No Image Available
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[#3B82F6] border border-[#3B82F6]/30">
          {media.type}
        </span>
        {media.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{media.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-sm text-[#FAFAFA] line-clamp-1 group-hover:text-[#3B82F6] transition-colors">
            {media.title}
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-1 capitalize">
            Source: {media.source}
          </p>
        </div>

        {onAdd && (
          <button
            onClick={() => onAdd(media)}
            disabled={isAdded}
            className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-150 ${
              isAdded
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default"
                : "bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Watchlist</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Watchlist</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
