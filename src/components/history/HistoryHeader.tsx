import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { historyStyles as styles } from '@/src/styles/history.styles';

interface HistoryHeaderProps {
  count: number;
  colorScheme: 'light' | 'dark';
}

/**
 * History screen header with title and swipe count
 */
export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ count, colorScheme }) => {
  return (
    <View style={styles.header}>
      <ThemedText
        style={[styles.title, { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' }]}
      >
        Historique des Swipes
      </ThemedText>
      <ThemedText
        style={[styles.subtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}
      >
        {count} swipe{count !== 1 ? 's' : ''}
      </ThemedText>
    </View>
  );
};

