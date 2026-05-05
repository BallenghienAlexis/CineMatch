import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { searchStyles as styles } from '@/src/styles/search.styles';

interface SearchHeaderProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  colorScheme: 'light' | 'dark';
  paddingTop: number;
}

/**
 * Search header with title and search input
 */
export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onChangeText,
  colorScheme,
  paddingTop,
}) => {
  return (
    <View
      style={[
        styles.header,
        {
          paddingTop,
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#F5F5F5',
        },
      ]}
    >
      <ThemedText
        style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
        ]}
      >
        Rechercher un film
      </ThemedText>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#FFFFFF',
            borderColor: colorScheme === 'dark' ? '#444' : '#E0E0E0',
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={colorScheme === 'dark' ? '#999' : '#666'}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[
            styles.input,
            { color: colorScheme === 'dark' ? '#fff' : '#000' },
          ]}
          placeholder="Entrez le titre..."
          placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          value={searchQuery}
          onChangeText={onChangeText}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colorScheme === 'dark' ? '#999' : '#666'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

