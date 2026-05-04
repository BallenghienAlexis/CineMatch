import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MovieCard } from '@/src/components/MovieCard';
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LikedMovie } from '@/src/services/supabase';

export default function MatchesScreen() {
  const [likedMovies, setLikedMovies] = useState<LikedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

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

  if (loading) {
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

  if (likedMovies.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={{ textAlign: 'center', fontSize: 18 }}>
          Aucun film aimé pour le moment ❤️
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 8, fontSize: 14, opacity: 0.6 }}>
          Allez dans l'onglet Découvrir et swipez des films!
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mes Films Aimés</ThemedText>
        <ThemedText style={styles.subtitle}>
          {likedMovies.length} film{likedMovies.length > 1 ? 's' : ''}
        </ThemedText>
      </View>

      {/* Liste des films */}
      <FlatList
        data={likedMovies}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.movieContainer}>
            <MovieCard
              movie={{
                id: item.movie_id,
                title: item.movie_title,
                poster_path: '',
                release_date: '',
                vote_average: item.movie_rating || 0,
                overview: '',
              }}
              showOverlay={true}
            />
            <ThemedText style={styles.rating}>
              ⭐ {item.movie_rating?.toFixed(1)}
            </ThemedText>
          </View>
        )}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
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
  rating: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});

