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
      // Use requestAnimationFrame to ensure FlatList is rendered
      const frameId = requestAnimationFrame(() => {
        try {
          // "Tous" is always at index 0
          let targetIndex = 0;
          if (selectedGenreId !== null) {
            const foundIndex = genres.findIndex((g) => g.id === selectedGenreId);
            if (foundIndex !== -1) {
              targetIndex = foundIndex + 1; // +1 because "Tous" is at start
            }
          }

          // Use scrollToIndex for more reliable scrolling
          genresListRef.current?.scrollToIndex({
            index: targetIndex,
            animated: true,
            viewPosition: 0.5, // Center item on screen
          });
        } catch (error) {
          console.warn('ScrollToIndex error:', error);
        }
      });

      return () => cancelAnimationFrame(frameId);
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

