# AI + RAG design — Thaw

## Goal

Break overwhelming academic tasks into realistic, context-sensitive micro-actions. Energy level (1–5 spoons) shapes every recommendation. The user always sees whether a plan came from a live AI provider or the local fallback.

## Retrieval (RAG)

`lib/rag.ts` maintains a version-controlled knowledge base of curated, non-clinical strategies:

- Task initiation (Two-Minute Micro-Start, Next Physical Action)
- Decomposition (Task Dissection)
- Low-energy pacing (Spoon-Budgeted Pacing)
- Body doubling / ambient presence
- Guilt-free cognitive rest
- Friction reduction / environment tuning
- Energy-based task triage
- Interruption management
- Break protocol

Each strategy has a stable id, title, category, description, actionable tip, energy suitability, tags, and provenance.

`retrieveRelevantStrategies(query, energyLevel, limit)` scores strategies by:
1. Energy suitability match (strong weight)
2. Keyword overlap across title, description, tip, tags
3. Multi-term match boost

It is keyword + metadata based, **not** vector search. The design documents this honestly and does not claim semantic search.

## LLM generation

`app/api/sequence/route.ts`:

1. Retrieves up to 3 relevant strategies.
2. Builds a system prompt that includes the user's task, energy level, and retrieved strategies.
3. Calls Anthropic (Claude 3.5 Sonnet) or Gemini with a strict JSON schema.
4. Validates the model output with Zod (`SequenceResultSchema`). Malformed responses are rejected and the fallback is used.
5. Returns the plan plus a `isLiveAI` flag, `aiProvider`, `fallback` flag, and the `strategyUsed` object.

A `withTimeout` wrapper (15s) guards against hanging provider calls. Timeout or provider failure falls back to the deterministic local sequencer.

## Fallback

When no API key is configured or the provider fails, a deterministic fallback generates structured plans:
- Low energy (1–2): 3 short, gentle steps + rest option.
- Medium/high: up to 5 steps with a breather.

The `fallback: true` flag and "Demo fallback" badge make this visible. The app never claims a live provider is connected when it is not.

## Transparency

Each result includes `Why this suggestion?` disclosing:
- The energy level considered.
- The retrieved strategy categories and titles used.
- Whether the plan came from live AI or fallback.

No hidden prompts, credentials, or private internal reasoning are exposed.

## Limits

- No clinical validation or therapeutic effectiveness claims.
- RAG retrieval quality depends on knowledge-base coverage and keyword matching.
- Live AI requires ANTHROPIC_API_KEY or GEMINI_API_KEY; otherwise fallback is used.
