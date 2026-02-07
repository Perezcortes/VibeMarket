import { test, expect } from '@playwright/test';

test.describe('Historia: Seguridad y Roles', () => {

  test('CN-03: Comprador NO puede acceder al Admin Dashboard', async ({ page }) => {
    // 1. Registrar comprador
    const email = `buyer_${Date.now()}@vibe.com`;
    await page.goto('/register');
    await page.locator('input[name="full_name"]').fill('Comprador Intruso');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('123456');
    await page.getByRole('button', { name: 'Registrarme' }).click();

    // 2. Login
    await page.goto('/login');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('123456');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    await expect(page).toHaveURL(/\/dashboard/);

    // 3. Intento de hackeo
    await page.goto('/dashboard/admin');

    // 4. Verificar rebote
    // Esperamos que NO sea la URL de admin
    await expect(page).not.toHaveURL(/\/dashboard\/admin/);
  });
});