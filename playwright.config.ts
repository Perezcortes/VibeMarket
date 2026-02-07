import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Carpeta donde pondremos las pruebas
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html', // Genera el reporte visual

  use: {
    baseURL: 'http://localhost:3000', // Tu URL local
    trace: 'on-first-retry',
    screenshot: 'on', // Tomar captura si falla
    video: 'on',      // Grabar video de la prueba 
  },

  // Configura que Playwright levante tu app antes de probar
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});