import React, { createContext, useState, useCallback, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeToggleContext = createContext<ThemeContextType>({
  themeMode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export function ThemeToggleProvider(props: any) {
  const systemColorScheme = useSystemColorScheme();
  const [forcedTheme, setForcedTheme] = useState<ThemeMode | null>(null);

  // Déterminer le thème actuel: forcé ou système
  const themeMode = useMemo(() => {
    if (forcedTheme) return forcedTheme;
    return (systemColorScheme === 'dark' ? 'dark' : 'light') as ThemeMode;
  }, [forcedTheme, systemColorScheme]);

  const toggleTheme = useCallback(() => {
    setForcedTheme((prev) => {
      if (prev === 'dark') return 'light';
      return 'dark';
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setForcedTheme(mode);
  }, []);

  return (
    <ThemeToggleContext.Provider value={{ themeMode, toggleTheme, setThemeMode }}>
      {props.children}
    </ThemeToggleContext.Provider>
  );
}

export function useThemeToggle() {
  const context = React.useContext(ThemeToggleContext);
  if (!context) {
    throw new Error('useThemeToggle must be used within ThemeToggleProvider');
  }
  return context;
}

