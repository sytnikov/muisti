import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json()

    if (!words || !Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: 'Words array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const wordsList = words.join(', ')

    const prompt = `Create a simple, engaging story in English at A1.2 level (beginner-intermediate) that naturally incorporates these words: ${wordsList}.

Requirements:
- Use simple vocabulary and short sentences
- Make the story coherent and interesting
- Naturally include all the provided words
- Keep it between 100-200 words
- Make it suitable for language learners
- Use present tense when possible
- Avoid complex grammar structures

The story should be educational and help someone learn these words in context.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that creates simple, educational stories for language learners at A1.2 level.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const generatedStory = completion.choices[0]?.message?.content

    if (!generatedStory) {
      return NextResponse.json(
        { error: 'Failed to generate story' },
        { status: 500 }
      )
    }

    return NextResponse.json({ story: generatedStory })
  } catch (error) {
    console.error('Error generating story:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate story: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
