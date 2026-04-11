import { test, expect } from '@playwright/test';


test('admin reject deck', async ({ page,request }) => {
      await request.post('http://localhost:8000/flashcards/test/insert/deck', {
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'User' }).click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill("San");
  await page.getByRole('textbox', { name: 'Password' }).fill("Sanish2003");
  await page.getByRole('button', { name: 'Submit' }).click();
 await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Pending approvals' }).click();
  await page.getByRole('button', { name: 'Reject' }).first().click();
  await expect(page.getByText('Deck rejected!')).toBeVisible()

  await request.post('http://localhost:8000/flashcards/test/cleanup/deck', {
    data: { category: 'testDeck' },
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });
});

test('admin approve media', async ({ page,request }) => {
      await request.post('http://localhost:8000/immersion/test/insert/media', {
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'User' }).click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill("San");
  await page.getByRole('textbox', { name: 'Password' }).fill("Sanish2003");
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.waitForTimeout(1000);
 await page.getByRole('button', { name: 'User' }).click();
  await page.getByRole('link', { name: 'Pending approvals' }).click();
  await page.getByRole('tab', { name: 'Medias' }).click();
  await page.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByText('Media approved!')).toBeVisible();

  await request.post('http://localhost:8000/immersion/test/cleanup/media', {
    data: { title: 'testImmersion' },
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });
});



