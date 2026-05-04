import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  PanResponder,
  StyleSheet,
  ActivityIndicator,
  PanResponderInstance,
  Dimensions,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MovieCard } from '@/src/components/MovieCard';
import { tmdbService, Movie, Genre } from '@/src/services/tmdb';
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { useThemeToggle } from '@/src/contexts/ThemeContext';
import { Colors } from '@/constants/theme';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';

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
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [genresLoading, setGenresLoading] = useState(true);

  const panResponderRef = useRef<PanResponderInstance | null>(null);
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const moviesRef = useRef<Movie[]>([]);
  const currentIndexRef = useRef(0);
  const pageRef = useRef(1);
  const hasLoadedRef = useRef(false); // Track if we've loaded movies
  const isAnimatingRef = useRef(false); // Track if animation is in progress
  const genresListRef = useRef<FlatList>(null);
  const [genreItemWidths, setGenreItemWidths] = useState<{ [key: string]: number }>({});
  const { user, signOut } = useAuth();
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const insets = useSafeAreaInsets();
  const { toggleTheme } = useThemeToggle();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleMoviePress = () => {
    // Ne pas naviguer pendant une animation de swipe
    if (isAnimatingRef.current) return;
    
    // Utiliser les refs (mises à jour synchronously) au lieu du state (asynchrone)
    const currentMovie = moviesRef.current[currentIndexRef.current];
    if (currentMovie) {
      router.push({
        pathname: '/detail/[movieId]',
        params: { movieId: currentMovie.id.toString() },
      });
    }
  };

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

  // Charger les genres au montage
  useEffect(() => {
    const loadGenres = async () => {
      try {
        setGenresLoading(true);
        const genreList = await tmdbService.getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Error loading genres:', err);
      } finally {
        setGenresLoading(false);
      }
    };
    loadGenres();
  }, []);

  const loadMovies = useCallback(async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }
      setError(null);

      // Récupérer l'historique des swipes pour filtrer les films déjà vus
      let swipedMovieIds: Set<number> = new Set();
      if (user?.id) {
        try {
          const { data: swipeHistory } = await databaseService.getSwipeHistory(user.id);
          swipedMovieIds = new Set(swipeHistory?.map((s) => s.movie_id) || []);
        } catch (err) {
          console.error('Error fetching swipe history for filtering:', err);
        }
      }

      const result = selectedGenreId
        ? await tmdbService.getMoviesByGenre(selectedGenreId, pageNum)
        : await tmdbService.getPopularMovies(pageNum);

      // Filtrer les films déjà swipés
      const filteredMovies = result.results.filter((movie) => !swipedMovieIds.has(movie.id));

      setMovies((prev) => [...prev, ...filteredMovies]);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des films');
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      }
    }
  }, [selectedGenreId, user?.id]);

  // Restaurer la progression de l'utilisateur au montage
  useEffect(() => {
    if (!hasLoadedRef.current && movies.length === 0 && user?.id) {
      hasLoadedRef.current = true;

      const restoreProgress = async () => {
        try {
          // Récupérer l'historique des swipes
          const { data: swipeHistory, error: historyError } = await databaseService.getSwipeHistory(user.id);

          if (historyError) {
            console.error('Erreur lors du chargement de l\'historique:', historyError);
            loadMovies(1);
            return;
          }

          const swipeCount = swipeHistory?.length || 0;
          console.log(`📊 Historique: ${swipeCount} swipes détectés`);

          // Calculer la page et l'index
          const moviesPerPage = 20;
          const targetPage = Math.floor(swipeCount / moviesPerPage) + 1;
          const targetIndex = swipeCount;

          console.log(`🔄 Restauration: page ${targetPage}, index ${targetIndex}`);

          // Charger toutes les pages jusqu'à la cible
          let allMovies: Movie[] = [];
          for (let p = 1; p <= targetPage; p++) {
            try {
              const result = await tmdbService.getPopularMovies(p);
              allMovies = [...allMovies, ...result.results];
            } catch (err) {
              console.error(`Erreur lors du chargement page ${p}:`, err);
              break;
            }
          }

          setMovies(allMovies);
          setPage(targetPage);

          // Restaurer l'index, mais s'assurer qu'il ne dépasse pas la limite
          const safeIndex = Math.min(targetIndex, allMovies.length - 1);
          setCurrentIndex(safeIndex);

          console.log(`✅ Progression restaurée: ${safeIndex}/${allMovies.length} films`);
          setLoading(false);
        } catch (err: any) {
          console.error('Erreur lors de la restauration de la progression:', err);
          loadMovies(1);
        }
      };

      restoreProgress();
    } else if (!hasLoadedRef.current && movies.length === 0) {
      // Si pas d'utilisateur connecté, charger normalement
      hasLoadedRef.current = true;
      loadMovies(1);
    }
  }, [user?.id, loadMovies]);

  // Charger plus de films quand la page change
  useEffect(() => {
    if (page > 1) {
      loadMovies(page);
    }
  }, [page, loadMovies]);

  // Recharger les films quand le genre sélectionné change
  useEffect(() => {
    setMovies([]);
    setCurrentIndex(0);
    setPage(1);
    hasLoadedRef.current = false;
    loadMovies(1);
  }, [selectedGenreId, loadMovies]);

  // Scroll automatiquement vers le genre sélectionné
  useEffect(() => {
    if (genresListRef.current && genres.length > 0) {
      const timeoutId = setTimeout(() => {
        try {
          let targetIndex = 0; // "Tous" est toujours au index 0
          if (selectedGenreId !== null) {
            const foundIndex = genres.findIndex((g) => g.id === selectedGenreId);
            if (foundIndex !== -1) {
              targetIndex = foundIndex + 1; // +1 car on a "Tous" au début
            }
          }

          // Chaque item fait environ 80-90px, avec gap de 8px
          // "Tous" = ~50px, autres genres en moyenne ~70-80px
          const avgItemWidth = 75;
          const gapSize = 8;
          const itemSize = avgItemWidth + gapSize;

          // Calculer l'offset pour centrer l'item
          // On veut que l'item soit au centre, donc offset = position - (screenWidth / 2) + (itemWidth / 2)
          const offset = Math.max(0, targetIndex * itemSize - screenWidth / 2 + avgItemWidth / 2);

          genresListRef.current?.scrollToOffset({
            offset,
            animated: true,
          });
        } catch (error) {
          console.warn('ScrollToOffset error:', error);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedGenreId, genres]);

  // Vérifier si le film actuel a été swipé au retour du détail
  useFocusEffect(
    useCallback(() => {
      const checkAndSkipIfSwiped = async () => {
        if (!user?.id || movies.length === 0) return;

        try {
          const currentMovie = moviesRef.current[currentIndexRef.current];
          if (!currentMovie) return;

          // Récupérer l'historique des swipes
          const { data } = await databaseService.getSwipeHistory(user.id);
          if (!data) return;

          // Vérifier si le film actuel a été swipé
          const isMovieSwiped = data.some((s) => s.movie_id === currentMovie.id);

          if (isMovieSwiped) {
            // Passer au film suivant
            const nextIndex = currentIndexRef.current + 1;
            setCurrentIndex(nextIndex);

            // Vérifier si on doit charger plus de films
            const remainingMovies = moviesRef.current.length - nextIndex;
            if (remainingMovies <= LOAD_MORE_BUFFER) {
              setPage((prev) => prev + 1);
            }
          }
        } catch (err) {
          console.error('Error checking if movie was swiped:', err);
        }
      };

      checkAndSkipIfSwiped();
    }, [user?.id, movies])
  );

  const animateSwipe = useCallback(async (dx: number, action: 'like' | 'reject') => {
    const movie = moviesRef.current[currentIndexRef.current];
    if (!movie) return;

    // Marquer que l'animation est en cours
    isAnimatingRef.current = true;

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
            movie.poster_path ?? undefined
          );
        }
      } catch (err) {
        console.error('Error saving swipe:', err);
      }
    }

    // Animer vers la sortie avec Reanimated
    panX.value = withTiming(dx > 0 ? screenWidth * 2 : -screenWidth * 2, {
      duration: 300,
    });

    // Après l'animation, passer au film suivant
    setTimeout(() => {
      // Reset pour le film suivant
      panX.value = 0;
      panY.value = 0;

      const nextIndex = currentIndexRef.current + 1;
      setCurrentIndex(nextIndex);

      // Vérifier si on doit charger plus de films
      const remainingMovies = moviesRef.current.length - nextIndex;
      console.log(`🎬 Films restants: ${remainingMovies}, prochain index: ${nextIndex}`);

       if (remainingMovies <= LOAD_MORE_BUFFER) {
         console.log(`⬇️ Chargement de la page ${pageRef.current + 1}...`);
         setPage((prev) => prev + 1);
       }

       // Marquer que l'animation est terminée avec un petit délai pour permettre aux states de se mettre à jour
       setTimeout(() => {
         isAnimatingRef.current = false;
       }, 50);
    }, 300);
  }, [user?.id, panX, panY]);

    useEffect(() => {
      panResponderRef.current = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (evt, { dx }) => {
          return Math.abs(dx) > 5;
        },
        onPanResponderMove: (evt, { dx }) => {
          panX.value = dx;
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { dx, vx } = gestureState;

          if (dx > SWIPE_THRESHOLD || vx > 0.5) {
            animateSwipe(dx, 'like');
          } else if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
            animateSwipe(dx, 'reject');
          } else if (Math.abs(dx) < 5 && Math.abs(vx) < 0.1) {
            // Simple tap - ouvrir le détail
            handleMoviePress();
          } else {
            // Retour à la position normale avec spring
            panX.value = withSpring(0, {
              damping: 10,
              mass: 1,
              stiffness: 100,
            });
            panY.value = withSpring(0, {
              damping: 10,
              mass: 1,
              stiffness: 100,
            });
          }
        },
      });
    }, [animateSwipe, handleMoviePress, panX, panY]);

  // Créer tous les animated styles AVANT toute condition de rendu
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: panX.value },
      { translateY: panY.value },
      {
        rotateZ: `${interpolate(
          panX.value,
          [-screenWidth / 2, 0, screenWidth / 2],
          [-15, 0, 15],
          Extrapolate.CLAMP
        )}deg`,
      },
    ],
  }));

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      panX.value,
      [0, SWIPE_THRESHOLD, screenWidth / 2],
      [0, 0.3, 0.7],
      Extrapolate.CLAMP
    ),
  }));

  const rejectOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      panX.value,
      [-screenWidth / 2, -SWIPE_THRESHOLD, 0],
      [0.7, 0.3, 0],
      Extrapolate.CLAMP
    ),
  }));

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
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
        },
      ]}
    >
      {/* Theme toggle button - top left with safe area */}
      <TouchableOpacity
        style={[
          styles.themeButton,
          {
            top: insets.top + 12,
            left: 12,
            backgroundColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          },
        ]}
        onPress={toggleTheme}
      >
        <Ionicons
          name={colorScheme === 'dark' ? 'sunny' : 'moon'}
          size={24}
          color={colorScheme === 'dark' ? '#000000' : '#FFFFFF'}
        />
      </TouchableOpacity>

      {/* Logout button - top right with safe area */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            top: insets.top + 12,
            right: 12,
            backgroundColor: '#FF3B30',
          },
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="power" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Fond progressif like (vert) */}
      <Animated.View
        style={[
          styles.feedbackBackgroundLike,
          likeOpacity,
        ]}
        pointerEvents="none"
      />

      {/* Fond progressif reject (rouge) */}
      <Animated.View
        style={[
          styles.feedbackBackgroundReject,
          rejectOpacity,
        ]}
        pointerEvents="none"
      />

      {/* Card avec gestes */}
      <Animated.View
        style={[
          styles.cardContainer,
          cardAnimatedStyle,
        ]}
        {...panResponderRef.current?.panHandlers}
      >
        <MovieCard movie={currentMovie} showOverlay={true} />
      </Animated.View>

      {/* Genres Filter */}
      {!genresLoading && genres.length > 0 && (
        <View style={styles.genresSection}>
          <FlatList
            ref={genresListRef}
            data={[{ id: 'all', name: 'Tous' }, ...genres]}
            renderItem={({ item }) => {
              const isAll = item.id === 'all';
              const genreId = isAll ? null : item.id;
              const isActive = selectedGenreId === genreId;

              return (
                <TouchableOpacity
                  style={[
                    styles.genreChip,
                    isActive && styles.genreChipActive,
                    {
                      backgroundColor: isActive
                        ? (colorScheme === 'dark' ? '#0a7ea4' : '#0a7ea4')
                        : (colorScheme === 'dark' ? '#333' : '#f0f0f0'),
                    },
                  ]}
                  onPress={() => setSelectedGenreId(genreId)}
                >
                  <ThemedText
                    style={[
                      styles.genreChipText,
                      {
                        color: isActive ? '#fff' : (colorScheme === 'dark' ? '#ccc' : '#666'),
                      },
                    ]}
                  >
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genresScrollContainer}
            scrollEventThrottle={16}
            onScrollToIndexFailed={(error) => {
              console.warn('ScrollToIndex failed:', error);
            }}
          />
        </View>
      )}
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
  logoutButton: {
    position: 'absolute',
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  themeButton: {
    position: 'absolute',
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  genresSection: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
  },
  genresScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreChipActive: {
    backgroundColor: '#0a7ea4',
  },
  genreChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});




