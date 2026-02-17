import { test, expect } from '@playwright/test';

// Tests for user uploads
test('immersion media upload', async ({ page,request }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: 'Immersion', exact: true }).click();
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('testImmersion');
  await page.getByRole('textbox', { name: 'Description' }).fill('This is a test media upload');
  await page.getByRole('textbox', { name: 'Author' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Link' }).fill('https://www.google.com/');
  await page.getByRole('checkbox', { name: 'Short Stories' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Media uploaded!')).toBeVisible()

  await request.post('http://localhost:8000/immersion/test/cleanup/media', {
    data: { title: 'testImmersion' },
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });
});

test('media upload with no title', async ({ page}) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('link', { name: 'Immersion', exact: true }).click();
  await page.getByRole('button', { name: 'Upload' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('This is a test media upload');
  await page.getByRole('textbox', { name: 'Author' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Link' }).fill('https://www.google.com/');
  await page.getByRole('checkbox', { name: 'Short Stories' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Title cannot be empty!')).toBeVisible()

});

test('flashcard deck upload', async ({ page,request }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newUser');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('#radix-_r_p_').click();
  await page.getByRole('menuitem', { name: 'Create Deck' }).click();
  await page.getByRole('textbox', { name: 'Deck Title' }).fill('testDeck');
  await page.getByRole('textbox', { name: 'Word' }).fill('testWord');
  await page.getByRole('textbox', { name: 'English translation' }).fill('testEnglish');
  await page.getByRole('button', { name: 'Add card' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Deck submitted successfully!')).toBeVisible();
  await request.post('http://localhost:8000/flashcards/test/cleanup/deck', {
    data: { category: 'testDeck' },
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });
});

test('lesson upload', async ({ page,request }) => {
  await page.goto('http://localhost:5173/');
  await page.locator('#radix-_r_3_').click();
  await page.getByRole('menuitem', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('newTeacher');
  await page.getByRole('textbox', { name: 'Password' }).fill('newPassword');
  await page.getByRole('button', { name: 'Submit' }).click();
   await page.locator('#radix-_r_n_').click();
  await page.getByRole('link', { name: 'Create Lesson' }).click();
  await page.getByRole('textbox', { name: 'Lesson Title' }).fill('testCustomLesson');
  await page.getByRole('textbox', { name: 'Enter an objective' }).fill('create a test lesson');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: 'Next section' }).click();
  await page.getByRole('button', { name: 'Add Dialogue Block' }).click();
  await page.getByRole('textbox', { name: 'Dialogue Title' }).fill('test dialogue');
  await page.getByRole('textbox', { name: 'Scene Description' }).fill('test description');
  await page.getByText('Formal').click();
  await page.getByRole('option', { name: 'Informal' }).click();
  await page.getByRole('textbox', { name: 'Speaker' }).fill('speaker');
  await page.getByRole('textbox', { name: 'Text' }).fill('text');
  await page.getByRole('textbox', { name: 'English translation' }).fill('text');
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('button', { name: 'Add Deck' }).click();
  await page.getByRole('textbox', { name: 'Deck title:' }).fill('testDeck');
  await page.getByRole('textbox', { name: 'Card word' }).fill('Test');
  await page.getByRole('textbox', { name: 'English translation' }).fill('TestEnglish');
  await page.getByRole('button').nth(2).click();
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('button', { name: 'Add Grammar table' }).click();
  await page.getByRole('textbox', { name: 'Grammar point title:' }).fill('test grammar point');
  await page.getByRole('textbox', { name: 'Add a note' }).fill('Test note');
  await page.getByRole('button', { name: 'Add Note' }).click();
  await page.getByRole('textbox', { name: 'Grammar point', exact: true }).fill('test point');
  await page.getByRole('textbox', { name: 'English translation' }).fill('test english');
  await page.getByRole('textbox', { name: 'Example' }).fill('test example');
  await page.getByRole('button').nth(3).click();
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('textbox', { name: 'Question:' }).fill('test question');
  await page.getByRole('textbox', { name: 'Add the answer' }).fill('Correct');
  await page.getByRole('textbox', { name: 'Option 3' }).fill('Correct');
  await page.getByRole('textbox', { name: 'Option 1' }).fill('Wrong');
  await page.getByRole('textbox', { name: 'Option 2' }).fill('Wrong');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('textbox', { name: 'Question:' }).fill('test MCQ');
  await page.getByRole('textbox', { name: 'Add the answer' }).fill('correct');
  await page.getByRole('textbox', { name: 'Option 1' }).fill('correct');
  await page.getByRole('textbox', { name: 'Option 3' }).fill('wrong');
  await page.getByRole('textbox', { name: 'Option 2' }).fill('wrong');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('textbox', { name: 'Cultural note title:' }).fill('test culture');
  await page.getByRole('textbox', { name: 'Add a note' }).fill('test note');
  await page.getByRole('button', { name: 'Add Note' }).click();
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('textbox', { name: 'Resource title' }).fill('test resource');
  await page.getByRole('textbox', { name: 'Add a link' }).fill('google.com');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('textbox', { name: 'Grammar Point:' }).fill('test grammar');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Next Section' }).click();
  await page.getByRole('textbox', { name: 'Skill:' }).fill('test lesson created');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Lesson submitted successfully!')).toBeVisible()

  await request.post('http://localhost:8000/lessons/test/cleanup/lesson', {
    data: { title: 'testCustomLesson',language:'italian' },
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });
 
});

