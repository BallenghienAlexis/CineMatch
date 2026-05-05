import React from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { MovieCard } from '@/src/components/MovieCard';
import { Movie } from '@/src/services/tmdb';
import { Colors } from '@/constants/theme';
import { searchStyles as styles } from '@/src/styles/search.styles';

interface SearchResultsGridProps {
  results: Movie[];
  loading: boolean;
  refreshing: boolean;
  page: number;
  totalPages: number;
  hasSearched: boolean;
  bottomInset: number;
  colorScheme: 'light' | 'dark';
  onMoviePress: (movieId: number) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
}

/**
 * Displays search results in a 2-column grid with pagination
 */
export const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  results,
  loading,
  refreshing,
  page,
  totalPages,
  hasSearched,
  bottomInset,
  colorScheme,
  onMoviePress,
  onLoadMore,
  onRefresh,
}) => {
  // Only show grid if we have results
  if (results.length === 0) {
    return null;
  }

  return (
    <>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.movieContainer}>
            <MovieCard
              movie={item}
              showOverlay={true}
              onPress={() => onMoviePress(item.id)}
            />
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: bottomInset + 16 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme].tint}
          />
        }
        ListFooterComponent={() => {
          if (!loading || results.length === 0) return null;
          return (
            <View style={styles.footerContainer}>
              <ActivityIndicator
                size="small"
                color={Colors[colorScheme].button}
              />
            </View>
          );
        }}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Pagination info */}
      {hasSearched && results.length > 0 && (
        <View
          style={[
            styles.paginationInfo,
            {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#F5F5F5',
              borderTopColor: colorScheme === 'dark' ? '#333' : '#E0E0E0',
            },
          ]}
        >
          <ThemedText style={{ fontSize: 12 }}>
            Page {page} / {totalPages}
          </ThemedText>
        </View>
      )}
    </>
  );
};

