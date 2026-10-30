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

  const { activeTab, lastStudyTab, query = 'Summarize study context' } = body;

  const studyTarget =
    activeTab?.category === 'educational' ? activeTab : lastStudyTab || activeTab;

  const topicTitle = studyTarget?.title || studyTarget?.domain || 'Current Study Material';
  const specificType = studyTarget?.specificType || 'academic';

  // Ground with RAG
  const relevantStrategies = retrieveRelevantStrategies('decomposition micro-start initiation', 3, 2);
  const primaryStrategy = relevantStrategies[0] || getStrategyById('strat-01')!;

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  let guidanceText: string | null = null;
  let isLiveAI = false;
  let aiProvider: 'anthropic' | 'gemini' | null = null;

  const systemPrompt = `You are Pegasus Context-Aware Study Assistant.
A student is reviewing academic material:
- Title/Domain: "${topicTitle}"
- Type: ${specificType}
- User Request: "${query}"
- Grounding Strategy: ${primaryStrategy.title} - ${primaryStrategy.actionableTip}

Provide a concise, highly encouraging response (maximum 3 sentences):
1. A 1-sentence synthesis or orienting thought about this topic.
2. A single physical verb micro-action to start engaging with it right now (under 2 minutes).

Strictly avoid medical or clinical labels.`;

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
          max_tokens: 300,
          messages: [{ role: 'user', content: systemPrompt }],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        guidanceText = data.content?.[0]?.text?.trim() || null;
        if (guidanceText) isLiveAI = true;
      }
    } catch (e) {
      console.warn('[Pegasus Assist] Anthropic call failed:', e);
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
            contents: [{ parts: [{ text: systemPrompt }] }],
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        guidanceText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
        if (guidanceText) isLiveAI = true;
      }
    } catch (e) {
      console.warn('[Pegasus Assist] Gemini call failed:', e);
    }
  }

  // Deterministic Cognitive Fallback
  if (!guidanceText) {
    if (specificType === 'pdf') {
      guidanceText = `For "${topicTitle.slice(0, 35)}", begin by skimming only the abstract or section headings for 90 seconds. Write down 1 key question you hope this document answers.`;
    } else if (specificType === 'youtube_lecture') {
      guidanceText = `For this lecture, set your playback speed comfortably and write down the single main idea introduced in the first 3 minutes.`;
    } else {
      guidanceText = `To ease into "${topicTitle.slice(0, 35)}", open your notes and write a 1-sentence summary of what this page covers before deep reading.`;
    }
  }

  return NextResponse.json(
    {
      success: true,
      summaryTitle: topicTitle,
      guidance: guidanceText,
      strategyUsed: primaryStrategy,
      isLiveAI,
      aiProvider,
    },
    { headers: corsHeaders }
  );
}
