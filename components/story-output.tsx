"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWords } from "@/lib/word-context";

export default function StoryOutput() {
  const { state, generateText } = useWords();

  const handleRegenerate = useCallback(() => {
    generateText();
  }, [generateText]);

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
          {state.words.length > 0 && (
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
          {state.output ? (
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
  );
}
