import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { detailStyles as styles } from '@/src/styles/detail.styles';

interface MovieHeaderProps {
  title: string;
  year: string;
  rating: number;
  colorScheme: 'light' | 'dark';
}

/**
 * Displays movie title, year, and TMDB rating
 */
export const MovieHeader: React.FC<MovieHeaderProps> = ({ title, year, rating, colorScheme }) => {
  return (
    <View style={styles.headerContainer}>
      <ThemedText
        style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
        ]}
      >
        {title}
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
          <ThemedText style={styles.rating}>{rating.toFixed(1)}</ThemedText>
        </View>
      </View>
    </View>
  );
};

