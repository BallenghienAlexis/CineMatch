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
   * Use setTimeout with a delay to ensure FlatList is fully rendered
   */
  useEffect(() => {
    if (genresListRef.current && genres.length > 0) {
      const timeoutId = setTimeout(() => {
        try {
          // Use scrollToIndex with viewPosition to center - it's more reliable
          genresListRef.current?.scrollToIndex({
            index: scrollTargetRef.current,
            animated: false,
            viewPosition: 0.5, // Center on screen
          });
        } catch (error) {
          // Fallback: try without viewPosition
          try {
            genresListRef.current?.scrollToIndex({
              index: scrollTargetRef.current,
              animated: false,
            });
          } catch (err) {
            console.warn('ScrollToIndex failed:', err);
          }
        }
      }, 100); // 100ms delay for better rendering

      return () => clearTimeout(timeoutId);
    }
  }); // Empty dependency - scroll on every render

  return {
    genres,
    selectedGenreId,
    setSelectedGenreId,
    genresLoading,
    genresListRef,
  };
};

