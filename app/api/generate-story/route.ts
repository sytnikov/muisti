import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { words, model } = await request.json()

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

    // Validate and set default model
    const validModels = [
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-0125',
      'gpt-3.5-turbo-1106',
      'gpt-4',
      'gpt-4-turbo',
      'gpt-4-turbo-preview',
      'gpt-4-0125-preview',
      'gpt-4-1106-preview',
      'gpt-4o',
      'gpt-4o-2024-08-06',
      'gpt-4o-mini',
      'gpt-4o-mini-2024-07-18',
      'o1-preview',
      'o1-mini',
    ]
    const selectedModel =
      model && validModels.includes(model) ? model : 'gpt-3.5-turbo'

    const wordsList = words.join(', ')

    const prompt = `Create a simple, engaging story in ENGLISH that naturally incorporates these Finnish words: ${wordsList}.

CRITICAL REQUIREMENTS:
- Write the story ENTIRELY in English
- Embed the Finnish words naturally into the English sentences
- Format each Finnish word in bold using **word** markdown syntax (e.g., **köyhä**)
- When you use each Finnish word for the first time, immediately follow it with a detailed explanation sentence that provides clear context about what the word means
- DO NOT provide explicit translations or state what the word means directly
- NEVER use the English translation of the Finnish word in the same sentence or immediately after introducing the Finnish word
- The explanation sentence must provide enough context so the reader can understand the meaning through examples, descriptions, or actions
- Use words ONLY in their direct, literal meaning - never use them metaphorically or figuratively
- For VERBS: When introducing a verb for the first time, use it as the main action after the subject (e.g., "The dog **purra** her" not "she gets purra")
- For NOUNS: Provide enough context so the reader understands what the object/item is (e.g., for "huulipuna", describe it as something used on lips that adds color)
- Make the story coherent and interesting
- Include all the provided Finnish words
- Keep it between 100-200 words
- Use present tense when possible

EXAMPLE FORMATS:

For adjectives (like "köyhä"):
"Kaisa was really **köyhä**. She didn't have a lot of money and couldn't afford new clothes."

For nouns (like "huulipuna"):
"Sofia puts **huulipuna** on her lips. The colorful stick makes her smile look brighter."

For verbs (like "purra"):
"The dog **purra** Sofia's hand. Sharp teeth sink into her skin, and she feels pain."

NOTICE:
- The story is in English
- Finnish words are formatted in bold using **word**
- The explanation provides clear context without using the English translation
- No direct translations appear (avoid "wrinkled skin" right after "ryppyinen iho")
- Verbs are used as main actions after subjects
- Words are used in their literal, direct meaning

Create a complete story following these patterns for all the provided Finnish words.`

    const completion = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that creates educational stories in English with embedded Finnish vocabulary words. Format Finnish words in bold using **word** markdown syntax. Each Finnish word must be immediately followed by a detailed explanatory sentence that provides clear context - never use the English translation in the same or next sentence. Use words only in their direct, literal meaning. For verbs, use them as main actions after subjects. Provide enough context for nouns so readers understand what they are.',
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
