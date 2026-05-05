import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { searchStyles as styles } from '@/src/styles/search.styles';

interface SearchEmptyStatesProps {
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchQuery: string;
  resultsCount: number;
  colorScheme: 'light' | 'dark';
}

/**
 * Displays all empty/loading/error states for search
 */
export const SearchEmptyStates: React.FC<SearchEmptyStatesProps> = ({
  loading,
  error,
  hasSearched,
  searchQuery,
  resultsCount,
  colorScheme,
}) => {
  // Initial loading state
  if (loading && resultsCount === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors[colorScheme].button} />
        <ThemedText style={{ marginTop: 12 }}>Recherche en cours...</ThemedText>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={{ color: 'red', textAlign: 'center' }}>
          Erreur: {error}
        </ThemedText>
      </View>
    );
  }

  // No search yet
  if (!hasSearched && resultsCount === 0 && !loading) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="search"
          size={64}
          color={colorScheme === 'dark' ? '#444' : '#DDD'}
        />
        <ThemedText
          style={[
            styles.emptyText,
            { color: colorScheme === 'dark' ? '#999' : '#666', marginTop: 16 },
          ]}
        >
          Tapez un titre pour chercher
        </ThemedText>
      </View>
    );
  }

  // No results found
  if (hasSearched && resultsCount === 0 && !loading && !error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText
          style={[
            styles.emptyText,
            { color: colorScheme === 'dark' ? '#999' : '#666' },
          ]}
        >
          Aucun résultat pour "{searchQuery}"
        </ThemedText>
      </View>
    );
  }

  return null;
};

