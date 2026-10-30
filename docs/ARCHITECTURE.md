# Thaw Architecture Overview

Thaw is a Next.js 14 (App Router) full-stack web application for students with executive dysfunction.

## Layer diagram

```
Browser (Next.js App Router)
├─ Landing (/)
├─ Dashboard — one recommended next action + energy check-in
├─ Tasks — CRUD, subtasks, filter, sort, search
├─ Sequencer — RAG-grounded AI task breakdown
├─ Timer — focus session with body-double presence
├─ Rest — guilt-free rest sanctuary
├─ Planner — energy-aware weekly schedule + rebalance
├─ Activity — neutral history
├─ Insights — real metrics from stored data
└─ Settings — privacy & preferences
          │
          ▼
State layer — ThawContext (React Context)
  ├─ energyLevel (1–5 spoons)
  ├─ tasks (+ subtasks)
  ├─ activities (neutral log)
  └─ preferences (reducedMotion, demoMode)
          │ persists to
          ▼
Browser LocalStorage (thaw_energy, thaw_tasks, thaw_activities, thaw_motion)
          │
          ▼
API route layer — /api/sequence
  ├─ RAG retrieval (lib/rag.ts, keyword + metadata)
  ├─ Anthropic / Gemini (optional, server-side keys only)
  └─ Deterministic local fallback (when no key / provider fails)
```

## Data flow & persistence

- User state lives in React Context and is persisted to `localStorage` on mutation.
- `localStorage` is scoped to one browser profile; data is not synchronized across devices and is not server-backed.
- AI sequencing requests POST to `/api/sequence`, where strategies are retrieved via RAG and (if a key is configured) sent to the LLM. A clearly identified local fallback guarantees uninterrupted use without credentials.

## Design tokens

Defined in `app/globals.css` as CSS variables: colors (`--color-bg`, `--color-sage`, `--color-amber`, etc.), radius, shadows, transitions, spacing, and typography. Shared UI components live in `components/ui/` (Button, GlassPanel, Toast, EmptyState, Skeleton, EnergySelector).

## Security decisions

- AI API keys are server-side environment variables only; never exposed to the client.
- No secrets committed to the repo (see `.env.example`).
- Task contents are not logged unnecessarily.
- No webcam, keystroke logging, or invasive browser monitoring.
- No diagnostic telemetry.

## Limitations

- Persistence is `localStorage` only — single browser profile, no multi-user backend.
- RAG retrieval is keyword + metadata based (not vector search).
- Live AI requires ANTHROPIC_API_KEY or GEMINI_API_KEY; otherwise fallback is used.
- No clinical validation or therapeutic claims.
