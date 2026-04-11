import { test, expect } from '@playwright/test';

test.describe('HU013-D: Notificación de devolución finalizada', () => {

  test.beforeEach(async ({ page }) => {
    await test.step('PASO 1: Inicio de sesión con Marin', async () => {
      await page.goto('/login', { waitUntil: 'domcontentloaded' });
      await page.fill('input[type="email"]', 'marin@ejemplo.com');
      await page.fill('input[type="password"]', '123456');
      await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
      await expect(page.getByRole('button', { name: /Hola, Marin/i })).toBeVisible();
    });

    await test.step('PASO 2: Navegación al reporte de finalización', async () => {
      await page.goto('/dashboard/buyer/returns/RET-FIN-1/completed', { waitUntil: 'domcontentloaded' });
    });
  });

  test('CA1: El sistema muestra el resumen de reembolso exitoso', async ({ page }) => {
    await test.step('Validación: Título de éxito visible', async () => {
      await expect(page.getByText(/¡Caso Cerrado!/i, { exact: true })).toBeVisible();
    });

    await test.step('Validación: Monto del reembolso correcto ($1250)', async () => {
      await expect(page.getByText(/\$1250/i)).toBeVisible();
    });

    await test.step('APROBADO: El método de pago es especificado correctamente', async () => {
      await expect(page.getByText(/Visa \*\*\*\*4321/i)).toBeVisible();
    });
  });

});