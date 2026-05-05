import { useState, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import { tmdbService, Genre } from '@/src/services/tmdb';

interface UseGenreFilterReturn {
  genres: Genre[];
  selectedGenreId: number | null;
  setSelectedGenreId: (id: number | null) => void;
  genresLoading: boolean;
  genresListRef: React.RefObject<FlatList>;
}

/**
 * Custom hook for managing genre filter and auto-scroll
 */
export const useGenreFilter = (): UseGenreFilterReturn => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [genresLoading, setGenresLoading] = useState(true);
  const genresListRef = useRef<FlatList>(null);
  
  // Keep track of the target index to scroll to
  const scrollTargetRef = useRef<number>(0);

  /**
   * Load genres on mount
   */
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setGenresLoading(true);
        const genreList = await tmdbService.getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Error loading genres:', err);
      } finally {
        setGenresLoading(false);
      }
    };
    loadGenres();
  }, []);

  /**
   * Update target index when selectedGenreId changes
   */
  useEffect(() => {
    let targetIndex = 0;
    if (selectedGenreId !== null) {
      const foundIndex = genres.findIndex((g) => g.id === selectedGenreId);
      if (foundIndex !== -1) {
        targetIndex = foundIndex + 1; // +1 because "Tous" is at start
      }
    }
    scrollTargetRef.current = targetIndex;
  }, [selectedGenreId, genres]);

  /**
   * Scroll to target on every render (keeps position persistent)
   */
  useEffect(() => {
    if (genresListRef.current && genres.length > 0) {
      const frameId = requestAnimationFrame(() => {
        try {
          genresListRef.current?.scrollToIndex({
            index: scrollTargetRef.current,
            animated: false, // No animation to prevent jumping
            viewPosition: 0.5,
          });
        } catch (error) {
          console.warn('ScrollToIndex error:', error);
        }
      });

      return () => cancelAnimationFrame(frameId);
    }
  }); // Empty dependency - scroll on every render!

  return {
    genres,
    selectedGenreId,
    setSelectedGenreId,
    genresLoading,
    genresListRef,
  };
};

