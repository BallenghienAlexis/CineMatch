# 📊 CONTEXTE COMPLET DU PROJET CINEMATCH

**Date**: 4 mai 2026  
**Statut**: En développement (Session 6)  
**Version**: 1.0.0

---

## 🎯 RÉSUMÉ EXÉCUTIF

**CineMatch** est une application mobile React Native (Expo) permettant à des groupes d'amis de choisir un film ensemble via un système de "swipe" (semblable à Tinder). Chaque utilisateur swipe les films en secret, et l'application affiche les films aimés par tout le monde.

**Contexte académique**: Projet d'évaluation SUP de VINCI Master 1 React Native (équipe de 2-3 personnes)

---

## 📱 ARCHITECTURE TECHNIQUE

### Stack Technologique
```
Frontend        : React Native + Expo SDK 54
Langage         : TypeScript 5.9 (strict mode)
Framework nav.  : Expo Router v6 (file-based routing)
UI Components   : React Native StyleSheet + ThemedText/ThemedView
État            : React Context API
Animations      : React Native Reanimated 4.1
Gestes          : PanResponder natif + react-native-gesture-handler
Backend         : Supabase (PostgreSQL + Auth JWT)
API Externe     : The Movie Database (TMDB) REST
Stockage Local  : AsyncStorage + Expo SecureStore
Dev Tools       : ESLint 9.25 + TypeScript strict
```

### Versions clés
- `expo@54.0.33`
- `react@19.1.0`
- `react-native@0.81.5`
- `@supabase/supabase-js@2.43.1`
- `expo-router@6.0.23`
- `react-native-reanimated@4.1.1`

---

## 📁 STRUCTURE DU PROJET

```
CineMatch/
├── app/                           # Expo Router (file-based routing)
│   ├── _layout.tsx                # Root layout (Auth + Theme + Stack)
│   ├── modal.tsx                  # Modal de démo
│   └── (tabs)/                    # Tab navigation group
│       ├── _layout.tsx            # Tabs layout (3 onglets)
│       ├── explore.tsx            # 🎬 Écran Swipe (principal)
│       ├── matches.tsx            # ❤️ Films aimés
│       └── history.tsx            # 📜 Historique des swipes
│
├── src/                           # Code métier
│   ├── components/
│   │   └── MovieCard.tsx          # Composant réutilisable Film
│   ├── contexts/
│   │   └── AuthContext.tsx        # Gestion de l'authentification
│   ├── services/
│   │   ├── supabase.ts            # Client Supabase + types
│   │   ├── auth.ts                # Fonctions auth (signup/login)
│   │   ├── database.ts            # Requêtes Supabase (films, historique)
│   │   └── tmdb.ts                # API TMDB (films populaires, recherche)
│   ├── screens/
│   │   └── auth/
│   │       ├── LoginScreen.tsx
│   │       └── SignupScreen.tsx
│   ├── hooks/
│   │   └── useFormatting.ts       # Utilitaires (debounce, date, année)
│
├── components/                    # Composants Expo Starter (réutilisables)
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   ├── haptic-tab.tsx
│   ├── parallax-scroll-view.tsx
│   ├── external-link.tsx
│   └── ui/
│       ├── icon-symbol.tsx
│       └── icon-symbol.ios.tsx
│
├── constants/
│   └── theme.ts                   # Palettes couleur light/dark
│
├── hooks/
│   ├── use-color-scheme.ts        # Détection mode clair/sombre
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── assets/
│   └── images/                    # Icônes, splash, favicon
│
├── .agents/                       # Documentation pour IA & équipe
│   ├── AGENTS.md                  # Guide pour agents IA
│   ├── contexte.md                # Spécification évaluation
│   ├── GIT_COMMIT_GUIDELINES.md   # Standards commits Git
│   └── README.md
│
├── .env.local                     # ⚠️ SECRETS (gitignored)
│   ├── EXPO_PUBLIC_TMDB_API_KEY
│   ├── EXPO_PUBLIC_SUPABASE_URL
│   └── EXPO_PUBLIC_SUPABASE_ANON_KEY
│
├── app.json                       # Config Expo
├── package.json                   # Dépendances
├── tsconfig.json                  # Config TypeScript strict
├── eslint.config.js               # Config ESLint
├── HISTORY.md                     # Changelog par session
├── README.md                       # Guide utilisateur
└── PROJECT_CONTEXT.md             # Ce fichier 📄
```

---

## 🔐 AUTHENTIFICATION (Supabase)

### Flux
1. **Signup**: Email + mot de passe → Crée `auth.users` + `profiles`
2. **Login**: Email + mot de passe → Récupère JWT session
3. **Persist**: JWT sauvegardé dans SecureStore (iOS/Android) ou AsyncStorage (web)
4. **AuthContext**: Écoute `onAuthStateChange` pour navigation automatique

### Fichiers clés
- `src/services/auth.ts` - Services (signup, login, logout)
- `src/contexts/AuthContext.tsx` - Context + Hook `useAuth()`
- `src/screens/auth/LoginScreen.tsx` - UI Connexion
- `src/screens/auth/SignupScreen.tsx` - UI Inscription

### Sécurité
- Tokens JWT dans SecureStore (natif) ou AsyncStorage (web)
- RLS (Row-Level Security) sur toutes les tables Supabase
- Variables d'env jamais hardcodées

---

## 🎬 ÉCRANS & NAVIGATION

### Structure de navigation

```
AuthContext (Root)
    ├─ Non authentifié → /auth/login
    │   ├─ login.tsx (redirect vers signup)
    │   └─ signup.tsx (redirect vers login)
    │
    └─ Authentifié → /(tabs)
        ├─ Discover (explore.tsx) 🎬
        │   Swipe UI avec PanResponder
        │   Sauve likes/rejects dans Supabase
        │
        ├─ Matches (matches.tsx) ❤️
        │   Affiche films aimés triés par note
        │   Pull-to-refresh
        │
        └─ History (history.tsx) 📜
            Historique des swipes
            Filtres: Tous/Aimés/Rejetés
```

### Écran Discover (explore.tsx)
**Fonctionnalités** ✅
- Affiche 1 film à la fois (poster + titre + année + note)
- Gestes swipe: Droite = Like ❤️, Gauche = Reject ✕
- Données persistées en temps réel dans Supabase
- Pagination auto (20 films/page TMDB)
- Restauration de progression au reload (Session 6)
- Feedback visuel: Fond vert à droite, rouge à gauche

**Refs & Caching**
```
moviesRef.current       : Array films chargés
currentIndexRef.current : Position actuelle
pageRef.current         : Page TMDB active
hasLoadedRef            : Flag (une seule init)
```

### Écran Matches (matches.tsx)
**Fonctionnalités** ✅
- Récupère films aimés triés par note
- Affiche en grille 2 colonnes
- Pull-to-refresh
- Empty state dédié

### Écran History (history.tsx)
**Fonctionnalités** ✅
- Affiche tous les swipes (likes + rejects) triés par date récente
- Filtres: All / Likes ❤️ / Rejects ✕
- Dates formatées en français
- Empty state

---

## 🌐 INTÉGRATIONS EXTERNES

### TMDB API (The Movie Database)

**Endpoints utilisés**
```
GET /movie/popular?page=1           # Films populaires paginés
GET /movie/{id}                     # Détails film + credits + vidéos
GET /search/movie?query=...         # Recherche films
```

**Configuration**
- Clé API: `process.env.EXPO_PUBLIC_TMDB_API_KEY`
- Base URL: `https://api.themoviedb.org/3`
- Images: `https://image.tmdb.org/t/p/w500{posterPath}`
- Langue: Français (`fr-FR`)

**Service** (`src/services/tmdb.ts`)
```typescript
tmdbService.getPopularMovies(page)  // → Movie[]
tmdbService.searchMovies(query)     // → Movie[]
tmdbService.getMovieDetail(id)      // → MovieDetail (+ credits, vidéos)
tmdbService.getPosterUrl(path)      // → URL complète
tmdbService.getYoutubeTrailerUrl()  // → URL trailer
tmdbService.getTopCast()            // → Top 5 acteurs
```

**Cache**
- Simple Map en mémoire
- Durée: 1 heure par page
- Méthode: `tmdbService.clearCache()`

---

## 💾 BASE DE DONNÉES (Supabase/PostgreSQL)

### Schéma

#### `profiles`
```sql
id          UUID PK (FK auth.users)
email       TEXT
created_at  TIMESTAMP
```

#### `liked_movies`
```sql
id          SERIAL PK
user_id     UUID FK (profiles)
movie_id    INT (TMDB ID)
movie_title TEXT
movie_rating FLOAT
poster_path TEXT
created_at  TIMESTAMP
```

#### `swipe_history`
```sql
id          SERIAL PK
user_id     UUID FK (profiles)
movie_id    INT (TMDB ID)
movie_title TEXT
action      ENUM('like', 'reject')
created_at  TIMESTAMP
```

### Services (`src/services/database.ts`)
```typescript
databaseService.getLikedMovies(userId)
databaseService.addLikedMovie(userId, movieId, title, rating, posterPath)
databaseService.removeLikedMovie(userId, movieId)
databaseService.addSwipeHistory(userId, movieId, title, action)
databaseService.getSwipeHistory(userId)
```

### RLS (Row-Level Security)
✅ Tout les utilisateurs ne voient que **leurs propres** données

---

## 🎨 THÈME & STYLING

### Palettes
**Light Mode**
```
text        : #11181C (noir foncé)
background  : #fff (blanc)
tint        : #0a7ea4 (bleu)
icon        : #687076 (gris)
button      : #0a7ea4 (bleu)
```

**Dark Mode**
```
text        : #ECEDEE (gris clair)
background  : #151718 (presque noir)
tint        : #fff (blanc)
icon        : #9BA1A6 (gris moyen)
button      : #0a7ea4 (bleu défaut)
```

### Composants Thématisés
```typescript
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
// Adaptent couleurs automatiquement au mode
```

### Stylings Localisés
```typescript
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  // ...
})
```

---

## 🔧 HOOKS UTILITAIRES

### `useFormatting.ts`
```typescript
useDebounce<T>(value, delay=500)        // Retarde changements (recherche)
useFormatDate(dateString)               // "4 mai 2026"
useGetYear(dateString)                  // "2026"
useFormatRuntime(minutes)               // "1h 45min"
```

### `use-color-scheme.ts`
```typescript
useColorScheme()                        // "light" | "dark" | null
useThemeColor(lightColor, darkColor)    // Retourne couleur adaptée
```

---

## 📊 FLUX DE DONNÉES

### Login/Signup Flow
```
TextInput (email/pwd) 
    ↓ (handleLogin/handleSignup)
AuthContext (signIn/signUp)
    ↓
authService.login() / authService.signup()
    ↓
Supabase Auth API
    ↓
JWT + Session sauvegardée
    ↓
onAuthStateChange déclenché
    ↓
Navigation auto: /auth → /(tabs)
```

### Swipe Flow
```
MovieCard affichée
    ↓ (geste PanResponder)
pan.x.setValue(dx)
Feedback visuel (fond vert/rouge)
    ↓ (threshold atteint)
animateSwipe('like'/'reject')
    ↓
databaseService.addSwipeHistory()
databaseService.addLikedMovie() [si like]
    ↓
Supabase INSERT
    ↓
setCurrentIndex++
Auto-pagination si remaining ≤ 3
```

### Restauration de Progression (Session 6)
```
App reload (R pressed)
    ↓
useEffect (hasLoadedRef.current check)
    ↓
databaseService.getSwipeHistory(userId)
    → swipeCount = history.length
    ↓
Calculer: targetPage = swipeCount / 20 + 1
    ↓
Charger TOUTES les pages 1 → targetPage
    ↓
setCurrentIndex = swipeCount
    ✅ Utilisateur voit film N+1
```

---

## 🧪 ÉTAT DE DÉVELOPPEMENT

### ✅ COMPLÉTÉ (Session 6)
- [x] Authentification Supabase (signup/login)
- [x] Navigation Auth + Tab
- [x] Écran Swipe (Discover) avec PanResponder
- [x] Like/Reject persistance Supabase
- [x] Écran Matches (films aimés)
- [x] Écran History (historique avec filtres)
- [x] TMDB API intégration
- [x] Dark/Light mode
- [x] Français localization
- [x] **Progress restoration on reload**

### 🟡 EN COURS
- [ ] Écran Film Detail (synopsis, casting, trailer)
- [ ] Recherche (avec debounce)

### 🎁 BONUS (Non prioritaire)
- [ ] Filtres par genre
- [ ] Animations Reanimated avancées

---

## 📝 CONFIGURATION REQUISE

### `.env.local` (Ne JAMAIS commit)
```env
EXPO_PUBLIC_TMDB_API_KEY=your_key_here
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Obtenir les clés
1. **TMDB**: https://www.themoviedb.org/settings/api
2. **Supabase**: Dashboard projet → Settings → API

---

## 🚀 DÉMARRAGE RAPIDE

```bash
# Installation
npm install

# Dev (Expo Go)
npm start          # Puis: i (iOS) ou a (Android) ou w (Web)

# Linting
npm run lint

# Autres variables
EXPO_PUBLIC_TMDB_API_KEY=...
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 📚 DOCUMENTATION ASSOCIÉE

| Fichier | Contenu |
|---------|---------|
| `.agents/contexte.md` | Spec évaluation complète (14 pts grille) |
| `.agents/AGENTS.md` | Guide pour agents IA |
| `.agents/GIT_COMMIT_GUIDELINES.md` | Standards commits Git |
| `HISTORY.md` | Changelog détaillé par session |
| `README.md` | Guide utilisateur final |
| `PROJECT_CONTEXT.md` | Ce document 📄 |

---

## 🎓 POINTS D'ÉVALUATION CLÉS

**Équipe (14 pts)**
- Fonctionnalités: 7 pts (core) + 2 pts (bonus)
- Code: 3 pts (architecture, qualité, réutilisabilité)
- UX: 1 pt (responsive, accessible, empty states)
- Git: 1.5 pts (historique régulier, messages clairs)

**Individuel (4 pts)**
- Doc contribution: 2 pts
- Utilisation IA: 2 pts

---

## 🔮 PROCHAINES PRIORITÉS

1. **Film Detail Screen** - Synopsis, genres, casting, trailer YouTube
2. **Search Screen** - Debounced search + pagination
3. **Genre Filters** (Bonus) - Filter before exploring
4. **Reanimated Animations** (Bonus) - Smooth card rotation on swipe

---

**Mis à jour**: 4 mai 2026 | Session 6  
**État**: En développement actif

