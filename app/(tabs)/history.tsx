import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Pressable,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SwipeHistory } from '@/src/services/supabase';
import { useFormatDate } from '@/src/hooks/useFormatting';

type FilterType = 'all' | 'like' | 'reject';

export default function HistoryScreen() {
  const [history, setHistory] = useState<SwipeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const { data, error } = await databaseService.getSwipeHistory(user.id);
      if (error) throw new Error(error);
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredHistory = () => {
    if (filter === 'all') return history;
    return history.filter((item) => item.action === filter);
  };

  const filteredHistory = getFilteredHistory();

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

  if (history.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={{ textAlign: 'center', fontSize: 18 }}>
          Aucun historique pour le moment 📋
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', marginTop: 8, fontSize: 14, opacity: 0.6 }}>
          Allez à Découvrir et commencez à swiper!
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Historique des Swipes</ThemedText>
        <ThemedText style={styles.subtitle}>
          {filteredHistory.length} swipe{filteredHistory.length > 1 ? 's' : ''}
        </ThemedText>
      </View>

      {/* Filtres */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}
          >
            Tous
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filter === 'like' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('like')}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === 'like' && styles.filterTextActive,
            ]}
          >
            ❤️ Aimés
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filter === 'reject' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('reject')}
        >
          <ThemedText
            style={[
              styles.filterText,
              filter === 'reject' && styles.filterTextActive,
            ]}
          >
            ✕ Rejetés
          </ThemedText>
        </Pressable>
      </View>

      {/* Liste */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryItem item={item} colorScheme={colorScheme} />
        )}
        contentContainerStyle={styles.listContent}
      />
import { useFormatDate } from '@/src/hooks/useFormatting';

// ... existing code ...

function HistoryItem({
  item,
  colorScheme,
}: {
  item: SwipeHistory;
  colorScheme: 'light' | 'dark';
}) {
  const date = useFormatDate(item.created_at);

  const isLike = item.action === 'like';
  const actionIcon = isLike ? '❤️' : '✕';
  const actionColor = isLike ? '#4CAF50' : '#F44336';

  return (
    <View style={styles.historyItem}>
      <View style={[styles.actionBadge, { backgroundColor: actionColor }]}>
        <ThemedText style={styles.actionIcon}>{actionIcon}</ThemedText>
      </View>

      <View style={styles.itemContent}>
        <ThemedText style={styles.movieTitle} numberOfLines={2}>
          {item.movie_title}
        </ThemedText>
        <ThemedText style={styles.itemDate}>{date}</ThemedText>
      </View>

      <ThemedText style={styles.action}>
        {isLike ? 'Aimé' : 'Rejeté'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(100, 150, 255, 0.3)',
    borderColor: '#6496FF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  filterTextActive: {
    fontWeight: '600',
    opacity: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    gap: 12,
  },
  actionBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  action: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
});


