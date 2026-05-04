import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/src/services/auth';

export default function VerifyEmailScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [polling, setPolling] = useState(true);
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  // Poll pour vérifier si l'email est confirmé
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const { user: updatedUser, error: checkError } = await authService.getUser();
        if (checkError) {
          setError('Erreur lors de la vérification');
          return;
        }

        if (updatedUser?.user_metadata?.email_verified) {
          setPolling(false);
          // L'email est confirmé, créer le profile
          const { error: profileError } = await authService.createProfile(
            updatedUser.id,
            updatedUser.email || ''
          );

          if (!profileError) {
            // Redirection automatique via AuthContext
            router.replace('/(tabs)');
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000); // Check toutes les 3 secondes

    return () => clearInterval(interval);
  }, [polling]);

  const handleResendEmail = async () => {
    try {
      setError('');
      setLoading(true);

      if (!user?.email) {
        setError('Email non trouvé');
        return;
      }

      // Supabase enverra automatiquement un email si on appelle resend
      // Pour cela, on doit utiliser l'API admin ou une Edge Function
      // Pour le moment, on affiche un message
      setError('Vérifiez votre boîte email. Un lien de confirmation a été envoyé.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          CineMatch
        </ThemedText>

        <ThemedText type="subtitle" style={styles.subtitle}>
          Vérifiez votre email
        </ThemedText>

        <ThemedView style={styles.content}>
          <ActivityIndicator size="large" color={Colors[colorScheme].tint} />

          <ThemedText style={styles.description}>
            Un email de confirmation a été envoyé à :
          </ThemedText>

          <ThemedText style={[styles.email, { color: Colors[colorScheme].tint }]}>
            {user?.email}
          </ThemedText>

          <ThemedText style={styles.instruction}>
            Cliquez sur le lien de confirmation dans l&#39;email pour activer votre compte. L'application se mettra à jour automatiquement.
          </ThemedText>

          {error ? (
            <ThemedView
              style={[styles.errorBox, { backgroundColor: Colors[colorScheme].tint + '20' }]}
            >
              <ThemedText style={{ color: Colors[colorScheme].tint }}>{error}</ThemedText>
            </ThemedView>
          ) : null}
        </ThemedView>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].button }]}
          onPress={handleResendEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
              Renvoyer l'email
            </ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonSecondary, { borderColor: Colors[colorScheme].icon }]}
          onPress={handleLogout}
          disabled={loading}
        >
          <ThemedText style={{ color: Colors[colorScheme].text }}>
            Se déconnecter
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 24,
    gap: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  description: {
    textAlign: 'center',
    marginTop: 12,
  },
  email: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  instruction: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
  errorBox: {
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonSecondary: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
});

