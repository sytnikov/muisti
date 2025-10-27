import { describe, it, expect } from 'vitest';
import { ContextGenerator } from './context-generator';

describe('ContextGenerator', () => {
  it('should create an instance', () => {
    const generator = new ContextGenerator();
    expect(generator).toBeInstanceOf(ContextGenerator);
  });

  it('should add a word', () => {
    const generator = new ContextGenerator();
    generator.addWord('hello');
    
    expect(generator.hasWord('hello')).toBe(true);
    expect(generator.getWordCount()).toBe(1);
  });

  it('should not add empty words', () => {
    const generator = new ContextGenerator();
    generator.addWord('');
    generator.addWord('   ');
    
    expect(generator.getWordCount()).toBe(0);
  });

  it('should not add duplicate words', () => {
    const generator = new ContextGenerator();
    generator.addWord('test');
    generator.addWord('test');
    generator.addWord('TEST');
    generator.addWord(' Test ');
    
    expect(generator.getWordCount()).toBe(1);
  });

  it('should remove a word', () => {
    const generator = new ContextGenerator();
    generator.addWord('hello');
    generator.addWord('world');
    
    generator.removeWord('hello');
    
    expect(generator.hasWord('hello')).toBe(false);
    expect(generator.hasWord('world')).toBe(true);
    expect(generator.getWordCount()).toBe(1);
  });

  it('should get all words', () => {
    const generator = new ContextGenerator();
    generator.addWord('first');
    generator.addWord('second');
    generator.addWord('third');
    
    const words = generator.getWords();
    expect(words.length).toBe(3);
    expect(words.every(w => w.word)).toBe(true);
  });

  it('should generate text for no words', () => {
    const generator = new ContextGenerator();
    const text = generator.generateContextualText();
    
    expect(text).toContain('Add some words');
  });

  it('should generate text for a single word', () => {
    const generator = new ContextGenerator();
    generator.addWord('curiosity');
    const text = generator.generateContextualText();
    
    expect(text).toContain('curiosity');
    expect(text.length).toBeGreaterThan(0);
  });

  it('should generate text for two words', () => {
    const generator = new ContextGenerator();
    generator.addWord('adventure');
    generator.addWord('discovery');
    const text = generator.generateContextualText();
    
    expect(text).toContain('adventure');
    expect(text).toContain('discovery');
  });

  it('should generate text for three words', () => {
    const generator = new ContextGenerator();
    generator.addWord('wisdom');
    generator.addWord('journey');
    generator.addWord('insight');
    const text = generator.generateContextualText();
    
    expect(text).toContain('wisdom');
    expect(text).toContain('journey');
    expect(text).toContain('insight');
  });

  it('should generate text for multiple words', () => {
    const generator = new ContextGenerator();
    generator.addWord('one');
    generator.addWord('two');
    generator.addWord('three');
    generator.addWord('four');
    generator.addWord('five');
    const text = generator.generateContextualText();
    
    expect(text.length).toBeGreaterThan(0);
  });

  it('should handle case-insensitive word lookup', () => {
    const generator = new ContextGenerator();
    generator.addWord('Test');
    
    expect(generator.hasWord('test')).toBe(true);
    expect(generator.hasWord('TEST')).toBe(true);
    expect(generator.hasWord('Test')).toBe(true);
  });

  it('should handle word removal with different case', () => {
    const generator = new ContextGenerator();
    generator.addWord('Hello');
    generator.removeWord('hello');
    
    expect(generator.getWordCount()).toBe(0);
  });
});

