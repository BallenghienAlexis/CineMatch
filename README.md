# 🎬 CineMatch — Movie Discovery App

A React Native application for discovering, rating, and managing movies. Built with Expo, Supabase, and The Movie Database (TMDB) API.

**Project**: SUP de VINCI M1 - Master Degree  
**Repository**: [GitHub](https://github.com/BallenghienAlexis/CineMatch)  
**Status**: 🚀 In Development

---

## ✨ Features

### ✅ Implemented

- **🔐 Authentication** — Supabase sign-up/login with secure session management
- **🎯 Explore (Swipe UI)** — Discover popular movies with intuitive swipe left/right gestures
  - Swipe Right = Like
  - Swipe Left = Reject
  - Auto-pagination of movies
  - **NEW**: Automatic progress restoration on app reload
- **🎨 Dark/Light Mode** — Theme support with styled components
- **🌍 French Localization** — Complete French UI

### 🟡 In Progress

- **❤️ Matches Screen** — Display liked movies sorted by rating
- **📜 History Screen** — View all swipes (likes/rejects) with filters
- **🔍 Search Screen** — Find movies with debounce optimization
- **🎞️ Movie Detail Page** — View synopsis, cast, trailers

### 🎁 Bonus Features (Planned)

- **🏷️ Genre Filters** — Filter movies by genre before exploring
- **✨ Animations** — Smooth transitions with React Native Reanimated

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- TMDB API key (free): [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/BallenghienAlexis/CineMatch.git
   cd CineMatch
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` in project root:

   ```env
   EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**

   ```bash
   npx expo start
   ```

5. **Open in simulator/emulator**

   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

---

## 🏗️ Project Structure

```
CineMatch/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation
│   │   ├── explore.tsx           # Swipe UI screen
│   │   ├── matches.tsx           # Liked movies screen
│   │   └── history.tsx           # Swipe history screen
│   ├── auth/                     # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── _layout.tsx               # Root layout with auth flow
├── src/
│   ├── services/
│   │   ├── supabase.ts          # Supabase client
│   │   ├── auth.ts              # Auth functions
│   │   ├── database.ts          # Database queries
│   │   └── tmdb.ts              # TMDB API integration
│   ├── contexts/
│   │   └── AuthContext.tsx      # Auth state management
│   ├── components/
│   │   └── MovieCard.tsx        # Reusable movie display
│   └── hooks/
│       └── useFormatting.ts     # Utilities (debounce, date format)
├── .agents/                      # AI agent guidelines
│   ├── AGENTS.md                # AI development guide
│   ├── GIT_COMMIT_GUIDELINES.md # Git workflow standards
│   └── contexte.md              # Evaluation requirements
├── HISTORY.md                    # Session changelog
└── README.md                     # This file
```

---

## 🔧 Key Technologies

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native, Expo Router, React Hooks |
| **Styling** | React Native StyleSheet, themed components |
| **Backend** | Supabase (PostgreSQL, Auth, Realtime) |
| **External API** | The Movie Database (TMDB) |
| **State Management** | React Context API |
| **Storage** | Supabase (secure) + AsyncStorage (cache) |
| **Language** | TypeScript |
| **Gestures** | PanResponder (React Native) |

---

## 🎯 Current Session Features

### Session 6: Restore User Progress on App Reload ✅

**Problem**: Pressing "R" in Expo console would reset app to first movie

**Solution**: 
- Auto-fetch user's swipe history from Supabase on mount
- Calculate exact position (swipeCount = currentIndex)
- Load all TMDB pages to restore full film list
- Detect changes with console logs: `📊 📍 ✅`

**Example Flow**:
```
User swipes film #15 → Presses "R" in Expo console
                    ↓
App reloads: Fetches swipe history from Supabase
           → Sees 15 swipes, calculates page 1
           → Loads all pages 1→1
           → Restores currentIndex = 15
           ↓
User sees film #16 (exactly where they left off) ✅
```

---

## 📱 Screens & Navigation

```
Login / Signup
    ↓
App (Authenticated)
├── Découvrir (🎬 Explore/Swipe)
│   ├── Swipe Cards
│   ├── Load More Films
│   └── Persist Likes → Database
│
├── Aims (❤️ Matches)
│   ├── View Liked Films
│   ├── Filter by Rating
│   └── Open Film Details
│
└── Historique (📜 History)
    ├── View All Swipes
    ├── Filter: All/Likes/Rejects
    └── View Timestamps
```

---

## 🔄 Development Workflow

### Git Conventions

Follow `.agents/GIT_COMMIT_GUIDELINES.md` for commit messages:

```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Commit regularly (min 3-5 commits per feature)
git commit -m "feat(scope): description

- Add component/function
- Integrate with Supabase
- Test on device"

# Push and create PR
git push -u origin feature/new-feature-name
```

### Code Standards

- **TypeScript strict mode** enabled
- **ESLint** rules enforced
- **Component pattern**: Functional components with hooks
- **Services pattern**: Separate business logic from UI

---

## 📊 Database Schema

### Supabase Tables

```sql
-- Users (managed by Supabase Auth)
auth.users {}

-- User Profiles
profiles {
  id: UUID (FK auth.users)
  email: TEXT
  created_at: TIMESTAMP
}

-- Liked Movies
liked_movies {
  id: SERIAL
  user_id: UUID (FK profiles)
  movie_id: INT
  movie_title: TEXT
  movie_rating: FLOAT
  poster_path: TEXT
  created_at: TIMESTAMP
}

-- Swipe History
swipe_history {
  id: SERIAL
  user_id: UUID (FK profiles)
  movie_id: INT
  movie_title: TEXT
  action: ENUM ('like', 'reject')
  created_at: TIMESTAMP
}
```

### RLS Policies

All tables have Row-Level Security enabled:
- Users can only view/modify their own data
- Public read access to movie data only

---

## 🧪 Testing Checklist

- [ ] **Auth Flow**
  - [ ] Signup creates profile
  - [ ] Login restores session
  - [ ] Logout clears session
  
- [ ] **Explore Screen**
  - [ ] Movies load from TMDB
  - [ ] Swipe right (like) saves to database
  - [ ] Swipe left (reject) saves to database
  - [ ] Pagination auto-loads more films
  - [ ] Progress restores on app reload ✅
  
- [ ] **Dark Mode**
  - [ ] All buttons visible in light/dark mode
  - [ ] Text has sufficient contrast
  
- [ ] **Performance**
  - [ ] No jank during swipe animation
  - [ ] Database queries are fast
  - [ ] TMDB API calls are cached

---

## 📚 Documentation

See `.agents/` folder for detailed guides:

- **`.agents/AGENTS.md`** — AI agent development guidelines
- **`.agents/GIT_COMMIT_GUIDELINES.md`** — Git workflow & conventions
- **`.agents/contexte.md`** — Complete evaluation requirements
- **`HISTORY.md`** — Session-by-session changelog

---

## 🐛 Known Issues

- Email confirmation redirect not configured (will fix in next session)
- Search screen UI not yet implemented
- History screen filters not yet implemented

---

## 🎁 Next Steps (Priority Order)

1. **Matches Screen** — Display liked movies
2. **History Screen** — Show all swipes with filters
3. **Search Screen** — Find movies with debounce
4. **Movie Detail Page** — View full film info + trailer
5. **Genre Filters** — Filter before exploring (bonus)

---

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/BallenghienAlexis/CineMatch/issues)
- **Expo Docs**: [expo.dev/docs](https://docs.expo.dev)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **TMDB Docs**: [themoviedb.org/docs](https://www.themoviedb.org/docs)

---

## 📄 License

Academic project for SUP de VINCI Master Degree  
Built with: Expo, React Native, Supabase, TMDB API

**Last Updated**: 2026-05-04 — Session 6: Progress Restoration ✅

