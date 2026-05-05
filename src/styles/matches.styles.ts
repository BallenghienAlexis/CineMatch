import { StyleSheet } from 'react-native';

/**
 * Consolidated StyleSheet for matches screen and its components
 */
export const matchesStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
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

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Grid
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
});

