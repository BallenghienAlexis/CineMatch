import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MovieCard } from '@/src/components/MovieCard';
import { tmdbService } from '@/src/services/tmdb';
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';
import { LikedMovie } from '@/src/services/supabase';

export default function MatchesScreen() {
  const [likedMovies, setLikedMovies] = useState<LikedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const colorScheme = useEffectiveColorScheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadLikedMovies();
  }, [user?.id]);

  const loadLikedMovies = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await databaseService.getLikedMovies(user.id);
      if (error) throw new Error(error);
      setLikedMovies(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des films aimés');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLikedMovies();
    setRefreshing(false);
  };

  if (loading && likedMovies.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].button} />
        <ThemedText style={{ marginTop: 12 }}>Chargement...</ThemedText>
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

  // État vide avec pull-to-refresh activé
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
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' }]}>
            Mes Films Aimés
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
            0 film
          </ThemedText>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[colorScheme].tint}
            />
          }
          contentContainerStyle={[
            styles.emptyContainer,
            { paddingBottom: insets.bottom + 16 },
          ]}
          scrollEnabled={false}
        >
          <ThemedText style={{ textAlign: 'center', fontSize: 18 }}>
            Aucun film aimé pour le moment ❤️
          </ThemedText>
          <ThemedText style={{ textAlign: 'center', marginTop: 8, fontSize: 14, opacity: 0.6 }}>
            Allez dans l&#39;onglet Découvrir et swipez des films!
          </ThemedText>
        </ScrollView>
      </ThemedView>
    );
  }

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
      {/* En-tête */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' }]}>
          Mes Films Aimés
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
          {likedMovies.length} film{likedMovies.length > 1 ? 's' : ''}
        </ThemedText>
      </View>

      {/* Liste des films avec refresh */}
      <FlatList
        data={likedMovies}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MovieItemCard movie={item} />
        )}
        scrollEnabled={true}
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
      />
    </ThemedView>
  );
}

function MovieItemCard({ movie }: { movie: LikedMovie }) {
  return (
    <View style={styles.movieContainer}>
      <MovieCard
        movie={{
          id: movie.movie_id,
          title: movie.movie_title,
          poster_path: movie.poster_path || '/w342/film-placeholder.jpg',
          release_date: '',
          vote_average: movie.movie_rating || 0,
          overview: '',
        }}
        showOverlay={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
});

