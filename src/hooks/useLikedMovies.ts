import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { databaseService } from '@/src/services/database';
import { LikedMovie } from '@/src/services/supabase';

interface UseLikedMoviesReturn {
  likedMovies: LikedMovie[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  loadLikedMovies: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Custom hook for managing liked movies with refresh
 */
export const useLikedMovies = (userId?: string): UseLikedMoviesReturn => {
  const [likedMovies, setLikedMovies] = useState<LikedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load liked movies from database
   */
  const loadLikedMovies = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await databaseService.getLikedMovies(userId);
      if (dbError) throw new Error(dbError);
      setLikedMovies(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des films aimés');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Refresh liked movies
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLikedMovies();
    setRefreshing(false);
  }, [loadLikedMovies]);

  /**
   * Load on mount
   */
  useEffect(() => {
    loadLikedMovies();
  }, [userId, loadLikedMovies]);

  /**
   * Reload when returning from detail screen (to detect rejected movies)
   */
  useFocusEffect(
    useCallback(() => {
      loadLikedMovies();
    }, [loadLikedMovies])
  );

  return {
    likedMovies,
    loading,
    refreshing,
    error,
    loadLikedMovies,
    onRefresh,
  };
};

