import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { exploreStyles as styles } from '@/src/styles/explore.styles';

interface ActionButtonsProps {
  topInset: number;
  colorScheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
}

/**
 * Top action buttons (theme toggle + logout)
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  topInset,
  colorScheme,
  onToggleTheme,
  onLogout,
}) => {
  return (
    <>
      {/* Theme toggle button - top left */}
      <TouchableOpacity
        style={[
          styles.themeButton,
          {
            top: topInset + 12,
            left: 12,
            backgroundColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          },
        ]}
        onPress={onToggleTheme}
      >
        <Ionicons
          name={colorScheme === 'dark' ? 'sunny' : 'moon'}
          size={24}
          color={colorScheme === 'dark' ? '#000000' : '#FFFFFF'}
        />
      </TouchableOpacity>

      {/* Logout button - top right */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            top: topInset + 12,
            right: 12,
          },
        ]}
        onPress={onLogout}
      >
        <Ionicons name="power" size={24} color="#fff" />
      </TouchableOpacity>
    </>
  );
};

