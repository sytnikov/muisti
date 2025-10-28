"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWords } from "@/lib/word-context";

export default function WordInput() {
  const { state, addWord, setInputValue } = useWords();

  const handleAddWord = useCallback(() => {
    addWord(state.inputValue);
  }, [addWord, state.inputValue]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddWord();
    }
  }, [handleAddWord]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, [setInputValue]);

  return (
    <Card className="bg-white text-black border-2 border-black">
      <CardHeader>
        <CardTitle>Add Words</CardTitle>
        <CardDescription className="text-gray-600">
          Enter words to include in your story
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            placeholder="Enter a word..."
            value={state.inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-1 border-2 border-black focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black"
          />
          <Button 
            onClick={handleAddWord}
            className="bg-black text-white hover:bg-gray-900 border-2 border-black"
          >
            Add
          </Button>
        </div>
        {state.error && <p className="text-red-600 mt-2 text-sm">{state.error}</p>}
      </CardContent>
    </Card>
  );
}
