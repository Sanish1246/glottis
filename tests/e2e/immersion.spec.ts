import { test, expect } from '@playwright/test';

// Flows for media interaction

test('like and remove like from media', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: 'Immersion', exact: true }).click();
  await page.getByText('None').click();
  await page.getByRole('option', { name: 'Intermediate', exact: true }).click();
  await page.getByRole('link', { name: 'Media image Gioielli, Caffè e' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await expect(page.getByText('Item liked')).toBeVisible();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await expect(page.getByText('Like removed')).toBeVisible();
});
