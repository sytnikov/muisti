'use client'

/**
 * React hooks and context for word management
 */

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react'

export interface WordEntry {
  id: string
  word: string
  addedAt: number
}

interface WordState {
  words: WordEntry[]
  inputValue: string
  output: string
  error: string
  isLoading: boolean
}

type WordAction =
  | { type: 'ADD_WORD'; payload: string }
  | { type: 'REMOVE_WORD'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_OUTPUT'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_INPUT' }
  | { type: 'GENERATE_TEXT' }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: WordState = {
  words: [],
  inputValue: '',
  output: '',
  error: '',
  isLoading: false,
}

function wordReducer(state: WordState, action: WordAction): WordState {
  switch (action.type) {
    case 'ADD_WORD': {
      const trimmedWord = action.payload.trim().toLowerCase()
      if (!trimmedWord) {
        return { ...state, error: 'Please enter a word' }
      }

      const exists = state.words.some((w) => w.word === trimmedWord)
      if (exists) {
        return { ...state, error: 'This word is already in the list' }
      }

      const newWord: WordEntry = {
        id: `${trimmedWord}-${Date.now()}`,
        word: trimmedWord,
        addedAt: Date.now(),
      }

      return {
        ...state,
        words: [...state.words, newWord],
        inputValue: '',
        error: '',
        isLoading: true,
      }
    }

    case 'REMOVE_WORD': {
      const filteredWords = state.words.filter((w) => w.word !== action.payload)
      return {
        ...state,
        words: filteredWords,
        isLoading: true,
      }
    }

    case 'SET_INPUT':
      return { ...state, inputValue: action.payload, error: '' }

    case 'SET_OUTPUT':
      return { ...state, output: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'CLEAR_ERROR':
      return { ...state, error: '' }

    case 'CLEAR_INPUT':
      return { ...state, inputValue: '' }

    case 'GENERATE_TEXT':
      return { ...state, isLoading: true }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}

/**
 * Generate story using OpenAI API
 */
async function generateStory(words: WordEntry[]): Promise<string> {
  const wordArray = words.map((w) => w.word)

  if (wordArray.length === 0) {
    return 'Add some words to generate a story...'
  }

  try {
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words: wordArray }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate story')
    }

    const data = await response.json()
    return data.story || 'Failed to generate story'
  } catch (error) {
    console.error('Error generating story:', error)
    return `Error generating story: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`
  }
}

interface WordContextType {
  state: WordState
  addWord: (word: string) => void
  removeWord: (word: string) => void
  setInputValue: (value: string) => void
  generateText: () => void
  clearError: () => void
}

const WordContext = createContext<WordContextType | undefined>(undefined)

export function WordProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wordReducer, initialState)

  // Generate story when words change
  useEffect(() => {
    if (state.words.length > 0 && state.isLoading) {
      generateStory(state.words)
        .then((story) => {
          dispatch({ type: 'SET_OUTPUT', payload: story })
          dispatch({ type: 'SET_LOADING', payload: false })
        })
        .catch((error) => {
          dispatch({
            type: 'SET_ERROR',
            payload: `Failed to generate story: ${error.message}`,
          })
          dispatch({ type: 'SET_LOADING', payload: false })
        })
    }
  }, [state.words, state.isLoading])

  const addWord = (word: string) => {
    dispatch({ type: 'ADD_WORD', payload: word })
  }

  const removeWord = (word: string) => {
    dispatch({ type: 'REMOVE_WORD', payload: word })
  }

  const setInputValue = (value: string) => {
    dispatch({ type: 'SET_INPUT', payload: value })
  }

  const generateText = () => {
    dispatch({ type: 'GENERATE_TEXT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  return (
    <WordContext.Provider
      value={{
        state,
        addWord,
        removeWord,
        setInputValue,
        generateText,
        clearError,
      }}
    >
      {children}
    </WordContext.Provider>
  )
}

export function useWords() {
  const context = useContext(WordContext)
  if (context === undefined) {
    throw new Error('useWords must be used within a WordProvider')
  }
  return context
}
