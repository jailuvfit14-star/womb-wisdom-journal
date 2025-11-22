/**
 * API Route for AI Reflection
 * Generates personalized journaling prompts based on the last journal entry
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { lastEntry } = await req.json();

    if (!lastEntry) {
      return NextResponse.json(
        { error: 'No entry provided' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create a nurturing, reflective prompt based on the entry
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a gentle, nurturing journaling companion. Your role is to read someone's journal entry and create a thoughtful, personalized reflection prompt that encourages deeper self-exploration and emotional awareness.

Your prompts should:
- Be warm, compassionate, and non-judgmental
- Acknowledge what they've shared
- Gently invite deeper reflection on emotions, patterns, or insights
- Use soft, feminine language that feels supportive
- Be 2-3 sentences long
- Focus on self-discovery and growth

Avoid:
- Being overly cheerful or dismissive
- Giving advice or solutions
- Using therapy jargon
- Being too analytical or clinical`,
        },
        {
          role: 'user',
          content: `Based on this journal entry, create a personalized reflection prompt:

Title: ${lastEntry.title}

${lastEntry.content}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const reflectionPrompt = completion.choices[0]?.message?.content;

    if (!reflectionPrompt) {
      return NextResponse.json(
        { error: 'Failed to generate reflection prompt' },
        { status: 500 }
      );
    }

    return NextResponse.json({ prompt: reflectionPrompt });
  } catch (error) {
    console.error('Error generating reflection:', error);
    return NextResponse.json(
      { error: 'Failed to generate reflection prompt' },
      { status: 500 }
    );
  }
}
