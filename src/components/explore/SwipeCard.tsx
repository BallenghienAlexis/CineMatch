import React from 'react';
import Animated from 'react-native-reanimated';
import { MovieCard } from '@/src/components/MovieCard';
import { Movie } from '@/src/services/tmdb';
import { exploreStyles as styles } from '@/src/styles/explore.styles';

interface SwipeCardProps {
  currentMovie: Movie;
  panResponder: any;
  cardAnimatedStyle: any;
  likeOpacity: any;
  rejectOpacity: any;
}

/**
 * Animated card component for swiping movies
 */
export const SwipeCard: React.FC<SwipeCardProps> = ({
  currentMovie,
  panResponder,
  cardAnimatedStyle,
  likeOpacity,
  rejectOpacity,
}) => {
  return (
    <>
      {/* Green feedback background - like */}
      <Animated.View
        style={[styles.feedbackBackgroundLike, likeOpacity]}
        pointerEvents="none"
      />

      {/* Red feedback background - reject */}
      <Animated.View
        style={[styles.feedbackBackgroundReject, rejectOpacity]}
        pointerEvents="none"
      />

      {/* Swipeable card */}
      <Animated.View
        style={[styles.cardContainer, cardAnimatedStyle]}
        {...panResponder?.panHandlers}
      >
        <MovieCard movie={currentMovie} showOverlay={true} />
      </Animated.View>
    </>
  );
};

