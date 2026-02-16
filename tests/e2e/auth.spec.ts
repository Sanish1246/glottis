// Test for user authentication processes
import { test, expect } from '@playwright/test';

test('user registration', async ({ page,request }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser1');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('newEmail1@test.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword1');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('User Logged in!')).toBeVisible();
    // cleanup created user so next browser/project can reuse the same username
  await request.post('http://localhost:8000/test/cleanup/user', {
    data: { username: 'newUser1', email: 'newEmail1@test.com' },
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });
});

test('user login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('San');
  await page.getByRole('textbox', { name: 'Password' }).fill('Sanish2003');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('User Logged in!')).toBeVisible();
});

test('user logout', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('San');
  await page.getByRole('textbox', { name: 'Password' }).fill('Sanish2003');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('User Logged in!')).toBeVisible();
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByText('User Logged out!')).toBeVisible();
});

test('invalid username login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('Invalid user');
  await page.getByRole('textbox', { name: 'Password' }).fill('Sanish2003');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('User not found')).toBeVisible();
});

test('invalid password login', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('San');
  await page.getByRole('textbox', { name: 'Password' }).fill('Sanish2000000');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Invalid password')).toBeVisible();
});