"use client";

import { useState } from "react";
import { searchMedia, addToWatchlist, MediaItem } from "@/lib/api";
import { MediaCard } from "@/components/MediaCard";
import { Search, Loader2 } from "lucide-react";

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
            <MediaCard
              key={`${media.source}-${media.type}-${media.id}-${idx}`}
              media={media}
              isAdded={addedIds.has(media.id)}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
