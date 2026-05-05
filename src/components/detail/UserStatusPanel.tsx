import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { detailStyles as styles } from '@/src/styles/detail.styles';

type UserStatus = 'liked' | 'rejected' | 'none';

interface UserStatusPanelProps {
  userStatus: UserStatus;
  updatingStatus: boolean;
  onLike: () => void;
  onReject: () => void;
  colorScheme: 'light' | 'dark';
}

/**
 * Displays user's like/reject status and action buttons
 */
export const UserStatusPanel: React.FC<UserStatusPanelProps> = ({
  userStatus,
  updatingStatus,
  onLike,
  onReject,
  colorScheme,
}) => {
  return (
    <>
      <View
        style={[
          styles.divider,
          { backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' },
        ]}
      />
      <View style={styles.statusContainer}>
        <ThemedText
          style={[
            styles.statusLabel,
            { color: colorScheme === 'dark' ? '#ECEDEE' : '#000000' },
          ]}
        >
          Votre avis
        </ThemedText>

        {/* Status Badge */}
        <View style={styles.statusBadgeContainer}>
          {userStatus !== 'none' && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    userStatus === 'liked'
                      ? 'rgba(76, 175, 80, 0.2)'
                      : 'rgba(244, 67, 54, 0.2)',
                  borderColor: userStatus === 'liked' ? '#4CAF50' : '#F44336',
                },
              ]}
            >
              <Ionicons
                name={userStatus === 'liked' ? 'heart' : 'close-circle'}
                size={16}
                color={userStatus === 'liked' ? '#4CAF50' : '#F44336'}
              />
              <ThemedText
                style={{
                  marginLeft: 8,
                  color: userStatus === 'liked' ? '#4CAF50' : '#F44336',
                  fontWeight: '600',
                }}
              >
                {userStatus === 'liked' ? 'Aimé' : 'Rejeté'}
              </ThemedText>
            </View>
          )}
          {userStatus === 'none' && (
            <ThemedText
              style={[
                styles.noStatusText,
                { color: colorScheme === 'dark' ? '#999' : '#666' },
              ]}
            >
              Pas encore d'avis
            </ThemedText>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.likeButton,
              {
                backgroundColor:
                  userStatus === 'liked'
                    ? 'rgba(76, 175, 80, 0.3)'
                    : colorScheme === 'dark'
                      ? '#1a1a1a'
                      : '#F5F5F5',
                borderColor: userStatus === 'liked' ? '#4CAF50' : 'transparent',
              },
            ]}
            onPress={onLike}
            disabled={updatingStatus}
          >
            <Ionicons
              name="heart"
              size={24}
              color={
                userStatus === 'liked'
                  ? '#4CAF50'
                  : colorScheme === 'dark'
                    ? '#fff'
                    : '#000'
              }
            />
            <ThemedText
              style={{
                marginLeft: 8,
                fontWeight: '600',
                color:
                  userStatus === 'liked'
                    ? '#4CAF50'
                    : colorScheme === 'dark'
                      ? '#fff'
                      : '#000',
              }}
            >
              J'aime
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.rejectButton,
              {
                backgroundColor:
                  userStatus === 'rejected'
                    ? 'rgba(244, 67, 54, 0.3)'
                    : colorScheme === 'dark'
                      ? '#1a1a1a'
                      : '#F5F5F5',
                borderColor: userStatus === 'rejected' ? '#F44336' : 'transparent',
              },
            ]}
            onPress={onReject}
            disabled={updatingStatus}
          >
            <Ionicons
              name="close-circle"
              size={24}
              color={
                userStatus === 'rejected'
                  ? '#F44336'
                  : colorScheme === 'dark'
                    ? '#fff'
                    : '#000'
              }
            />
            <ThemedText
              style={{
                marginLeft: 8,
                fontWeight: '600',
                color:
                  userStatus === 'rejected'
                    ? '#F44336'
                    : colorScheme === 'dark'
                      ? '#fff'
                      : '#000',
              }}
            >
              Rejeter
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};



