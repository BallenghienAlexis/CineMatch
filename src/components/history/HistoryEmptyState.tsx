import React from 'react';
import { ScrollView } from 'react-native';
import { RefreshControl } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { historyStyles as styles } from '@/src/styles/history.styles';

interface HistoryEmptyStateProps {
  type: 'empty' | 'loading' | 'error';
  error?: string | null;
  refreshing: boolean;
  onRefresh: () => void;
  colorScheme: 'light' | 'dark';
  bottomInset: number;
  scrollEnabled?: boolean;
}

/**
 * Empty/Loading/Error states for history
 */
export const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({
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
        Aucun historique pour le moment 📋
      </ThemedText>
      <ThemedText
        style={{
          textAlign: 'center',
          marginTop: 8,
          fontSize: 14,
          opacity: 0.6,
        }}
      >
        Allez à Découvrir et commencez à swiper!
      </ThemedText>
    </ScrollView>
  );
};

