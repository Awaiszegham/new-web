// playwright.config.js
const { devices } = require('@playwright/test');

const config = {
  testDir: './',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
};

module.exports = config;
