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


