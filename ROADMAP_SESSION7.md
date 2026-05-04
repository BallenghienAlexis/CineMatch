# 🎬 ROADMAP - PROCHAINES ÉTAPES DU PROJET

**Date**: 4 mai 2026 | **Session**: 7+  
**Statut Global**: Core features ✅ | À faire: Film Detail + Search

---

## 📊 ÉTAT ACTUEL (Session 6)

### ✅ COMPLÉTÉ (7/9 fonctionnalités obligatoires)
- [x] **Authentification** (Supabase signup/login/logout)
- [x] **Écran Swipe/Discover** (PanResponder, like/reject)
- [x] **Écran Matches** (films aimés, tri par note)
- [x] **Écran History** (historique avec filtres)
- [x] **TMDB API** (films populaires, cache 1h)
- [x] **Thème Dark/Light** (toggle + persistence)
- [x] **RLS Security** (Supabase policies fixées)
- [x] **Progress Restoration** (reload app = reprendre où on était)

### 🟡 À FAIRE (2/9 obligatoires)
1. **Film Detail Screen** (Fiche film complète)
2. **Search Screen** (Recherche avec debounce)

### 🎁 BONUS (0/2 - Max +2 pts)
- Genre Filters (filtrer avant swipe)
- Reanimated Animations (card rotation smooth)

---

## 🎯 PRIORITÉS

### PRIORITÉ 1: Film Detail Screen ⭐ (Obligatoire)
**Urgence**: HAUTE | **Complexité**: Moyenne | **Points**: +1 (équipe)

#### Ce qu'il affiche:
```
┌─────────────────────────────┐
│  [Poster large]             │
├─────────────────────────────┤
│ Titre + Année + Note (⭐)   │
├─────────────────────────────┤
│ Synopsis (full text)        │
│ Durée: XX min               │
│ Genres: [Tag1] [Tag2]       │
├─────────────────────────────┤
│ 🎬 Lien Bande-annonce [YT]  │
├─────────────────────────────┤
│ Casting (Top 5):            │
│ [Actor 1] - Role 1          │
│ [Actor 2] - Role 2          │
│ ...                         │
└─────────────────────────────┘
```

#### Données TMDB à récupérer:
- `/movie/{id}` → Détails complets
  - `overview` (synopsis)
  - `runtime` (durée en min)
  - `genres[]` (liste genres)
  - `vote_average` (note)
  
- `/movie/{id}/credits` → Casting
  - `cast[]` → Top 5 acteurs + rôles

- `/movie/{id}/videos` → Trailers YouTube
  - Chercher type="Trailer", site="YouTube"
  - Générer URL: `https://www.youtube.com/watch?v={key}`

#### Trigger d'accès:
- Tap sur une carte film (explore, matches, search)
- Navigation: `/(tabs)/explore/detail/:movieId` OR modal

#### Stockage:
- Pas de persistance requise (affichage temp)
- TMDB API déjà cachée 1h

---

### PRIORITÉ 2: Search Screen 📱 (Obligatoire)
**Urgence**: HAUTE | **Complexité**: Moyenne | **Points**: +1 (équipe)

#### UI Layout:
```
┌──────────────────────────────┐
│ [Search Input] 🔍            │ ← Debounce 500ms
├──────────────────────────────┤
│ Résultats (FlatList grille)  │
│ [Poster 1] [Poster 2]        │
│ [Poster 3] [Poster 4]        │
├──────────────────────────────┤
│ [Charger plus] ou pagination │
└──────────────────────────────┘
```

#### Fonctionnalités:
- Input avec debounce 500ms
- `/search/movie?query=...` API call
- Pagination (page 1, 2, 3...)
- Empty state si aucun résultat
- Pull-to-refresh
- Peut tapoter une film → Film Detail

#### État vide suggestions:
- "Tapez pour chercher..."
- "Aucun résultat pour 'xyz'"
- "Erreur lors de la charge"

---

## 📋 ORDRE D'IMPLÉMENTATION

### Étape 1: Setup Film Detail Screen (1-2h)
```bash
# Créer fichier
touch app/(tabs)/detail.tsx

# Ajouter la route
# À: app/(tabs)/_layout.tsx
# Stack.Screen name="detail" (modal)

# Implémenter minimal:
- Header avec poster
- Titre, année, note
- Synopsis basique
- Placeholder casting
```

### Étape 2: Fetch Movie Details (1h)
```typescript
// src/services/tmdb.ts
tmdbService.getMovieDetail(movieId)
  └─ Retourne: synopsis, runtime, genres, credits

tmdbService.getYoutubeTrailerUrl(detail)
  └─ Parse videos[], extrait YouTube URL
```

### Étape 3: Afficher Casting (1h)
```typescript
// Parse credits.cast[]
// Affiche: Nom + Rôle
// Top 5 seulement
// Photos profil TMDB si disponible
```

### Étape 4: Launch Search (1-2h)
```bash
# Créer
touch app/(tabs)/search.tsx

# Ajouter à _layout.tsx
# Stack.Screen name="search"

# Implémenter:
- Input + debounce
- FlatList 2 colonnes
- Pagination avec "Load more"
```

### Étape 5: Polish & Test (1h)
- Erreur handling
- Loading states
- Responsive design
- Navigation fluide

---

## 💾 FILES À CRÉER/MODIFIER

| Fichier | Action | Priorité |
|---------|--------|----------|
| `app/(tabs)/detail.tsx` | NEW | 1 |
| `app/(tabs)/search.tsx` | NEW | 1 |
| `app/(tabs)/_layout.tsx` | MODIFY | 1 |
| `src/services/tmdb.ts` | EXTEND | 1 |
| `HISTORY.md` | UPDATE | 2 |

---

## 🎨 UI MOCKUPS

### Detail Screen
```
Header: Large poster + backdrop overlay
Body: 
  - Title | Year | Rating
  - Genres (Pills)
  - Synopsis (scroll)
  - Duration
  - Trailer button
  - Casting grid
Footer: Back button
```

### Search Screen
```
Header: Large search input + filters
Body: Results grid (2 columns)
Footer: Load more button OR pagination
```

---

## 🧪 TEST CASES

**Film Detail:**
- [ ] Load film populaire → affiche détails corrects
- [ ] Affiche top 5 acteurs
- [ ] Trailer YouTube link works
- [ ] Genres display correctly
- [ ] Responsive sur mobile (portrait + landscape)
- [ ] Back button works
- [ ] Error screen si TMDB API fail

**Search:**
- [ ] Debounce works (attendre 500ms avant request)
- [ ] Results affiche correctement
- [ ] Pagination fonctionne
- [ ] Empty state pour aucun résultat
- [ ] Tap film → Film Detail screen
- [ ] Erreur handling

---

## 📈 POINTS D'ÉVALUATION

Voir `.agents/contexte.md` section **Grille de Notation**:

| Feature | Équipe | Comments |
|---------|--------|----------|
| Film Detail | +1 | Obligatoire |
| Search | +1 | Obligatoire |
| Genre Filters (Bonus) | +1 | Optional |
| Animations (Bonus) | +1 | Optional |

**Total possible**: 9 pts (7 core + 2 bonus)

---

## 🚀 COMMANDES GIT

```bash
# Créer branche feature
git checkout -b feature/film-detail-screen

# Après implémentation
git commit -m "feat(detail): add film detail screen with full info"
git commit -m "feat(search): implement search with debounce"

# Merger vers master
git checkout master
git merge --no-ff feature/film-detail-screen
git push origin master
```

---

## 📞 RÉFÉRENCES

- **Spec complète**: `.agents/contexte.md` (lignes 97-99)
- **Tech stack**: `TECH_STACK.md`
- **Code structure**: `PROJECT_CONTEXT.md`
- **TMDB API docs**: `https://www.themoviedb.org/settings/api`
- **Current status**: `HISTORY.md` Session 6

---

**Status**: 🟡 IN PROGRESS  
**Deadline**: À confirmer  
**Next review**: Après Film Detail + Search implémentés

