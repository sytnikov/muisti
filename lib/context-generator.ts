/**
 * Core business logic for generating contextual text with target words
 */

export interface WordEntry {
  word: string;
  addedAt: number;
}

export class ContextGenerator {
  private words: Map<string, WordEntry> = new Map();

  /**
   * Add a new word to the collection
   */
  addWord(word: string): void {
    const trimmedWord = word.trim().toLowerCase();
    if (trimmedWord && !this.words.has(trimmedWord)) {
      this.words.set(trimmedWord, {
        word: trimmedWord,
        addedAt: Date.now(),
      });
    }
  }

  /**
   * Remove a word from the collection
   */
  removeWord(word: string): void {
    const trimmedWord = word.trim().toLowerCase();
    this.words.delete(trimmedWord);
  }

  /**
   * Get all words
   */
  getWords(): WordEntry[] {
    return Array.from(this.words.values());
  }

  /**
   * Generate contextual text incorporating target words
   */
  generateContextualText(): string {
    const wordArray = Array.from(this.words.keys());
    
    if (wordArray.length === 0) {
      return "Add some words to generate a story...";
    }

    if (wordArray.length === 1) {
      return this.generateSingleWordContext(wordArray[0]);
    }

    if (wordArray.length === 2) {
      return this.generateTwoWordContext(wordArray);
    }

    // For 3+ words, create a more complex narrative
    return this.generateMultiWordContext(wordArray);
  }

  /**
   * Generate context for a single word
   */
  private generateSingleWordContext(word: string): string {
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
  private generateTwoWordContext(words: string[]): string {
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
  private generateMultiWordContext(words: string[]): string {
    if (words.length === 3) {
      return this.generateThreeWordContext(words);
    }

    // Select a subset of words and create a narrative
    const selectedWords = words.slice(0, 4);
    const remainingWords = words.slice(4);

    let story = `The journey began with ${this.wordList(selectedWords)}. `;
    story += `These concepts intertwined, creating a tapestry of meaning that invited exploration. `;
    
    if (remainingWords.length > 0) {
      story += `As the story unfolded, ${this.wordList(remainingWords)} emerged naturally, `;
      story += `each contributing its unique perspective to the narrative.`;
    }

    return story;
  }

  /**
   * Generate a three-word narrative
   */
  private generateThreeWordContext(words: string[]): string {
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
  private wordList(words: string[]): string {
    if (words.length === 1) return `"${words[0]}"`;
    if (words.length === 2) return `"${words[0]}" and "${words[1]}"`;
    
    const lastWord = words[words.length - 1];
    const otherWords = words.slice(0, -1).map(w => `"${w}"`).join(", ");
    return `${otherWords}, and "${lastWord}"`;
  }

  /**
   * Check if a word exists
   */
  hasWord(word: string): boolean {
    return this.words.has(word.trim().toLowerCase());
  }

  /**
   * Get total word count
   */
  getWordCount(): number {
    return this.words.size;
  }
}

