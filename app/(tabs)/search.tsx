import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MovieCard } from '@/src/components/MovieCard';
import { tmdbService, Movie } from '@/src/services/tmdb';
import { Colors } from '@/constants/theme';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useEffectiveColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setPage(1);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery, 1);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const performSearch = async (query: string, pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const result = await tmdbService.searchMovies(query, pageNum);

      if (pageNum === 1) {
        setResults(result.results);
      } else {
        setResults((prev) => [...prev, ...result.results]);
      }

      setTotalPages(result.total_pages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      performSearch(searchQuery, page + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (searchQuery.trim()) {
      await performSearch(searchQuery, 1);
    }
    setRefreshing(false);
  };

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
      {/* En-tête */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#F5F5F5',
          },
        ]}
      >
        <ThemedText style={[styles.title, { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' }]}>
          Rechercher un film
        </ThemedText>

        {/* Search Input */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colorScheme === 'dark' ? '#333' : '#FFFFFF',
              borderColor: colorScheme === 'dark' ? '#444' : '#E0E0E0',
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={colorScheme === 'dark' ? '#999' : '#666'}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={[
              styles.input,
              { color: colorScheme === 'dark' ? '#fff' : '#000' },
            ]}
            placeholder="Entrez le titre..."
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colorScheme === 'dark' ? '#999' : '#666'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading initial */}
      {loading && results.length === 0 && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme].button} />
          <ThemedText style={{ marginTop: 12 }}>Recherche en cours...</ThemedText>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.centerContainer}>
          <ThemedText style={{ color: 'red', textAlign: 'center' }}>
            Erreur: {error}
          </ThemedText>
        </View>
      )}

      {/* No search yet */}
      {!hasSearched && results.length === 0 && !loading && (
        <View style={styles.centerContainer}>
          <Ionicons
            name="search"
            size={64}
            color={colorScheme === 'dark' ? '#444' : '#DDD'}
          />
          <ThemedText
            style={[
              styles.emptyText,
              { color: colorScheme === 'dark' ? '#999' : '#666', marginTop: 16 },
            ]}
          >
            Tapez un titre pour chercher
          </ThemedText>
        </View>
      )}

      {/* Results */}
      {hasSearched && results.length === 0 && !loading && !error && (
        <View style={styles.centerContainer}>
          <ThemedText style={[styles.emptyText, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
            Aucun résultat pour "{searchQuery}"
          </ThemedText>
        </View>
      )}

      {/* Grid de résultats */}
      {results.length > 0 && (
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
                onPress={() => handleMoviePress(item.id)}
              />
            </View>
          )}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 16 },
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
                <ActivityIndicator size="small" color={Colors[colorScheme].button} />
              </View>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  movieContainer: {
    width: '48%',
    aspectRatio: 2 / 3,
    marginBottom: 8,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  paginationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
  },
});

