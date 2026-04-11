import { test, expect } from '@playwright/test';

// Flows for flashcard-related actions

test('add and remove flashcard to deck', async ({ page }) => {
  await page.goto('http://localhost:5173/');
 await page.getByRole('button', { name: 'User' }).click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Biblíon' }).click();
   await page.getByRole('menuitem', { name: 'Decks', exact: true }).click();
  await page.getByRole('link', { name: 'Greetings -7 cards' }).click();
  await page.getByText('Ciao').click();
  await expect(page.getByText('Hi / Bye (informal)')).toBeVisible();
  await page.getByRole('button', { name: '➕' }).nth(1).click();
  await expect(page.getByText('Card added successfully')).toBeVisible();
  await page.getByRole('button', { name: '➖' }).nth(1).click();
  await expect(page.getByText('Card removed successfully')).toBeVisible();
});

test('review a card and remove it from deck', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'User' }).click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Biblíon' }).click();
  await page.getByRole('menuitem', { name: 'Decks', exact: true }).click();
  await page.getByRole('link', { name: 'Greetings -7 cards' }).click();
  await page.getByRole('button', { name: '➕' }).first().click();
  await expect(page.getByText('Card added successfully')).toBeVisible();
  await page.getByRole('button', { name: 'Biblíon' }).click();
  await page.getByRole('menuitem', { name: 'Review' }).click();
  await page.locator('div').filter({ hasText: /^newUser's italian deck$/ }).click();
  await page.getByRole('button', { name: 'Start now' }).click();
  await page.getByRole('button', { name: 'See answer' }).click();
  await page.getByRole('button', { name: 'Medium' }).click();
  await page.getByText('Edit Deck').click();
  await page.waitForTimeout(5000)
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Card removed successfully')).toBeVisible();
});
