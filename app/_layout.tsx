import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/src/contexts/AuthContext';
import { ThemeToggleProvider, useThemeToggle } from '@/src/contexts/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Thème clair amélioré avec meilleure visibilité
const LightThemeImproved = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0a7ea4',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    border: '#E5E5E5',
    notification: '#0a7ea4',
  },
};

// Thème sombre amélioré
const DarkThemeImproved = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#fff',
    background: '#000000',
    card: '#1a1a1a',
    text: '#ECEDEE',
    border: '#2a2a2a',
    notification: '#fff',
  },
};

function RootLayoutContent() {
  const { themeMode } = useThemeToggle();

  // Utiliser le thème forcé
  const isDark = themeMode === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkThemeImproved : LightThemeImproved}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeToggleProvider>
        <RootLayoutContent />
      </ThemeToggleProvider>
    </AuthProvider>
  );
}
