"use client";

import { useState } from "react";
import Link from "next/link";
import { searchMedia, addToWatchlist, MediaItem } from "@/lib/api";
import { Search, Film, Tv, Sparkles, Star, Plus, Check, Loader2 } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const executeSearch = async (searchQuery: string, mediaType: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    const data = await searchMedia(searchQuery, mediaType);
    setResults(data);
    setLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query, type);
  };

  const handleTypeChange = (selectedType: string) => {
    setType(selectedType);
    if (query.trim()) {
      executeSearch(query, selectedType);
    }
  };

  const handleAdd = async (media: MediaItem) => {
    const success = await addToWatchlist({
      mediaId: media.id,
      source: media.source,
      externalId: media.externalId,
      type: media.type,
      title: media.title,
      posterPath: media.posterPath,
      status: "WATCHING",
    });

    if (success) {
      setAddedIds((prev) => new Set(prev).add(media.id));
    }
  };

  const filterChips = [
    { label: "All Types", value: "all" },
    { label: "Movies", value: "movie" },
    { label: "TV Series", value: "tv" },
    { label: "Anime", value: "anime" },
    { label: "Manga & Manhwa", value: "manga" },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Search className="w-8 h-8 text-[#3B82F6]" />
          <span>Unified Media Search</span>
        </h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          Search across Movies, TV Series, Anime, Manga, and MangaDex in real-time.
        </p>
      </div>

      {/* Search Input & Filter Chips */}
      <form onSubmit={handleFormSubmit} className="space-y-4 max-w-3xl">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Interstellar, One Piece, Breaking Bad, Solo Leveling..."
            className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl px-5 py-4 pl-12 text-sm text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] shadow-md transition"
          />
          <Search className="w-5 h-5 text-[#A1A1AA] absolute left-4 top-4" />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 bg-[#3B82F6] hover:bg-blue-600 font-semibold text-xs rounded-xl text-white shadow-md shadow-blue-500/20 transition-all duration-150 flex items-center gap-2"
          >
            <span>Search</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {filterChips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => handleTypeChange(chip.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                type === chip.value
                  ? "bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] shadow-sm"
                  : "bg-[#18181B] border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#27272A]"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </form>

      {/* Search Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#A1A1AA] space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#3B82F6]" />
          <span className="text-sm font-medium">Fetching metadata from TMDb, AniList & MangaDex...</span>
        </div>
      ) : results.length === 0 ? (
        query.trim() ? (
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-12 text-center text-[#A1A1AA]">
            No results found for "{query}". Try searching another title or filter.
          </div>
        ) : (
          <div className="bg-[#18181B]/40 border border-[#27272A]/60 rounded-2xl p-12 text-center space-y-2">
            <p className="text-[#FAFAFA] font-medium">Ready to Search</p>
            <p className="text-xs text-[#A1A1AA]">Type a movie, TV show, or anime title above and press Search.</p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {results.map((media, idx) => (
            <div
              key={`${media.source}-${media.type}-${media.id}-${idx}`}
              className="group bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#3B82F6]/50 transition-all duration-200 shadow-sm hover:shadow-xl"
            >
              <div className="relative overflow-hidden aspect-[2/3] bg-[#27272A]">
                {media.posterPath ? (
                  <img
                    src={media.posterPath}
                    alt={media.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#A1A1AA]">
                    No Poster
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-[#09090B]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-bold uppercase text-[#3B82F6]">
                  {media.type}
                </div>
                {media.rating && (
                  <div className="absolute top-3 right-3 bg-[#09090B]/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{media.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#FAFAFA] line-clamp-2 group-hover:text-[#3B82F6] transition-colors">
                    {media.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    {media.releaseYear ? `${media.releaseYear}` : "N/A"} • {media.source.toUpperCase()}
                  </p>
                </div>

                <button
                  onClick={() => handleAdd(media)}
                  disabled={addedIds.has(media.id)}
                  className={`w-full mt-4 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all duration-150 ${
                    addedIds.has(media.id)
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-[#27272A] hover:bg-[#3B82F6] text-[#FAFAFA] hover:text-white"
                  }`}
                >
                  {addedIds.has(media.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
