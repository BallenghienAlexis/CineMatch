import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { MovieCard } from '@/src/components/MovieCard';
import { LikedMovie } from '@/src/services/supabase';
import { matchesStyles as styles } from '@/src/styles/matches.styles';

interface MovieItemCardProps {
  movie: LikedMovie;
}

/**
 * Single movie card for liked movies grid
 */
export const MovieItemCard: React.FC<MovieItemCardProps> = ({ movie }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/detail/[movieId]',
      params: { movieId: movie.movie_id.toString() },
    });
  };

  return (
    <View style={styles.movieContainer}>
      <MovieCard
        movie={{
          id: movie.movie_id,
          title: movie.movie_title,
          poster_path: movie.poster_path || '/w342/film-placeholder.jpg',
          release_date: '',
          vote_average: movie.movie_rating || 0,
          overview: '',
          genre_ids: [],
        }}
        showOverlay={true}
        onPress={handlePress}
      />
    </View>
  );
};

