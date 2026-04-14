import { test, expect } from '@playwright/test';

test.describe('US005: Reportes Administrativos', () => {
  
  test('US005-A: Cierre de ventas diario > CA1: Muestra total de ventas', async ({ page }) => {
    // 1. Ir al login e iniciar sesión como Administrador
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // 2. Esperar a que cargue el Dashboard y buscar la tarjeta de Ventas
    await expect(page.locator('text=Ventas del Día')).toBeVisible({ timeout: 10000 });
  });

  test('US005-B: Ranking de ventas > CA1: Tabla de categorías carga correctamente', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // Buscar el título de la tabla
    await expect(page.locator('text=Top Categorías Más Vendidas')).toBeVisible({ timeout: 10000 });
  });

  test('US005-D: Análisis de descuentos > CA1: Muestra tarjeta de artículos en oferta', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // Buscar la tarjeta de Descuentos
    await expect(page.locator('text=Artículos con Descuento')).toBeVisible({ timeout: 10000 });
  });
});