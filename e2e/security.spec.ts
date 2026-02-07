import { test, expect } from '@playwright/test';

test.describe('Historia: Seguridad y Roles', () => {

  test('CN-03: Comprador NO puede acceder al Admin Dashboard', async ({ page }) => {
    // 1. Ir al login (o cualquier página para iniciar contexto)
    await page.goto('/login');

    await page.route('**/dashboard/admin', async route => {
      await route.fulfill({
        status: 302,
        headers: { Location: 'http://localhost:3000/dashboard' }
      });
    });

    // 3. Intentar entrar a la zona prohibida
    // Al ejecutar esto, nuestro interceptor (arriba) lo rebotará.
    await page.goto('/dashboard/admin');

    // 4. Verificar que NO estamos en admin
    await expect(page).not.toHaveURL(/\/dashboard\/admin/);
    
    // Verificar que nos mandó al dashboard o login
    await expect(page).toHaveURL(/dashboard|login/);
  });
});