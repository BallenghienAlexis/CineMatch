import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Movie } from '@/src/services/tmdb';
import { tmdbService } from '@/src/services/tmdb';
import { useGetYear } from '@/src/hooks/useFormatting';

type MovieCardProps = {
  movie: Movie;
  showOverlay?: boolean;
};

/**
 * Composant pour afficher une carte film avec poster, titre, année et note
 * Réutilisable pour explore, matches, search
 */
export function MovieCard({ movie, showOverlay = true }: MovieCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
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

  return (
    <ThemedView style={styles.card}>
      <Image
        source={{ uri: posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />

      {showOverlay && (
        <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
          <View style={styles.infoContainer}>
            {/* Titre */}
            <ThemedText
              style={[
                styles.title,
                { color: '#fff', fontWeight: 'bold' },
              ]}
              numberOfLines={2}
            >
              {movie.title}
            </ThemedText>

            {/* Année et Note */}
            <View style={styles.metaContainer}>
              {year && (
                <ThemedText style={[styles.meta, { color: '#ddd' }]}>
                  {year}
                </ThemedText>
              )}
              <View style={styles.ratingBadge}>
                <ThemedText style={styles.ratingText}>
                  ⭐ {rating}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 2 / 3, // Ratio standart film
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  poster: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 12,
  },
  infoContainer: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  meta: {
    fontSize: 14,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

