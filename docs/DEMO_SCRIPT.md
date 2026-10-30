# Thaw — 3-minute panel demo script

## Setup
1. `npm install && npm run dev`
2. Open `http://localhost:3000`
3. Ensure no `ANTHROPIC_API_KEY` is required — the demo works with the local fallback. To show live AI, set `ANTHROPIC_API_KEY` in `.env.local` and restart.

## 1. The hook (0:00–0:45)
Open `/`. Narrate: "Conventional productivity apps assume neurotypical consistency. For students facing task paralysis, rigid alarms and red overdue labels deepen overwhelm. Thaw is a gentle co-pilot that adapts to your energy."
Click "Launch Thaw" → `/dashboard`.

## 2. Spoon check-in & dashboard (0:45–1:30)
On `/dashboard`, change the energy selector from 3 to 2 (low). Watch the recommended next action shrink and the tone soften. Show the "Why this suggestion?" disclosure noting which strategies were used and that it's the local fallback (or live AI if configured).
Click "Start 2-minute step" → the timer begins.

## 3. AI task sequencer (1:30–2:15)
Open `/sequencer`. Enter: "I need to finish my entire research report by tomorrow and I don't know where to start." Generate. Show:
- Compassionate acknowledgment.
- 2-minute micro-start.
- Editable step sequence with durations.
- RAG strategy sources used.
- "Save to tasks" → task appears in `/tasks`.
Optionally switch energy to 1 and regenerate to show energy adaptation.

## 4. Focus timer & rest (2:15–2:45)
Open `/timer`. Start a 2-minute starter session. Show pause/resume and completion. Then open `/rest` — guided breathing, optional break timer, unrestricted exit. Emphasize: leaving is never penalized.

## 5. Weekly planner & close (2:45–3:00)
Open `/planner`. Click "Rebalance my week" — see the proposed schedule respecting deadlines, effort, and energy. Review the explanation and "Apply this schedule." Close on `/settings` showing data export/delete and local-only privacy.

## Key messages
- One clear next action, not a wall of tasks.
- Energy adapts the plan; rest is an equal option.
- Live AI or local fallback — always transparent.
- Your data stays on your device.
