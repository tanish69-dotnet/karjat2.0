import { NextResponse } from 'next/server';
import { retrieveRelevantStrategies, getStrategyById } from '@/lib/rag';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders });
  }

  const {
    sessionDuration = 0,
    categoryTotals = {},
    totalSwitches = 0,
    switchesLastMinute = 0,
    distractionDuration = 0,
    focusEfficiency = 100,
    activeTab,
    lastStudyTab,
    state = 'normal',
    detectedPatterns = [],
  } = body;

  // Build retrieval query based on detected patterns and state
  let ragQuery = 'focus anchor initiation';
  if (state === 'possible_distraction' || distractionDuration > 60) {
    ragQuery = 'distraction interruption return starting';
  } else if (state === 'frequent_tab_switching' || switchesLastMinute > 5) {
    ragQuery = 'friction reduction transition environment clutter';
  } else if (state === 'repeated_interruptions') {
    ragQuery = 'managing interruptions capture next physical action';
  } else if (state === 'prolonged_activity') {
    ragQuery = 'break rest recovery attention';
  }

  const relevantStrategies = retrieveRelevantStrategies(ragQuery, 3, 3);
  const primaryStrategy = relevantStrategies[0] || getStrategyById('strat-01')!;

  // Check API keys
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  let aiAdvice: string | null = null;
  let isLiveAI = false;
  let aiProvider: 'anthropic' | 'gemini' | null = null;

  const contextPrompt = `You are Pegasus, a gentle, non-judgmental AI focus companion for students.
Analyze this real-time browser session state:
- Current State: ${state}
- Distraction Duration: ${distractionDuration} seconds
- Switches in last minute: ${switchesLastMinute}
- Active Tab: ${activeTab?.title || activeTab?.domain || 'unknown'} (${activeTab?.category || 'neutral'})
- Last Study Material: ${lastStudyTab?.title || 'None recorded'}
- Grounding Strategy: ${primaryStrategy.title} - ${primaryStrategy.actionableTip}

Rules:
- Strictly non-clinical, non-pathologizing language. Never mention ADHD, anxiety, or depression.
- Offer 1 gentle validating observation and 1 tiny concrete action to regain momentum.
- Output clean JSON: { "observation": "...", "suggestion": "...", "suggestedState": "${state}" }`;

  if (anthropicKey) {
    aiProvider = 'anthropic';
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 350,
          messages: [{ role: 'user', content: contextPrompt }],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.content?.[0]?.text ?? '';
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          aiAdvice = parsed.suggestion || parsed.observation;
          isLiveAI = true;
        }
      }
    } catch (e) {
      console.warn('[Pegasus Analyze] Anthropic call failed, falling back:', e);
    }
  } else if (geminiKey) {
    aiProvider = 'gemini';
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: contextPrompt }] }],
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          aiAdvice = parsed.suggestion || parsed.observation;
          isLiveAI = true;
        }
      }
    } catch (e) {
      console.warn('[Pegasus Analyze] Gemini call failed, falling back:', e);
    }
  }

  // Deterministic Cognitive Fallback (Zero downtime, fully reliable)
  if (!aiAdvice) {
    if (state === 'possible_distraction') {
      const docName = lastStudyTab ? `"${lastStudyTab.title.slice(0, 25)}..."` : 'your study doc';
      aiAdvice = `Ready to switch back to ${docName}? Just open the page and read the very first sentence.`;
    } else if (state === 'frequent_tab_switching') {
      aiAdvice = `It looks like tasks might be competing for attention. Pick just 1 tab to leave open and minimize the rest for 5 minutes.`;
    } else if (state === 'repeated_interruptions') {
      aiAdvice = `Whenever focus feels fragmented, write down the single next word or note before opening another tab.`;
    } else if (state === 'prolonged_activity') {
      aiAdvice = `You've spent substantial continuous time here. A 3-minute stretch or sip of water can reset your mental energy.`;
    } else {
      aiAdvice = `You are maintaining steady momentum. Keep exploring your study materials at your natural pace.`;
    }
  }

  return NextResponse.json(
    {
      success: true,
      state: state,
      isLiveAI: isLiveAI,
      aiProvider: aiProvider,
      guidance: aiAdvice,
      strategyUsed: primaryStrategy,
      metricsSnapshot: {
        focusEfficiency,
        sessionDuration,
        distractionDuration,
        switchesLastMinute,
      },
    },
    { headers: corsHeaders }
  );
}

