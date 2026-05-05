import { useState, useEffect, useRef, useCallback } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { tmdbService, Genre } from '@/src/services/tmdb';

const { width: screenWidth } = Dimensions.get('window');

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
   * Auto-scroll genre list to selected genre
   */
  useEffect(() => {
    if (genresListRef.current && genres.length > 0) {
      const timeoutId = setTimeout(() => {
        try {
          // "Tous" is always at index 0
          let targetIndex = 0;
          if (selectedGenreId !== null) {
            const foundIndex = genres.findIndex((g) => g.id === selectedGenreId);
            if (foundIndex !== -1) {
              targetIndex = foundIndex + 1; // +1 because "Tous" is at start
            }
          }

          // Each item ~75px + 8px gap
          const avgItemWidth = 75;
          const gapSize = 8;
          const itemSize = avgItemWidth + gapSize;

          // Center the item on screen
          const offset = Math.max(0, targetIndex * itemSize - screenWidth / 2 + avgItemWidth / 2);

          genresListRef.current?.scrollToOffset({
            offset,
            animated: true,
          });
        } catch (error) {
          console.warn('ScrollToOffset error:', error);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedGenreId, genres]);

  return {
    genres,
    selectedGenreId,
    setSelectedGenreId,
    genresLoading,
    genresListRef,
  };
};

