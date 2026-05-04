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
  const [isEmailVerified, setIsEmailVerified] = React.useState(false);
  const router = useRouter();
  const segments = useSegments();

  React.useEffect(() => {
    const unsubscribe = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // Vérifier si l'email est confirmé
      if (currentUser) {
        const emailVerified = currentUser.user_metadata?.email_verified ?? false;
        setIsEmailVerified(emailVerified);
      } else {
        setIsEmailVerified(false);
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribe.data.subscription?.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inVerifyGroup = segments[1] === 'verify-email';

    // Si utilisateur a email non vérifié, rediriger vers vérification
    if (user && !isEmailVerified && !inVerifyGroup) {
      router.replace('/auth/verify-email');
    } else if (user && isEmailVerified && inAuthGroup) {
      // Si email vérifié et connecté, rediriger vers app
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      // Si pas connecté, rediriger vers login
      router.replace('/auth/login');
    }
  }, [user, isEmailVerified, isLoading, segments]);

  async function signUp(email: string, password: string) {
    try {
      const { user: newUser, error } = await authService.signup(email, password);
      if (error) throw new Error(error);
      setUser(newUser);
      setIsEmailVerified(false);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { user: loggedInUser, error } = await authService.login(email, password);
      if (error) throw new Error(error);
      setUser(loggedInUser);
      // Vérifier l'état de vérification email
      if (loggedInUser) {
        const emailVerified = loggedInUser.user_metadata?.email_verified ?? false;
        setIsEmailVerified(emailVerified);
      }
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
      setIsEmailVerified(false);
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
    <AuthContext.Provider value={{ user, session, isLoading, isEmailVerified, signUp, signIn, signOut }}>
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

