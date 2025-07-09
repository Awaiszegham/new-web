const { test, expect } = require('@playwright/test');

test('should send form data to the correct webhook URL', async ({ page }) => {
  // 1. Intercept network requests
  let webhookRequest;
  page.on('request', (request) => {
    if (request.url().startsWith('https://primary-production-9e0f.up.railway.app/webhook/')) {
      webhookRequest = request;
    }
  });

  // 2. Navigate to the local submission page
  // Using file:// protocol to open the local HTML file
  const filePath = `file://${process.cwd()}/submission.html`;
  await page.goto(filePath);

  // 3. Fill out the form
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', 'test@example.com');
  await page.selectOption('#automationType', 'Other');
  await page.fill('#date', '2025-01-01');
  await page.fill('#time', '12:00');
  await page.fill('#needs', 'Test automation needs.');

  // 4. Click the submit button
  await page.click('button[type="submit"]');

  // 5. Wait for the network request to be captured
  await page.waitForTimeout(1000); // Give it a moment to fire

  // 6. Assert that the request was made to the correct URL
  expect(webhookRequest).toBeDefined();
  expect(webhookRequest.url()).toBe('https://primary-production-9e0f.up.railway.app/webhook/739d8ccf-4a0a-479b-91e7-6427681622ff');
  
  // 7. Assert that the request method is POST
  expect(webhookRequest.method()).toBe('POST');

  // 8. Assert that the form feedback is successful
  const feedbackEl = page.locator('#form-feedback');
  await expect(feedbackEl).toHaveText('Thank you! Your submission has been received.');
  await expect(feedbackEl).toHaveClass(/alert-success/);
});
