const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface MediaItem {
  id: string;
  source: string;
  externalId: string;
  type: string;
  title: string;
  description?: string;
  posterPath?: string;
  bannerPath?: string;
  releaseYear?: number;
  rating?: number;
  genres?: string[];
}

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaId: string;
  mediaTitle: string;
  mediaPoster?: string;
  mediaType: string;
  status: string;
  progress: number;
  rating?: number;
  notes?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  mediaTitle: string;
  mediaPoster?: string;
  details?: string;
  createdAt: string;
}

export interface UserStats {
  watching: number;
  completed: number;
  dropped: number;
  planToWatch: number;
  totalHours: number;
  averageRating: number;
  totalTracked: number;
  streakDays: number;
}

export interface DetailedStats {
  statusDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  ratingDistribution: Record<string, number>;
  monthlyActivity: Array<{ month: string; events: number }>;
  completionRate: number;
  averageRating: number;
  totalHours: number;
  totalTracked: number;
  completedCount: number;
  streakDays: number;
}

export async function searchMedia(query: string, type?: string): Promise<MediaItem[]> {
  if (!query) return [];
  const params = new URLSearchParams({ q: query });
  if (type && type !== "all") params.append("type", type);
  
  try {
    const res = await fetch(`${API_BASE_URL}/media/search?${params.toString()}`);
    const json = await res.json();
    return json.success ? json.data.items : [];
  } catch (error) {
    console.error("Failed to search media", error);
    return [];
  }
}

export async function getWatchlist(): Promise<WatchlistItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlist`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error("Failed to fetch watchlist", error);
    return [];
  }
}

export async function getActivities(): Promise<ActivityItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/activity`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error("Failed to fetch activities", error);
    return [];
  }
}

export async function getUserStats(): Promise<UserStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Failed to fetch user stats", error);
    return null;
  }
}

export async function getDetailedStats(): Promise<DetailedStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/stats/detailed`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Failed to fetch detailed stats", error);
    return null;
  }
}

export async function addToWatchlist(item: {
  mediaId: string;
  source: string;
  externalId: string;
  type: string;
  title: string;
  posterPath?: string;
  status?: string;
  progress?: number;
  rating?: number;
}): Promise<WatchlistItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Failed to add item to watchlist", error);
    return null;
  }
}

export async function updateWatchlist(id: string, updates: {
  status?: string;
  progress?: number;
  rating?: number;
  notes?: string;
}): Promise<WatchlistItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Failed to update watchlist item", error);
    return null;
  }
}

export async function deleteFromWatchlist(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/watchlist/${id}`, { method: "DELETE" });
    const json = await res.json();
    return json.success;
  } catch (error) {
    console.error("Failed to delete item from watchlist", error);
    return false;
  }
}
