import React, { useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Genre } from '@/src/services/tmdb';
import { exploreStyles as styles } from '@/src/styles/explore.styles';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId: number | null;
  onSelectGenre: (id: number | null) => void;
  genresListRef: React.RefObject<FlatList<any> | null>;
  colorScheme: 'light' | 'dark';
}

interface GenreItem {
  id: 'all' | number;
  name: string;
}

/**
 * Horizontal scrollable genre filter
 */
export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenreId,
  onSelectGenre,
  genresListRef,
  colorScheme,
}) => {
  // Memoize genre data to avoid recreating on every render
  const genreData: GenreItem[] = useMemo(
    () => [{ id: 'all', name: 'Tous' }, ...genres],
    [genres]
  );

  return (
    <View style={styles.genresSection}>
      <FlatList
        ref={genresListRef}
        data={genreData}
        renderItem={({ item }) => {
          const isAll = item.id === 'all';
          const genreId = isAll ? null : (item.id as number);
          const isActive = selectedGenreId === genreId;

          return (
            <TouchableOpacity
              style={[
                styles.genreChip,
                isActive && styles.genreChipActive,
                {
                  backgroundColor: isActive
                    ? '#0a7ea4'
                    : colorScheme === 'dark'
                      ? '#333'
                      : '#f0f0f0',
                },
              ]}
              onPress={() => onSelectGenre(genreId)}
            >
              <ThemedText
                style={[
                  styles.genreChipText,
                  {
                    color: isActive ? '#fff' : colorScheme === 'dark' ? '#ccc' : '#666',
                  },
                ]}
              >
                {item.name}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genresScrollContainer}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(error) => {
          console.warn('ScrollToIndex failed:', error);
        }}
       />
     </View>
   );
};


