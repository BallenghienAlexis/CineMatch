import { useRouter, useSegments } from 'expo-router';
import { Session, User } from '@supabase/supabase-js';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { authService } from '@/src/services/auth';
import { supabase } from '@/src/services/supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider(props: any) {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const segments = useSegments();

  React.useEffect(() => {
    let isMounted = true;
    let timeoutId: number;

    const initializeAuth = async () => {
      try {
        console.log('[AuthContext] Initializing auth...');

        // Get initial session with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth init timeout')), 5000)
        );

        const sessionPromise = supabase.auth.getSession();
        const { data, error: getSessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise,
        ]) as any;

        if (getSessionError) {
          console.error('[AuthContext] getSession error:', getSessionError);
        } else {
          console.log('[AuthContext] Initial session:', data?.session ? 'Found' : 'Not found');
        }

        if (isMounted) {
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[AuthContext] Initialization error:', error);
        if (isMounted) {
          console.warn('[AuthContext] Setting loading to false due to error');
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth().then(() => {});

    // Safety timeout: if still loading after 10s, force continue
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('[AuthContext] Force stopping loading after timeout');
        setIsLoading(false);
      }
    }, 10000);

    // Subscribe to auth changes
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event);
      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      data?.subscription?.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (isLoading) {
      console.log('[AuthContext] Still loading...');
      return;
    }

    console.log('[AuthContext] Auth initialized - session:', session ? 'Active' : 'None', 'segments:', segments);
    const inAuthGroup = segments[0] === 'auth';

    if (session && inAuthGroup) {
      console.log('[AuthContext] Redirecting to explore (logged in)');
      router.replace('/(tabs)/explore');
    } else if (!session && !inAuthGroup) {
      console.log('[AuthContext] Redirecting to login (not logged in)');
      router.replace('/auth/login');
    }
  }, [session, isLoading, segments]);

  async function signUp(email: string, password: string) {
    try {
      const { user: newUser, error } = await authService.signup(email, password);
      if (error) throw new Error(error);
      setUser(newUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { user: loggedInUser, error } = await authService.login(email, password);
      if (error) throw new Error(error);
      setUser(loggedInUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function signOut() {
    try {
      const { error } = await authService.logout();
      if (error) throw new Error(error);
      setUser(null);
      setSession(null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
