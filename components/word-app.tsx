"use client";

import WordInput from "@/components/word-input";
import WordList from "@/components/word-list";
import StoryOutput from "@/components/story-output";
import ModelSelector from "@/components/model-selector";

export default function WordApp() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Muisti</h1>
          <p className="text-gray-400 text-lg">Transform words into meaningful context</p>
        </div>

        <div className="space-y-6">
          <ModelSelector />
          <WordInput />
          <WordList />
          <StoryOutput />
        </div>
      </div>
    </div>
  );
}