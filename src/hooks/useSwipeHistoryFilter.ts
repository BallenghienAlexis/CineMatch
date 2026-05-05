import { useEffect, useState, useCallback } from 'react';
import { databaseService } from '@/src/services/database';
import { SwipeHistory } from '@/src/services/supabase';

type FilterType = 'all' | 'like' | 'reject';

interface UseSwipeHistoryFilterReturn {
  history: SwipeHistory[];
  filteredHistory: SwipeHistory[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  loadHistory: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Custom hook for managing swipe history with filtering and refresh
 */
export const useSwipeHistoryFilter = (userId?: string): UseSwipeHistoryFilterReturn => {
  const [history, setHistory] = useState<SwipeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  /**
   * Load swipe history from database
   */
  const loadHistory = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: dbError } = await databaseService.getSwipeHistory(userId);
      if (dbError) throw new Error(dbError);
      setHistory(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Refresh history data
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  /**
   * Load on mount
   */
  useEffect(() => {
    loadHistory();
  }, [userId, loadHistory]);

  /**
   * Filter history by action
   */
  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.action === filter;
  });

  return {
    history,
    filteredHistory,
    loading,
    refreshing,
    error,
    filter,
    setFilter,
    loadHistory,
    onRefresh,
  };
};

