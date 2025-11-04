'use client'

import { useCallback } from 'react'
import { useWords } from '@/lib/word-context'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const AVAILABLE_MODELS = [
  // GPT-3.5 Models
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  // { value: 'gpt-3.5-turbo-0125', label: 'GPT-3.5 Turbo (0125)' },
  // { value: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo (1106)' },
  // // GPT-4 Models
  // { value: 'gpt-4', label: 'GPT-4' },
  // { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  // { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo Preview' },
  // { value: 'gpt-4-0125-preview', label: 'GPT-4 (0125 Preview)' },
  // { value: 'gpt-4-1106-preview', label: 'GPT-4 (1106 Preview)' },
  // // GPT-4o Models
  // { value: 'gpt-4o', label: 'GPT-4o' },
  // { value: 'gpt-4o-2024-08-06', label: 'GPT-4o (2024-08-06)' },
  // { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  // { value: 'gpt-4o-mini-2024-07-18', label: 'GPT-4o Mini (2024-07-18)' },
  // // Reasoning Models (if available)
  // { value: 'o1-preview', label: 'O1 Preview' },
  // { value: 'o1-mini', label: 'O1 Mini' },
]

export default function ModelSelector() {
  const { state, setModel } = useWords()

  const handleModelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setModel(e.target.value)
    },
    [setModel]
  )

  return (
    <Card className="bg-white text-black border-2 border-black">
      <CardHeader>
        <CardTitle>AI Model</CardTitle>
        <CardDescription className="text-gray-600">
          Choose the OpenAI model for story generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <select
          value={state.selectedModel}
          onChange={handleModelChange}
          disabled={state.isLoading}
          className="w-full h-9 px-3 py-1 text-base border-2 border-black rounded-md bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  )
}
