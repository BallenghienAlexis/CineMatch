import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LikedMovie } from '@/src/services/supabase';
import { tmdbService } from '@/src/services/tmdb';

type MatchMovieCardProps = {
  movie: LikedMovie;
  onPress?: () => void;
};

/**
 * Composant spécifique pour afficher une carte film dans la grille des films aimés
 * Design optimisé pour la grille avec zone d'info plus grande
 */
export function MatchMovieCard({ movie, onPress }: MatchMovieCardProps) {
  const posterUrl = tmdbService.getPosterUrl(movie.poster_path || undefined);
  const rating = Math.round((movie.movie_rating || 0) * 10) / 10;

  if (!posterUrl) {
    return (
      <ThemedView style={[styles.card, styles.noImageContainer]}>
        <ThemedText style={{ textAlign: 'center', fontSize: 12 }}>
          {movie.movie_title}
        </ThemedText>
      </ThemedView>
    );
  }

  const cardContent = (
    <ThemedView style={styles.card}>
      {/* AFFICHE EN TOP */}
      <Image
        source={{ uri: posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />

      {/* ESPACE INFO EN BAS */}
      <View style={styles.infoSection}>
        {/* Titre */}
        <ThemedText
          style={[styles.title, { fontWeight: 'bold' }]}
          numberOfLines={2}
        >
          {movie.movie_title}
        </ThemedText>

        {/* Note */}
        <View style={styles.ratingBadge}>
          <ThemedText style={styles.ratingText}>⭐ {rating}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{cardContent}</TouchableOpacity>;
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    flexDirection: 'column',
  },
  poster: {
    flex: 0.75,
    width: '100%',
    backgroundColor: '#ccc',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  infoSection: {
    flex: 0.25,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
    gap: 6,
  },
  title: {
    fontSize: 13,
    lineHeight: 16,
    color: '#fff',
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

