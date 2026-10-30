export interface Strategy {
  id: string;
  title: string;
  category:
    | 'initiation'
    | 'decomposition'
    | 'low_energy'
    | 'body_doubling'
    | 'rest'
    | 'transition'
    | 'prioritization'
    | 'interruption';
  description: string;
  actionableTip: string;
  energySuitability: number[]; // e.g., [1, 2] for low energy or [1,2,3,4,5] for all
  tags: string[];
}

export const KNOWLEDGE_BASE: Strategy[] = [
  {
    id: 'strat-01',
    title: 'The Two-Minute Micro-Start',
    category: 'initiation',
    description:
      'Executive dysfunction often distorts the perceived effort of starting. Committing to just two minutes lowers the activation barrier without requiring motivation.',
    actionableTip:
      'Set a timer for 120 seconds. Open the document or app, write one sentence or create a blank file, then give yourself explicit permission to stop if needed.',
    energySuitability: [1, 2, 3, 4, 5],
    tags: ['starting', 'inertia', 'overwhelm', 'timer', 'micro-start'],
  },
  {
    id: 'strat-02',
    title: 'Task Dissection (Shrinking the Monster)',
    category: 'decomposition',
    description:
      'Vague tasks like "work on essay" signal threat to the brain. Concrete physical actions signal safety and are easier to begin.',
    actionableTip:
      'Break the task down until a single step takes under 5 minutes and starts with a physical verb (open, type, click, write, fetch, gather).',
    energySuitability: [1, 2, 3, 4, 5],
    tags: ['breaking down', 'steps', 'clarity', 'planning', 'decomposition'],
  },
  {
    id: 'strat-03',
    title: 'Spoon-Budgeted Pacing',
    category: 'low_energy',
    description:
      'When energy is low (1-2 spoons), attempting high-cognitive tasks causes paralysis. Adjust expectations to match current capacity rather than fighting it.',
    actionableTip:
      'Choose maintenance or administrative micro-tasks instead of deep creation. Celebrate any movement as complete success.',
    energySuitability: [1, 2],
    tags: ['low energy', 'spoons', 'burnout', 'gentle', 'pacing'],
  },
  {
    id: 'strat-04',
    title: 'Body Doubling & Ambient Presence',
    category: 'body_doubling',
    description:
      'Working alongside a calm, non-judgmental presence provides an external anchor against distractibility and wandering thoughts.',
    actionableTip:
      'Use a quiet visual focus timer or study alongside a friend without pressure to converse. The presence itself is the support.',
    energySuitability: [2, 3, 4, 5],
    tags: ['focus', 'timer', 'anchor', 'presence', 'co-working'],
  },
  {
    id: 'strat-05',
    title: 'Guilt-Free Cognitive Rest',
    category: 'rest',
    description:
      'Rest is not a reward for productivity; it is a biological prerequisite for cognitive recovery. Forced grinding deepens paralysis.',
    actionableTip:
      'Step away from the screen for 10 minutes. Look out a window, do breathing exercises, or lie down without guilt.',
    energySuitability: [1, 2, 3],
    tags: ['rest', 'recovery', 'burnout', 'guilt-free', 'break'],
  },
  {
    id: 'strat-06',
    title: 'Friction Reduction & Environment Tuning',
    category: 'transition',
    description:
      'Transitioning between tasks requires cognitive switching costs. Minimizing open tabs and visual clutter reduces mental load.',
    actionableTip:
      'Close all irrelevant browser tabs, put the phone in another room, and leave only the single required tool open.',
    energySuitability: [2, 3, 4, 5],
    tags: ['environment', 'friction', 'clutter', 'transition', 'focus'],
  },
  {
    id: 'strat-07',
    title: 'The Next Physical Action',
    category: 'initiation',
    description:
      'Ambiguity about what to do first is a common cause of paralysis. Naming the very next physical movement makes starting concrete.',
    actionableTip:
      'Ask: "What is the smallest physical movement I can make right now?" Examples: open the laptop, open the file, write the title.',
    energySuitability: [1, 2, 3, 4, 5],
    tags: ['next action', 'physical', 'clarity', 'starting', 'specific'],
  },
  {
    id: 'strat-08',
    title: 'Energy-Based Task Triage',
    category: 'prioritization',
    description:
      'Match task difficulty to current energy rather than defaulting to the most urgent item. Low energy suits administrative steps; higher energy suits creation.',
    actionableTip:
      'Sort pending tasks by energy required (1-5 spoons). Pick a task whose energy requirement is at or below your current spoon level.',
    energySuitability: [1, 2, 3, 4, 5],
    tags: ['prioritization', 'triaging', 'energy matching', 'selection'],
  },
  {
    id: 'strat-09',
    title: 'Managing Interruptions',
    category: 'interruption',
    description:
      'Interruptions break focus and increase restart cost. A quick capture ritual lets you note where you were and return without re-thinking.',
    actionableTip:
      'When interrupted, jot down the exact next micro-step on a sticky note before switching contexts. Return to that note first.',
    energySuitability: [2, 3, 4, 5],
    tags: ['interruption', 'focus', 'capture', 'return'],
  },
  {
    id: 'strat-10',
    title: 'The 5-Minute Break Protocol',
    category: 'rest',
    description:
      'Short, intentional breaks prevent decision fatigue and restore attention without derailing momentum.',
    actionableTip:
      'After 25 minutes of focus, take a 5-minute break. Stand, stretch, or look away from screens. Avoid scrolling social media.',
    energySuitability: [3, 4, 5],
    tags: ['break', 'pomodoro', 'restoration', 'attention'],
  },
];

export function retrieveRelevantStrategies(
  query: string,
  energyLevel: number,
  limit: number = 3
): Strategy[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = KNOWLEDGE_BASE.map((strat) => {
    let score = 0;

    // Energy suitability is a strong filter — prefer strategies usable at this energy
    if (strat.energySuitability.includes(energyLevel)) {
      score += 4;
    } else {
      // Strategies not suitable for this energy are heavily deprioritized
      score -= 2;
    }

    // Keyword relevance across title, description, tip, tags
    const text = `${strat.title} ${strat.description} ${strat.actionableTip} ${strat.tags.join(' ')}`.toLowerCase();
    let matchCount = 0;
    queryWords.forEach((word) => {
      if (text.includes(word)) {
        score += 2;
        matchCount += 1;
      }
    });

    // Boost strategies that matched multiple query terms
    if (matchCount >= 2) {
      score += 2;
    }

    // Small default weight so every strategy has a chance
    score += 1;

    return { strat, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.strat);
}

export function getStrategyById(id: string): Strategy | undefined {
  return KNOWLEDGE_BASE.find((s) => s.id === id);
}
