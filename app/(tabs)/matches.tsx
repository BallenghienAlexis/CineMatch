import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';
import { useAuth } from '@/src/contexts/AuthContext';

// Extracted Hook
import { useLikedMovies } from '@/src/hooks/useLikedMovies';

// Extracted Components
import { MatchesHeader } from '@/src/components/matches/MatchesHeader';
import { MatchesEmptyState } from '@/src/components/matches/MatchesEmptyState';
import { MatchesGrid } from '@/src/components/matches/MatchesGrid';

// Styles
import { matchesStyles as styles } from '@/src/styles/matches.styles';

export default function MatchesScreen() {
  const colorScheme = useEffectiveColorScheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Extract liked movies logic
  const { likedMovies, loading, refreshing, error, onRefresh } = useLikedMovies(user?.id);

  // Loading state
  if (loading && likedMovies.length === 0) {
    return (
      <MatchesEmptyState
        type="loading"
        refreshing={refreshing}
        onRefresh={onRefresh}
        colorScheme={colorScheme}
        bottomInset={insets.bottom}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <MatchesEmptyState
        type="error"
        error={error}
        refreshing={refreshing}
        onRefresh={onRefresh}
        colorScheme={colorScheme}
        bottomInset={insets.bottom}
      />
    );
  }

  // Empty state
  if (likedMovies.length === 0) {
    return (
      <ThemedView
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
          },
        ]}
      >
        <MatchesHeader count={0} colorScheme={colorScheme} />
        <MatchesEmptyState
          type="empty"
          refreshing={refreshing}
          onRefresh={onRefresh}
          colorScheme={colorScheme}
          bottomInset={insets.bottom}
          scrollEnabled={false}
        />
      </ThemedView>
    );
  }

  // Success state with movies
  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
        },
      ]}
    >
      {/* Component 1: Header */}
      <MatchesHeader count={likedMovies.length} colorScheme={colorScheme} />

      {/* Component 2: Grid of liked movies */}
      <MatchesGrid
        likedMovies={likedMovies}
        refreshing={refreshing}
        onRefresh={onRefresh}
        colorScheme={colorScheme}
        bottomInset={insets.bottom}
      />
    </ThemedView>
  );
}


