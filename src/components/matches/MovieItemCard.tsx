import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { MatchMovieCard } from './MatchMovieCard';
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
      <MatchMovieCard movie={movie} onPress={handlePress} />
    </View>
  );
};

