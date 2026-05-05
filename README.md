# 🎬 CineMatch — Application de Swipe Films

> L'app qui met fin aux débats interminables pour choisir un film

Une application mobile **React Native / Expo** permettant à des groupes d'amis de choisir un film ensemble via un système de "swipe" (semblable à Tinder). Chaque utilisateur swipe les films en secret, et l'application sauvegarde les likes pour trouver les matchs.

---

## 📋 Composition de l'équipe

| Nom | Prénom | Partie traitée | Statut |
|-----|--------|----------------|--------|
| BALLENGHIEN | Alexis | Tout le projet | ✅ Solo |

**Statut** : Travail en solo (solo accepté selon le cahier des charges)

---

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le repo
git clone <URL_REPO>
cd CineMatch

# Installer les dépendances
npm install

# Configurer les variables d'environnement (voir .env.example)
cp .env.example .env.local
# Remplir .env.local avec vos clés API

# Lancer l'app en dev
npm start
# Puis : i (iOS) ou a (Android) ou w (Web)
```

### Configuration requise

#### 1. **Clé API TMDB (The Movie Database)**

1. Aller sur : https://www.themoviedb.org/settings/api
2. Créer un compte et demander une clé API
3. Copier la clé dans `.env.local` :
   ```
   EXPO_PUBLIC_TMDB_API_KEY=votre_clé_ici
   ```

#### 2. **Supabase (Base de données + Auth)**

1. Aller sur : https://supabase.com
2. Créer un nouveau projet
3. Dans Settings → API, récupérer :
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
4. Ajouter dans `.env.local` :
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme
   ```

#### 3. **Configuration Supabase**

- Email Confirmations : **OFF** (désactivé pour permettre connexion immédiate)
- Créer les tables : `profiles`, `liked_movies`, `swipe_history` (scripts inclus)
- Configurer RLS (Row-Level Security) sur toutes les tables

---

## 📱 Fonctionnalités

### ✅ Fonctionnalités Obligatoires

| # | Fonctionnalité | Status | Notes |
|---|---|---|---|
| 1 | **Authentification** (Supabase signup/login) | ✅ | Email + mot de passe |
| 2 | **Écran Swipe** (1 film / geste) | ✅ | PanResponder, like/reject |
| 3 | **Écran Matches** (films likés) | ✅ | Grille 2 colonnes, tri note |
| 4 | **Fiche Film** (détails + casting) | ✅ | Synopsis, genres, trailer YouTube |
| 5 | **Recherche** (debounce 500ms) | ✅ | Pagination, 4 empty states |
| 6 | **Historique** (swipes sauvegardés) | ✅ | Filtres : Tous/Aimés/Rejetés |

### 🎁 Fonctionnalités Bonus

| Bonus | Status |
|-------|--------|
| Filtres par genre (dropdown TMDB) | ✅ |
| Animations Reanimated 3D (rotation + spring) | ✅ |

### 📊 Écrans

```
┌─ Navigation
│  ├─ /auth/login        → Connexion
│  ├─ /auth/signup       → Inscription
│  └─ /(tabs)
│     ├─ explore         🎬 Swipe principal
│     ├─ matches         ❤️ Films aimés
│     ├─ history         📜 Historique
│     └─ search          🔍 Recherche
│       • detail/[movieId] → Fiche film
```

---

## 🛠 Stack Technologique

| Layer | Technologie | Version |
|-------|-------------|---------|
| **Framework** | React Native + Expo | 54.0.33 |
| **Navigation** | Expo Router (file-based) | 6.0.23 |
| **Langage** | TypeScript (strict) | 5.9 |
| **State** | React Context API | - |
| **Animations** | React Native Reanimated | 4.1.1 |
| **Gestes** | PanResponder (natif) | - |
| **Auth** | Supabase Auth (JWT) | 2.43.1 |
| **Base de données** | Supabase PostgreSQL | - |
| **API externe** | The Movie Database (TMDB) REST | - |
| **Stockage local** | AsyncStorage + SecureStore | - |
| **UI** | StyleSheet (natif) + théming | - |
| **Linting** | ESLint 9.25 | - |

### Dépendances principales

```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "54.0.33",
  "expo-router": "6.0.23",
  "@supabase/supabase-js": "2.43.1",
  "react-native-reanimated": "4.1.1",
  "react-native-safe-area-context": "*"
}
```

**Justifications des choix** :
- **Expo** : Déploiement simplifié, accès facile Expo Go
- **Expo Router** : Navigation file-based, simplification vs React Navigation config
- **TypeScript** : Type-safety, meilleure maintenabilité
- **Supabase** : Auth + BDD intégrées, RLS natif, gratuit
- **Reanimated** : Animations native fluides, bien intégré Expo
- **Context API** : Suffisant pour l'état global, pas besoin Redux

---

## 📁 Structure du projet

```
CineMatch/
├── app/                           # Expo Router (file-based routing)
│   ├── _layout.tsx                # Root layout (Auth + Theme stack)
│   ├── modal.tsx                  # Modal démo
│   │
│   ├── (tabs)/                    # Tab group (3 onglets)
│   │   ├── _layout.tsx            # Tabs layout
│   │   ├── explore.tsx            # 🎬 Écran swipe principal
│   │   ├── matches.tsx            # ❤️ Films aimés
│   │   ├── history.tsx            # 📜 Historique swipes
│   │   └── search.tsx             # 🔍 Recherche films
│   │
│   └── auth/                      # Auth screens
│       ├── _layout.tsx
│       ├── login.tsx
│       └── signup.tsx
│
├── src/
│   ├── components/                # Composants réutilisables
│   │   ├── MovieCard.tsx          # Carte film (explore)
│   │   └── explore/
│   │       ├── SwipeCard.tsx
│   │       ├── GenreFilter.tsx
│   │       └── ActionButtons.tsx
│   │   └── matches/
│   │       ├── MatchMovieCard.tsx # Carte film (grille)
│   │       ├── MatchesGrid.tsx
│   │       └── MovieItemCard.tsx
│   │
│   ├── services/                  # Logique métier
│   │   ├── tmdb.ts                # API TMDB
│   │   ├── supabase.ts            # Client Supabase
│   │   ├── auth.ts                # Auth functions
│   │   └── database.ts            # Requêtes Supabase
│   │
│   ├── hooks/                     # Custom hooks
│   │   ├── useMovieStack.ts       # Pagination + progress restore
│   │   ├── useSwipeGestures.ts    # PanResponder logic
│   │   ├── useGenreFilter.ts      # Genre selection
│   │   └── useFormatting.ts       # Debounce, dates, etc.
│   │
│   └── contexts/                  # React Context
│       ├── AuthContext.tsx
│       ├── ThemeContext.tsx
│       └── GenreContext.tsx
│
├── constants/                     # Constantes
│   └── theme.ts                   # Palettes light/dark
│
├── .env.local                     # ⚠️ NE PAS COMMIT
├── .env.example                   # Template pour .env.local
├── .gitignore                     # Ignore .env.local
├── app.json                       # Config Expo
├── package.json
├── tsconfig.json
├── eslint.config.js
│
├── README.md                      # Ce fichier
├── PROJECT_CONTEXT.md             # Contexte complet
├── HISTORY.md                     # Changelog par session
└── BALLENGHIEN_Alexis_M1RN_DocumentIndividuel.md  # Doc individuelle
```

---

## 🔐 Authentification et Sécurité

### Flux Auth

1. **Signup** : Email + mot de passe → Supabase Auth crée `auth.users` + trigger crée `profiles`
2. **Login** : Email + mot de passe → JWT session générée
3. **Persist** : JWT sauvegardé dans AsyncStorage (ou SecureStore)
4. **Auto-navigation** : `onAuthStateChange` redirige `/auth` → `/(tabs)`

### Sécurité

- ✅ JWT tokens jamais hardcodés
- ✅ Clés API dans `.env.local` (gitignored)
- ✅ RLS (Row-Level Security) sur toutes les tables
- ✅ Utilisateurs ne voient que **leurs propres** données
- ✅ Email confirmation désactivé (pour UX)

---

## 💾 Base de Données (Supabase)

### Schema SQL

```sql
-- profiles (créé automatiquement au signup)
CREATE TABLE profiles (
  id UUID PRIMARY KEY FK auth.users,
  email TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- liked_movies
CREATE TABLE liked_movies (
  id SERIAL PRIMARY KEY,
  user_id UUID FK profiles,
  movie_id INT (TMDB ID),
  movie_title TEXT,
  movie_rating FLOAT,
  poster_path TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- swipe_history
CREATE TABLE swipe_history (
  id SERIAL PRIMARY KEY,
  user_id UUID FK profiles,
  movie_id INT,
  movie_title TEXT,
  action ENUM('like', 'reject'),
  created_at TIMESTAMP DEFAULT now()
);
```

### RLS Policies

Toutes les tables ont RLS configuré pour que chaque utilisateur ne voie que ses données.

---

## 🎨 Thème et Styling

### Dark Mode

```
text        : #ECEDEE
background  : #151718
tint        : #fff
icon        : #9BA1A6
button      : #0a7ea4
```

### Light Mode

```
text        : #11181C
background  : #fff
tint        : #0a7ea4
icon        : #687076
button      : #0a7ea4
```

**Composants thématisés** : `ThemedText`, `ThemedView` adaptent leur stylet automatiquement.

---

## 🧪 Tests et Déploiement

### Tester localement

```bash
# Dev
npm start
# i (iOS), a (Android), w (Web)

# Lint
npm run lint

# Build Android APK (si EAS configuré)
eas build -p android --local
```

### Expo Go (Recommandé pour test rapide)

1. Installer "Expo Go" sur votre téléphone
2. Lancer `npm start`
3. Scanner le QR code

### Publication (APK/IPA)

```bash
# Avec EAS CLI
eas build -p android    # APK Android
eas build -p ios        # IPA iOS
```

---

## 📝 Commits et Historique

**Stratégie Git** :
- Branch `main` pour production
- Commits atomiques (1 feature = 1 commit)
- Messages explicites : `feat:`, `fix:`, `refactor:`, `docs:`

**Exemple de log** :
```
2d70bc9 - Limit movie card title to single line
8350792 - Fix: Show loading spinner when changing genre
23d596d - Fix: Add missing useState import
12700df - Add pull to refresh for empty movies state
...
```

Voir `HISTORY.md` pour le changelog complet.

---

## 🎯 Points Forts de cette Implémentation

1. ✅ **Code réutilisable** : 8 composants bien isolés, services séparés
2. ✅ **TypeScript strict** : 0 `any` inutile, toutes erreurs résolues
3. ✅ **UX fluide** : Animations 3D, debounce recherche, pull-to-refresh
4. ✅ **Gestion d'erreurs** : Loading states, empty states, error messages
5. ✅ **Traçabilité** : 20+ commits structurés, documentation à jour
6. ✅ **SEO/Accessibilité** : Accessibilité labels, responsive design
7. ✅ **Performance** : Pagination auto, cache TMDB, useCallback optimisé

---

## 🤔 Limitations et Améliorations Futures

### Limitations actuelles

- Pas de tests unitaires (Jest/Detox)
- Pas de notifications push
- Pas de real-time collaboration
- Pas d'analytics

### À améliorer

1. Tests E2E automatisés
2. Redux/Zustand pour gestion d'état
3. Supabase Realtime pour sync live
4. Haptic feedback sur swipes
5. Analytics suivi utilisateur

---

## 📧 Contact & Support

- **Auteur** : Alexis Ballenghien
- **Projet** : CineMatch (M1RN - Évaluation)
- **Date** : Mai 2026
- **Documentation** : Voir `PROJECT_CONTEXT.md` et `HISTORY.md`

---

## 📄 Fichiers Importants

| Fichier | Contenu |
|---------|---------|
| `.env.example` | Template variables d'env |
| `PROJECT_CONTEXT.md` | Architecture + détails techniques |
| `HISTORY.md` | Changelog par session |
| `BALLENGHIEN_Alexis_M1RN_DocumentIndividuel.md` | Document individuel |

---

**Mis à jour** : 5 mai 2026  
**État** : ✅ Complété (toutes fonctionnalités)  


