import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
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
    <View style={styles.poster}>
      <Image
        source={{ uri: posterUrl } as any}
        style={localStyles.image}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

