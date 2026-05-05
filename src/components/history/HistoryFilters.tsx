import React from 'react';
import { View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { historyStyles as styles } from '@/src/styles/history.styles';

type FilterType = 'all' | 'like' | 'reject';

interface HistoryFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  colorScheme: 'light' | 'dark';
}

/**
 * Filter buttons for history (All, Liked, Rejected)
 */
export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  activeFilter,
  onFilterChange,
  colorScheme,
}) => {
  const filters: { id: FilterType; label: string; icon: string }[] = [
    { id: 'all', label: 'Tous', icon: '' },
    { id: 'like', label: '✓ Aimés', icon: '✓' },
    { id: 'reject', label: '✕ Rejetés', icon: '✕' },
  ];

  return (
    <View style={styles.filterContainer}>
      {filters.map((f) => {
        const isActive = activeFilter === f.id;
        const bgColor =
          isActive
            ? colorScheme === 'dark'
              ? 'rgba(100, 150, 255, 0.3)'
              : 'rgba(100, 150, 255, 0.15)'
            : colorScheme === 'dark'
              ? 'rgba(0, 0, 0, 0.3)'
              : 'rgba(0, 0, 0, 0.08)';

        return (
          <Pressable
            key={f.id}
            style={[
              styles.filterButton,
              { backgroundColor: bgColor },
              isActive && styles.filterButtonActive,
            ]}
            onPress={() => onFilterChange(f.id)}
          >
            <ThemedText
              style={[
                styles.filterText,
                {
                  color: isActive ? '#0a7ea4' : colorScheme === 'dark' ? '#ccc' : '#000000',
                },
                isActive && styles.filterTextActive,
              ]}
            >
              {f.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
};

