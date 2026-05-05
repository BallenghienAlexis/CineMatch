import { useState, useCallback, useRef, useEffect } from 'react';
import { tmdbService, Movie } from '@/src/services/tmdb';
import { databaseService } from '@/src/services/database';

const LOAD_MORE_BUFFER = 3;

interface UseMovieStackProps {
  userId?: string;
  selectedGenreId: number | null;
}

interface UseMovieStackReturn {
  movies: Movie[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  moviesRef: React.MutableRefObject<Movie[]>;
  currentIndexRef: React.MutableRefObject<number>;
  pageRef: React.MutableRefObject<number>;
  loadMovies: (pageNum: number) => Promise<void>;
}

/**
 * Custom hook for managing movie stack with swipe history filtering and progress restoration
 */
export const useMovieStack = ({
  userId,
  selectedGenreId,
}: UseMovieStackProps): UseMovieStackReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const moviesRef = useRef<Movie[]>([]);
  const currentIndexRef = useRef(0);
  const pageRef = useRef(1);
  const hasLoadedRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  /**
   * Load movies from TMDB, filtered by swipe history
   */
  const loadMovies = useCallback(
    async (pageNum: number) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        }
        setError(null);

        // Fetch swipe history to filter already-swiped movies
        let swipedMovieIds: Set<number> = new Set();
        if (userId) {
          try {
            const { data: swipeHistory } = await databaseService.getSwipeHistory(userId);
            swipedMovieIds = new Set(swipeHistory?.map((s) => s.movie_id) || []);
          } catch (err) {
            console.error('Error fetching swipe history for filtering:', err);
          }
        }

        // Fetch movies by genre or popular
        const result = selectedGenreId
          ? await tmdbService.getMoviesByGenre(selectedGenreId, pageNum)
          : await tmdbService.getPopularMovies(pageNum);

        // Filter out already-swiped movies
        const filteredMovies = result.results.filter(
          (movie) => !swipedMovieIds.has(movie.id)
        );

        // If first load and no movies found after filtering, try next pages
        if (pageNum === 1 && filteredMovies.length === 0 && isFirstLoadRef.current) {
          console.log('⚠️ Page 1 empty after filtering, trying next pages...');
          for (let p = 2; p <= Math.min(5, result.total_pages || 5); p++) {
            try {
              const nextResult = selectedGenreId
                ? await tmdbService.getMoviesByGenre(selectedGenreId, p)
                : await tmdbService.getPopularMovies(p);

              const nextFilteredMovies = nextResult.results.filter(
                (movie) => !swipedMovieIds.has(movie.id)
              );

              if (nextFilteredMovies.length > 0) {
                console.log(`✅ Found ${nextFilteredMovies.length} movies on page ${p}`);
                setMovies(nextFilteredMovies);
                setPage(p);
                break;
              }
            } catch (err) {
              console.error(`Error loading page ${p}:`, err);
            }
          }
        } else {
          setMovies((prev) => (pageNum === 1 ? filteredMovies : [...prev, ...filteredMovies]));
        }

        isFirstLoadRef.current = false;
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des films');
      } finally {
        if (pageNum === 1) {
          setLoading(false);
        }
      }
    },
    [selectedGenreId, userId]
  );

  /**
   * Restore user progress on initial load
   */
  useEffect(() => {
    if (!hasLoadedRef.current && movies.length === 0 && userId) {
      hasLoadedRef.current = true;

      const restoreProgress = async () => {
        try {
          // Get swipe history
          const { data: swipeHistory, error: historyError } =
            await databaseService.getSwipeHistory(userId);

          if (historyError) {
            console.error('Error loading progression:', historyError);
            loadMovies(1);
            return;
          }

          const swipeCount = swipeHistory?.length || 0;
          console.log(`📊 Progression: ${swipeCount} swipes detected`);

          // Calculate target page and index
          const moviesPerPage = 20;
          const targetPage = Math.floor(swipeCount / moviesPerPage) + 1;
          const targetIndex = swipeCount;

          console.log(`🔄 Restoring: page ${targetPage}, index ${targetIndex}`);

          // Load all pages up to target
          let allMovies: Movie[] = [];
          for (let p = 1; p <= targetPage; p++) {
            try {
              const result = await tmdbService.getPopularMovies(p);
              allMovies = [...allMovies, ...result.results];
            } catch (err) {
              console.error(`Error loading page ${p}:`, err);
              break;
            }
          }

          setMovies(allMovies);
          setPage(targetPage);

          // Restore index safely
          const safeIndex = Math.min(targetIndex, allMovies.length - 1);
          setCurrentIndex(safeIndex);

          console.log(`✅ Progression restored: ${safeIndex}/${allMovies.length} films`);
          setLoading(false);
        } catch (err: any) {
          console.error('Error restoring progression:', err);
          loadMovies(1);
        }
      };

      restoreProgress();
    } else if (!hasLoadedRef.current && movies.length === 0) {
      // No user logged in: load normally
      hasLoadedRef.current = true;
      loadMovies(1);
    }
  }, [userId, loadMovies]);

  /**
   * Load more when page changes
   */
  useEffect(() => {
    if (page > 1) {
      loadMovies(page);
    }
  }, [page, loadMovies]);

   /**
    * Reset when genre changes
    */
   useEffect(() => {
     setMovies([]);
     setCurrentIndex(0);
     setPage(1);
     hasLoadedRef.current = false;
     isFirstLoadRef.current = true;
     loadMovies(1);
   }, [selectedGenreId, loadMovies]);

  /**
   * Update refs whenever states change
   */
  useEffect(() => {
    moviesRef.current = movies;
  }, [movies]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  return {
    movies,
    currentIndex,
    setCurrentIndex,
    loading,
    error,
    page,
    setPage,
    moviesRef,
    currentIndexRef,
    pageRef,
    loadMovies,
  };
};

