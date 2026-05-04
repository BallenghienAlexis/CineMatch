import { LikedMovie, SwipeHistory, supabase } from './supabase';

export const databaseService = {
  getLikedMovies: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('liked_movies')
        .select('*')
        .eq('user_id', userId)
        .order('movie_rating', { ascending: false });

      if (error) throw error;
      return { data: (data as LikedMovie[]) || [], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  addLikedMovie: async (
    userId: string,
    movieId: number,
    movieTitle: string,
    movieRating: number,
    posterPath?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('liked_movies')
        .insert({
          user_id: userId,
          movie_id: movieId,
          movie_title: movieTitle,
          movie_rating: movieRating,
          poster_path: posterPath || null,
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as LikedMovie, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  removeLikedMovie: async (userId: string, movieId: number) => {
    try {
      const { error } = await supabase
        .from('liked_movies')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  addSwipeHistory: async (
    userId: string,
    movieId: number,
    movieTitle: string,
    action: 'like' | 'reject'
  ) => {
    try {
      const { data, error } = await supabase
        .from('swipe_history')
        .insert({
          user_id: userId,
          movie_id: movieId,
          movie_title: movieTitle,
          action,
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as SwipeHistory, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  getSwipeHistory: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('swipe_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: (data as SwipeHistory[]) || [], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },
};

