import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { tmdbService, MovieDetail } from '@/src/services/tmdb';
import { detailStyles as styles } from '@/src/styles/detail.styles';


interface TrailerButtonProps {
  movie: MovieDetail;
  colorScheme: 'light' | 'dark';
}

/**
 * Displays trailer button and opens YouTube link
 */
export const TrailerButton: React.FC<TrailerButtonProps> = ({ movie, colorScheme }) => {
  const trailerUrl = tmdbService.getYoutubeTrailerUrl(movie);

  if (!trailerUrl) return null;

  const handleOpenTrailer = async () => {
    const canOpen = await Linking.canOpenURL(trailerUrl);
    if (canOpen) {
      Linking.openURL(trailerUrl);
    }
  };

  return (
    <>
      <View
        style={[
          styles.divider,
          { backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' },
        ]}
      />
      <TouchableOpacity
        style={[
          styles.trailerButton,
          { backgroundColor: colorScheme === 'dark' ? '#1a7ea4' : '#0a7ea4' },
        ]}
        onPress={handleOpenTrailer}
      >
        <Ionicons name="play" size={20} color="#fff" />
        <ThemedText style={styles.trailerButtonText}>Voir la bande-annonce</ThemedText>
      </TouchableOpacity>
    </>
  );
};

