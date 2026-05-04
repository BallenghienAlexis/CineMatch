# 🎯 GUIDE RAPIDE - CINEMATCH EN 5 MIN

---

## 📲 CAS D'USAGE UTILISATEUR

### 1️⃣ Premier Lancement
```
┌─────────────────────────────────────┐
│  CineMatch - Connexion              │
│                                     │
│  🎬 CineMatch                       │
│  Connexion                          │
│                                     │
│  Email: [user@email.com]            │
│  Mot de passe: [password]           │
│                                     │
│  [Se connecter]                     │
│                                     │
│  Pas encore de compte?              │
│  > S'inscrire                       │
└─────────────────────────────────────┘
```

**Actions**:
- Créer compte (signup) → Email + Password + Validation
- Ou se connecter (login) → Email + Password

**Backend**:
```
User input
  ↓
AuthContext.signIn/signUp()
  ↓
authService.login/signup()
  ↓
Supabase Auth API
  ↓
Token + Profile créé
  ↓
onAuthStateChange → Navigation /(tabs) ✅
```

---

### 2️⃣ Swiper des Films (Main Flow)
```
┌─────────────────────────────────────┐
│  Découvrir                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│     ┌─────────────────────────┐    │
│     │   JURASSIC PARK         │    │
│     │                         │    │
│     │   [Affiche TMDB]        │    │
│     │         ↑               │    │
│     │         │               │    │
│     │   Swipe left/right      │    │
│     │         ↓               │    │
│     │                         │    │
│     │   Jurassic Park         │    │
│     │   1993 ⭐ 7.7          │    │
│     └─────────────────────────┘    │
│     ← Reject          Like →        │
│                                     │
│  Aimés (0)  Historique (0)         │
└─────────────────────────────────────┘
```

**Gestes Swipe**:
- **Droite** (→) = **Like** ❤️ → Fond vert
- **Gauche** (←) = **Reject** ✕ → Fond rouge

**Flow Backend**:
```
Affiche Film #1
  ↓
User swipes RIGHT + THRESHOLD atteint
  ↓
animateSwipe('like')
  ↓
Enregistrer dans swipe_history (LIKE)
  ↓
Enregistrer dans liked_movies
  ↓
Supabase INSERT × 2
  ↓
setCurrentIndex = index + 1
  ↓
Affiche Film #2 ✅

[Si 3 films restants avant fin page]
  ↓
Charger page 2 TMDB (auto)
```

**Avec Restauration** (Session 6):
```
User: swipe film #15 → Reload (R pressed)
  ↓
App check: swipeHistory.length = 15
  ↓
targetPage = 15 / 20 + 1 = 1 ✅
targetIndex = 15 ✅
  ↓
Charger page 1 (20 films)
  ↓
setCurrentIndex = 15
  ↓
Affiche Film #16 (où on s'était arrêté) ✅
```

---

### 3️⃣ Voir Films Aimés (Matches)
```
┌─────────────────────────────────────┐
│  Aimés                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Mes Films Aimés (3 films)          │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Avatar 2 │  │ Dune     │        │
│  │ 8.5 ⭐  │  │ 8.0 ⭐  │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐                       │
│  │ Oppenhe- │                       │
│  │ imer 8.2 │                       │
│  └──────────┘                       │
│                                     │
│  Pull to refresh ↓                  │
└─────────────────────────────────────┘
```

**Features**:
- Grille 2 colonnes
- Trié par note (↓ décroissant)
- Pull-to-refresh
- Empty state si vide

**Backend**:
```
useEffect: user?.id changed
  ↓
databaseService.getLikedMovies(userId)
  ↓
Supabase: SELECT * FROM liked_movies ORDER BY rating DESC
  ↓
setLikedMovies(data)
  ↓
Rendu grille ✅
```

---

### 4️⃣ Voir Historique (History)
```
┌─────────────────────────────────────┐
│  Historique                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Historique des Swipes (5 swipes)   │
│                                     │
│  [Tous] [❤️ Aimés] [✕ Rejetés]    │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ ❤️ Avatar 2                 │  │
│  │    4 mai 2026 à 14h32   ❤️  │  │
│  └─────────────────────────────┘  │
│  ┌─────────────────────────────┐  │
│  │ ✕ Inception                 │  │
│  │    4 mai 2026 à 14h30    ✕  │  │
│  └─────────────────────────────┘  │
│  ┌─────────────────────────────┐  │
│  │ ❤️ Dune                      │  │
│  │    4 mai 2026 à 14h28   ❤️  │  │
│  └─────────────────────────────┘  │
│                                     │
│  Pull to refresh ↓                  │
└─────────────────────────────────────┘
```

**Filtres**:
- **Tous** = Tous les swipes
- **❤️ Aimés** = Uniquement likes
- **✕ Rejetés** = Uniquement rejects

**Backend**:
```
Charge historique
  ↓
databaseService.getSwipeHistory(userId)
  ↓
Supabase: SELECT * FROM swipe_history ORDER BY created_at DESC
  ↓
Filtre par action (si filter !== 'all')
  ↓
Affiche avec dates formatées ✅
```

---

## 🔄 FLUX D'AUTHENTIFICATION COMPLET

```
┌─────────────────────────────────────────────────────────────┐
│                    APP INITIALIZATION                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │      AuthContext (Root Layout)        │
        │                                       │
        │  useEffect: onAuthStateChange()       │
        │  Écoute auth state Supabase           │
        └───────────────────────────────────────┘
                    ↓                    ↓
        ┌───────────────┐        ┌──────────────┐
        │  Session OK   │        │ No Session   │
        │   user ≠ null │        │  user = null │
        └───────────────┘        └──────────────┘
                ↓                        ↓
        ┌──────────────┐        ┌──────────────────┐
        │  Route to    │        │  Route to        │
        │  /(tabs)     │        │  /auth/login     │
        │              │        │                  │
        │ Discover ✅  │        │  LoginScreen:    │
        │ Matches ✅   │        │  - Email input   │
        │ History ✅   │        │  - Password      │
        └──────────────┘        │  - [Login]       │
                                │  - [Signup →]   │
                                └──────────────────┘
                                        ↓
                                ┌──────────────────┐
                                │  User fills form │
                                │  - Email         │
                                │  - Password      │
                                │  - Confirm pwd   │
                                │  - [Sign up]     │
                                └──────────────────┘
                                        ↓
                                ┌──────────────────┐
                                │ authService      │
                                │ .signup(e, p)    │
                                └──────────────────┘
                                        ↓
                                ┌──────────────────┐
                                │ Supabase Auth    │
                                │ API crée user    │
                                │ + profile        │
                                └──────────────────┘
                                        ↓
                                ┌──────────────────┐
                                │ JWT sauvé dans   │
                                │ SecureStore      │
                                └──────────────────┘
                                        ↓
                                ┌──────────────────┐
                                │ onAuthStateChange│
                                │ déclenché        │
                                └──────────────────┘
                                        ↓
                                ┌──────────────────┐
                                │ setSession()     │
                                │ setUser()        │
                                └──────────────────┘
                                        ↓
                        ┌───────────────────────────┐
                        │ Route to /(tabs) ✅       │
                        │ User connecté!            │
                        └───────────────────────────┘
```

---

## 📊 ARCHITECTURE DE FICHIERS (Vue condensée)

```
CineMatch/
│
├── 🎨 UI LAYER
│   ├── app/                           # Routes (Expo Router)
│   │   ├── _layout.tsx                # Auth + Theme + Navigation
│   │   └── (tabs)/                    # Tab structure
│   │       ├── explore.tsx ⭐         # MAIN: Swipe UI
│   │       ├── matches.tsx            # Liked films grid
│   │       └── history.tsx            # Swipe history list
│   │
│   ├── src/screens/                   # Screen components
│   │   └── auth/
│   │       ├── LoginScreen.tsx
│   │       └── SignupScreen.tsx
│   │
│   ├── src/components/                # Reusables
│   │   ├── MovieCard.tsx ⭐           # Film display
│   │   └── ...
│   │
│   └── components/                    # Expo starter UI
│       ├── themed-text.tsx
│       ├── themed-view.tsx
│       └── ...
│
├── 🦴 BACKEND LAYER
│   ├── src/contexts/
│   │   └── AuthContext.tsx ⭐         # Auth state + routing
│   │
│   ├── src/services/
│   │   ├── supabase.ts ⭐             # Supabase client
│   │   ├── auth.ts                    # Login/signup functions
│   │   ├── database.ts ⭐             # Supabase queries
│   │   └── tmdb.ts ⭐                 # TMDB API + cache
│   │
│   └── src/hooks/
│       ├── useFormatting.ts           # Debounce, date format
│       └── ...
│
├── ⚙️ CONFIG
│   ├── .env.local                     # API keys (gitignored)
│   ├── app.json                       # Expo config
│   ├── package.json                   # Dependencies
│   ├── tsconfig.json                  # TypeScript strict
│   ├── eslint.config.js               # Linting
│   └── constants/theme.ts             # Colors
│
├── 📚 DOCS
│   ├── PROJECT_CONTEXT.md ⭐          # Vue complète
│   ├── TECH_STACK.md ⭐               # Tech details
│   ├── README.md                      # User guide
│   ├── HISTORY.md                     # Changelog
│   └── .agents/                       # AI/Team guides
│
└── 🔒 GIT
    └── .gitignore                     # Never commit .env
```

---

## 🎯 POINTS CLÉS À RETENIR

| Aspect | Point clé |
|--------|-----------|
| **Authentification** | Supabase Auth (JWT) → SecureStore → AuthContext |
| **Swipe Interaction** | PanResponder (natif) → Animated → Supabase INSERT |
| **API Données Films** | TMDB REST + cache 1h en mémoire |
| **Persistance** | Supabase (films aimés, historique) + AsyncStorage (local) |
| **Navigation** | Expo Router (file-based) + React Navigation (tabs) |
| **Styling** | React Native StyleSheet + themed components |
| **Restauration** | Query swipe_history, calculer index, reload pages |
| **Performance** | Debounce search, cache TMDB, refs pour gestures |
| **UX** | Loading states, error messages, empty states, responsive |

---

## 🚀 POUR COMMENCER

```bash
# 1. Clone & Install
git clone https://github.com/BallenghienAlexis/CineMatch.git
cd CineMatch
npm install

# 2. Configure .env.local
EXPO_PUBLIC_TMDB_API_KEY=your_key
EXPO_PUBLIC_SUPABASE_URL=your_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key

# 3. Launch
npm start

# 4. Choose platform
# i = iOS Simulator
# a = Android Emulator
# w = Web browser
# Scan QR = Expo Go app
```

---

## 🎓 PROCHAINES ÉTAPES

1. **Film Detail Screen** (Mandatory)
   - Affiche: Synopsis, genres, durée, note, casting top 5, trailer YouTube
   - Trigger: Tap on film card

2. **Search Screen** (Mandatory)
   - Barre de recherche + debounce 500ms
   - Pagination
   - Grille résultats

3. **Genre Filters** (Bonus +1 pt)
   - Selector avant swipe UI
   - Filter TMDB results par genre

4. **Smooth Animations** (Bonus +1 pt)
   - Reanimated card rotation on swipe
   - Spring physics

---

**Quick Reference**: Voir `PROJECT_CONTEXT.md` pour détails complets  
**Tech Details**: Voir `TECH_STACK.md` pour dépendances & services  
**User Guide**: Voir `README.md` pour installation & utilisation

