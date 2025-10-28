"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWords } from "@/lib/word-context";

export default function WordList() {
  const { state, removeWord } = useWords();

  const handleRemoveWord = useCallback((word: string) => {
    removeWord(word);
  }, [removeWord]);

  if (state.words.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white text-black border-2 border-black">
      <CardHeader>
        <CardTitle>Your Words ({state.words.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {state.words.map((wordEntry) => (
            <div
              key={wordEntry.id}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full group"
            >
              <span className="text-sm font-medium">{wordEntry.word}</span>
              <button
                onClick={() => handleRemoveWord(wordEntry.word)}
                className="text-white hover:text-gray-300 ml-1 transition-colors"
                aria-label={`Remove ${wordEntry.word}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
