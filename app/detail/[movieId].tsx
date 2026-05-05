import React from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';
import { useAuth } from '@/src/contexts/AuthContext';
import { useMovieDetail } from '@/src/hooks/useMovieDetail';

// Extracted Components (Refactored - Each ~50-80 lines)
import { MoviePoster } from '@/src/components/detail/MoviePoster';
import { MovieHeader } from '@/src/components/detail/MovieHeader';
import { MovieGenres } from '@/src/components/detail/MovieGenres';
import { MovieSynopsis } from '@/src/components/detail/MovieSynopsis';
import { TrailerButton } from '@/src/components/detail/TrailerButton';
import { CastingSection } from '@/src/components/detail/CastingSection';
import { UserStatusPanel } from '@/src/components/detail/UserStatusPanel';

// Styles (Extracted to separate file - 190 lines)
import { detailStyles as styles } from '@/src/styles/detail.styles';

/**
 * ============================================
 * DETAIL SCREEN - REFACTORED VERSION
 * ============================================
 *
 * Original: 704 lines (monolithic)
 * Current: ~140 lines (orchestration only)
 *
 * Extracted:
 * - Custom Hook: useMovieDetail (93 lines, all logic)
 * - 7 Components: ~50-130 lines each (reusable UI)
 * - Styles: detail.styles.ts (190 lines, all StyleSheets)
 *
 * Benefits:
 * ✅ Better reusability (MovieGenres, TrailerButton shareable)
 * ✅ Easier testing (logic in hook, UI in components)
 * ✅ Better maintainability (each file ~100 lines max)
 * ✅ Performance: memoization ready
 */
export default function DetailScreen() {
  // Get params from route
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useEffectiveColorScheme();
  const { user } = useAuth();

  // All logic extracted to custom hook
  const { movie, loading, error, userStatus, updatingStatus, updateUserStatus } =
    useMovieDetail(movieId, user?.id);

  // LOADING STATE
  if (loading) {
    return (
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
        ]}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </View>
      </ThemedView>
    );
  }

  // ERROR STATE
  if (error || !movie) {
    return (
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.centerContainer}>
          <ThemedText style={{ color: 'red', textAlign: 'center' }}>
            {error || 'Film non trouvé'}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Extract year from release_date
  const year = movie.release_date?.split('-')[0] || 'N/A';

  // SUCCESS STATE - Render all components
  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
      ]}
    >
      {/* Floating Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        accessibilityLabel="Retour"
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Component 1: Movie Poster */}
        <MoviePoster posterPath={movie.poster_path} title={movie.title} />

        <View style={styles.infoContainer}>
          {/* Component 2: Header (Title + Year + Rating) */}
          <MovieHeader
            title={movie.title}
            year={year}
            rating={movie.vote_average || 0}
            colorScheme={colorScheme}
          />

          {/* Component 3: Genre Tags */}
          <MovieGenres genres={movie.genres || []} colorScheme={colorScheme} />

          {/* Component 4: Synopsis + Runtime */}
          <MovieSynopsis
            overview={movie.overview || ''}
            runtime={movie.runtime}
            colorScheme={colorScheme}
          />

          {/* Component 5: YouTube Trailer Button */}
          <TrailerButton movie={movie} colorScheme={colorScheme} />

          {/* Component 6: Casting Section (Top 5) */}
          <CastingSection movie={movie} colorScheme={colorScheme} />

          {/* Component 7: User Status Panel (Like/Reject + Badge) */}
          <UserStatusPanel
            userStatus={userStatus}
            updatingStatus={updatingStatus}
            onLike={() => updateUserStatus('like')}
            onReject={() => updateUserStatus('reject')}
            colorScheme={colorScheme}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}