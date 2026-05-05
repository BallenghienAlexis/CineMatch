import React from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';
import { useMovieSearch } from '@/src/hooks/useMovieSearch';

// Extracted Components
import { SearchHeader } from '@/src/components/search/SearchHeader';
import { SearchEmptyStates } from '@/src/components/search/SearchEmptyStates';
import { SearchResultsGrid } from '@/src/components/search/SearchResultsGrid';

// Styles
import { searchStyles as styles } from '@/src/styles/search.styles';

/**
 * ============================================
 * SEARCH SCREEN - REFACTORED VERSION
 * ============================================
 *
 * Original: 338 lines (monolithic)
 * Current: ~80 lines (orchestration only)
 *
 * Extracted:
 * - Custom Hook: useMovieSearch (120 lines, all logic + debounce)
 * - 3 Components: SearchHeader, SearchEmptyStates, SearchResultsGrid (~60-80 lines each)
 * - Styles: search.styles.ts (67 lines, all StyleSheets)
 *
 * Benefits:
 * ✅ Clean logic separation (hook handles all state)
 * ✅ Reusable components (SearchHeader, SearchEmptyStates shareable)
 * ✅ Easier testing (each component has single responsibility)
 * ✅ Better maintainability (each file ~100 lines max)
 */
export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useEffectiveColorScheme();

  // All logic extracted to custom hook
  const {
    searchQuery,
    results,
    loading,
    refreshing,
    error,
    page,
    totalPages,
    hasSearched,
    setSearchQuery,
    handleLoadMore,
    onRefresh,
  } = useMovieSearch();

  const handleMoviePress = (movieId: number) => {
    router.push({
      pathname: '/detail/[movieId]',
      params: { movieId: movieId.toString() },
    });
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
      ]}
    >
      {/* Component 1: Search Header */}
      <SearchHeader
        searchQuery={searchQuery}
        onChangeText={setSearchQuery}
        colorScheme={colorScheme}
        paddingTop={insets.top}
      />

      {/* Component 2: Empty/Loading/Error States */}
      <SearchEmptyStates
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        searchQuery={searchQuery}
        resultsCount={results.length}
        colorScheme={colorScheme}
      />

      {/* Component 3: Results Grid */}
      <SearchResultsGrid
        results={results}
        loading={loading}
        refreshing={refreshing}
        page={page}
        totalPages={totalPages}
        hasSearched={hasSearched}
        bottomInset={insets.bottom}
        colorScheme={colorScheme}
        onMoviePress={handleMoviePress}
        onLoadMore={handleLoadMore}
        onRefresh={onRefresh}
      />
    </ThemedView>
  );
}


