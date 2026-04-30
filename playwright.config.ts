import { defineConfig, devices } from '@playwright/test';

/**
 * Ruta donde se guardará el estado de la sesión (cookies y localStorage)
 * después de que el script de autenticación termine.
 */
export const STORAGE_STATE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // Usamos 127.0.0.1 para evitar problemas de resolución de DNS en Linux
    baseURL: 'http://127.0.0.1:3000', 
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
  },

  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  projects: [
    // --- PROYECTO DE AUTENTICACIÓN ---
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/, // Esto buscará tu archivo auth.setup.ts
    },

    // --- PROYECTO DE PRUEBAS ESTÁNDAR ---
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Aquí le decimos a Chromium que use la sesión guardada
        storageState: STORAGE_STATE,
      },
      // IMPORTANTE: Esto obliga a que el setup corra antes que las pruebas
      dependencies: ['setup'],
    },
  ],
});