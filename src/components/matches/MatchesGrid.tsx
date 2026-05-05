import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { MovieItemCard } from './MovieItemCard';
import { LikedMovie } from '@/src/services/supabase';
import { Colors } from '@/constants/theme';
import { matchesStyles as styles } from '@/src/styles/matches.styles';

interface MatchesGridProps {
  likedMovies: LikedMovie[];
  refreshing: boolean;
  onRefresh: () => void;
  colorScheme: 'light' | 'dark';
  bottomInset: number;
}

/**
 * Grid of liked movies with refresh capability
 */
export const MatchesGrid: React.FC<MatchesGridProps> = ({
  likedMovies,
  refreshing,
  onRefresh,
  colorScheme,
  bottomInset,
}) => {
  return (
    <FlatList
      data={likedMovies}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => <MovieItemCard movie={item} />}
      scrollEnabled={true}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: bottomInset + 16 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors[colorScheme].tint}
        />
      }
    />
  );
};

