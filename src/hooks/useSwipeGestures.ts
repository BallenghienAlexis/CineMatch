import { useRef, useCallback, useEffect } from 'react';
import { PanResponder, Dimensions, PanResponderInstance } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const SWIPE_THRESHOLD = 100;
const { width: screenWidth } = Dimensions.get('window');

interface UseSwipeGesturesReturn {
  panX: Animated.Shared<number>;
  panY: Animated.Shared<number>;
  panResponder: PanResponderInstance | null;
  cardAnimatedStyle: any;
  likeOpacity: any;
  rejectOpacity: any;
  animateSwipe: (dx: number, action: 'like' | 'reject') => void;
  resetCard: () => void;
}

interface UseSwipeGesturesProps {
  onSwipeComplete: (dx: number, action: 'like' | 'reject') => Promise<void>;
  onCardTap: () => void;
  isAnimating: React.MutableRefObject<boolean>;
}

/**
 * Custom hook for swipe gestures with Reanimated animations
 */
export const useSwipeGestures = ({
  onSwipeComplete,
  onCardTap,
  isAnimating,
}: UseSwipeGesturesProps): UseSwipeGesturesReturn => {
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const panResponderRef = useRef<PanResponderInstance | null>(null);

  /**
   * Animate the card out with timing
   */
  const animateSwipe = useCallback(
    async (dx: number, action: 'like' | 'reject') => {
      // Mark animation as in progress
      isAnimating.current = true;

      // Call the complete handler (saves to database)
      await onSwipeComplete(dx, action);

      // Animate card out of screen
      panX.value = withTiming(dx > 0 ? screenWidth * 2 : -screenWidth * 2, {
        duration: 300,
      });

      // Reset for next card after animation
      setTimeout(() => {
        panX.value = 0;
        panY.value = 0;

        // Mark animation as complete with small delay
        setTimeout(() => {
          isAnimating.current = false;
        }, 50);
      }, 300);
    },
    [onSwipeComplete, isAnimating, panX, panY]
  );

  /**
   * Create PanResponder for touch gestures
   */
  useEffect(() => {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, { dx }) => {
        return Math.abs(dx) > 5;
      },
      onPanResponderMove: (evt, { dx }) => {
        panX.value = dx;
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;

        // Swipe right: like
        if (dx > SWIPE_THRESHOLD || vx > 0.5) {
          animateSwipe(dx, 'like');
        }
        // Swipe left: reject
        else if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
          animateSwipe(dx, 'reject');
        }
        // Simple tap: open details
        else if (Math.abs(dx) < 5 && Math.abs(vx) < 0.1) {
          onCardTap();
        }
        // Return to center with spring
        else {
          panX.value = withSpring(0, {
            damping: 10,
            mass: 1,
            stiffness: 100,
          });
          panY.value = withSpring(0, {
            damping: 10,
            mass: 1,
            stiffness: 100,
          });
        }
      },
    });
  }, [animateSwipe, onCardTap, panX, panY]);

  /**
   * Card transform animations (translate, rotate)
   */
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: panX.value },
      { translateY: panY.value },
      {
        rotateZ: `${interpolate(
          panX.value,
          [-screenWidth / 2, 0, screenWidth / 2],
          [-15, 0, 15],
          Extrapolate.CLAMP
        )}deg`,
      },
    ],
  }));

  /**
   * Like feedback opacity (green)
   */
  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      panX.value,
      [0, SWIPE_THRESHOLD, screenWidth / 2],
      [0, 0.3, 0.7],
      Extrapolate.CLAMP
    ),
  }));

  /**
   * Reject feedback opacity (red)
   */
  const rejectOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      panX.value,
      [-screenWidth / 2, -SWIPE_THRESHOLD, 0],
      [0.7, 0.3, 0],
      Extrapolate.CLAMP
    ),
  }));

  /**
   * Reset card to initial state
   */
  const resetCard = useCallback(() => {
    panX.value = 0;
    panY.value = 0;
  }, [panX, panY]);

  return {
    panX,
    panY,
    panResponder: panResponderRef.current,
    cardAnimatedStyle,
    likeOpacity,
    rejectOpacity,
    animateSwipe,
    resetCard,
  };
};

