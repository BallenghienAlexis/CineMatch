import { useEffect, useState } from 'react';
import { tmdbService, MovieDetail } from '@/src/services/tmdb';
import { databaseService } from '@/src/services/database';

type UserStatus = 'liked' | 'rejected' | 'none';

/**
 * Custom hook for managing movie detail data and user interactions
 */
export const useMovieDetail = (movieId: string | string[] | undefined, userId: string | undefined) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>('none');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load movie details
  useEffect(() => {
    loadMovieDetail();
  }, [movieId]);

  // Load user status
  useEffect(() => {
    loadUserStatus();
  }, [movieId, userId]);

  const loadMovieDetail = async () => {
    if (!movieId) {
      setError('Film non trouvé');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const id = parseInt(movieId as string, 10);
      const data = await tmdbService.getMovieDetail(id);
      setMovie(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du film');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStatus = async () => {
    if (!userId || !movieId) return;

    try {
      const movieIdNum = parseInt(movieId as string, 10);
      const { data, error } = await databaseService.getSwipeHistory(userId);

      if (error || !data) {
        setUserStatus('none');
        return;
      }

      const swipe = data.find((s) => s.movie_id === movieIdNum);
      if (swipe) {
        setUserStatus(swipe.action === 'like' ? 'liked' : 'rejected');
      } else {
        setUserStatus('none');
      }
    } catch (err) {
      console.error('Error loading user status:', err);
      setUserStatus('none');
    }
  };

  const updateUserStatus = async (action: 'like' | 'reject') => {
    if (!userId || !movie) return;

    setUpdatingStatus(true);
    try {
      await databaseService.addSwipeHistory(userId, movie.id, movie.title, action);

      if (action === 'like') {
        await databaseService.addLikedMovie(
          userId,
          movie.id,
          movie.title,
          movie.vote_average,
          movie.poster_path ?? undefined
        );
        setUserStatus('liked');
      } else {
        await databaseService.removeLikedMovie(userId, movie.id);
        setUserStatus('rejected');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return {
    movie,
    loading,
    error,
    userStatus,
    updatingStatus,
    updateUserStatus,
  };
};


