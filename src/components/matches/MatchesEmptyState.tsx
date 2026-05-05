import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { matchesStyles as styles } from '@/src/styles/matches.styles';

interface MatchesEmptyStateProps {
  type: 'empty' | 'loading' | 'error';
  error?: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  colorScheme: 'light' | 'dark';
  bottomInset: number;
  scrollEnabled?: boolean;
}

/**
 * Empty/Loading/Error states for matches
 */
export const MatchesEmptyState: React.FC<MatchesEmptyStateProps> = ({
  type,
  error,
  refreshing,
  onRefresh,
  colorScheme,
  bottomInset,
  scrollEnabled = false,
}) => {
  const isError = type === 'error';
  const isLoading = type === 'loading';
  const isEmpty = type === 'empty';

  // For loading/error, show simple centered view
  if (isLoading || isError) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText
          style={{
            color: isError ? 'red' : Colors[colorScheme].button,
            textAlign: 'center',
          }}
        >
          {isError ? `Erreur: ${error}` : 'Chargement...'}
        </ThemedText>
      </ThemedView>
    );
  }

  // For empty state, show with refresh capability
  return (
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
        { paddingBottom: bottomInset + 16 },
      ]}
      scrollEnabled={scrollEnabled}
    >
      <ThemedText style={{ textAlign: 'center', fontSize: 18 }}>
        Aucun film aimé pour le moment ❤️
      </ThemedText>
      <ThemedText
        style={{
          textAlign: 'center',
          marginTop: 8,
          fontSize: 14,
          opacity: 0.6,
        }}
      >
        Allez dans l'onglet Découvrir et swipez des films!
      </ThemedText>
    </ScrollView>
  );
};

