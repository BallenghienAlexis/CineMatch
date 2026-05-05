import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { matchesStyles as styles } from '@/src/styles/matches.styles';

interface MatchesHeaderProps {
  count: number;
  colorScheme: 'light' | 'dark';
}

/**
 * Matches screen header with title and movie count
 */
export const MatchesHeader: React.FC<MatchesHeaderProps> = ({ count, colorScheme }) => {
  return (
    <View style={styles.header}>
      <ThemedText
        style={[styles.title, { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' }]}
      >
        Mes Films Aimés
      </ThemedText>
      <ThemedText
        style={[styles.subtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}
      >
        {count} film{count !== 1 ? 's' : ''}
      </ThemedText>
    </View>
  );
};

