import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WordProvider, useWords } from './word-context';
import { ReactNode } from 'react';

// Test wrapper for React context
function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <WordProvider>{children}</WordProvider>;
  };
}

describe('Word Context', () => {
  it('should provide initial state', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    expect(result.current.state.words).toEqual([]);
    expect(result.current.state.inputValue).toBe('');
    expect(result.current.state.output).toBe('');
    expect(result.current.state.error).toBe('');
  });

  it('should add a word', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.addWord('hello');
    });

    expect(result.current.state.words).toHaveLength(1);
    expect(result.current.state.words[0].word).toBe('hello');
    expect(result.current.state.inputValue).toBe('');
    expect(result.current.state.error).toBe('');
  });

  it('should not add empty words', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.addWord('');
    });

    expect(result.current.state.words).toHaveLength(0);
    expect(result.current.state.error).toBe('Please enter a word');
  });

  it('should not add duplicate words', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.addWord('test');
    });

    act(() => {
      result.current.addWord('test');
    });

    expect(result.current.state.words).toHaveLength(1);
    expect(result.current.state.error).toBe('This word is already in the list');
  });

  it('should remove a word', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.addWord('hello');
      result.current.addWord('world');
    });

    act(() => {
      result.current.removeWord('hello');
    });

    expect(result.current.state.words).toHaveLength(1);
    expect(result.current.state.words[0].word).toBe('world');
  });

  it('should set input value', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.setInputValue('test input');
    });

    expect(result.current.state.inputValue).toBe('test input');
  });

  it('should generate text', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.addWord('curiosity');
    });

    const output = result.current.state.output;
    expect(output).toContain('curiosity');
    expect(output.length).toBeGreaterThan(0);
  });

  it('should handle case-insensitive words', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.addWord('Test');
    });

    act(() => {
      result.current.addWord('TEST');
    });

    expect(result.current.state.words).toHaveLength(1);
    expect(result.current.state.error).toBe('This word is already in the list');
  });

  it('should clear error when setting input', () => {
    const { result } = renderHook(() => useWords(), { wrapper: createWrapper() });

    act(() => {
      result.current.addWord('');
    });

    expect(result.current.state.error).toBe('Please enter a word');

    act(() => {
      result.current.setInputValue('new input');
    });

    expect(result.current.state.error).toBe('');
  });
});
