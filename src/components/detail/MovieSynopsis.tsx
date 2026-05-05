import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { detailStyles as styles } from '@/src/styles/detail.styles';

interface MovieSynopsisProps {
  overview: string;
  runtime: number | null;
  colorScheme: 'light' | 'dark';
}

/**
 * Displays movie synopsis and runtime
 */
export const MovieSynopsis: React.FC<MovieSynopsisProps> = ({ overview, runtime, colorScheme }) => {
  return (
    <View>
      {runtime && (
        <ThemedText
          style={[
            styles.runtime,
            { color: colorScheme === 'dark' ? '#999' : '#666' },
          ]}
        >
          ⏱️ Durée: {runtime} min
        </ThemedText>
      )}

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
        Synopsis
      </ThemedText>
      <ThemedText
        style={[
          styles.synopsis,
          { color: colorScheme === 'dark' ? '#ccc' : '#333' },
        ]}
      >
        {overview || 'Pas de synopsis disponible'}
      </ThemedText>
    </View>
  );
};

