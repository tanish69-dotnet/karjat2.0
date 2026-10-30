# Pegasus — AI Student Focus & Distraction Companion (Chrome Extension)

Pegasus is a Manifest V3 Google Chrome Extension that connects real-time browser activity with the Thaw / Pegasus AI backend. It monitors browsing patterns, identifies distractions (with fine-grained YouTube Shorts discrimination), recognizes fragmented switching patterns, and provides gentle, context-aware assistance.

---

## 🚀 How to Install and Load in Chrome

1. Open **Google Chrome**.
2. Navigate to `chrome://extensions` in the address bar.
3. Toggle **Developer mode** ON in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the folder:
   ```
   C:\karjat\thaw\chrome-extension
   ```
6. The **Pegasus Focus Companion** icon will appear in your Chrome toolbar. Pin it for easy access!

---

## 🌟 Key Features

### 1. Activity Monitoring & Periodic Aggregation
- Tracks active tab, switching velocity (switches/min), and window focus/idle states.
- Aggregates time spent on Educational, Distracting, and Neutral websites without continuous per-event backend flooding.

### 2. Educational vs. Distracting Website Detection
- Distinguishes **YouTube Shorts** (`youtube.com/shorts/...` -> Distracting) from **Educational Lectures** (`youtube.com/watch?...` with tutorial, course, or lecture keywords -> Educational).
- Automatic detection of Study PDFs (local or web `file://` or `.pdf`).
- Extensible domain and keyword classifier.

### 3. Smart Distraction Detection & Gentle Warnings
- 30s / 2m / 5m configurable thresholds with notification cooldowns so students are never spammed.
- Actionable Chrome Notifications with one-click **"Return to Study Tab"** button.

### 4. Browsing Behavior & Pattern Analysis Engine
- Detects 5 non-trivial browsing patterns:
  - Excessive Tab Switching (high velocity)
  - Excessive Site Switching (fragmented browsing across unrelated domains)
  - Prolonged Time on Single Entertainment Website
  - Repeated Interruptions (oscillating study -> entertainment -> study)
  - Unstable Navigation (frequent brief jumps without study progression)
- **Strictly non-clinical, non-pathologizing language** (never diagnoses ADHD, anxiety, or depression).

### 5. Small Floating Pegasus Circle / Smart Check-In
- Interactive companion circular emblem with 6 distinct states:
  1. `normal` — Neutral copper ring
  2. `frequent_tab_switching` — Gently pulsing amber ring
  3. `prolonged_activity` — Soft ochre ring
  4. `possible_distraction` — Terracotta / crimson ring
  5. `repeated_interruptions` — Muted violet ring
  6. `focused_study` — Sage emerald ring
- In-page floating pip with isolated Shadow DOM and expandable micro-card.
- Extension popup dashboard with real-time efficiency metrics and quick actions.

### 6. Full AI & RAG Integration with Next.js Backend
- Connects to:
  - `POST http://localhost:3000/api/pegasus/analyze`
  - `POST http://localhost:3000/api/pegasus/assist`
- Full CORS support.
- Grounded in local RAG strategies from `lib/rag.ts`.
- Zero-Downtime Deterministic Fallback guaranteeing 100% reliability offline or without API keys.
