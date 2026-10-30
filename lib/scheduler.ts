import { Task } from '@/lib/store';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Minutes of focus-worthy capacity per day by spoon level (1-5).
// Low energy means less total schedulable work; rest is respected.
const DAILY_CAPACITY_BY_ENERGY: Record<number, number> = {
  1: 30, // very low — only tiny maintenance
  2: 60, // low — gentle maintenance only
  3: 120, // steady — a few light tasks + one focus session
  4: 180, // good — creative work + larger steps
  5: 240, // high — deep focus + planning
};

function parseDeadline(deadline?: string): { dayIndex: number | null; isFixed: boolean } {
  if (!deadline) return { dayIndex: null, isFixed: false };
  const d = deadline.toLowerCase().trim();
  const today = new Date();
  const dayMap: Record<string, number> = {
    monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6,
    today: today.getDay() === 0 ? 6 : today.getDay() - 1,
    tomorrow: (today.getDay() === 0 ? 6 : today.getDay() - 1 + 1) % 7,
  };
  if (dayMap[d] !== undefined) return { dayIndex: dayMap[d], isFixed: d !== 'flexible' };
  return { dayIndex: null, isFixed: false };
}

interface ScheduledTask {
  task: Task;
  dayIndex: number;
  dayLabel: string;
  reason: string;
}

interface UnscheduledTask {
  task: Task;
  reason: string;
}

interface RebalanceResult {
  scheduled: ScheduledTask[];
  unscheduled: UnscheduledTask[];
  explanations: string[];
  infeasible: boolean;
}

/**
 * Deterministic energy-aware weekly scheduler.
 * Hard constraints (deadlines) are enforced by the engine; the LLM is only used
 * for explanations, never for arithmetic or deadline enforcement.
 */
export function rebalanceWeek(
  tasks: Task[],
  energyLevel: number
): RebalanceResult {
  const explanations: string[] = [];
  const capacity = DAILY_CAPACITY_BY_ENERGY[energyLevel] ?? 120;
  const remaining = DAYS.map(() => capacity);

  // Separate fixed-deadline tasks from flexible ones.
  const fixed: Task[] = [];
  const flexible: Task[] = [];
  tasks.forEach((t) => {
    const parsed = parseDeadline(t.deadline);
    if (parsed.isFixed && parsed.dayIndex !== null) fixed.push(t);
    else flexible.push(t);
  });

  // Sort fixed tasks by deadline proximity (day index), then energy required (ascending).
  fixed.sort((a, b) => {
    const pa = parseDeadline(a.deadline).dayIndex ?? 99;
    const pb = parseDeadline(b.deadline).dayIndex ?? 99;
    if (pa !== pb) return pa - pb;
    return (a.energyRequired ?? 3) - (b.energyRequired ?? 3);
  });

  // Sort flexible tasks by energy required (ascending), then estimated minutes.
  flexible.sort((a, b) => {
    const ea = a.energyRequired ?? 3;
    const eb = b.energyRequired ?? 3;
    if (ea !== eb) return ea - eb;
    return (a.estimatedMinutes ?? 15) - (b.estimatedMinutes ?? 15);
  });

  const scheduled: ScheduledTask[] = [];
  const unscheduled: UnscheduledTask[] = [];

  const placeTask = (task: Task, preferredDay: number | null, why: string): boolean => {
    const minutes = task.estimatedMinutes ?? 15;
    // Try preferred day first, then scan forward through the week.
    const start = preferredDay !== null ? preferredDay : 0;
    for (let offset = 0; offset < 7; offset++) {
      const day = (start + offset) % 7;
      if (remaining[day] >= minutes) {
        remaining[day] -= minutes;
        scheduled.push({
          task,
          dayIndex: day,
          dayLabel: DAYS[day],
          reason: why,
        });
        return true;
      }
    }
    return false;
  };

  // Place fixed-deadline tasks first (hard constraints).
  fixed.forEach((task) => {
    const parsed = parseDeadline(task.deadline);
    const placed = placeTask(task, parsed.dayIndex, `Fixed deadline: ${task.deadline ?? 'N/A'}`);
    if (!placed) {
      unscheduled.push({
        task,
        reason: `No remaining capacity before deadline (${task.deadline ?? 'N/A'}).`,
      });
      explanations.push(
        `"${task.title}" could not be scheduled before its deadline — the week is over capacity.`
      );
    }
  });

  // Place flexible tasks next, preferring days with more remaining capacity.
  flexible.forEach((task) => {
    // Find the day with the most remaining capacity that can fit this task.
    let bestDay = -1;
    let bestRemaining = -1;
    for (let d = 0; d < 7; d++) {
      if (remaining[d] >= task.estimatedMinutes! && remaining[d] > bestRemaining) {
        bestRemaining = remaining[d];
        bestDay = d;
      }
    }
    if (bestDay !== -1) {
      remaining[bestDay] -= task.estimatedMinutes!;
      scheduled.push({
        task,
        dayIndex: bestDay,
        dayLabel: DAYS[bestDay],
        reason: 'Distributed to balance load across the week.',
      });
    } else {
      unscheduled.push({
        task,
        reason: 'No remaining capacity in the week.',
      });
      explanations.push(
        `"${task.title}" was not scheduled — reduce its estimated duration or lower its energy requirement.`
      );
    }
  });

  if (unscheduled.length > 0) {
    explanations.push(
      `${unscheduled.length} task(s) could not be placed this week. Consider splitting them into smaller steps or extending deadlines.`
    );
  } else if (scheduled.length === 0) {
    explanations.push('No tasks to schedule this week. A clear slate is a good time to rest.');
  } else {
    explanations.push('Tasks were placed to respect deadlines, estimated effort, and your current energy level.');
  }

  return { scheduled, unscheduled, explanations, infeasible: unscheduled.length > 0 };
}

export { DAYS, DAILY_CAPACITY_BY_ENERGY };
