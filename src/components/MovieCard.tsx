import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Movie, tmdbService } from '@/src/services/tmdb';
import { useGetYear } from '@/src/hooks/useFormatting';

type MovieCardProps = {
  movie: Movie;
  showOverlay?: boolean;
  onPress?: () => void;
};

/**
 * Composant pour afficher une carte film avec poster, titre, année et note
 * Réutilisable pour explore, matches, search
 */
export function MovieCard({ movie, showOverlay = true, onPress }: MovieCardProps) {
  const year = useGetYear(movie.release_date);
  const posterUrl = tmdbService.getPosterUrl(movie.poster_path);
  const rating = Math.round(movie.vote_average * 10) / 10;

  if (!posterUrl) {
    // Fallback si pas de poster
    return (
      <ThemedView style={[styles.card, styles.noImageContainer]}>
        <ThemedText style={{ textAlign: 'center' }}>{movie.title}</ThemedText>
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
      {showOverlay && (
        <View style={styles.infoSection}>
          {/* Titre */}
          <ThemedText
            style={[styles.title, { fontWeight: 'bold' }]}
            numberOfLines={2}
          >
            {movie.title}
          </ThemedText>

          {/* Année et Note */}
          <View style={styles.metaContainer}>
            {year && <ThemedText style={styles.meta}>{year}</ThemedText>}
            <View style={styles.ratingBadge}>
              <ThemedText style={styles.ratingText}>⭐ {rating}</ThemedText>
            </View>
          </View>
        </View>
      )}
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
    flex: 0.93,
    width: '100%',
    backgroundColor: '#ccc',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  infoSection: {
    flex: 0.07,
    padding: 2,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
    gap: 0,
  },
  title: {
    fontSize: 12,
    lineHeight: 14,
    color: '#fff',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontSize: 10,
    color: '#aaa',
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
