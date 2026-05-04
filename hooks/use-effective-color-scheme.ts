import { useThemeToggle } from '@/src/contexts/ThemeContext';

/**
 * Hook qui retourne le thème actuel du contexte
 * À utiliser à la place de useColorScheme pour respecter le toggle
 */
export function useEffectiveColorScheme(): 'light' | 'dark' {
  const { themeMode } = useThemeToggle();
  return themeMode;
}

