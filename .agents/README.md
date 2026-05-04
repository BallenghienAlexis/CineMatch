# 📚 `.agents/` — Instruction Repository for CineMatch

This folder centralizes all AI agent and team member instruction documents for the CineMatch project.

## 📋 Files in this Directory

| File | Purpose | Audience |
|------|---------|----------|
| **contexte.md** | Complete evaluation specification (SUP de VINCI) | Students, evaluators |
| **AGENTS.md** | AI agent guidance for feature development | AI agents (Copilot, Claude, Cursor) |
| **GIT_COMMIT_GUIDELINES.md** | Git workflow & commit conventions | Team members |
| **skills/** | Modular skill documentation (Expo, React, design patterns) | Specialized agents |

---

## 🚀 Quick Start Guide

### For Team Members
1. **First time?** Read `AGENTS.md` for architecture overview.
2. **Writing code?** Check `AGENTS.md` → "Change Guidance for Agents" section.
3. **Making commits?** Follow `GIT_COMMIT_GUIDELINES.md` for message format and workflow.

### For AI Agents (Copilot, Claude, etc.)
1. Start with `AGENTS.md` for project context and mandatory features.
2. Reference `contexte.md` for complete evaluation rubric (scoring, penalties).
3. Use `GIT_COMMIT_GUIDELINES.md` when committing changes.

### For Evaluators
- `contexte.md` = complete evaluation specification
- `AGENTS.md` = architecture & feature checklist
- See `HISTORY.md` (project root) for session-by-session progress

---

## 📝 Document Maintenance

All documents should be:
- **Updated when evaluation rubric changes** → Modify `contexte.md`
- **Updated when architecture changes** → Modify `AGENTS.md`
- **Updated when workflow changes** → Modify `GIT_COMMIT_GUIDELINES.md`
- **Never hardcoded with secrets** (API keys, URLs always in `.env`)

---

## 🔗 Related Files (Project Root)

- `HISTORY.md` — Session-by-session changelog & feature progress
- `.gitignore` — Secrets are excluded from Git
- `package.json` — Dependencies and scripts (npm install, npm run start)

---

**Directory Created**: 2026-05-04  
**Last Updated**: 2026-05-04

