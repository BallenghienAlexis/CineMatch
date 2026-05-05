import { StyleSheet } from 'react-native';

/**
 * Consolidated StyleSheet for search screen and its components
 */
export const searchStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  // Search Input
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },

  // Empty/Loading/Error States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },

  // Results Grid
  listContent: {
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  movieContainer: {
    width: '48%',
    aspectRatio: 2 / 3,
    marginBottom: 8,
  },

  // Pagination
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  paginationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
  },
});

