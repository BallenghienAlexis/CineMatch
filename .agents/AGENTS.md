# AGENTS Guide for CineMatch

## 🎯 Project Mission & Context
**CineMatch** is an educational evaluation project (SUP de VINCI, M1 React Native) for an app that helps friend groups choose movies together via voting/swiping. Each member swipes films secretly, and the app reveals matches (films everyone liked).

- **Evaluation document**: `contexte.md` — defines all mandatory + bonus features and scoring rubric.
- **Status**: Starter scaffold (Expo boilerplate) adapted to CineMatch; core features not yet implemented.
- **Critical path**: Auth → TMDB API → Swipe UI → Supabase persistence → History/Search + bonus animations.

## Project Snapshot
- Stack: Expo SDK 54 + React Native 0.81 + React 19 + TypeScript strict (`package.json`, `tsconfig.json`).
- Routing is file-based with Expo Router; app entry is `expo-router/entry` (`package.json`).
- Current codebase is the Expo starter scaffold adapted to `CineMatch` naming (`app.json`).

## Architecture You Need First
- Root navigation is in `app/_layout.tsx`: `ThemeProvider` + `Stack` with `(tabs)` and `modal` routes.
- Tab navigation is in `app/(tabs)/_layout.tsx` with two tabs: `index` and `explore`.
- Screen files map directly to routes: `app/(tabs)/index.tsx`, `app/(tabs)/explore.tsx`, `app/modal.tsx`.
- Shared UI primitives live in `components/` and `components/ui/` and are used by screens.

## Mandatory Features (from `contexte.md`)
1. **Auth** (Supabase): Email + password signup/login with user persistence.
2. **Swipe Screen**: Films one-by-one (poster, title, year, TMDB rating) + left/right gestures (PanResponder or react-native-gesture-handler).
3. **Matches Screen**: Show user's liked films, sorted by TMDB rating, persisted in Supabase.
4. **Film Detail**: Synopsis, duration, genres, rating, YouTube trailer link, top 5 cast.
5. **Search**: Debounced search bar for films (TMDB API).
6. **History**: Swipe history (likes + rejects) persistent in Supabase, viewable in dedicated screen.
7. **API**: TMDB (The Movie Database) — `/movie/popular`, `/movie/{id}`, `/search/movie` + `.env` file required.

Bonus (+1 pt each, max +2): Genre filters before swiping; smooth Reanimated card animation during swipe.

## Theming and UI Conventions
- Prefer `ThemedText` and `ThemedView` over raw `Text`/`View` for app content (`components/themed-text.tsx`, `components/themed-view.tsx`).
- Resolve colors through `useThemeColor` (`hooks/use-theme-color.ts`) and tokens in `constants/theme.ts`.
- Keep imports on alias paths (`@/...`) instead of deep relative paths (configured in `tsconfig.json`).
- For platform-specific components, follow suffix convention (`components/ui/icon-symbol.ios.tsx` + fallback `icon-symbol.tsx`).

## Cross-Platform Patterns
- External links should use `ExternalLink` (`components/external-link.tsx`) so native opens in in-app browser.
- Tab press haptics are centralized in `HapticTab` (`components/haptic-tab.tsx`); don't duplicate haptic logic in screens.
- Animated/parallax header behavior is encapsulated in `ParallaxScrollView` (`components/parallax-scroll-view.tsx`).
- Web color scheme hydration is handled in `hooks/use-color-scheme.web.ts`; keep this split when touching theme logic.

## Evaluation UX Requirements (from `contexte.md`)
- **Loading states**: Use `ActivityIndicator` during API/Supabase calls; never let the UI hang silently.
- **Error handling**: Display readable error messages on network failure or API errors.
- **Responsive design**: No text cutoff, no overflow; test on iOS + Android via Expo Go or emulator.
- **Empty states**: Every list (history, search results, matches) must show a meaningful empty state.
- **No console.log in production**: Remove all debug logs before final submission.
- **Test on real device early**: Emulator behavior differs from physical devices.

## Code Structure Requirements (from evaluation rubric)
- Organize as: `src/components/`, `src/screens/`, `src/hooks/`, `src/services/`, `src/utils/`.
- Reusable components (Button, Card, Input) isolated in `components/`.
- TMDB API calls grouped in `services/`, never scattered in screens.
- Supabase auth + database calls also in `services/` or dedicated `hooks/`.

## Developer Workflows
- Install deps: `npm install`.
- Start dev server: `npm run start` (or `npm run android`, `npm run ios`, `npm run web`).
- Lint: `npm run lint` (Expo ESLint flat config in `eslint.config.js`).
- `npm run reset-project` is destructive/structural: it moves or deletes `app`, `components`, `hooks`, `constants`, `scripts` into `app-example` (`scripts/reset-project.js`). Avoid running it during normal feature work.
- **Git workflow**: See `GIT_COMMIT_GUIDELINES.md` — commits are graded (1.5 pts); min 3–5 commits per feature, explicit messages required, -3 pts if single last-minute commit.

## Change Guidance for Agents
When implementing CineMatch features:
- **Never hardcode API keys or Supabase URLs**: Use `.env` file (listed in `.gitignore`) + `expo-constants`.
- **Supabase first**: Set up auth before building UI — it's the foundation of all features.
- **Services layer**: Put TMDB fetch calls in `src/services/tmdb.ts`; Supabase queries in `src/services/supabase.ts`.
- **When adding screens**: Place under `app/` for automatic routing; keep layouts in `_layout.tsx`.
- **Reuse primitives**: Before creating new UI, use existing `Collapsible`, `IconSymbol`, `ParallexScrollView`.
- **Animations bonus**: Use `react-native-reanimated` (already in `package.json`) for swipe card animation.
- **Git discipline**: Commit frequently with clear messages; evaluation penalizes single last-minute commit.
- **README critical**: Document how to get TMDB key, set `.env`, install deps, run app; mention team members && their parts.

## Existing AI Instructions Discovered
- Searched: `**/{.github/copilot-instructions.md,AGENT.md,AGENTS.md,CLAUDE.md,.cursorrules,.windsurfrules,.clinerules,.cursor/rules/**,.windsurf/rules/**,.clinerules/**,README.md}` + `.agents/**`.
- Found: `.agents/contexte.md` (evaluation document) + `.agents/skills/` (skill modules).
- No prior agent guide existed; this `AGENTS.md` replaces boilerplate starter assumptions with concrete project needs.

## Historical Context (in HISTORY.md)
This document consolidates knowledge from `contexte.md`, the starter scaffold, and component patterns to guide AI agents in feature development. All changes are logged in `HISTORY.md` for inter-session continuity.

