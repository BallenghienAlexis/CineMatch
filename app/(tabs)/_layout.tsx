import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';

export default function TabLayout() {
  const colorScheme = useEffectiveColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      key={`tabs-${colorScheme}`}
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fff' : '#0a7ea4',
        tabBarInactiveTintColor: isDark ? '#888' : '#666',
        tabBarActiveBackgroundColor: isDark ? '#1a1a1a' : '#F5F5F5',
        tabBarInactiveBackgroundColor: isDark ? '#000000' : '#FFFFFF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          color: isDark ? '#fff' : '#000000',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Découvrir',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="film.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Aimés',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historique',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet.rectangle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
