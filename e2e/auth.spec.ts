import { test, expect } from '@playwright/test';

test.describe('Historia: Autenticación', () => {
  
  test('CN-01: Registro de usuario nuevo exitoso', async ({ page }) => {
    const randomId = Date.now();
    const email = `test_${randomId}@vibe.com`;
    const password = 'Password123!';

    await page.goto('/register');

    await page.locator('input[name="full_name"]').fill('Usuario Playwright');
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    
    // Si quieres seleccionar rol (opcional, tu código tiene default "comprador")
    // await page.locator('select[name="role"]').selectOption('vendedor');

    await page.getByRole('button', { name: 'Registrarme' }).click();

    // Verificamos que redirija al login
    await expect(page).toHaveURL(/\/login/);
  });

  test('CN-02: Bloqueo de login con contraseña incorrecta', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('admin@vibemarket.com'); 
    await page.locator('input[name="password"]').fill('incorrecta123'); 

    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    await expect(page.getByText('Credenciales inválidas')).toBeVisible();
  });
});