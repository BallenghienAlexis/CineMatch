import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { tmdbService, MovieDetail } from '@/src/services/tmdb';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';

export default function DetailScreen() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useEffectiveColorScheme();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovieDetail();
  }, [movieId]);

  const loadMovieDetail = async () => {
    if (!movieId) {
      setError('Film non trouvé');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const id = parseInt(movieId, 10);
      const data = await tmdbService.getMovieDetail(id);
      setMovie(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du film');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTrailer = async () => {
    if (!movie) return;
    const trailerUrl = tmdbService.getYoutubeTrailerUrl(movie);
    if (trailerUrl) {
      const canOpen = await Linking.canOpenURL(trailerUrl);
      if (canOpen) {
        Linking.openURL(trailerUrl);
      }
    }
  };

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

  const posterUrl = tmdbService.getPosterUrl(movie.poster_path);
  const year = movie.release_date?.split('-')[0] || 'N/A';
  const genres = movie.genres?.map((g) => g.name).join(', ') || 'N/A';
  const cast = tmdbService.getTopCast(movie);
  const trailerUrl = tmdbService.getYoutubeTrailerUrl(movie);

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
      ]}
    >
      {/* Back Button - Floating over poster */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 12 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Poster and Basic Info */}
        {posterUrl && (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        )}

        <View style={styles.infoContainer}>
          {/* Title and Year */}
          <ThemedText
            style={[
              styles.title,
              { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
            ]}
          >
            {movie.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <ThemedText
              style={[
                styles.meta,
                { color: colorScheme === 'dark' ? '#999' : '#666' },
              ]}
            >
              {year}
            </ThemedText>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.rating}>{movie.vote_average?.toFixed(1)}</ThemedText>
            </View>
          </View>

          {/* Genres */}
          <View style={styles.genresContainer}>
            {movie.genres?.map((genre) => (
              <View
                key={genre.id}
                style={[
                  styles.genreTag,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0',
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.genreText,
                    { color: colorScheme === 'dark' ? '#ccc' : '#333' },
                  ]}
                >
                  {genre.name}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Runtime */}
          {movie.runtime && (
            <ThemedText
              style={[
                styles.runtime,
                { color: colorScheme === 'dark' ? '#999' : '#666' },
              ]}
            >
              ⏱️ Durée: {movie.runtime} min
            </ThemedText>
          )}

          {/* Divider */}
          <View
            style={[
              styles.divider,
              { backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' },
            ]}
          />

          {/* Synopsis */}
          <ThemedText
            style={[
              styles.sectionTitle,
              { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
            ]}
          >
            Synopsis
          </ThemedText>
          <ThemedText
            style={[
              styles.synopsis,
              { color: colorScheme === 'dark' ? '#ccc' : '#333' },
            ]}
          >
            {movie.overview || 'Pas de synopsis disponible'}
          </ThemedText>

          {/* Trailer Button */}
          {trailerUrl && (
            <>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' },
                ]}
              />
              <TouchableOpacity
                style={[
                  styles.trailerButton,
                  { backgroundColor: colorScheme === 'dark' ? '#1a7ea4' : '#0a7ea4' },
                ]}
                onPress={handleOpenTrailer}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <ThemedText style={styles.trailerButtonText}>Voir la bande-annonce</ThemedText>
              </TouchableOpacity>
            </>
          )}

          {/* Casting */}
          {cast.length > 0 && (
            <>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' },
                ]}
              />
              <ThemedText
                style={[
                  styles.sectionTitle,
                  { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
                ]}
              >
                Casting (Top 5)
              </ThemedText>

              <View style={styles.castContainer}>
                {cast.map((actor: any) => (
                  <View key={actor.id} style={styles.castItem}>
                    {actor.profile_path && (
                      <Image
                        source={{
                          uri: `https://image.tmdb.org/t/p/w185${actor.profile_path}`,
                        }}
                        style={styles.castImage}
                      />
                    )}
                    {!actor.profile_path && (
                      <View
                        style={[
                          styles.castImagePlaceholder,
                          { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0' },
                        ]}
                      >
                        <Ionicons
                          name="person"
                          size={32}
                          color={colorScheme === 'dark' ? '#666' : '#ccc'}
                        />
                      </View>
                    )}
                    <ThemedText
                      style={[
                        styles.castName,
                        { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
                      ]}
                      numberOfLines={2}
                    >
                      {actor.name}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.castRole,
                        { color: colorScheme === 'dark' ? '#999' : '#666' },
                      ]}
                      numberOfLines={1}
                    >
                      {actor.character}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  poster: {
    width: '100%',
    height: 500,
    marginBottom: 16,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '500',
  },
  runtime: {
    fontSize: 13,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  trailerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  castContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  castItem: {
    width: '30%',
    alignItems: 'center',
  },
  castImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  castImagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  castRole: {
    fontSize: 10,
    textAlign: 'center',
  },
});

