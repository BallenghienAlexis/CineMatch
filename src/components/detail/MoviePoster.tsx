import React from 'react';
import { Image, View } from 'react-native';
import { tmdbService } from '@/src/services/tmdb';
import { detailStyles as styles } from '@/src/styles/detail.styles';

interface MoviePosterProps {
  posterPath: string | null;
  title: string;
}

/**
 * Displays the movie poster image
 */
export const MoviePoster: React.FC<MoviePosterProps> = ({ posterPath, title }) => {
  if (!posterPath) return null;

  const posterUrl = tmdbService.getPosterUrl(posterPath);

  return (
    <Image
      source={{ uri: posterUrl }}
      style={styles.poster}
      resizeMode="cover"
      accessibilityLabel={`Poster de ${title}`}
    />
  );
};

