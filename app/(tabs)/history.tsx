import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { databaseService } from '@/src/services/database';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';
import { SwipeHistory } from '@/src/services/supabase';
import { useFormatDate } from '@/src/hooks/useFormatting';

type FilterType = 'all' | 'like' | 'reject';

export default function HistoryScreen() {
  const [history, setHistory] = useState<SwipeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const { user } = useAuth();
  const colorScheme = useEffectiveColorScheme();
  const insets = useSafeAreaInsets();

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const getFilteredHistory = () => {
    if (filter === 'all') return history;
    return history.filter((item) => item.action === filter);
  };

  const filteredHistory = getFilteredHistory();

  if (loading && history.length === 0) {
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
      <ThemedView
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
          },
        ]}
      >
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' }]}>
            Historique des Swipes
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
            0 swipe
          </ThemedText>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[colorScheme].tint}
            />
          }
          contentContainerStyle={[
            styles.emptyContainer,
            { paddingBottom: insets.bottom + 16 },
          ]}
          scrollEnabled={false}
        >
          <ThemedText style={{ textAlign: 'center', fontSize: 18 }}>
            Aucun historique pour le moment 📋
          </ThemedText>
          <ThemedText style={{ textAlign: 'center', marginTop: 8, fontSize: 14, opacity: 0.6 }}>
            Allez à Découvrir et commencez à swiper!
          </ThemedText>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
        },
      ]}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' }]}>
          Historique des Swipes
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
          {filteredHistory.length} swipe{filteredHistory.length > 1 ? 's' : ''}
        </ThemedText>
      </View>

      {/* Filtres */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'all' ? (colorScheme === 'dark' ? 'rgba(100, 150, 255, 0.3)' : 'rgba(100, 150, 255, 0.15)') : (colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'),
            },
            filter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <ThemedText
            style={[
              styles.filterText,
              {
                color: filter === 'all' ? '#0a7ea4' : (colorScheme === 'dark' ? '#ccc' : '#000000'),
              },
              filter === 'all' && styles.filterTextActive,
            ]}
          >
            Tous
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'like' ? (colorScheme === 'dark' ? 'rgba(100, 150, 255, 0.3)' : 'rgba(100, 150, 255, 0.15)') : (colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'),
            },
            filter === 'like' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('like')}
        >
          <ThemedText
            style={[
              styles.filterText,
              {
                color: filter === 'like' ? '#0a7ea4' : (colorScheme === 'dark' ? '#ccc' : '#000000'),
              },
              filter === 'like' && styles.filterTextActive,
            ]}
          >
            ✓ Aimés
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'reject' ? (colorScheme === 'dark' ? 'rgba(100, 150, 255, 0.3)' : 'rgba(100, 150, 255, 0.15)') : (colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'),
            },
            filter === 'reject' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('reject')}
        >
          <ThemedText
            style={[
              styles.filterText,
              {
                color: filter === 'reject' ? '#0a7ea4' : (colorScheme === 'dark' ? '#ccc' : '#000000'),
              },
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
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme].tint}
          />
        }
      />
    </ThemedView>
  );
}

function HistoryItem({
  item,
  colorScheme,
}: {
  item: SwipeHistory;
  colorScheme: 'light' | 'dark';
}) {
  const date = useFormatDate(item.created_at);

  const isLike = item.action === 'like';
  const actionIcon = isLike ? '✓' : '✕';
  const actionColor = isLike ? '#4CAF50' : '#F44336';

  return (
    <View
      style={[
        styles.historyItem,
        {
          backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      <View style={[styles.actionBadge, { backgroundColor: actionColor }]}>
        <ThemedText style={styles.actionIcon}>{actionIcon}</ThemedText>
      </View>

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

      <ThemedText style={[styles.action, { color: colorScheme === 'dark' ? '#999' : '#666' }]}>
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
    paddingTop: 8,
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
  emptyContainer: {
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
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
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


