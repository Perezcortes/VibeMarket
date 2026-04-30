import { test, expect } from '@playwright/test';

test.describe('US008-B: Recuperación de contraseña', () => {

  test('US008-B: Recuperación de contraseña > CA1: Muestra mensaje ambiguo de seguridad', async ({ page }) => {
    // 1. Ir a la pantalla de recuperar contraseña
    await page.goto('/forgot-password');
    
    // 2. Llenar el formulario con un correo de prueba
    await page.fill('input[type="email"]', 'correo_prueba_123@test.com');
    await page.click('button[type="submit"]');

    // 3. Verificar que sale el mensaje de seguridad de la regla de negocio
    await expect(page.locator('text=enlace')).toBeVisible({ timeout: 10000 });
  });

});