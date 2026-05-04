// Types pour les films TMDB
export type Movie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

export type MovieDetail = Movie & {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
    }>;
  };
  videos?: {
    results: Array<{
      id: string;
      key: string;
      type: string;
      site: string;
    }>;
  };
};

export type SearchResult = {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
};

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Cache simple pour réduire les appels API
const movieCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 heure

export const tmdbService = {
  /**
   * Fetch films populaires avec pagination
   */
  getPopularMovies: async (page: number = 1): Promise<SearchResult> => {
    const cacheKey = `popular_${page}`;
    const cached = movieCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=fr-FR`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: SearchResult = await response.json();

      // Cache le résultat
      movieCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  /**
   * Chercher des films par keyword avec debounce
   */
  searchMovies: async (query: string, page: number = 1): Promise<SearchResult> => {
    if (!query.trim()) {
      return { results: [], page: 1, total_pages: 0, total_results: 0 };
    }

    const cacheKey = `search_${query}_${page}`;
    const cached = movieCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodedQuery}&page=${page}&language=fr-FR`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: SearchResult = await response.json();

      // Cache le résultat
      movieCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  /**
   * Récupérer les détails complets d'un film avec casting et vidéos
   */
  getMovieDetail: async (movieId: number): Promise<MovieDetail> => {
    const cacheKey = `detail_${movieId}`;
    const cached = movieCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits,videos`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: MovieDetail = await response.json();

      // Cache le résultat
      movieCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Error fetching movie detail:', error);
      throw error;
    }
  },

  /**
   * Obtenir l'URL complète du poster
   */
  getPosterUrl: (posterPath: string | null): string | null => {
    if (!posterPath) return null;
    return `${IMAGE_BASE_URL}${posterPath}`;
  },

  /**
   * Obtenir l'URL YouTube de la bande-annonce
   */
  getYoutubeTrailerUrl: (movieDetail: MovieDetail): string | null => {
    if (!movieDetail.videos?.results) return null;

    const trailer = movieDetail.videos.results.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    );

    if (!trailer) return null;
    return `https://www.youtube.com/watch?v=${trailer.key}`;
  },

  /**
   * Récupérer top 5 acteurs d'un film
   */
  getTopCast: (movieDetail: MovieDetail): MovieDetail['credits']['cast'] => {
    if (!movieDetail.credits?.cast) return [];
    return movieDetail.credits.cast.slice(0, 5);
  },

  /**
   * Nettoyer le cache (utile pour tests ou forcer refresh)
   */
  clearCache: () => {
    movieCache.clear();
  },
};

