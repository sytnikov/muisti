'use client'

import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useWords } from '@/lib/word-context'

export default function StoryOutput() {
  const { state, generateText } = useWords()

  const handleRegenerate = useCallback(() => {
    generateText()
  }, [generateText])

  // Convert markdown bold syntax (**text**) to HTML bold tags
  const renderStoryWithBold = (text: string) => {
    // Split by markdown bold syntax while preserving the matches
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, index) => {
      // Check if this part is a bold markdown pattern
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        const boldText = part.slice(2, -2)
        return (
          <strong key={index} className="font-bold">
            {boldText}
          </strong>
        )
      }
      // Return regular text, preserving line breaks
      return <span key={index}>{part}</span>
    })
  }

  return (
    <Card className="bg-white text-black border-2 border-black">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Generated Story</CardTitle>
            <CardDescription className="text-gray-600">
              Your words in context
            </CardDescription>
          </div>
          {state.words.length > 0 && !state.isLoading && (
            <Button
              onClick={handleRegenerate}
              variant="outline"
              className="border-2 border-black hover:bg-gray-100"
            >
              {state.output ? 'Regenerate' : 'Generate Story'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-[200px] p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          {state.isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-gray-600">Generating your story...</p>
              </div>
            </div>
          ) : state.error ? (
            <div className="text-center">
              <p className="text-red-600 mb-2">{state.error}</p>
              <Button
                onClick={generateText}
                variant="outline"
                className="border-2 border-red-600 text-red-600 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          ) : state.output ? (
            <p className="text-gray-900 leading-relaxed text-lg whitespace-pre-wrap">
              {renderStoryWithBold(state.output)}
            </p>
          ) : state.words.length > 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                You have {state.words.length} word
                {state.words.length === 1 ? '' : 's'} ready for story
                generation.
              </p>
              <p className="text-gray-500 text-sm">
                Click Generate Story above to create an AI-powered story using
                your words.
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic">
              Add words above to generate a story...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
