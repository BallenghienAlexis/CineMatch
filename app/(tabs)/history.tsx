import React from 'react';
import { FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';

// Extracted Hook
import { useSwipeHistoryFilter } from '@/src/hooks/useSwipeHistoryFilter';

// Extracted Components
import { HistoryHeader } from '@/src/components/history/HistoryHeader';
import { HistoryFilters } from '@/src/components/history/HistoryFilters';
import { HistoryItem } from '@/src/components/history/HistoryItem';
import { HistoryEmptyState } from '@/src/components/history/HistoryEmptyState';

// Styles
import { historyStyles as styles } from '@/src/styles/history.styles';

export default function HistoryScreen() {
  const colorScheme = useEffectiveColorScheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Extract history logic
  const { filteredHistory, loading, refreshing, error, filter, setFilter, onRefresh } =
    useSwipeHistoryFilter(user?.id);

  // Determine state type
  if (loading && filteredHistory.length === 0) {
    return (
      <HistoryEmptyState
        type="loading"
        refreshing={refreshing}
        onRefresh={onRefresh}
        colorScheme={colorScheme}
        bottomInset={insets.bottom}
      />
    );
  }

  if (error) {
    return (
      <HistoryEmptyState
        type="error"
        error={error}
        refreshing={refreshing}
        onRefresh={onRefresh}
        colorScheme={colorScheme}
        bottomInset={insets.bottom}
      />
    );
  }

  if (filteredHistory.length === 0) {
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
        <HistoryHeader count={0} colorScheme={colorScheme} />
        <HistoryEmptyState
          type="empty"
          refreshing={refreshing}
          onRefresh={onRefresh}
          colorScheme={colorScheme}
          bottomInset={insets.bottom}
          scrollEnabled={false}
        />
      </ThemedView>
    );
  }

  // Success state with data
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
      {/* Component 1: Header */}
      <HistoryHeader count={filteredHistory.length} colorScheme={colorScheme} />

      {/* Component 2: Filters */}
      <HistoryFilters
        activeFilter={filter}
        onFilterChange={setFilter}
        colorScheme={colorScheme}
      />

      {/* Component 3: History List */}
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
        onEndReachedThreshold={0.5}
      />
    </ThemedView>
  );
}



