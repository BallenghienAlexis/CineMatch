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
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';

export default function DetailScreen() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useEffectiveColorScheme();
  const { user } = useAuth();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<'liked' | 'rejected' | 'none'>('none');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadMovieDetail();
  }, [movieId]);

  useEffect(() => {
    loadUserStatus();
  }, [movieId, user?.id]);

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

  const loadUserStatus = async () => {
    if (!user?.id || !movieId) return;

    try {
      const movieIdNum = parseInt(movieId, 10);
      const { data, error } = await databaseService.getSwipeHistory(user.id);

      if (error || !data) {
        setUserStatus('none');
        return;
      }

      const swipe = data.find((s) => s.movie_id === movieIdNum);
      if (swipe) {
        setUserStatus(swipe.action === 'like' ? 'liked' : 'rejected');
      } else {
        setUserStatus('none');
      }
    } catch (err) {
      console.error('Error loading user status:', err);
      setUserStatus('none');
    }
  };

  const updateUserStatus = async (action: 'like' | 'reject') => {
    if (!user?.id || !movie) return;

    setUpdatingStatus(true);
    try {
      await databaseService.addSwipeHistory(user.id, movie.id, movie.title, action);

      if (action === 'like') {
        await databaseService.addLikedMovie(
          user.id,
          movie.id,
          movie.title,
          movie.vote_average,
          movie.poster_path ?? undefined
        );
        setUserStatus('liked');
      } else {
        setUserStatus('rejected');
      }

      // Revenir à l'écran précédent après 800ms pour voir la confirmation
      setTimeout(() => {
        router.back();
      }, 800);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(false);
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

          {/* User Status Section */}
          <View
            style={[
              styles.divider,
              { backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' },
            ]}
          />

          <View style={styles.statusContainer}>
            <ThemedText
              style={[
                styles.statusLabel,
                { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
              ]}
            >
              Votre avis
            </ThemedText>

            {/* Status Badge */}
            <View style={styles.statusBadgeContainer}>
              {userStatus !== 'none' && (
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        userStatus === 'liked'
                          ? 'rgba(76, 175, 80, 0.2)'
                          : 'rgba(244, 67, 54, 0.2)',
                      borderColor: userStatus === 'liked' ? '#4CAF50' : '#F44336',
                    },
                  ]}
                >
                  <Ionicons
                    name={userStatus === 'liked' ? 'heart' : 'close-circle'}
                    size={16}
                    color={userStatus === 'liked' ? '#4CAF50' : '#F44336'}
                  />
                  <ThemedText
                    style={{
                      marginLeft: 8,
                      color: userStatus === 'liked' ? '#4CAF50' : '#F44336',
                      fontWeight: '600',
                    }}
                  >
                    {userStatus === 'liked' ? 'Aimé' : 'Rejeté'}
                  </ThemedText>
                </View>
              )}
              {userStatus === 'none' && (
                <ThemedText
                  style={[
                    styles.noStatusText,
                    { color: colorScheme === 'dark' ? '#999' : '#666' },
                  ]}
                >
                  Pas encore d'avis
                </ThemedText>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.likeButton,
                  {
                    backgroundColor:
                      userStatus === 'liked'
                        ? 'rgba(76, 175, 80, 0.3)'
                        : colorScheme === 'dark'
                          ? '#1a1a1a'
                          : '#F5F5F5',
                    borderColor: userStatus === 'liked' ? '#4CAF50' : 'transparent',
                  },
                ]}
                onPress={() => updateUserStatus('like')}
                disabled={updatingStatus}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color={userStatus === 'liked' ? '#4CAF50' : colorScheme === 'dark' ? '#fff' : '#000'}
                />
                <ThemedText
                  style={{
                    marginLeft: 8,
                    fontWeight: '600',
                    color: userStatus === 'liked' ? '#4CAF50' : colorScheme === 'dark' ? '#fff' : '#000',
                  }}
                >
                  J'aime
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.rejectButton,
                  {
                    backgroundColor:
                      userStatus === 'rejected'
                        ? 'rgba(244, 67, 54, 0.3)'
                        : colorScheme === 'dark'
                          ? '#1a1a1a'
                          : '#F5F5F5',
                    borderColor: userStatus === 'rejected' ? '#F44336' : 'transparent',
                  },
                ]}
                onPress={() => updateUserStatus('reject')}
                disabled={updatingStatus}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={userStatus === 'rejected' ? '#F44336' : colorScheme === 'dark' ? '#fff' : '#000'}
                />
                <ThemedText
                  style={{
                    marginLeft: 8,
                    fontWeight: '600',
                    color: userStatus === 'rejected' ? '#F44336' : colorScheme === 'dark' ? '#fff' : '#000',
                  }}
                >
                  Rejeter
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
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
  statusContainer: {
    paddingVertical: 12,
    gap: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadgeContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  noStatusText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  likeButton: {
    borderColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
});

