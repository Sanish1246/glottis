import { test, expect } from '@playwright/test';

// Tests for user uploads
test('immersion media upload', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: 'Immersion', exact: true }).click();
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('testImmersion');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('This is a test media upload');
  await page.getByRole('textbox', { name: 'Author' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Link' }).fill('https://www.google.com/');
  await page.getByRole('checkbox', { name: 'Short Stories' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Media uploaded!')).toBeVisible()
});

test('flashcard deck upload', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('#radix-_r_p_').click();
  await page.getByRole('link', { name: 'Create Deck' }).click();
  await page.locator('html').click();
  await page.getByRole('textbox', { name: 'Deck Title' }).fill('testDeck');
  await page.getByRole('textbox', { name: 'Word' }).fill('testWord');
  await page.getByRole('textbox', { name: 'English translation' }).fill('testEnglish');
  await page.getByRole('button', { name: 'Add card' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Deck submitted successfully!')).toBeVisible();
});

