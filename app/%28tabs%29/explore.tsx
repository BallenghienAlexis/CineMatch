import React, { useEffect, useRef, useState } from 'react';
import {
  PanResponder,
  View,
  StyleSheet,
  ActivityIndicator,
  PanResponderInstance,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MovieCard } from '@/src/components/MovieCard';
import { tmdbService, Movie, SearchResult } from '@/src/services/tmdb';
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SWIPE_THRESHOLD = 50; // pixels minimum pour valider le swipe

export default function ExploreScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

  // Initialiser PanResponder pour les gestes de swipe
  useEffect(() => {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;

        // Swipe droite = like
        if (dx > SWIPE_THRESHOLD) {
          handleSwipe('like');
        }
        // Swipe gauche = reject
        else if (dx < -SWIPE_THRESHOLD) {
          handleSwipe('reject');
        }
      },
    });
  }, []);

  // Charger les films au démarrage
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await tmdbService.getPopularMovies(page);
      setMovies((prev) => [...prev, ...result.results]);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des films');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: 'like' | 'reject') => {
    if (currentIndex >= movies.length) return;

    const movie = movies[currentIndex];

    // Persister le swipe dans la base de données
    if (user?.id) {
      try {
        await databaseService.addSwipeHistory(
          user.id,
          movie.id,
          movie.title,
          action
        );
      } catch (err) {
        console.error('Error saving swipe:', err);
      }
    }

    // Passer au film suivant
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // Charger plus de films si on approche de la fin
    if (nextIndex >= movies.length - 5) {
      setPage((prev) => prev + 1);
      loadMovies();
    }
  };

  if (loading && movies.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].button} />
        <ThemedText style={{ marginTop: 12 }}>Chargement des films...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={{ color: 'red', textAlign: 'center' }}>
          Erreur: {error}
        </ThemedText>
      </ThemedView>
    );
  }

  if (movies.length === 0 || currentIndex >= movies.length) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={{ textAlign: 'center', fontSize: 18 }}>
          Aucun film disponible pour le moment 🎬
        </ThemedText>
      </ThemedView>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <ThemedView style={styles.container}>
      {/* Titre */}
      <View style={styles.header}>
        <ThemedText type="title">Découvrir</ThemedText>
        <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
          {currentIndex + 1} / {movies.length}
        </ThemedText>
      </View>

      {/* Gesture Container */}
      <View
        style={styles.gestureContainer}
        {...panResponderRef.current?.panHandlers}
      >
        <MovieCard movie={currentMovie} showOverlay={true} />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <ThemedText style={{ fontSize: 12, textAlign: 'center', opacity: 0.6 }}>
          ← Glisser à gauche pour rejeter | Glisser à droite pour aimer →
        </ThemedText>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBadge}>
          <ThemedText style={{ fontSize: 12 }}>❌ Rejeter</ThemedText>
        </View>
        <View style={styles.statBadge}>
          <ThemedText style={{ fontSize: 12 }}>❤️ Aimer</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    marginTop: 8,
    gap: 4,
  },
  gestureContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  instructions: {
    paddingVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
  },
  statBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

