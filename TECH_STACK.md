# 🔧 TECHNOLOGIES & DÉPENDANCES - CINEMATCH

**Date**: 4 mai 2026  
**Version**: Expo SDK 54

---

## 📦 DÉPENDANCES PRINCIPALES

### Core Framework
| Package | Version | Usage |
|---------|---------|-------|
| `expo` | ~54.0.33 | Platform/SDK |
| `react` | 19.1.0 | UI Framework |
| `react-native` | 0.81.5 | Mobile Runtime |
| `expo-router` | ~6.0.23 | File-based routing |
| `typescript` | ~5.9.2 | Type safety (strict mode) |

### Navigation & UI
| Package | Version | Usage |
|---------|---------|-------|
| `@react-navigation/native` | ^7.1.8 | Router foundation |
| `@react-navigation/bottom-tabs` | ^7.4.0 | Tab navigation |
| `@react-navigation/elements` | ^2.6.3 | Nav helpers |
| `react-native-safe-area-context` | ~5.6.0 | Safe area (notch) |
| `react-native-screens` | ~4.16.0 | Nav optimization |
| `expo-status-bar` | ~3.0.9 | Status bar control |

### Animations & Gestures
| Package | Version | Usage |
|---------|---------|-------|
| `react-native-reanimated` | ~4.1.1 | Advanced animations (bonus) |
| `react-native-worklets` | 0.5.1 | Reanimated support |
| `react-native-gesture-handler` | ~2.28.0 | Swipe/gesture detection |

### Backend & Auth
| Package | Version | Usage |
|---------|---------|-------|
| `@supabase/supabase-js` | ^2.43.1 | Database + Auth |
| `expo-secure-store` | ^13.0.0 | Secure JWT storage (iOS/Android) |
| `@react-native-async-storage/async-storage` | ^1.23.1 | Local cache + web fallback |

### Media & Icons
| Package | Version | Usage |
|---------|---------|-------|
| `expo-image` | ~3.0.11 | Optimized image loading |
| `expo-font` | ~14.0.11 | Custom fonts |
| `@expo/vector-icons` | ^15.0.3 | Icon library (SF Symbols) |
| `expo-symbols` | ~1.0.8 | Native SF Symbols |

### Utilities
| Package | Version | Usage |
|---------|---------|-------|
| `expo-constants` | ~18.0.13 | App config access |
| `expo-haptics` | ~15.0.8 | Haptic feedback (press) |
| `expo-linking` | ~8.0.11 | Deep links + auth redirects |
| `expo-web-browser` | ~15.0.10 | In-app browser (links) |
| `expo-splash-screen` | ~31.0.13 | Splash screen management |
| `react-native-web` | ~0.21.0 | Web support |

### Dev Dependencies
| Package | Version | Usage |
|---------|---------|-------|
| `@types/react` | ~19.1.0 | React TypeScript definitions |
| `eslint` | ^9.25.0 | Linting |
| `eslint-config-expo` | ~10.0.0 | Expo ESLint rules |

---

## 🏛️ ARCHITECTURE DES SERVICES

### `src/services/supabase.ts`
**Responsabilité**: Client Supabase configuré + types globaux

```typescript
// Export unique
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStorage,  // Secure storage natif
    autoRefreshToken: true,
    persistSession: true,
  }
})

// Types exportés
export type Profile { id, email, created_at }
export type LikedMovie { id, user_id, movie_id, title, rating, poster_path, created_at }
export type SwipeHistory { id, user_id, movie_id, title, action, created_at }
```

### `src/services/auth.ts`
**Responsabilité**: Fonctions d'authentification (signup, login, logout)

```typescript
authService.signup(email, password)    // → { user, error }
authService.login(email, password)     // → { user, error }
authService.logout()                   // → { error }
authService.getSession()               // → { session, error }
authService.getUser()                  // → { user, error }
```

**Note**: Crée profile dans Supabase post-signup

### `src/services/database.ts`
**Responsabilité**: Requêtes Supabase (films aimés, historique)

```typescript
// Liked movies
databaseService.getLikedMovies(userId)     // → LikedMovie[]
databaseService.addLikedMovie(...)         // → LikedMovie
databaseService.removeLikedMovie(...)      // → { error }

// Swipe history
databaseService.getSwipeHistory(userId)    // → SwipeHistory[]
databaseService.addSwipeHistory(...)       // → SwipeHistory
```

### `src/services/tmdb.ts`
**Responsabilité**: API TMDB avec cache 1h

```typescript
// Fetch
tmdbService.getPopularMovies(page)         // → SearchResult
tmdbService.searchMovies(query, page)      // → SearchResult
tmdbService.getMovieDetail(movieId)        // → MovieDetail

// Helpers
tmdbService.getPosterUrl(posterPath)       // → URL string
tmdbService.getYoutubeTrailerUrl(detail)   // → YouTube URL
tmdbService.getTopCast(detail)             // → Cast[]

// Utility
tmdbService.clearCache()                   // Flush cache
```

**Types**:
```typescript
type Movie {
  id, title, release_date, poster_path, vote_average, overview, genre_ids
}
type MovieDetail extends Movie {
  runtime, genres[], credits { cast[] }, videos { results[] }
}
type SearchResult {
  results: Movie[], page, total_pages, total_results
}
```

---

## 🎣 CONTEXTES & HOOKS

### `src/contexts/AuthContext.tsx`
**Responsabilité**: État auth global + navigation auto

```typescript
type AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp(email, password): Promise<void>
  signIn(email, password): Promise<void>
  signOut(): Promise<void>
}

export function useAuth(): AuthContextType
```

**Comportement**:
- Écoute `onAuthStateChange` (Supabase)
- Route auto: `/auth` si non connecté, `/(tabs)` si connecté
- Gère loading state

### `src/hooks/useFormatting.ts`
**Responsabilité**: Utilitaires format

```typescript
useDebounce<T>(value, delay=500)           // Delay changement
useFormatDate(dateString)                  // "4 mai 2026"
useGetYear(dateString)                     // "2026"
useFormatRuntime(minutes)                  // "1h 45min"
```

### `hooks/use-color-scheme.ts` / `hooks/use-color-scheme.web.ts`
**Responsabilité**: Détection mode clair/sombre

```typescript
useColorScheme()                           // "light" | "dark" | null
useThemeColor(lightColor, darkColor)       // Retourne couleur appropriée
```

---

## 🧩 COMPOSANTS RÉUTILISABLES

### `src/components/MovieCard.tsx`
**Props**: `{ movie: Movie, showOverlay?: boolean }`

**Affichage**:
- Image poster (85% hauteur)
- Titre + année + note (15% hauteur)
- Overlay noir semi-transparent
- Fallback si pas de poster

**Usage**: Explore, Matches, Search

### `components/themed-text.tsx`
**Props**: `{ type?: 'title' | 'subtitle' | 'link', ...TextProps }`

**Variantes**: Title, Subtitle, Default, Link

### `components/themed-view.tsx`
**Props**: `{ lightColor?, darkColor?, ...ViewProps }`

**Comportement**: Adapte background au mode

### `components/haptic-tab.tsx`
**Responsabilité**: Feedback haptic on tab press

**Usage**: Tab navigation

---

## 📁 ORGANISATION FICHIERS CLÉS

### Navigation (Expo Router)
```
app/
├── _layout.tsx                    # Root: AuthProvider + ThemeProvider + Stack
├── modal.tsx                      # Modal de démo
└── (tabs)/
    ├── _layout.tsx                # Tabs: 3 screens
    ├── explore.tsx                # Swipe UI
    ├── matches.tsx                # Liked films
    └── history.tsx                # Swipe history
```

### Écrans Auth
```
app/auth/
├── _layout.tsx
├── login.tsx                      # → LoginScreen
└── signup.tsx                     # → SignupScreen

src/screens/auth/
├── LoginScreen.tsx                # Form + handleLogin
└── SignupScreen.tsx               # Form + handleSignup
```

### Theme & Styling
```
constants/
└── theme.ts                       # Colors (light/dark palette)
                                   # Fonts definition

hooks/
├── use-color-scheme.ts
├── use-color-scheme.web.ts
└── use-theme-color.ts
```

---

## 🔐 VARIABLES D'ENVIRONNEMENT

### Format `.env.local` (Gitignored)
```env
EXPO_PUBLIC_TMDB_API_KEY=sk_...
EXPO_PUBLIC_SUPABASE_URL=https://...supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Accès en code
```typescript
import Constants from 'expo-constants'

const key = process.env.EXPO_PUBLIC_TMDB_API_KEY
// ou
const key = Constants.expoConfig?.extra?.tmdbKey
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### Caching TMDB
```typescript
const movieCache = new Map<string, { data, timestamp }>()
const CACHE_DURATION = 1000 * 60 * 60  // 1 heure

// Auto-cache sur chaque fetch getPopularMovies, searchMovies, getMovieDetail
```

### Debounce Search
```typescript
const debouncedQuery = useDebounce(searchInput, 500)

// Requête API déclenchée seulement si debouncedQuery change
```

### Refs pour gestures (explore.tsx)
```typescript
moviesRef.current         // Avoid re-render during swipe
currentIndexRef.current   // Atomic index access
pageRef.current           // Page number tracking
panResponderRef.current   // PanResponder instance
```

### Image Loading
```typescript
<Image source={{ uri: posterUrl }} />  // expo-image handle cache
```

---

## 🧪 TESTING & VALIDATION

### ESLint
```bash
npm run lint          # Check all
```

**Config**: `eslint.config.js` (Expo flat config)

### TypeScript Strict
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## 📱 PLATEFORME SPÉCIFIQUE

### iOS
- Secure storage via `expo-secure-store` (Keychain)
- SF Symbols pour icons
- TabBar natif sous iOS 13+

### Android
- Secure storage via `expo-secure-store` (Keystore)
- Material icons fallback
- Edge-to-edge enabled

### Web
- AsyncStorage pour session (localStorage)
- Web color scheme hydration
- Responsive design

---

## 🚀 COMMANDES

```bash
# Installation
npm install

# Dev
npm start              # QR code Expo Go
npm run android       # Android Emulator
npm run ios           # iOS Simulator
npm run web           # Web browser

# Vérif
npm run lint

# Destructif (éviter)
npm run reset-project # Archivez app, components, etc.
```

---

## 📊 DÉPENDANCE GRAPHIQUE

```
expo
├── react-native
│   ├── react
│   └── PanResponder (natif)
│
├── expo-router (React Navigation)
│   ├── @react-navigation/native
│   ├── @react-navigation/bottom-tabs
│   └── react-native-screens
│
├── supabase
│   ├── @supabase/supabase-js
│   ├── crypto (auth JWT)
│   └── realtime (websockets)
│
├── Animations
│   ├── react-native-reanimated
│   └── react-native-gesture-handler
│
├── Storage
│   ├── expo-secure-store
│   └── async-storage
│
├── UI
│   ├── expo-icons (@expo/vector-icons)
│   └── @react-navigation/elements
│
└── Web
    └── react-native-web
```

---

## 🔄 DATA FLOW COMPLET

```
User Input (TextInput/Swipe)
    ↓
Handler (handleLogin / animateSwipe)
    ↓
Service Call (authService / databaseService / tmdbService)
    ↓
Fetch/Supabase API call
    ↓
Response → State update (useState)
    ↓
Component re-render
    ↓
UI update
```

---

**Document créé**: 4 mai 2026  
**Prochaine révision**: Après Session 7

