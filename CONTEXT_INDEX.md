# 📖 INDEX DU CONTEXTE CINEMATCH

**Date**: 4 mai 2026  
**Créé pour**: Compréhension rapide et complète du projet

---

## 📚 DOCUMENTS DE CONTEXTE (CRÉÉS)

### 1. 🚀 **QUICK_START.md** ← **COMMENCER ICI**
- **Pour**: Développeurs qui veulent comprendre en 5 min
- **Contient**: 
  - Cas d'usage visuels (ASCII diagrams)
  - Flux authentification détaillé
  - Architecture condensée
  - Points clés à retenir
  - Prochaines étapes
- **Temps de lecture**: 5-10 min

### 2. 📊 **PROJECT_CONTEXT.md** ← **VUE COMPLÈTE**
- **Pour**: Équipe, évaluateurs, intégration continue
- **Contient**:
  - Résumé exécutif
  - Architecture technique complète
  - Structure fichiers détaillée
  - Authentification + Services expliqués
  - Écrans & Navigation détaillés
  - Flux de données (swipe, restauration, etc.)
  - État de développement (✅/🟡/🎁)
  - Configuration requise
  - Points d'évaluation
- **Temps de lecture**: 20-30 min

### 3. 🔧 **TECH_STACK.md** ← **DÉPENDANCES & SERVICES**
- **Pour**: Développeurs techniques, intégrations
- **Contient**:
  - Tableau toutes dépendances + versions
  - Services expliqués (Supabase, Auth, Database, TMDB)
  - Contextes & Hooks
  - Composants réutilisables
  - Variables d'environnement
  - Performance optimizations
  - Plateforme spécifique (iOS/Android/Web)
  - Commandes essentielles
- **Temps de lecture**: 15-20 min

---

## 📁 FICHIERS SOURCE IMPORTANTS

### Navigation & Entry Points
```
app/_layout.tsx                   # Root: AuthProvider + ThemeProvider + Stack
└── Structure globale, gestion Auth redirection
    ├── if (user) → /(tabs)
    └── if (!user) → /auth/login

app/(tabs)/_layout.tsx            # Tab navigation: 3 onglets
├── explore.tsx (🎬 Swipe UI)
├── matches.tsx (❤️ Liked films)
└── history.tsx (📜 History)

app/auth/_layout.tsx
├── login.tsx
└── signup.tsx
```

### Contextes (État Global)
```
src/contexts/AuthContext.tsx
├── useAuth() hook pour accéder state auth
├── signUp(), signIn(), signOut()
├── Écoute onAuthStateChange (Supabase)
└── Navigation automatique basée sur session
```

### Services (Métier)
```
src/services/supabase.ts
├── Client Supabase configuré
├── Types: Profile, LikedMovie, SwipeHistory
└── ExpoSecureStorage (natif)

src/services/auth.ts
├── authService.signup(email, password)
├── authService.login(email, password)
├── authService.logout()
└── authService.getSession()

src/services/database.ts ⭐ CRUCIAL
├── getLikedMovies(userId) → LikedMovie[]
├── addLikedMovie(userId, ...) → LikedMovie
├── getSwipeHistory(userId) → SwipeHistory[]
└── addSwipeHistory(userId, movieId, title, action)

src/services/tmdb.ts ⭐ CRUCIAL
├── getPopularMovies(page) → SearchResult
├── searchMovies(query) → SearchResult
├── getMovieDetail(movieId) → MovieDetail
├── getPosterUrl(posterPath) → URL
├── getYoutubeTrailerUrl(detail) → YouTube URL
├── getTopCast(detail) → Cast[]
└── Cache en mémoire (1h par page)
```

### Écrans Principaux
```
app/(tabs)/explore.tsx ⭐ SWIPE LOGIC
├── loadMovies(page) - Fetch TMDB
├── restoreProgress() - Session 6 ✅
├── animateSwipe(dx, action) - Save + animate
├── PanResponder + Animated API
├── Feedback backgrounds (vert/rouge)
├── Auto-pagination (buffer = 3 films)
└── Console logs pour debug: 📊 🔄 ✅

app/(tabs)/matches.tsx ⭐ LIKED FILMS
├── loadLikedMovies() - Fetch Supabase
├── Affiche en grille 2 colonnes
├── Pull-to-refresh
├── Empty state
└── Sorted by rating (↓)

app/(tabs)/history.tsx ⭐ SWIPE HISTORY
├── loadHistory() - Fetch Supabase
├── Filtres: All / Likes / Rejects
├── FlatList avec dates formatées
├── Pull-to-refresh
└── Empty state
```

### Composants Réutilisables
```
src/components/MovieCard.tsx
├── Props: { movie, showOverlay }
├── Affiche: Poster (85%) + Info (15%)
├── Fallback sans image
└── Usage: Explore, Matches, Search

components/themed-text.tsx
├── Props: { type?, lightColor?, darkColor?, ... }
├── Variantes: title, subtitle, default, link
└── Adapte couleur au mode sombre/clair

components/themed-view.tsx
├── Props: { lightColor?, darkColor?, ...ViewProps }
└── Background adapté au mode

components/haptic-tab.tsx
├── Haptic feedback on tab press
└── Utilisé dans Tabs navigation
```

### Utilitaires & Hooks
```
src/hooks/useFormatting.ts
├── useDebounce<T>(value, delay=500)
├── useFormatDate(dateString) → "4 mai 2026"
├── useGetYear(dateString) → "2026"
└── useFormatRuntime(minutes) → "1h 45min"

hooks/use-color-scheme.ts / .web.ts
├── useColorScheme() → "light" | "dark" | null
└── useThemeColor(light, dark) → color

constants/theme.ts
├── Colors.light: { text, background, tint, icon, button }
└── Colors.dark: { text, background, tint, icon, button }
```

### Configuration
```
.env.local (🔒 GITIGNORED)
├── EXPO_PUBLIC_TMDB_API_KEY
├── EXPO_PUBLIC_SUPABASE_URL
└── EXPO_PUBLIC_SUPABASE_ANON_KEY

app.json
├── name: "CineMatch"
├── icon, splash, assets
├── plugins: expo-router, expo-splash-screen
└── experiments: typedRoutes, reactCompiler

package.json
├── dependencies: expo, react-native, supabase, etc.
├── scripts: start, android, ios, web, lint
└── devDependencies: typescript, eslint

tsconfig.json
├── strict: true
├── paths: @/* → ./
└── includes: **/*.ts, **/*.tsx
```

---

## 🎯 FLUX DE DONNÉES (RÉSUMÉ)

### LOGIN FLOW
```
TextInput → handleLogin → authService.login() 
          → Supabase Auth API 
          → JWT saved (SecureStore)
          → onAuthStateChange 
          → Route /(tabs) ✅
```

### SWIPE FLOW
```
PanResponder event → pan.x.setValue() 
                  → Animated rotation + background feedback
                  → THRESHOLD atteint?
                  → animateSwipe('like'/'reject')
                  → databaseService.addSwipeHistory()
                  → databaseService.addLikedMovie() [if like]
                  → Supabase INSERT × 2
                  → setCurrentIndex++
                  → remainingMovies ≤ 3?
                  → Load next page TMDB ✅
```

### PROGRESS RESTORATION (Session 6)
```
App reload
  → useEffect checks hasLoadedRef.current
  → databaseService.getSwipeHistory(userId)
  → swipeCount = history.length = 15
  → targetPage = Math.floor(15/20) + 1 = 1
  → Load pages 1 → targetPage
  → setCurrentIndex = 15
  → Show film #16 (where user left off) ✅
```

---

## 🔐 SÉCURITÉ & VARIABLES

### Secrets dans `.env.local`
```env
EXPO_PUBLIC_TMDB_API_KEY=sk_...       # TMDB API key
EXPO_PUBLIC_SUPABASE_URL=https://...  # Supabase URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # Anon key
```

### Storage Hiérarchie
```
SecureStore (iOS Keychain / Android Keystore)
  ├── JWT Token
  ├── Session data
  ├── Priorité: Sécurité maximale
  └── auto sync Supabase session
  
AsyncStorage (localStorage fallback web)
  ├── Cache films populaires
  ├── Session temporaire (web)
  └── Priorité: Performance
```

### RLS Policies (Supabase)
```
All tables: liked_movies, swipe_history
├── SELECT: only WHERE user_id = auth.uid()
├── INSERT: only if user_id = auth.uid()
├── UPDATE: only if user_id = auth.uid()
└── DELETE: only if user_id = auth.uid()
```

---

## 📋 CHECKLIST DÉVELOPPEUR

### Avant de commencer
- [ ] Lire `QUICK_START.md` (5 min)
- [ ] Lire `PROJECT_CONTEXT.md` section Architecture (10 min)
- [ ] Vérifier `.env.local` configuré
- [ ] npm install + npm start

### Lors du développement
- [ ] Utiliser `src/services/` pour API calls
- [ ] Utiliser `ThemedText`/`ThemedView`
- [ ] Ajouter console.log avec émojis seulement (debug)
- [ ] Gérer loading states (ActivityIndicator)
- [ ] Afficher erreurs lisibles
- [ ] Empty states sur listes
- [ ] Tester iOS + Android (Expo Go)

### Avant commit
- [ ] Supprimer console.log de production
- [ ] Tester responsivité
- [ ] ESLint clean: `npm run lint`
- [ ] Message commit clair
- [ ] Reference `.agents/GIT_COMMIT_GUIDELINES.md`

---

## 🗂️ STRUCTURE FICHIERS COMPLÈTE

```
CineMatch/
├── .agents/
│   ├── AGENTS.md                    # Guide IA
│   ├── contexte.md                  # Spec évaluation
│   ├── GIT_COMMIT_GUIDELINES.md     # Git workflow
│   ├── README.md
│   └── skills/                      # Modules spécialisés
│
├── app/
│   ├── _layout.tsx
│   ├── modal.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── explore.tsx
│       ├── matches.tsx
│       └── history.tsx
│
├── app/auth/
│   ├── _layout.tsx
│   ├── login.tsx
│   └── signup.tsx
│
├── src/
│   ├── components/
│   │   └── MovieCard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useFormatting.ts
│   ├── screens/
│   │   └── auth/
│   │       ├── LoginScreen.tsx
│   │       └── SignupScreen.tsx
│   └── services/
│       ├── auth.ts
│       ├── database.ts
│       ├── supabase.ts
│       └── tmdb.ts
│
├── components/
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       ├── icon-symbol.ios.tsx
│       └── icon-symbol.tsx
│
├── constants/
│   └── theme.ts
│
├── hooks/
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
│
├── assets/
│   └── images/
│       ├── icon.png
│       ├── splash-icon.png
│       ├── android-icon-*.png
│       └── favicon.png
│
├── scripts/
│   └── reset-project.js
│
├── .env.local                       # 🔒 GITIGNORED
├── .env.example                     # Template
├── .gitignore
├── app.json
├── eslint.config.js
├── expo-env.d.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── PROJECT_CONTEXT.md               # 📄 New
├── TECH_STACK.md                    # 📄 New
├── QUICK_START.md                   # 📄 New
├── README.md
├── HISTORY.md
├── CONTEXT_INDEX.md                 # 📄 This file
└── skills-lock.json
```

---

## 🎯 QUESTIONS RAPIDES

### "Où est le code de swipe?"
→ `app/(tabs)/explore.tsx:144-220` (animateSwipe + PanResponder)

### "Où sauve-t-on les films aimés?"
→ `src/services/database.ts:19-44` (addLikedMovie)
→ `app/(tabs)/explore.tsx:159-167` (dans animateSwipe)

### "Comment fonctionne l'auth?"
→ `src/contexts/AuthContext.tsx:34-59` (onAuthStateChange + routing)

### "Où est le cache TMDB?"
→ `src/services/tmdb.ts:44-46` (movieCache Map)

### "Comment restaurer la progression?"
→ `app/(tabs)/explore.tsx:70-129` (restoreProgress)

### "Où sont les couleurs?"
→ `constants/theme.ts` (Colors.light/dark)

### "Comment utiliser l'API TMDB?"
→ `src/services/tmdb.ts` (tmdbService)

---

## 📞 POINTS DE CONTACT

| Question | Fichier | Location |
|----------|---------|----------|
| Architecture globale | PROJECT_CONTEXT.md | Tout |
| Dépendances npm | TECH_STACK.md | Section "Dépendances principales" |
| Cas d'usage utilisateur | QUICK_START.md | Section "Cas d'usage" |
| Évaluation rubric | `.agents/contexte.md` | TBD |
| Git commit format | `.agents/GIT_COMMIT_GUIDELINES.md` | TBD |
| Historique sessions | HISTORY.md | TBD |

---

## 🗓️ TIMELINE SESSIONS

| # | Date | Focus | Status |
|---|------|-------|--------|
| 1 | 2026-05-04 | AGENTS.md + GIT guidelines | ✅ |
| 2-5 | TBD | Core features (Auth, Swipe, etc.) | 🟡 |
| 6 | 2026-05-04 | Progress restoration ✅ | ✅ |
| 7+ | TBD | Film detail, Search, Bonus | 🟡 |

---

## 🚦 STATUS FONCTIONNALITÉS

| Feature | Status | File |
|---------|--------|------|
| Auth (Supabase) | ✅ | src/services/auth.ts |
| Swipe UI | ✅ | app/(tabs)/explore.tsx |
| Liked films storage | ✅ | src/services/database.ts |
| Matches screen | ✅ | app/(tabs)/matches.tsx |
| History screen | ✅ | app/(tabs)/history.tsx |
| TMDB API | ✅ | src/services/tmdb.ts |
| Progress restoration | ✅ | app/(tabs)/explore.tsx:70-129 |
| Film detail | 🟡 | - |
| Search with debounce | 🟡 | - |
| Genre filters | 🎁 | - |
| Reanimated animations | 🎁 | - |

---

**Version**: 1.0 | **Créé**: 4 mai 2026 | **Prochaine update**: Après Session 7

Pour commencer: 📖 **QUICK_START.md** → 📊 **PROJECT_CONTEXT.md** → 🔧 **TECH_STACK.md**

