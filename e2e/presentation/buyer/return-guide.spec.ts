import { test, expect } from '@playwright/test';

test.describe('HU013-B: Guía de proceso de retorno', () => {

  test.beforeEach(async ({ page }) => {
    await test.step('PASO 1: Autenticación en VibeMarket', async () => {
      await page.goto('/login');
      await page.fill('input[type="email"]', 'marin@ejemplo.com');
      await page.fill('input[type="password"]', '123456');
      
      // FIX: Usar getByRole para mayor robustez
      await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
      
      // FIX: Validar el estado de logueado usando el botón de perfil
      await expect(page.getByRole('button', { name: /Hola, Marin/i })).toBeVisible();
    });

    await test.step('PASO 2: Navegación a la Guía de Retorno', async () => {
      // Navegar a una guía de retorno existente
      await page.goto('/dashboard/buyer/returns/RET-99-TEST/guide');
    });
  });

  test('CA1: Debe mostrar el número de tracking y las instrucciones', async ({ page }) => {
    await test.step('Validación: Presencia de tracking VIBE-', async () => {
      await expect(page.getByText(/VIBE-/i)).toBeVisible();
    });

    await test.step('Validación: Pasos de instrucción (Mínimo 3)', async () => {
      const steps = page.locator('li');
      // FIX: Obtenemos el conteo antes del expect
      const count = await steps.count(); 
      expect(count).toBeGreaterThanOrEqual(3);
    });

    await test.step('APROBADO: Botón de impresión funcional', async () => {
      const btn = page.getByRole('button', { name: /Imprimir/i });
      await expect(btn).toBeEnabled();
    });
  });

});