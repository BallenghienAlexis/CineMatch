import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Consolidated StyleSheet for explore screen and its components
 */
export const exploreStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Swipe Card
  cardContainer: {
    width: screenWidth * 0.9,
    height: screenWidth * 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // Feedback Backgrounds
  feedbackBackgroundLike: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.4)',
    zIndex: 5,
  },
  feedbackBackgroundReject: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 67, 54, 0.4)',
    zIndex: 5,
  },

  // Action Buttons
  logoutButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: '#FF3B30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  themeButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Genre Filter
  genresSection: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
  },
  genresScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreChipActive: {
    backgroundColor: '#0a7ea4',
  },
  genreChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

