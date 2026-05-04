# 📝 Git Commit Guidelines — CineMatch

## 🎯 Objectif Évaluation
L'historique Git est **noté** sur **1,5 pts** (`critère 8` du barème équipe).
- ✅ **Commits réguliers** des différents membres
- ✅ **Messages explicites** (pas vagues)
- ⚠️ **-3 pts** si un seul commit à la dernière minute

**Règle d'or**: Chaque feature doit avoir **au minimum 3–5 commits** montrant la progression.

---

## 📋 Conventions de Messages

### Format Requis
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types Acceptés
- **feat**: Nouvelle fonctionnalité (Auth, Swipe UI, Search)
- **fix**: Correction de bug
- **refactor**: Restructuration de code sans changement fonctionnel
- **style**: Changements visuels UI/UX (couleurs, layout, spacing)
- **test**: Ajout/modification de tests
- **docs**: Documentation (README, comments)
- **chore**: Tâches non liées au code (dépendances, config)

### Exemples de Bons Messages

```
feat(auth): implement Supabase signup screen with email validation

- Create signup form component with React Hook Form
- Add real-time email validation via Supabase
- Include error handling for duplicate emails
- Pass error state to user-friendly messages

Refs: Feature 1 (Auth)
```

```
feat(swipe): add gesture-based swipe detection with PanResponder

Body:
- Implement PanResponder for left/right swipe gestures
- Calculate swipe distance and velocity thresholds
- Persist swipe action (like/reject) to local state
- Trigger haptic feedback on successful swipe

Closes: #12
```

```
fix(history): resolve undefined swipe history on cold start

- Check for null/undefined before mapping history array
- Initialize empty history state when no Supabase data available
- Add empty state message for users with no swipe history

Fixes: #45
```

---

## 🔄 Workflow Git par Feature

### 1️⃣ Créer une Branche Feature
```bash
# Format: feature/descriptive-name (lisible)
git checkout -b feature/supabase-auth
git checkout -b feature/tmdb-api-integration
git checkout -b feature/swipe-screen-ui
git checkout -b feature/matches-persistence
```

### 2️⃣ Committer au fur et à mesure (Petit commit = facile à revoir)
```bash
# Commit 1: Mise en place de la structure
git commit -m "feat(auth): setup Supabase client and types"

# Commit 2: Écran de signup
git commit -m "feat(auth): create signup screen component"

# Commit 3: Intégration Supabase
git commit -m "feat(auth): integrate Supabase signup function"

# Commit 4: Gestion erreurs
git commit -m "fix(auth): handle duplicate email and network errors"

# Commit 5: Feedback utilisateur
git commit -m "style(auth): add loading state and success message"
```

### 3️⃣ Merger dans Main (Quand stable)
```bash
git checkout main
git pull origin main
git merge --no-ff feature/supabase-auth
# Le flag --no-ff crée un commit de merge explicite
git push origin main
```

---

## ✅ Checklist Avant Chaque Commit

- [ ] Code testé (au moins sur un device via Expo Go)
- [ ] Pas de code commented-out laissé (sauf TODO explicite)
- [ ] Pas d'import inutilisé
- [ ] TypeScript: pas de `// @ts-ignore` sauf justifié
- [ ] Message de commit explicite (min 5 mots)
- [ ] Lié à une seule feature/fix (pas mélanger les sujets)

---

## 📊 Exemple de Progression Réaliste (2 Semaines)

### Semaine 1
```
commit 1: chore: initialize project structure with services/
commit 2: feat(auth): setup Supabase client config
commit 3: feat(auth): create signup form UI
commit 4: feat(auth): implement signup function
commit 5: fix(auth): handle email validation errors
commit 6: feat(auth): add login screen
commit 7: feat(nav): add auth-protected tab navigation
```

### Semaine 2
```
commit 8: feat(api): create TMDB service with movie fetch
commit 9: feat(swipe): create swipe screen component
commit 10: feat(swipe): implement PanResponder gesture
commit 11: fix(swipe): calibrate swipe distance threshold
commit 12: feat(swipe): add haptic feedback
commit 13: feat(persistence): integrate liked movies to Supabase
commit 14: feat(matches): create matches screen UI
commit 15: feat(matches): fetch and display user liked movies
```

---

## ⚠️ Pénalités Automatiques

| Situation | Pénalité |
|-----------|----------|
| Repo non partagé ou inaccessible | Rendu non reçu = 0 pour l'équipe |
| **Un seul commit la veille** | **-3 pts (équipe)** |
| Historique Git vague ("fix", "update", "oups") | -0.5 pts |
| Commits sans lien entre membres | -1 pt (impossible à identifier contributions) |

---

## 🚀 Bonnes Pratiques Équipe

### Attribution de Features par Personne
```
Exemple équipe de 3:
- Alice:   Auth (Supabase login/signup)
- Bob:     TMDB API + Swipe screen
- Charlie: Matches + History screens
```

Chaque commit de Bob doit avoir `feat(swipe):` ou `feat(api):` → facile d'identifier sa part.

### Fréquence Minimale
- **Par membre**: 1 commit tous les 2–3 jours minimum
- **Par feature**: 3–5 commits montrant progression
- **Avant deadline**: Au moins 15–20 commits total (équipe de 2–3)

### Message de Commit = Documentation
```
❌ MAUVAIS:
commit 1: fix
commit 2: update
commit 3: stuff

✅ BON:
commit 1: feat(swipe): implement left/right gesture detection
commit 2: feat(swipe): add haptic feedback on successful swipe
commit 3: fix(swipe): prevent card swipe when already swiped
```

---

## 🔗 Intégration avec HISTORY.md

Après chaque **session de développement majeure**, mettez à jour `HISTORY.md`:
```markdown
## Session X — YYYY-MM-DD
### Feature Name

**Commits**:
- commit_hash1: feat(scope): description
- commit_hash2: fix(scope): description
- commit_hash3: refactor(scope): description

**Status**: ✅ Complete / 🟡 In Progress / ❌ Blocked
**Notes**: What was done, what's next, any blockers
```

---

## 📌 Résumé: Les 3 Règles d'Or

1. **Commit régulièrement** (min 1 commit/2-3 jours par personne)
2. **Messages explicites** (feature + scope + description claire)
3. **Une branche = une feature** (facile à review et merger)

```bash
# Template copier-coller pour commencer
git checkout -b feature/[name]
# ... code ...
git add .
git commit -m "feat(scope): description with context

- Added component/function
- Integrated with Supabase/API
- Tested on iOS and Android

Refs: Feature X from contexte.md"
```

---

**Version Guidelines**: 1.0 — 2026-05-04  
**Lié à**: `contexte.md` (critère 8: Historique Git / 1.5 pts)

