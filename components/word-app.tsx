"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextGenerator, type WordEntry } from "@/lib/context-generator";

export default function WordApp() {
  const [generator] = useState(() => new ContextGenerator());
  const [words, setWords] = useState<WordEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleAddWord = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Please enter a word");
      return;
    }

    if (generator.hasWord(trimmed)) {
      setError("This word is already in the list");
      return;
    }

    setError("");
    generator.addWord(trimmed);
    setWords(generator.getWords());
    setInputValue("");
    setOutput(generator.generateContextualText());
  }, [inputValue, generator]);

  const handleRemoveWord = useCallback((word: string) => {
    generator.removeWord(word);
    setWords(generator.getWords());
    setOutput(generator.generateContextualText());
  }, [generator]);

  const handleGenerate = useCallback(() => {
    setOutput(generator.generateContextualText());
  }, [generator]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddWord();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Muisti</h1>
          <p className="text-gray-400 text-lg">Transform words into meaningful context</p>
        </div>

        <div className="space-y-6">
          {/* Input Section */}
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
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
              {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
            </CardContent>
          </Card>

          {/* Words List */}
          {words.length > 0 && (
            <Card className="bg-white text-black border-2 border-black">
              <CardHeader>
                <CardTitle>Your Words ({words.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {words.map((wordEntry, index) => (
                    <div
                      key={index}
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
          )}

          {/* Output Section */}
          <Card className="bg-white text-black border-2 border-black">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Generated Story</CardTitle>
                  <CardDescription className="text-gray-600">
                    Your words in context
                  </CardDescription>
                </div>
                {words.length > 0 && (
                  <Button 
                    onClick={handleGenerate}
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
                {output ? (
                  <p className="text-gray-900 leading-relaxed text-lg whitespace-pre-wrap">
                    {output}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    Add words above to generate a story...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

