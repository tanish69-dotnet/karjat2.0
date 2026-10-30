import { NextResponse } from 'next/server';
import { z } from 'zod';
import { retrieveRelevantStrategies, getStrategyById } from '@/lib/rag';

const SequenceStepSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  duration: z.string().min(1),
  isEasiest: z.boolean().optional(),
});

const SequenceResultSchema = z.object({
  acknowledgment: z.string().min(1),
  firstStep: z.string().min(1),
  steps: z.array(SequenceStepSchema).min(1).max(10),
  strategyUsed: z.string().min(1),
});

type SequenceResult = z.infer<typeof SequenceResultSchema>;

const AI_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('AI provider timed out')), ms);
  });
  if (!timeoutId) {
    return promise;
  }
  return Promise.race([promise, timeout.finally(() => clearTimeout(timeoutId))]);
}

function buildSystemPrompt(energyLevel: number, strategies: Array<{ id: string; title: string; actionableTip: string }>) {
  const strategyText = strategies
    .map((s) => `- ${s.title} (${s.id}): ${s.actionableTip}`)
    .join('\n');
  return `You are Thaw, a compassionate, non-judgmental AI co-pilot for neurodivergent students experiencing executive dysfunction or task paralysis.

Your job: break a daunting academic task into microscopic, low-friction steps.

User energy level: ${energyLevel}/5 spoons.
- 1-2 spoons: keep steps extremely short, concrete, and rest-friendly. Offer rest as an equal option.
- 3 spoons: manageable sequences with gentle breaks.
- 4-5 spoons: deeper work OK, but still respect time and deadlines.

Retrieved non-clinical strategies to ground your response:
${strategyText}

Return valid JSON only, matching this schema exactly:
{
  "acknowledgment": "one or two validating sentences",
  "firstStep": "the single smallest physical action to begin (under 2 minutes)",
  "steps": [
    { "id": "step-1", "title": "...", "duration": "X mins", "isEasiest": true }
  ],
  "strategyUsed": "the ID of the single most relevant retrieved strategy"
}

Rules:
- 3 to 7 steps maximum.
- Each step must start with a physical verb.
- Durations must be realistic and short.
- Never shame, never use streaks, never suggest pushing through exhaustion.
- strategyUsed must be one of the retrieved strategy IDs above.`;
}

export async function POST(request: Request) {
  let body: { taskDescription?: unknown; energyLevel?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { taskDescription, energyLevel } = body;

  if (!taskDescription || typeof taskDescription !== 'string' || taskDescription.trim().length === 0) {
    return NextResponse.json({ error: 'Task description is required' }, { status: 400 });
  }

  const level = typeof energyLevel === 'number' && energyLevel >= 1 && energyLevel <= 5 ? energyLevel : 3;

  // 1. Retrieve relevant strategies (real local retrieval, keyword + metadata based)
  const relevantStrategies = retrieveRelevantStrategies(taskDescription, level, 3);
  const ragContext = relevantStrategies.map((s) => ({
    id: s.id,
    title: s.title,
    actionableTip: s.actionableTip,
  }));

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  let aiResult: SequenceResult | null = null;
  let aiProvider: 'anthropic' | 'gemini' | null = null;
  let aiError: string | null = null;

  // 2. Attempt live LLM generation only if a key is configured
  if (anthropicKey) {
    aiProvider = 'anthropic';
    try {
      const systemPrompt = buildSystemPrompt(level, ragContext);
      const response = await withTimeout(
        fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 900,
            system: systemPrompt,
            messages: [
              {
                role: 'user',
                content: `Task: "${taskDescription.trim()}"`,
              },
            ],
          }),
        }),
        AI_TIMEOUT_MS
      );

      if (!response.ok) {
        throw new Error(`Anthropic API returned ${response.status}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text ?? '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = SequenceResultSchema.safeParse(JSON.parse(jsonMatch[0]));
        if (parsed.success) {
          aiResult = parsed.data;
        } else {
          aiError = 'AI returned malformed structure';
        }
      } else {
        aiError = 'AI returned no usable JSON';
      }
    } catch (err: any) {
      aiError = err.message ?? 'Anthropic request failed';
      console.error('Anthropic error:', err);
    }
  } else if (geminiKey) {
    aiProvider = 'gemini';
    try {
      const systemPrompt = buildSystemPrompt(level, ragContext);
      const response = await withTimeout(
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemPrompt}\n\nTask: "${taskDescription.trim()}"` }] }],
              generationConfig: { maxOutputTokens: 900, temperature: 0.4 },
            }),
          }
        ),
        AI_TIMEOUT_MS
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned ${response.status}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = SequenceResultSchema.safeParse(JSON.parse(jsonMatch[0]));
        if (parsed.success) {
          aiResult = parsed.data;
        } else {
          aiError = 'AI returned malformed structure';
        }
      } else {
        aiError = 'AI returned no usable JSON';
      }
    } catch (err: any) {
      aiError = err.message ?? 'Gemini request failed';
      console.error('Gemini error:', err);
    }
  }

  // 3. Deterministic fallback — clearly identified, never misrepresented as live AI
  let finalResult: SequenceResult;
  let usedLiveAI = false;
  let strategyUsedId = relevantStrategies[0]?.id ?? 'strat-01';

  if (aiResult) {
    finalResult = aiResult;
    usedLiveAI = true;
    // Validate strategyUsed references a real strategy; fall back to first retrieved if not
    if (!relevantStrategies.some((s) => s.id === aiResult.strategyUsed)) {
      strategyUsedId = relevantStrategies[0]?.id ?? 'strat-01';
    } else {
      strategyUsedId = aiResult.strategyUsed;
    }
  } else {
    const isLowEnergy = level <= 2;
    const stepsCount = isLowEnergy ? 3 : 5;
    const strategy = relevantStrategies[0];
    strategyUsedId = strategy?.id ?? 'strat-01';

    const baseSteps = [
      {
        id: 'step-1',
        title: `Open your workspace and set aside distractions for 2 minutes`,
        duration: '2 mins',
        isEasiest: true,
      },
      {
        id: 'step-2',
        title: `Write down the core objective or title for: ${taskDescription.slice(0, 35)}...`,
        duration: '5 mins',
        isEasiest: false,
      },
      {
        id: 'step-3',
        title: `Draft rough notes or an outline without filtering yourself`,
        duration: isLowEnergy ? '10 mins' : '15 mins',
        isEasiest: false,
      },
    ];

    if (!isLowEnergy) {
      baseSteps.push(
        {
          id: 'step-4',
          title: `Take a gentle 3-minute breather or stretch`,
          duration: '3 mins',
          isEasiest: true,
        },
        {
          id: 'step-5',
          title: `Review and polish the first section`,
          duration: '10 mins',
          isEasiest: false,
        }
      );
    }

    finalResult = {
      acknowledgment: isLowEnergy
        ? `It is completely valid to feel low on energy today. We will keep things extremely gentle and small.`
        : `That sounds like a meaningful task. Let's melt the overwhelm by turning it into manageable steps.`,
      firstStep: baseSteps[0].title,
      steps: baseSteps.slice(0, stepsCount),
      strategyUsed: strategyUsedId,
    };
  }

  const strategyUsedObj = getStrategyById(strategyUsedId);

  return NextResponse.json({
    success: true,
    data: finalResult,
    ragContext,
    isLiveAI: usedLiveAI,
    aiProvider,
    strategyUsed: strategyUsedObj,
    fallback: !usedLiveAI,
    error: aiError ?? undefined,
  });
}
