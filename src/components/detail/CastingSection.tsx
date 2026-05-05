import React from 'react';
import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { tmdbService } from '@/src/services/tmdb';
import { detailStyles as styles } from '@/src/styles/detail.styles';

interface CastActor {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastingSectionProps {
  movie: any;
  colorScheme: 'light' | 'dark';
}

/**
 * Displays top 5 casting members with images
 */
export const CastingSection: React.FC<CastingSectionProps> = ({ movie, colorScheme }) => {
  const cast = tmdbService.getTopCast(movie);

  if (cast.length === 0) return null;

  return (
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
        {cast.map((actor: CastActor) => (
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
  );
};

