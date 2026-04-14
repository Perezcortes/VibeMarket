import { test, expect } from '@playwright/test';

test.describe('HU014-C: Mediación de disputas', () => {

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);

    await test.step('PASO 1: Login de Agente', async () => {
      await page.goto('/login');
      
      // Credenciales de Marin
      await page.getByPlaceholder('tucorreo@vibemarket.com').fill('marin@ejemplo.com');
      await page.locator('input[type="password"]').fill('123456');
      await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
      
      // Validamos sesión mediante la UI para evitar problemas de redirección
      await expect(page.getByRole('button', { name: /Hola, Marin/i })).toBeVisible({ timeout: 15000 });
    });

    await test.step('PASO 2: Navegación a la disputa DIS-101', async () => {
      await page.goto('/dashboard/support/disputes/DIS-101');
      
      const mainTitle = page.locator('main h1, h1.text-3xl'); 
      await expect(mainTitle).toContainText('Mediación de Disputa', { timeout: 15000 });
    });
  });

  // ESTO ES LO QUE FALTABA: Los tests reales
  test('CA1: El agente visualiza ambos argumentos correctamente', async ({ page }) => {
    // Verificamos que los argumentos carguen (asumiendo que los datos están ahí)
    await expect(page.getByText(/El color es azul/i)).toBeVisible();
    await expect(page.getByText(/azul cobalto/i)).toBeVisible();
  });

  test('CA2: Resolución con éxito del caso', async ({ page }) => {
    // Acción de resolución
    await page.getByRole('button', { name: /Reembolsar al Comprador/i }).click();
    
    // Verificamos estado final
    await expect(page.getByText(/Disputa Resuelta/i)).toBeVisible();
  });

});