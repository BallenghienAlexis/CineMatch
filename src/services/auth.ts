import { supabase } from './supabase';

export const authService = {
  signup: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Créer le profil immédiatement après signup
      // Note: Le trigger automatique devrait créer le profil,
      // mais on essaie également depuis le client pour plus de fiabilité
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
            });

          if (profileError) {
            // Ignore duplicate key errors (profile already exists from server trigger)
            if (profileError.code === '23505') {
              console.info('Profile already exists (created by server trigger).');
            }
            // If RLS prevents insertion, rely on server-side trigger
            else if (profileError.code === '42501') {
              console.info('RLS policy prevents direct insertion. Relying on server-side trigger.');
            } else {
              throw profileError;
            }
          }
        } catch (profileError: any) {
          console.error('Error during profile creation:', profileError);
          // Ne pas bloquer l'authentification si le profil échoue
        }
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session: data.session, error: null };
    } catch (error: any) {
      return { session: null, error: error.message };
    }
  },

  getUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },
};



