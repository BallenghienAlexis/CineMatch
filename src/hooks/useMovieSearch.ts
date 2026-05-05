import { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { tmdbService, Movie } from '@/src/services/tmdb';

/**
 * Custom hook for search functionality with debounce, pagination, and refresh
 */
export const useMovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Perform the actual search API call
   */
  const performSearch = useCallback(async (query: string, pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const result = await tmdbService.searchMovies(query, pageNum);

      if (pageNum === 1) {
        setResults(result.results);
      } else {
        setResults((prev) => [...prev, ...result.results]);
      }

      setTotalPages(result.total_pages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Debounce search query changes (500ms)
   */
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setPage(1);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery, 1);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  /**
   * Refresh results when returning to screen
   */
  useFocusEffect(
    useCallback(() => {
      if (searchQuery.trim() && results.length > 0) {
        performSearch(searchQuery, 1);
      }
    }, [searchQuery, results.length, performSearch])
  );

  /**
   * Load more results (pagination)
   */
  const handleLoadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      performSearch(searchQuery, page + 1);
    }
  }, [page, totalPages, loading, searchQuery, performSearch]);

  /**
   * Manual refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (searchQuery.trim()) {
      await performSearch(searchQuery, 1);
    }
    setRefreshing(false);
  }, [searchQuery, performSearch]);

  return {
    // State
    searchQuery,
    results,
    loading,
    refreshing,
    error,
    page,
    totalPages,
    hasSearched,
    // Actions
    setSearchQuery,
    handleLoadMore,
    onRefresh,
  };
};

