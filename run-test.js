const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let webhookRequest;
  page.on('request', (request) => {
    if (request.url().startsWith('https://primary-production-9e0f.up.railway.app/webhook/')) {
      webhookRequest = request;
    }
  });

  const filePath = `file://${path.resolve(__dirname, 'submission.html')}`;
  await page.goto(filePath);

  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', 'test@example.com');
  await page.selectOption('#automationType', 'Other');
  await page.fill('#date', '2025-01-01');
  await page.fill('#time', '12:00');
  await page.fill('#needs', 'Test automation needs.');

  await page.click('button[type="submit"]');

  await page.waitForTimeout(2000); // Wait for network request

  if (!webhookRequest) {
    console.error('Test Failed: Webhook request was not sent.');
    process.exit(1);
  }

  if (webhookRequest.url() !== 'https://primary-production-9e0f.up.railway.app/webhook/739d8ccf-4a0a-479b-91e7-6427681622ff') {
    console.error(`Test Failed: Incorrect webhook URL. Expected .../739d... but got ${webhookRequest.url()}`);
    process.exit(1);
  }

  if (webhookRequest.method() !== 'POST') {
    console.error(`Test Failed: Incorrect request method. Expected POST but got ${webhookRequest.method()}`);
    process.exit(1);
  }
  
  const feedbackEl = await page.locator('#form-feedback');
  const feedbackText = await feedbackEl.textContent();
  const feedbackClass = await feedbackEl.getAttribute('class');

  if (!feedbackText.includes('Thank you! Your submission has been received.')) {
      console.error(`Test Failed: Unexpected form feedback text: "${feedbackText}"`);
      process.exit(1);
  }

  if (!feedbackClass.includes('alert-success')) {
      console.error(`Test Failed: Form feedback does not have success class: "${feedbackClass}"`);
      process.exit(1);
  }

  console.log('Test Passed!');
  await browser.close();
})();
