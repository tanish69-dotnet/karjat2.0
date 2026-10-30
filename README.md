# Thaw — An Adaptive Co-Pilot for Getting Unstuck

Thaw is an AI-powered adaptive planner and executive-function co-pilot for university students experiencing task paralysis, overwhelm, or burnout.

It does not maximize productivity at any cost. It helps a person determine a realistic next action, initiate that action with minimal friction, adapt plans to current capacity, and choose rest when appropriate.

## Core principles

1. **Progress adapts to the person** — plans flex around energy, deadlines, and capacity.
2. **Reduce cognitive load** — one clear next action, not a wall of tasks.
3. **The user stays in control** — every recommendation can be edited, regenerated, saved, or declined; rest is always an equal option.

## Technical differentiator

An energy-aware, retrieval-grounded (RAG) task-sequencing engine that converts overwhelming academic work into realistic, context-sensitive micro-actions. Before generating steps, Thaw retrieves relevant non-clinical strategies (task initiation, decomposition, low-energy pacing, rest) and grounds the AI's suggestions in them.

## Tech stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS, Framer Motion, Lucide icons
- React Context + LocalStorage persistence
- Cinematic 3D Bookshelf with physical book portal spreads
- Liquid Glass floating navbar with dynamic active route indicator
- Atmospheric Book-Opening Loading Intro sequence
- Server-side `/api/sequence` route with RAG retrieval
- Optional Anthropic / Gemini API keys (local deterministic fallback when none configured)

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/dashboard` | Today's workspace — one recommended next action, energy check-in, upcoming work |
| `/tasks` | Full task CRUD, subtasks, filter, sort, search |
| `/sequencer` | AI task breakdown with editable results |
| `/timer` | Focus timer with body-double presence |
| `/rest` | Guilt-free rest sanctuary |
| `/planner` | Energy-aware weekly planner with rebalance |
| `/activity` | Neutral activity history |
| `/insights` | Real metrics from stored data |
| `/settings` | Privacy & preferences |

## Getting started

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Environment variables

See `.env.example`. AI provider keys are optional. Without them, Thaw uses a clearly identified local fallback.

```env
# Optional — only needed for live AI task sequencing
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## Data & privacy

- Tasks, energy levels, and activity history are stored in browser `localStorage` only.
- Nothing is synchronized across devices.
- Task text is sent to an AI provider only when you use the sequencer (and only if a key is configured).
- You can export or delete all local data in Settings.
- Thaw does not track browsing, capture keystrokes, or infer diagnoses.

## Documentation

- `docs/ARCHITECTURE.md` — system design and data flow
- `docs/AI_RAG_DESIGN.md` — AI provider, retrieval, and transparency design
- `docs/DEMO_SCRIPT.md` — 3-minute panel demo script
- `docs/IMPLEMENTATION_STATUS.md` — implemented vs planned features

## Limitations

- Persistence is `localStorage`-scoped to one browser profile; no multi-user backend.
- RAG retrieval is keyword + metadata based (not vector search) unless a vector DB is configured.
- No clinical validation or therapeutic claims are made.

## Build & verification

```bash
npm run build    # production build + typecheck + lint
npm run dev      # dev server
```
