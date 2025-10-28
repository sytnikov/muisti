"use client";

/**
 * React hooks and context for word management
 */

import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface WordEntry {
  id: string;
  word: string;
  addedAt: number;
}

interface WordState {
  words: WordEntry[];
  inputValue: string;
  output: string;
  error: string;
}

type WordAction =
  | { type: 'ADD_WORD'; payload: string }
  | { type: 'REMOVE_WORD'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_OUTPUT'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_INPUT' }
  | { type: 'GENERATE_TEXT' };

const initialState: WordState = {
  words: [],
  inputValue: '',
  output: '',
  error: '',
};

function wordReducer(state: WordState, action: WordAction): WordState {
  switch (action.type) {
    case 'ADD_WORD': {
      const trimmedWord = action.payload.trim().toLowerCase();
      if (!trimmedWord) {
        return { ...state, error: 'Please enter a word' };
      }
      
      const exists = state.words.some(w => w.word === trimmedWord);
      if (exists) {
        return { ...state, error: 'This word is already in the list' };
      }

      const newWord: WordEntry = {
        id: `${trimmedWord}-${Date.now()}`,
        word: trimmedWord,
        addedAt: Date.now(),
      };

      return {
        ...state,
        words: [...state.words, newWord],
        inputValue: '',
        error: '',
        output: generateContextualText([...state.words, newWord]),
      };
    }

    case 'REMOVE_WORD': {
      const filteredWords = state.words.filter(w => w.word !== action.payload);
      return {
        ...state,
        words: filteredWords,
        output: generateContextualText(filteredWords),
      };
    }

    case 'SET_INPUT':
      return { ...state, inputValue: action.payload, error: '' };

    case 'SET_OUTPUT':
      return { ...state, output: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: '' };

    case 'CLEAR_INPUT':
      return { ...state, inputValue: '' };

    case 'GENERATE_TEXT':
      return { ...state, output: generateContextualText(state.words) };

    default:
      return state;
  }
}

/**
 * Generate contextual text incorporating target words
 */
function generateContextualText(words: WordEntry[]): string {
  const wordArray = words.map(w => w.word);
  
  if (wordArray.length === 0) {
    return "Add some words to generate a story...";
  }

  if (wordArray.length === 1) {
    return generateSingleWordContext(wordArray[0]);
  }

  if (wordArray.length === 2) {
    return generateTwoWordContext(wordArray);
  }

  // For 3+ words, create a more complex narrative
  return generateMultiWordContext(wordArray);
}

/**
 * Generate context for a single word
 */
function generateSingleWordContext(word: string): string {
  const contexts = [
    `The word "${word}" sparked curiosity in her mind. What did it mean? Where had she heard it before?`,
    `He found himself contemplating the significance of "${word}" as he walked through the quiet evening streets.`,
    `"${word}" echoed in her thoughts, a gentle reminder of something she had almost forgotten.`,
    `The concept of "${word}" lingered in the air, waiting to be explored and understood.`,
  ];
  return contexts[Math.floor(Math.random() * contexts.length)];
}

/**
 * Generate context for two words
 */
function generateTwoWordContext(words: string[]): string {
  const templates = [
    `As she explored the relationship between "${words[0]}" and "${words[1]}", she began to see connections she hadn't noticed before.`,
    `The juxtaposition of "${words[0]}" alongside "${words[1]}" created an interesting tension in his mind.`,
    `Between the lines of "${words[0]}" and "${words[1]}" lay a story waiting to unfold.`,
    `He discovered that "${words[0]}" and "${words[1]}" were more interconnected than he had initially thought.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate context for multiple words
 */
function generateMultiWordContext(words: string[]): string {
  if (words.length === 3) {
    return generateThreeWordContext(words);
  }

  // Select a subset of words and create a narrative
  const selectedWords = words.slice(0, 4);
  const remainingWords = words.slice(4);

  let story = `The journey began with ${wordList(selectedWords)}. `;
  story += `These concepts intertwined, creating a tapestry of meaning that invited exploration. `;
  
  if (remainingWords.length > 0) {
    story += `As the story unfolded, ${wordList(remainingWords)} emerged naturally, `;
    story += `each contributing its unique perspective to the narrative.`;
  }

  return story;
}

/**
 * Generate a three-word narrative
 */
function generateThreeWordContext(words: string[]): string {
  const templates = [
    `The interplay of "${words[0]}", "${words[1]}", and "${words[2]}" revealed a pattern she had been searching for all along.`,
    `Through the lens of "${words[0]}", he began to understand how "${words[1]}" and "${words[2]}" connected to form a greater whole.`,
    `"${words[0]}", "${words[1]}", "${words[2]}"—each word added depth to a story that was just beginning to take shape.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Format a list of words for natural reading
 */
function wordList(words: string[]): string {
  if (words.length === 1) return `"${words[0]}"`;
  if (words.length === 2) return `"${words[0]}" and "${words[1]}"`;
  
  const lastWord = words[words.length - 1];
  const otherWords = words.slice(0, -1).map(w => `"${w}"`).join(", ");
  return `${otherWords}, and "${lastWord}"`;
}

interface WordContextType {
  state: WordState;
  addWord: (word: string) => void;
  removeWord: (word: string) => void;
  setInputValue: (value: string) => void;
  generateText: () => void;
  clearError: () => void;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export function WordProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wordReducer, initialState);

  const addWord = (word: string) => {
    dispatch({ type: 'ADD_WORD', payload: word });
  };

  const removeWord = (word: string) => {
    dispatch({ type: 'REMOVE_WORD', payload: word });
  };

  const setInputValue = (value: string) => {
    dispatch({ type: 'SET_INPUT', payload: value });
  };

  const generateText = () => {
    dispatch({ type: 'GENERATE_TEXT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

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
  );
}

export function useWords() {
  const context = useContext(WordContext);
  if (context === undefined) {
    throw new Error('useWords must be used within a WordProvider');
  }
  return context;
}
