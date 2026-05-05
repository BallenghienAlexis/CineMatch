import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { detailStyles as styles } from '@/src/styles/detail.styles';

interface Genre {
  id: number;
  name: string;
}

interface MovieGenresProps {
  genres: Genre[];
  colorScheme: 'light' | 'dark';
}

/**
 * Displays movie genres as tags
 */
export const MovieGenres: React.FC<MovieGenresProps> = ({ genres, colorScheme }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <View style={styles.genresContainer}>
      {genres.map((genre) => (
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
  );
};

