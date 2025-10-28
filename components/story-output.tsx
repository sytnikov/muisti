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
              Regenerate
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
              {state.output}
            </p>
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
