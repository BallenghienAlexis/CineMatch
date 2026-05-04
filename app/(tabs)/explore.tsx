import React, { useEffect, useRef, useState } from 'react';
import {
  PanResponder,
  View,
  StyleSheet,
  ActivityIndicator,
  PanResponderInstance,
  Animated,
  Dimensions,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MovieCard } from '@/src/components/MovieCard';
import { tmdbService, Movie } from '@/src/services/tmdb';
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SWIPE_THRESHOLD = 100;
const { width: screenWidth } = Dimensions.get('window');

export default function ExploreScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [swipeAction, setSwipeAction] = useState<'like' | 'reject' | null>(null);

  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;

        if (dx > SWIPE_THRESHOLD) {
          animateSwipe(dx, 'like');
        } else if (dx < -SWIPE_THRESHOLD) {
          animateSwipe(dx, 'reject');
        } else {
          // Retour à la position normale
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
          setSwipeAction(null);
        }
      },
    });
  }, [pan, opacity]);

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
    } finally {
      setLoading(false);
    }
  };

  const animateSwipe = async (dx: number, action: 'like' | 'reject') => {
    setSwipeAction(action);

    const movie = movies[currentIndex];
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

    // Animer vers la sortie
    Animated.timing(pan, {
      toValue: { x: dx > 0 ? screenWidth * 1.5 : -screenWidth * 1.5, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Reset pour le film suivant
      pan.setValue({ x: 0, y: 0 });
      setSwipeAction(null);

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= movies.length - 5) {
        setPage((prev) => prev + 1);
        loadMovies();
      }
    });
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
      <View style={styles.header}>
        <ThemedText type="title">Découvrir</ThemedText>
        <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
          {currentIndex + 1} / {movies.length}
        </ThemedText>
      </View>

      <View style={styles.feedbackContainer}>
        {/* Fond vert qui apparaît si swipe droite (like) */}
        {swipeAction === 'like' && (
          <View style={styles.feedbackLike}>
            <ThemedText style={styles.feedbackText}>❤️ AIMER</ThemedText>
          </View>
        )}

        {/* Fond rouge qui apparaît si swipe gauche (reject) */}
        {swipeAction === 'reject' && (
          <View style={styles.feedbackReject}>
            <ThemedText style={styles.feedbackText}>✕ REJETER</ThemedText>
          </View>
        )}

        <Animated.View
          style={[
            styles.gestureContainer,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
              ],
            },
          ]}
          {...panResponderRef.current?.panHandlers}
        >
          <MovieCard movie={currentMovie} showOverlay={true} />
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: 'transparent',
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
  feedbackContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gestureContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  feedbackLike: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 12,
  },
  feedbackReject: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 67, 54, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 12,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

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
      <View style={styles.header}>
        <ThemedText type="title">Découvrir</ThemedText>
        <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
          {currentIndex + 1} / {movies.length}
        </ThemedText>
      </View>

      <View style={styles.feedbackContainer}>
        {/* Fond vert qui apparaît si swipe droite (like) */}
        {swipeAction === 'like' && (
          <View style={styles.feedbackLike}>
            <ThemedText style={styles.feedbackText}>❤️ AIMER</ThemedText>
          </View>
        )}

        {/* Fond rouge qui apparaît si swipe gauche (reject) */}
        {swipeAction === 'reject' && (
          <View style={styles.feedbackReject}>
            <ThemedText style={styles.feedbackText}>✕ REJETER</ThemedText>
          </View>
        )}

        <Animated.View
          style={[
            styles.gestureContainer,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
              ],
            },
          ]}
          {...panResponderRef.current?.panHandlers}
        >
          <MovieCard movie={currentMovie} showOverlay={true} />
        </Animated.View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: 'transparent',
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
  feedbackContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gestureContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  feedbackLike: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 12,
  },
  feedbackReject: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 67, 54, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 12,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});


