import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { SwipeHistory } from '@/src/services/supabase';
import { useFormatDate } from '@/src/hooks/useFormatting';
import { historyStyles as styles } from '@/src/styles/history.styles';

interface HistoryItemProps {
  item: SwipeHistory;
  colorScheme: 'light' | 'dark';
}

/**
 * Single history item row with action badge
 */
export const HistoryItem: React.FC<HistoryItemProps> = ({ item, colorScheme }) => {
  const date = useFormatDate(item.created_at);

  const isLike = item.action === 'like';
  const actionIcon = isLike ? '✓' : '✕';
  const actionColor = isLike ? '#4CAF50' : '#F44336';
  const actionLabel = isLike ? 'Aimé' : 'Rejeté';

  return (
    <View
      style={[
        styles.historyItem,
        {
          backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* Action badge */}
      <View style={[styles.actionBadge, { backgroundColor: actionColor }]}>
        <ThemedText style={styles.actionIcon}>{actionIcon}</ThemedText>
      </View>

      {/* Movie title + date */}
      <View style={styles.itemContent}>
        <ThemedText
          style={[
            styles.movieTitle,
            { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
          ]}
          numberOfLines={2}
        >
          {item.movie_title}
        </ThemedText>
        <ThemedText style={[styles.itemDate, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
          {date}
        </ThemedText>
      </View>

      {/* Action label */}
      <ThemedText style={[styles.action, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
        {actionLabel}
      </ThemedText>
    </View>
  );
};

