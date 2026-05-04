import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const ExpoSecureStorage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        return AsyncStorage.getItem(key);
      }
      return SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        return AsyncStorage.setItem(key, value);
      }
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        return AsyncStorage.removeItem(key);
      }
      return SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Profile = {
  id: string;
  email: string;
  created_at: string;
};

export type LikedMovie = {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  movie_rating: number;
  created_at: string;
};

export type SwipeHistory = {
  id: string;
  user_id: string;
  movie_id: number;
  movie_title: string;
  action: 'like' | 'reject';
  created_at: string;
};

