import { test, expect } from '@playwright/test';

test.describe('Muisti App', () => {
  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Muisti' })).toBeVisible();
  });

  test('should allow adding a word', async ({ page }) => {
    await page.goto('/');
    
    // Enter a word
    const input = page.getByPlaceholder('Enter a word...');
    await input.fill('adventure');
    
    // Click add button
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Verify word appears in the list
    await expect(page.getByText('adventure')).toBeVisible();
    await expect(page.getByText('Your Words (1)')).toBeVisible();
  });

  test('should generate contextual text with added words', async ({ page }) => {
    await page.goto('/');
    
    // Add a word
    await page.getByPlaceholder('Enter a word...').fill('curiosity');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Wait for output to appear
    const output = page.locator('[class*="min-h-[200px]"]');
    await expect(output).toBeVisible();
    
    // Verify the output contains the word
    const outputText = await output.textContent();
    expect(outputText).toContain('curiosity');
    expect(outputText?.length).toBeGreaterThan(0);
  });

  test('should handle multiple words', async ({ page }) => {
    await page.goto('/');
    
    // Add multiple words
    await page.getByPlaceholder('Enter a word...').fill('wisdom');
    await page.getByRole('button', { name: 'Add' }).click();
    
    await page.getByPlaceholder('Enter a word...').fill('journey');
    await page.getByRole('button', { name: 'Add' }).click();
    
    await page.getByPlaceholder('Enter a word...').fill('insight');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Verify all words appear
    await expect(page.getByText('Your Words (3)')).toBeVisible();
    await expect(page.getByText('wisdom')).toBeVisible();
    await expect(page.getByText('journey')).toBeVisible();
    await expect(page.getByText('insight')).toBeVisible();
    
    // Verify output contains all words
    const output = page.locator('[class*="min-h-[200px]"]');
    const outputText = await output.textContent();
    expect(outputText).toContain('wisdom');
    expect(outputText).toContain('journey');
    expect(outputText).toContain('insight');
  });

  test('should allow removing words', async ({ page }) => {
    await page.goto('/');
    
    // Add two words
    await page.getByPlaceholder('Enter a word...').fill('first');
    await page.getByRole('button', { name: 'Add' }).click();
    
    await page.getByPlaceholder('Enter a word...').fill('second');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Remove the first word
    const removeButton = page.locator('text=first').locator('..').getByText('×');
    await removeButton.click();
    
    // Verify first word is gone
    await expect(page.getByText('first')).not.toBeVisible();
    
    // Verify second word still exists
    await expect(page.getByText('second')).toBeVisible();
    await expect(page.getByText('Your Words (1)')).toBeVisible();
  });

  test('should show error for empty word', async ({ page }) => {
    await page.goto('/');
    
    // Click add without entering a word
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Please enter a word')).toBeVisible();
  });

  test('should show error for duplicate word', async ({ page }) => {
    await page.goto('/');
    
    // Add the same word twice
    await page.getByPlaceholder('Enter a word...').fill('unique');
    await page.getByRole('button', { name: 'Add' }).click();
    
    await page.getByPlaceholder('Enter a word...').fill('unique');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Verify error message
    await expect(page.getByText('This word is already in the list')).toBeVisible();
  });

  test('should allow regenerating the story', async ({ page }) => {
    await page.goto('/');
    
    // Add a word
    await page.getByPlaceholder('Enter a word...').fill('regenerate');
    await page.getByRole('button', { name: 'Add' }).click();
    
    // Get initial output
    const output = page.locator('[class*="min-h-[200px]"]');
    const initialText = await output.textContent();
    
    // Click regenerate
    await page.getByRole('button', { name: 'Regenerate' }).click();
    
    // Verify output is still present (might be same or different)
    await expect(output).toBeVisible();
    const newText = await output.textContent();
    expect(newText?.length).toBeGreaterThan(0);
  });
});

