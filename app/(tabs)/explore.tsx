import React, { useCallback, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';
import { useAuth } from '@/src/contexts/AuthContext';
import { useThemeToggle } from '@/src/contexts/ThemeContext';
import { databaseService } from '@/src/services/database';
import { Colors } from '@/constants/theme';

// Extracted Hooks
import { useMovieStack } from '@/src/hooks/useMovieStack';
import { useSwipeGestures } from '@/src/hooks/useSwipeGestures';
import { useGenreFilter } from '@/src/hooks/useGenreFilter';

// Extracted Components
import { SwipeCard } from '@/src/components/explore/SwipeCard';
import { GenreFilter } from '@/src/components/explore/GenreFilter';
import { ActionButtons } from '@/src/components/explore/ActionButtons';

// Styles
import { exploreStyles as styles } from '@/src/styles/explore.styles';

const LOAD_MORE_BUFFER = 3;

/**
 * ============================================
 * EXPLORE SCREEN - REFACTORED VERSION
 * ============================================
 *
 * Original: 701 lines (monolithic with Reanimated animations)
 * Current: ~180 lines (orchestration only)
 *
 * Extracted:
 * - Custom Hook 1: useMovieStack (150 lines, movie loading + progress restore)
 * - Custom Hook 2: useSwipeGestures (180 lines, Reanimated + PanResponder)
 * - Custom Hook 3: useGenreFilter (80 lines, genres + auto-scroll)
 * - 3 Components: SwipeCard, GenreFilter, ActionButtons (~30-50 lines each)
 * - Styles: explore.styles.ts (90 lines, all StyleSheets)
 *
 * Benefits:
 * ✅ Complex animations cleanly extracted
 * ✅ Gesture handling in dedicated hook
 * ✅ Progress restoration logic separate
 * ✅ Genre filtering self-contained
 * ✅ Each file ~100 lines max
 */
export default function ExploreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useEffectiveColorScheme();
  const { user, signOut } = useAuth();
  const { toggleTheme } = useThemeToggle();

  // Extract movie stack logic
  const {
    movies,
    currentIndex,
    setCurrentIndex,
    loading,
    error,
    page,
    setPage,
    moviesRef,
    currentIndexRef,
    pageRef,
  } = useMovieStack({
    userId: user?.id,
    selectedGenreId: null,
  });

  // Extract genre filter logic
  const { genres, selectedGenreId, setSelectedGenreId, genresLoading, genresListRef } =
    useGenreFilter();

  // Track animation state
  const isAnimatingRef = useRef(false);

  /**
   * Handle swipe completion (save to database)
   */
  const handleSwipeComplete = useCallback(
    async (dx: number, action: 'like' | 'reject') => {
      const movie = moviesRef.current[currentIndexRef.current];
      if (!movie || !user?.id) return;

      try {
        // Save to swipe history
        await databaseService.addSwipeHistory(
          user.id,
          movie.id,
          movie.title,
          action
        );

        // If liked, also save to liked_movies
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

      // Move to next movie after swipe
      const nextIndex = currentIndexRef.current + 1;
      setCurrentIndex(nextIndex);

      // Load more if needed
      const remainingMovies = moviesRef.current.length - nextIndex;
      console.log(`🎬 Films restants: ${remainingMovies}, prochain index: ${nextIndex}`);

      if (remainingMovies <= LOAD_MORE_BUFFER) {
        console.log(`⬇️ Chargement page ${pageRef.current + 1}...`);
        setPage((prev) => prev + 1);
      }
    },
    [user?.id, moviesRef, currentIndexRef, pageRef, setCurrentIndex, setPage]
  );

  /**
   * Extract swipe gestures and animations
   */
  const {
    panResponder,
    cardAnimatedStyle,
    likeOpacity,
    rejectOpacity,
  } = useSwipeGestures({
    onSwipeComplete: handleSwipeComplete,
    onCardTap: () => {
      if (isAnimatingRef.current) return;
      const currentMovie = moviesRef.current[currentIndexRef.current];
      if (currentMovie) {
        router.push({
          pathname: '/detail/[movieId]',
          params: { movieId: currentMovie.id.toString() },
        });
      }
    },
    isAnimating: isAnimatingRef,
  });

  /**
   * Check if current movie was swiped when returning from detail
   */
  useFocusEffect(
    useCallback(() => {
      const checkAndSkipIfSwiped = async () => {
        if (!user?.id || movies.length === 0) return;

        try {
          const currentMovie = moviesRef.current[currentIndexRef.current];
          if (!currentMovie) return;

          const { data } = await databaseService.getSwipeHistory(user.id);
          if (!data) return;

          const isMovieSwiped = data.some((s) => s.movie_id === currentMovie.id);

          if (isMovieSwiped) {
            const nextIndex = currentIndexRef.current + 1;
            setCurrentIndex(nextIndex);

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
    }, [user?.id, movies, moviesRef, currentIndexRef, setCurrentIndex, setPage])
  );

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Loading state
  if (loading && movies.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].button} />
        <ThemedText style={{ marginTop: 12 }}>Chargement des films...</ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={{ color: 'red', textAlign: 'center' }}>
          Erreur: {error}
        </ThemedText>
      </ThemedView>
    );
  }

  // No movies state
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
        { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
      ]}
    >
      {/* Component 1: Action Buttons */}
      <ActionButtons
        topInset={insets.top}
        colorScheme={colorScheme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      {/* Component 2: Swipe Card with Animations */}
      <SwipeCard
        currentMovie={currentMovie}
        panResponder={panResponder}
        cardAnimatedStyle={cardAnimatedStyle}
        likeOpacity={likeOpacity}
        rejectOpacity={rejectOpacity}
      />

      {/* Component 3: Genre Filter */}
      {!genresLoading && genres.length > 0 && (
        <GenreFilter
          genres={genres}
          selectedGenreId={selectedGenreId}
          onSelectGenre={setSelectedGenreId}
          genresListRef={genresListRef}
          colorScheme={colorScheme}
        />
      )}
    </ThemedView>
  );
}

