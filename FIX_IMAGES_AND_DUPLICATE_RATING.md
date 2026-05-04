# Fix: Affichage des images et doublon de note

## 🔧 Changements réalisés

### 1. ✅ Doublon de note (RÉPARÉ)
- Enlevé l'affichage en doublon dans matches.tsx
- La note s'affiche maintenant **uniquement** via MovieCard (dans l'overlay)

### 2. 📸 Images manquantes (PARTIELLEMENT RÉPARÉ)
- Code modifié pour passer `poster_path` lors de la sauvegarde
- Base de données doit être mise à jour pour stocker les images

## 🚀 Étape pour que ça marche

### 1️⃣ Exécuter le migration SQL dans Supabase

- Ouvrir: https://supabase.com/dashboard
- **SQL Editor**
- Copier le contenu de: `supabase-update-liked-movies.sql`
- **RUN**

```sql
ALTER TABLE liked_movies 
ADD COLUMN IF NOT EXISTS poster_path text;
```

### 2️⃣ Modifier les films existants (optionnel)

Si vous avez déjà des films aimés sauvés, les posters seront vides. Pour les futures likes, les posters seront sauvés automatiquement.

### 3️⃣ Tester

1. Allez à **Découvrir**
2. Swipez un film **à droite** (like)
3. Allez à **Matches** → L'affiche du film devrait s'afficher!
4. **Pull-to-refresh** fonctionne aussi

## 📝 Changements de code

| Fichier | Changement |
|---------|-----------|
| `app/(tabs)/matches.tsx` | Enlevé doublon de note, utilisé `poster_path` du film |
| `src/services/supabase.ts` | Ajouté `poster_path?` au type `LikedMovie` |
| `src/services/database.ts` | `addLikedMovie()` accepte maintenant `posterPath` |
| `app/(tabs)/explore.tsx` | Passe `movie.poster_path` lors du like |

## ✅ Résultat attendu

- ✅ **Matches** affiche les affiches correctement
- ✅ **Pas de doublon** de note
- ✅ **Pull-to-refresh** pour rafraîchir
- ✅ **Safe Area** respectée (notch/status bar)

## ❓ Problèmes?

Si les affiches ne s'affichent **toujours pas**:
1. Vérifiez que la colonne `poster_path` a été ajoutée en Supabase
2. Swipez un **nouveau** film (les anciens auront poster_path = null)
3. Vérifiez que `poster_path` n'est pas vide dans la base de données

