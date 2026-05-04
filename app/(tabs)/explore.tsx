import React, { useEffect, useRef, useState, useCallback } from 'react';
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
const LOAD_MORE_BUFFER = 3; // Charger les films 3 avant la fin

export default function ExploreScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const moviesRef = useRef<Movie[]>([]);
  const currentIndexRef = useRef(0);
  const pageRef = useRef(1);
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

  // Mettre à jour les refs quand les states changent
  useEffect(() => {
    moviesRef.current = movies;
  }, [movies]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const loadMovies = useCallback(async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      const result = await tmdbService.getPopularMovies(pageNum);
      setMovies((prev) => [...prev, ...result.results]);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des films');
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, []);

  // Charger les films au montage (une seule fois)
  useEffect(() => {
    loadMovies(1);
  }, []); // Dépendance vide = une seule execution

  // Charger plus de films quand la page change
  useEffect(() => {
    if (page > 1) {
      loadMovies(page);
    }
  }, [page]);

  // Calculer l'angle de rotation en fonction du swipe (en degrés)
  const rotationValue = pan.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const animateSwipe = useCallback(async (dx: number, action: 'like' | 'reject') => {
    const movie = moviesRef.current[currentIndexRef.current];
    if (!movie) return;

    if (user?.id) {
      try {
        // Enregistrer dans swipe_history
        await databaseService.addSwipeHistory(
          user.id,
          movie.id,
          movie.title,
          action
        );

        // Si c'est un "like", ajouter aussi à liked_movies
        if (action === 'like') {
          await databaseService.addLikedMovie(
            user.id,
            movie.id,
            movie.title,
            movie.vote_average,
            movie.poster_path
          );
        }
      } catch (err) {
        console.error('Error saving swipe:', err);
      }
    }

    // Animer vers la sortie
    Animated.timing(pan, {
      toValue: { x: dx > 0 ? screenWidth * 2 : -screenWidth * 2, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Reset pour le film suivant
      pan.setValue({ x: 0, y: 0 });

      const nextIndex = currentIndexRef.current + 1;
      setCurrentIndex(nextIndex);

      // Vérifier si on doit charger plus de films
      const remainingMovies = moviesRef.current.length - nextIndex;
      console.log(`🎬 Films restants: ${remainingMovies}, prochain index: ${nextIndex}`);

      if (remainingMovies <= LOAD_MORE_BUFFER) {
        console.log(`⬇️ Chargement de la page ${pageRef.current + 1}...`);
        setPage((prev) => prev + 1);
      }
    });
  }, [user?.id, pan]);

  useEffect(() => {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, { dx, dy }) => {
        return Math.abs(dx) > 5;
      },
      onPanResponderMove: (evt, { dx, dy }) => {
        pan.x.setValue(dx);
        pan.y.setValue(dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;

        if (dx > SWIPE_THRESHOLD || vx > 0.5) {
          animateSwipe(dx, 'like');
        } else if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
          animateSwipe(dx, 'reject');
        } else {
          // Retour à la position normale
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }, [animateSwipe]);


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
      {/* Fond progressif like (vert) */}
      <Animated.View
        style={[
          styles.feedbackBackgroundLike,
          {
            opacity: pan.x.interpolate({
              inputRange: [0, SWIPE_THRESHOLD, screenWidth / 2],
              outputRange: [0, 0.3, 0.7],
            }),
          },
        ]}
        pointerEvents="none"
      />

      {/* Fond progressif reject (rouge) */}
      <Animated.View
        style={[
          styles.feedbackBackgroundReject,
          {
            opacity: pan.x.interpolate({
              inputRange: [-screenWidth / 2, -SWIPE_THRESHOLD, 0],
              outputRange: [0.7, 0.3, 0],
            }),
          },
        ]}
        pointerEvents="none"
      />

      {/* Card avec gestes */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotateZ: rotationValue },
            ],
          },
        ]}
        {...panResponderRef.current?.panHandlers}
      >
        <MovieCard movie={currentMovie} showOverlay={true} />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  counter: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardContainer: {
    width: screenWidth * 0.9,
    height: screenWidth * 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  feedbackBackgroundLike: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.4)',
    zIndex: 5,
  },
  feedbackBackgroundReject: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 67, 54, 0.4)',
    zIndex: 5,
  },
});




