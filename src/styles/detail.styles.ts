import { StyleSheet } from 'react-native';

/**
 * Consolidated StyleSheet for detail screen and its components
 */
export const detailStyles = StyleSheet.create({
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

  // Back Button
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },

  // Poster
  poster: {
    width: '100%',
    height: 500,
    marginBottom: 16,
  },

  // Content Container
  infoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Header
  headerContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },

  // Genres
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  genreTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Runtime
  runtime: {
    fontSize: 13,
    marginBottom: 12,
  },

  // Divider
  divider: {
    height: 1,
    marginVertical: 12,
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  // Synopsis
  synopsis: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },

  // Trailer Button
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  trailerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Casting
  castContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  castItem: {
    width: '30%',
    alignItems: 'center',
  },
  castImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  castImagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  castName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  castRole: {
    fontSize: 10,
    textAlign: 'center',
  },

  // Status Section
  statusContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadgeContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  noStatusText: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  likeButton: {
    borderColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
});


