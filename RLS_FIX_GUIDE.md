# 🔐 Fix RLS Error: Profile Creation Failed

## Problème
Lors de la création d'un compte, l'erreur suivante apparaît:
```
ERROR Profile creation failed: {"code": "42501", "message": "new row violates row-level security policy for table \"profiles\""}
```

## Cause
La politique RLS (Row-Level Security) de la table `profiles` empêche les utilisateurs de créer leur propre profil.

## Solution

### Option 1: Exécuter le script SQL (Recommandé)

1. Allez sur **Supabase Dashboard** → **SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu de `supabase-fix-rls.sql`
4. Cliquez **Run** pour exécuter le script

Le script va:
- ✅ Corriger les politiques RLS pour `profiles`
- ✅ Créer un trigger automatique pour générer le profil à la création du compte
- ✅ Accorder les permissions nécessaires aux utilisateurs authentifiés

### Option 2: Exécuter les commandes manuellement

Si vous préférez, exécutez chaque commande SQL du fichier une par une.

---

## ✅ Vérification

Après exécution, testez:

1. **Créez un nouveau compte** dans l'app
2. **Vérifiez** que le profil est créé automatiquement:
   ```sql
   SELECT * FROM profiles WHERE email = 'votreemail@example.com';
   ```

---

## 📋 Détails techniques

### Politiques RLS mises en place:

| Action | Politique | Condition |
|--------|-----------|-----------|
| SELECT | Users can view their own profile | `auth.uid() = id` |
| INSERT | Users can insert their own profile | `auth.uid() = id` |
| UPDATE | Users can update their own profile | `auth.uid() = id` |
| DELETE | Users can delete their own profile | `auth.uid() = id` |

### Trigger automati

que:
- **Nom**: `on_auth_user_created`
- **Déclenché**: Après INSERT dans `auth.users`
- **Action**: Crée automatiquement le profil utilisateur
- **Fonction**: `public.handle_new_user()`

---

## 🆘 Si ça ne marche toujours pas

1. **Réinitialisez les politiques**:
   - Allez à **Database** → **Policies** (pour `profiles`)
   - Supprimez toutes les politiques existantes
   - Refaites l'autorisation par SQL

2. **Vérifiez RLS est activé**:
   - **Database** → **Tables** → `profiles`
   - Vérifiez que "Enable RLS" est **coché**

3. **Vérifiez les triggers**:
   - **Database** → **Triggers**
   - Vérifiez que `on_auth_user_created` existe

4. **Vérifiez la table `profiles`**:
   - Vérifiez que les colonnes `id` (UUID) et `email` (TEXT) existent
   - Vérifiez que `id` est clé primaire

---

## 📞 Support

Si le problème persiste:
1. Consultez les logs Supabase: **Database** → **Logs**
2. Vérifiez l'onglet **Network** dans le navigateur (erreur API)
3. Contrôlez que les colonnes de `profiles` correspondent au code

---

**Créé**: 4 mai 2026  
**Statut**: ✅ Solution complète fournie

