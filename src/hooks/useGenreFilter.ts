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
          const targetIndex = scrollTargetRef.current;

          // Calculate offset manually for more reliable scrolling
          // "Tous" is ~55px, other genres are ~70px, gap is 8px
          let offset = 0;
          const tousWidth = 55;
          const genreWidth = 70;
          const gapSize = 8;
          const horizontalPadding = 12; // left padding from contentContainerStyle

          if (targetIndex === 0) {
            offset = 0;
          } else {
            // Start with "Tous" width + left padding
            offset = tousWidth + horizontalPadding;
            // Add all genres before target
            for (let i = 1; i < targetIndex; i++) {
              offset += genreWidth + gapSize;
            }
            // Approximately center on screen (rough estimate)
            offset = Math.max(0, offset - 50);
          }

          genresListRef.current?.scrollToOffset({
            offset,
            animated: false,
          });
        } catch (error) {
          console.warn('ScrollToOffset error:', error);
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

