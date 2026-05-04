import { useEffect, useState } from 'react';

/**
 * Hook useDebounce pour retarder les changements de valeur
 * Utile pour la recherche (évite trop de requêtes API)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook pour formater les dates en français
 */
export function useFormatDate(dateString: string | null): string {
  if (!dateString) return 'Date inconnue';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return 'Date inconnue';
  }
}

/**
 * Hook pour obtenir l'année d'une date
 */
export function useGetYear(dateString: string | null): string {
  if (!dateString) return '';
  try {
    const year = new Date(dateString).getFullYear();
    return year.toString();
  } catch {
    return '';
  }
}

/**
 * Hook pour formater la durée en minutes (hh:mm)
 */
export function useFormatRuntime(minutes: number): string {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
}

