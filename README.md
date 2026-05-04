# 🎬 CineMatch — Movie Discovery App

**L'app qui met fin aux débats interminables pour choisir un film** 🎞️

A React Native application for discovering, rating, and managing movies with your friends. Built with Expo, Supabase, and The Movie Database (TMDB) API.

**Project**: SUP de VINCI M1 React Native - Master Degree  
**Evaluation**: Final Assessment - 20 points  
**Status**: ✅ In Development (Session 6 — Progress Restoration Complete)

---

## 👤 Solo Developer

**Developer**: Alexis BALLENGHIEN  
**Status**: Solo project (not penalized on scoring)  
**All Features**: Auth, Navigation, Explore, Matches, History, Database

> **Note**: Solo work = same feature requirements as team, but all features implemented by one person.

---

---

## ⚙️ Prerequisites & Setup

### System Requirements

- **Node.js**: 18+ (check with `node --version`)
- **npm**: 9+ (check with `npm --version`)
- **Expo CLI**: Latest (install globally: `npm install -g expo-cli`)
- **Expo Go**: Download iOS/Android app for device testing
- **Git**: For version control

### Required API Keys & Configuration

#### 1️⃣ **TMDB API Key** (The Movie Database)

1. Visit: https://www.themoviedb.org/settings/api
2. Create an account (free)
3. Go to **Settings → API**
4. Copy your **API Read Access Token** (v4 auth)
5. This will be: `EXPO_PUBLIC_TMDB_API_KEY=your_token_here`

**Format**: Should look like `eyJhbGciOiJIUzI1NiJ9...` (long token)

#### 2️⃣ **Supabase Configuration** (Auth + Database)

1. Visit: https://supabase.com
2. Create account or sign in
3. Create new project:
   - Project name: `cinematch` (any name)
   - Database password: Set secure password
   - Region: Europe (or closest)
4. Go to **Settings → API**
5. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **Anon (public) key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Format**: 
- URL: `https://xxxxx.supabase.co`
- Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT token)

---

## 🚀 Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOURREPO.git
cd CineMatch
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`:
- Expo SDK 54
- React Native 0.81
- Supabase JS 2.43
- TypeScript 5.9
- And other dependencies

### Step 3: Configure Environment Variables

1. Copy the template file:

```bash
cp .env.example .env.local
```

2. Open `.env.local` in your editor and fill in your values:

```env
# The Movie Database API (from https://www.themoviedb.org/settings/api)
EXPO_PUBLIC_TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9...

# Supabase Project Settings (from https://supabase.com/dashboard)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT**: 
- **NEVER** commit `.env.local` to Git (it's in `.gitignore`)
- **NEVER** share these keys publicly
- Anyone with these keys can access your database and use your API quota

### Step 4: Start Development Server

```bash
npx expo start
```

You should see:

```
✅ Expo server is running on http://localhost:8081
Scan the QR code to launch the app:
[QR CODE DISPLAYED]
```

### Step 5: Run on Your Device

**Option A: Expo Go (Recommended for Testing)**

- **iOS**: Open Camera app, scan QR code, tap notification
- **Android**: Open Expo Go app, tap "Scan QR code", scan QR code
- **Web**: Press `w` in terminal

**Option B: Local Simulator**

```bash
# iOS (Mac only)
npx expo start
# Then press 'i'

# Android
npx expo start
# Then press 'a'
```

**Option C: EAS Build (Production)**

```bash
npm install -g eas-cli
eas build --platform android  # Generates .apk
eas build --platform ios      # Generates .ipa
```

---

## 📦 Project Structure

### Directory Explanation

## 📁 Project Structure

```
CineMatch/
├── 📱 app/                              # Expo Router file-based navigation
│   ├── _layout.tsx                      # ROOT: AuthProvider + Stack setup
│   ├── (tabs)/                          # Tab-based navigation group
│   │   ├── _layout.tsx                  # Tabs layout (3 screens)
│   │   ├── explore.tsx                  # 🎬 Swipe/Discover screen (main feature)
│   │   ├── matches.tsx                  # ❤️ Liked movies grid
│   │   └── history.tsx                  # 📜 Swipe history + filters
│   ├── auth/                            # Authentication routes
│   │   ├── _layout.tsx
│   │   ├── login.tsx                    # Login screen
│   │   └── signup.tsx                   # Signup screen
│   └── detail/
│       └── [movieId].tsx                # 🎞️ Movie detail (dynamic route)
│
├── 🔧 src/                              # Business logic & reusable code
│   ├── services/                        # API & database calls (ISOLATED)
│   │   ├── supabase.ts                  # Supabase client + types
│   │   ├── auth.ts                      # signup(), login(), logout()
│   │   ├── database.ts                  # Supabase queries (likes, history)
│   │   └── tmdb.ts                      # TMDB API + caching
│   ├── contexts/                        # Global state management
│   │   ├── AuthContext.tsx              # useAuth() hook
│   │   ├── GenreContext.tsx             # (Optional) genre filters
│   │   └── ThemeContext.tsx             # Theme state
│   ├── components/                      # Reusable UI components
│   │   └── MovieCard.tsx                # Card component (movies display)
│   ├── screens/                         # Screen-specific components
│   │   └── auth/
│   │       ├── LoginScreen.tsx
│   │       └── SignupScreen.tsx
│   └── hooks/                           # Custom React hooks
│       └── useFormatting.ts             # debounce, dateFormat, runtime
│
├── 🎨 components/                       # Expo starter components
│   ├── themed-text.tsx                  # Theme-aware text
│   ├── themed-view.tsx                  # Theme-aware container
│   ├── haptic-tab.tsx                   # Haptic feedback buttons
│   └── ui/                              # Generic UI components
│
├── ⚙️ constants/
│   └── theme.ts                         # Colors (light/dark palette)
│
├── hooks/                               # Platform-specific hooks
│   ├── use-color-scheme.ts              # Dark mode detector
│   └── use-color-scheme.web.ts
│
├── 📄 Configuration Files
│   ├── .env.local                       # 🔒 GITIGNORED - Fill with your keys
│   ├── .env.example                     # Template - check this for format
│   ├── .gitignore                       # Git ignore rules
│   ├── app.json                         # Expo app config
│   ├── package.json                     # Dependencies & scripts
│   ├── tsconfig.json                    # TypeScript strict mode
│   ├── eslint.config.js                 # Code linting rules
│   └── expo-env.d.ts                    # TypeScript definitions
│
├── 📚 Documentation
│   ├── README.md                        # THIS FILE
│   ├── HISTORY.md                       # Session changelog
│   ├── PROJECT_CONTEXT.md               # Full project overview
│   ├── TECH_STACK.md                    # Dependencies explanation
│   ├── QUICK_START.md                   # 5-minute quickstart
│   ├── EVALUATION_STATUS.md             # Evaluation checklist
│   └── CONTEXT_INDEX.md                 # Quick reference index
│
└── .agents/                             # AI Agent Guidelines (for Cursor/AI tools)
    ├── AGENTS.md                        # AI development rules
    ├── GIT_COMMIT_GUIDELINES.md         # Git commit standards
    ├── contexte.md                      # Evaluation spec
    ├── skills/                          # Skills directory
    └── README.md
```

### Key Architecture Decisions

- **`app/`**: Expo Router (file-based routing) — simpler than React Navigation
- **`src/services/`**: Centralized API calls (auth, database, TMDB) — no scattered fetch()
- **`src/contexts/`**: AuthContext for global state — avoids prop drilling
- **`components/`**: Reusable MovieCard component — DRY principle
- **`.env.local`**: Secrets NOT in version control — security best practice

---

## 💡 Technology Justification

### Why These Choices?

| Technology | Why Chosen | Alternative | Trade-offs |
|------------|-----------|-------------|-----------|
| **Expo** | Rapid development, EAS hosting, all platforms | React Native CLI | Slightly larger bundle, opinionated choices |
| **TypeScript** | Type safety, catching errors early | JavaScript | Slight learning curve, build step required |
| **Supabase** | Free tier, built-in Auth + DB + Realtime | Firebase, custom API | Postgres learning required |
| **Expo Router** | File-based routing, modern | React Navigation | Routes tied to file structure |
| **React Context** | Lightweight, built-in, no dependencies | Redux, Zustand | Props drilling at scale |
| **PanResponder** | Native, no extra library | Gesture Handler | Less powerful, but simpler |
| **TMDB API** | Large movie database, free API | OMDb, custom data | Rate limiting on free tier |

---

## 📦 Dependencies

### Core Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.33 | Platform SDK |
| `react` | 19.1.0 | UI Framework |
| `react-native` | 0.81.5 | Mobile Runtime |
| `expo-router` | ~6.0.23 | File-based routing |
| `typescript` | ~5.9.2 | Type safety |

### Backend & Auth

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/supabase-js` | ^2.43.1 | Database + Auth SDK |
| `expo-secure-store` | ~13.0.0 | Secure token storage |
| `@react-native-async-storage/async-storage` | ^1.23.1 | Local caching |

### UI & Animations

| Package | Version | Purpose |
|---------|---------|---------|
| `@react-navigation/native` | ^7.1.8 | Navigation foundation |
| `@react-navigation/bottom-tabs` | ^7.4.0 | Tab navigation |
| `react-native-reanimated` | ~4.1.1 | Smooth animations |
| `expo-image` | ~3.0.11 | Image optimization |

### Complete List

See `package.json` for full list of 30+ dependencies. Install all with:

```bash
npm install
```

---

## 🔐 Security & Environment Variables

### .env.local (Secrets - NEVER commit)

This file contains your API keys and should NEVER be pushed to GitHub.

**It's already in `.gitignore`** ✅

To set it up:

1. Copy `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual keys (see Setup section above)

3. Verify it's NOT committed:
   ```bash
   git status .env.local  # Should say "not tracked" or not appear
   ```

### .env.example (Template - OK to commit)

This is a **template** showing what variables are needed. Safe to commit.

Contains dummy/placeholder values so other developers know what to fill in.

---

## 🎮 Available Commands

```bash
# Development
npm start              # Start Expo server (use 'i', 'a', 'w' to select platform)
npm run android        # Start Android emulator
npm run ios            # Start iOS simulator
npm run web            # Start web browser

# Linting & Type Checking
npm run lint           # Check code style (ESLint)
npm run tsc            # Check TypeScript types

# Utilities
npm run reset-project  # ⚠️ DANGER: Reset to Expo starter (use rarely!)
```

---

## 🎬 App Features Status

### ✅ Fully Implemented (Session 6)

- [x] **Authentication** — Supabase auth with secure session
- [x] **Explore Screen** — Swipe UI with PanResponder
- [x] **Liked Movies** — Database persistence + grid display
- [x] **History** — Swipe history with filters
- [x] **Progress Restoration** — Resume where user left off
- [x] **Dark Mode** — System theme support
- [x] **French UI** — Localized strings

### 🟡 In Progress (Upcoming)

- [ ] **Movie Detail** — Full synopsis, genres, cast, trailers
- [ ] **Search Screen** — Find movies with debounce

### 🎁 Bonus (Optional)

- [ ] **Genre Filters** — Pre-filter by genre before swiping
- [ ] **Reanimated Animations** — Smooth card rotation

---

##

## 📱 Navigation Flow

```
Landing (Auth Check)
    ↓
    ├─ NOT Logged In → /auth/login
    │   ├─ Login Screen
    │   └─ → Signup Screen
    │
    └─ Logged In → /(tabs)
        ├─ 🎬 Explore (Swipe)
        │   └─ Swipe → Save to DB
        │
        ├─ ❤️ Matches (Liked Movies)
        │   ├─ Grid view, sorted by rating
        │   └─ Tap detail → /detail/[movieId]
        │
        └─ 📜 History (All Swipes)
            ├─ Filter: All/Likes/Rejects
            └─ View timestamps
```

---

## 💻 Git & Collaboration

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, test locally
git add .
git commit -m "feat(scope): description"

# Follow conventions from .agents/GIT_COMMIT_GUIDELINES.md
# Examples:
#   feat(explore): add progress restoration
#   fix(auth): handle token expiry
#   refactor(services): simplify database queries
#   docs(readme): update installation steps

# Push when ready
git push -u origin feature/your-feature-name
```

### Code Standards

- ✅ **TypeScript strict mode** — catch errors at compile time
- ✅ **ESLint** — `npm run lint` before committing
- ✅ **Functional components** — React Hooks only
- ✅ **Services layer** — API calls isolated from UI
- ✅ **No console.log** — in production code
- ✅ **Empty states** — every list has a fallback
- ✅ **Error handling** — network errors handled gracefully

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Auth Flow**
  - [ ] Signup with new email
  - [ ] Login with correct credentials
  - [ ] Logout clears session
  - [ ] Invalid password shows error

- [ ] **Explore Screen**
  - [ ] Movies load from TMDB
  - [ ] Swipe right saves like to database
  - [ ] Swipe left saves reject to database
  - [ ] Auto-pagination works (loads more at ~3 remaining)
  - [ ] Reload app → resume from where left off ✅

- [ ] **Matches Screen**
  - [ ] Shows only liked movies
  - [ ] Sorted by rating (highest first)
  - [ ] Pull-to-refresh works
  - [ ] Empty state when no likes

- [ ] **History Screen**
  - [ ] Shows all swipes
  - [ ] Filters work (All/Likes/Rejects)
  - [ ] Dates formatted correctly
  - [ ] Empty state when no history

- [ ] **Responsive Design**
  - [ ] Test on portrait + landscape
  - [ ] Test on small screen (SE) + large screen (Plus)
  - [ ] No text cutoff or overflow

- [ ] **Dark Mode**
  - [ ] Toggle system dark mode
  - [ ] All text readable in both modes
  - [ ] Proper contrast ratios

---

## 📊 Database Schema (Supabase)

All tables have **Row-Level Security (RLS)** enabled — users only see their own data.

### Tables

```sql
-- User Profiles (auto-created on signup)
profiles {
  id: UUID (PRIMARY KEY, FK auth.users)
  email: TEXT
  created_at: TIMESTAMP
}

-- Liked Movies
liked_movies {
  id: SERIAL (PRIMARY KEY)
  user_id: UUID (FK profiles) *RLS enforced*
  movie_id: INT (TMDB ID)
  movie_title: TEXT
  movie_rating: FLOAT
  poster_path: TEXT
  created_at: TIMESTAMP
}

-- Swipe History
swipe_history {
  id: SERIAL (PRIMARY KEY)
  user_id: UUID (FK profiles) *RLS enforced*
  movie_id: INT (TMDB ID)
  movie_title: TEXT
  action: ENUM ('like', 'reject')
  created_at: TIMESTAMP
}
```

### Setup

1. Create tables via Supabase dashboard SQL editor
2. Enable RLS on all tables
3. Add policies:
   - SELECT: `auth.uid() = user_id`
   - INSERT: `auth.uid() = user_id`
   - UPDATE: `auth.uid() = user_id`
   - DELETE: `auth.uid() = user_id`

SQL scripts available in:
- `supabase-fix-rls.sql` — RLS policies
- `supabase-update-liked-movies.sql` — Schema updates

---

## 🐛 Troubleshooting

### "API key not found"
- Check `.env.local` exists
- Check format: `EXPO_PUBLIC_TMDB_API_KEY=your_key_here` (no spaces)
- Restart `npm start`

### "Cannot connect to Supabase"
- Check `.env.local` has valid URL and key
- Check Supabase project is running (dashboard)
- Check RLS policies exist

### "App crashes on startup"
- Check console: `npm start` shows actual error
- Verify `.env.local` is filled correctly
- Try: `npm install` again

### "Progress restoration not working"
- Check Supabase table `swipe_history` has data
- Check RLS allows reads from current user
- Check console logs: `📊 🔄 ✅` debug markers

---

## 📚 Additional Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | 5-min overview (cases, flows, key points) |
| **PROJECT_CONTEXT.md** | Full technical overview (20-30 min read) |
| **TECH_STACK.md** | Dependencies & architecture explanation |
| **EVALUATION_STATUS.md** | Evaluation checklist & scoring |
| **CONTEXT_INDEX.md** | Quick reference & FAQ |
| **HISTORY.md** | Session-by-session changelog |
| **.agents/GIT_COMMIT_GUIDELINES.md** | Git commit conventions |
| **.agents/contexte.md** | Official evaluation rubric |

---

## 🤝 Contributing

1. Read `.agents/GIT_COMMIT_GUIDELINES.md`
2. Create feature branch: `git checkout -b feature/xyz`
3. Make changes with commits
4. Test thoroughly (iOS + Android)
5. Push: `git push -u origin feature/xyz`
6. Notify team for review

---

## 📞 Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Supabase Docs**: https://supabase.com/docs
- **TMDB API**: https://www.themoviedb.org/docs/api
- **TypeScript Handbook**: https://www.typescriptlang.org

---

## ✅ Before Submission Checklist

- [ ] All environment variables in `.env.local` are filled
- [ ] `.env.local` is NOT committed (check `.gitignore`)
- [ ] `.env.example` is in repo with placeholders
- [ ] `npm install` runs without errors
- [ ] `npm start` launches without crashes
- [ ] App works on iOS + Android (Expo Go) ✅
- [ ] Dark/Light mode works
- [ ] No console.log in production code
- [ ] README is complete and accurate
- [ ] Git history shows regular commits
- [ ] Search & Detail screens implemented (if available)
- [ ] All features work offline (with cached data)

---

## 📄 License & Attribution

**Academic Project**: SUP de VINCI Master 1 React Native

Built with:
- ⚛️ React Native + Expo
- 🗄️ Supabase (PostgreSQL)
- 🎬 The Movie Database API
- 🎯 Expo Router
- 🔐 TypeScript

---

**Last Updated**: 2026-05-04 — Session 6 ✅  
**Current Status**: In Development (Evaluation Ready)

For latest updates, see `HISTORY.md`
