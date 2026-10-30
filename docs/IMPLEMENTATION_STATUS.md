# Thaw Implementation Status

## Implemented (current)

### Core
- Landing page — premium marketing page, privacy principles, CTA to app
- Dashboard — one recommended next action, energy check-in, upcoming work, recent activity
- Tasks — full CRUD, subtasks, deadline/duration/energy/flexibility, filter, sort, search, edit with confirmation, delete with confirmation
- AI Sequencer — RAG retrieval, live Anthropic/Gemini or local fallback, Zod-validated output, editable steps, save-to-tasks, transparency disclosure, loading/error/empty states
- Timer — authoritative Date.now clock, tab-visibility handling, presets, skip, completion state, body-double
- Rest — guided breathing (4-4-4), optional break timer, grounding suggestions, unrestricted exit, no penalties
- Weekly Planner — deterministic energy-aware scheduler, rebalance workflow with review/confirm, deadline and effort respect, mobile-friendly
- Activity — neutral history log
- Insights — real metrics (completions, focus time, sessions, rest, weekly trend), no fabricated stats
- Settings — data export/delete, reset, reduced motion, demo mode, privacy disclosures

### State & persistence
- React Context (ThawProvider) + localStorage
- Stable IDs, schema-aligned Task/Subtask/Activity types
- Subtask add/toggle/delete/reorder

### AI + RAG
- Knowledge base: 10 curated strategies with ids, categories, energy suitability, tags
- Keyword + metadata retrieval (honestly documented, not vector search)
- Zod schema validation of model output
- 15s provider timeout
- `isLiveAI` / `fallback` / `aiProvider` transparency flags
- Deterministic local fallback when no key / provider fails

### Quality
- Next.js production build passes (`next build`)
- TypeScript strict typecheck passes
- Design system tokens (CSS variables)
- Shared UI component library
- Responsive layouts, reduced-motion support
- Toasts, empty states, error states

## Known limitations
- Persistence is localStorage only (single browser profile, no cross-device sync)
- RAG retrieval is keyword + metadata based, not vector search
- Live AI requires ANTHROPIC_API_KEY or GEMINI_API_KEY
- No clinical validation or therapeutic claims
- No multi-user backend / authentication

## Not implemented (future)
- Supabase / vector database for large-scale RAG
- Chrome extension for tab-switch counting
- Authentication and multi-user data isolation
