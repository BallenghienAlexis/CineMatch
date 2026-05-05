import { StyleSheet } from 'react-native';

/**
 * Consolidated StyleSheet for history screen and its components
 */
export const historyStyles = StyleSheet.create({
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
    paddingBottom: 16,
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

  // Filters
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(100, 150, 255, 0.3)',
    borderColor: '#6496FF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
  filterTextActive: {
    fontWeight: '600',
    opacity: 1,
  },

  // History List
  listContent: {
    paddingHorizontal: 16,
  },

  // History Item
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    gap: 12,
  },
  actionBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  action: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
  },
});

