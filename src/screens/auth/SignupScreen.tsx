import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/src/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  const handleSignup = async () => {
    try {
      setError('');
      setLoading(true);

      if (!email || !password || !confirmPassword) {
        setError('Tous les champs sont obligatoires');
        return;
      }

      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }

      await signUp(email, password);
    } catch (err: any) {
      setError(err.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          CineMatch
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Créer un compte
        </ThemedText>

        {error ? (
          <ThemedView
            style={[styles.errorBox, { backgroundColor: Colors[colorScheme].tint + '20' }]}
          >
            <ThemedText style={{ color: Colors[colorScheme].tint }}>{error}</ThemedText>
          </ThemedView>
        ) : null}

        <TextInput
          style={[
            styles.input,
            {
              borderColor: Colors[colorScheme].icon,
              color: Colors[colorScheme].text,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={Colors[colorScheme].icon}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          autoCapitalize="none"
        />

        <TextInput
          style={[
            styles.input,
            {
              borderColor: Colors[colorScheme].icon,
              color: Colors[colorScheme].text,
            },
          ]}
          placeholder="Mot de passe"
          placeholderTextColor={Colors[colorScheme].icon}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TextInput
          style={[
            styles.input,
            {
              borderColor: Colors[colorScheme].icon,
              color: Colors[colorScheme].text,
            },
          ]}
          placeholder="Confirmer le mot de passe"
          placeholderTextColor={Colors[colorScheme].icon}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].button }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>S'inscrire</ThemedText>
          )}
        </TouchableOpacity>

        <ThemedView style={styles.footer}>
          <ThemedText>Vous avez déjà un compte ? </ThemedText>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <ThemedText type="link">Se connecter</ThemedText>
          </TouchableOpacity>
        </ThemedView>
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
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  errorBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});

