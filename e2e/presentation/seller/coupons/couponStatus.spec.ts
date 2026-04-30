/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Pruebas E2E — Gestión de Cupones
 * Historia de Usuario: US004-C: Gestión de estado de cupones
 * AUTOR: Leonides Lopez Robles
 * COPILOTO: Ariadna Ramirez
 * FECHA: 2025-03-11
 * TIPO DE PRUEBA: E2E (End-to-End)
 */

import { test, expect, type Page } from '@playwright/test';

async function goToDiscounts(page: Page) {
  await page.getByRole('button', { name: /Descuentos/i }).click();
  await expect(page.locator('text=Nuevo Cupón')).toBeVisible({ timeout: 10000 });
}

async function createCouponViaUI(page: Page): Promise<string> {
  const code = `ST-${Date.now()}`;
  await page.fill("input[placeholder='Ej: VERANO20']", code);
  await page.selectOption('select', 'porcentaje');
  await page.fill("input[type='number']", '10');
  await page.click("button:has-text('Crear Cupón')");
  await expect(page.locator(`tr:has-text("${code}")`)).toBeVisible({ timeout: 10000 });
  return code;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  const emailInput = page.locator('input[name="email"]');
  await emailInput.waitFor({ state: 'visible' });
  await emailInput.fill('vendedor@vibemarket1.com');
  await page.locator('input[type="password"]').fill('password123');
  await page.getByRole('button', { name: /entrar|iniciar/i }).click();
  await expect(
    page.getByRole('heading', { name: /Panel de Control/i })
  ).toBeVisible({ timeout: 15000 });
  await goToDiscounts(page);
});

test.describe('US004-C | Gestión de estado de cupones', () => {

  /**
   * CP-003/CP-004 — Activar un cupón inactivo
   * Verificamos que el botón pasa de "Desactivar" → "Activar" → "Desactivar"
   */
  test('CP-003/CP-004 — debe activar un cupón inactivo y mostrar el cambio', async ({ page }) => {
    const code = await createCouponViaUI(page);
    const row = page.locator(`tr:has-text("${code}")`);
    const btn = row.locator('button').last();

    // Estado inicial: activo → botón dice "Desactivar"
    await expect(btn).toContainText(/Desactivar/i, { timeout: 5000 });

    // Desactivar → botón debe cambiar a "Activar"
    await btn.click();
    await expect(btn).toContainText(/Activar/i, { timeout: 5000 });

    // Activar de nuevo → botón debe cambiar a "Desactivar"
    await btn.click();
    await expect(btn).toContainText(/Desactivar/i, { timeout: 5000 });
  });

  /**
   * CP-006/CP-007 — Desactivar un cupón activo
   * Verificamos que el botón cambia de "Desactivar" a "Activar"
   */
  test('CP-006/CP-007 — debe desactivar un cupón activo', async ({ page }) => {
    const code = await createCouponViaUI(page);
    const row = page.locator(`tr:has-text("${code}")`);
    const btn = row.locator('button').last();

    // Estado inicial: botón dice "Desactivar"
    await expect(btn).toContainText(/Desactivar/i, { timeout: 5000 });

    // Click → botón debe cambiar a "Activar"
    await btn.click();
    await expect(btn).toContainText(/Activar/i, { timeout: 5000 });
  });

  /**
   * CP-009/CP-010 — Toggle doble
   * Dos clicks consecutivos regresan al estado original
   */
  test('CP-009/CP-010 — debe invertir el estado dos veces y quedar igual', async ({ page }) => {
    const code = await createCouponViaUI(page);
    const row = page.locator(`tr:has-text("${code}")`);
    const btn = row.locator('button').last();

    // Toggle 1: Desactivar → Activar
    await btn.click();
    await expect(btn).toContainText(/Activar/i, { timeout: 5000 });

    // Toggle 2: Activar → Desactivar
    await btn.click();
    await expect(btn).toContainText(/Desactivar/i, { timeout: 5000 });
  });

  /**
   * CP-011 — Persistencia tras recargar
   * El estado desactivado debe mantenerse después de un reload
   */
  test('CP-011 — el estado del cupón debe persistir tras recargar la página', async ({ page }) => {
    const code = await createCouponViaUI(page);
    const row = page.locator(`tr:has-text("${code}")`);
    const btn = row.locator('button').last();

    // Desactivar
    await btn.click();
    await expect(btn).toContainText(/Activar/i, { timeout: 5000 });

    // Recargar y verificar que sigue desactivado
    await page.reload({ waitUntil: 'domcontentloaded' });
    await goToDiscounts(page);

    const rowAfter = page.locator(`tr:has-text("${code}")`);
    await expect(rowAfter.locator('button').last()).toContainText(/Activar/i, { timeout: 10000 });
  });

  /**
   * CP-001 — Error con ID inválido
   * La API debe rechazar un PATCH con ID inexistente
   */
  test('CP-001 — debe retornar error si el ID del cupón no existe', async ({ page }) => {
    const res = await page.request.patch('/api/seller/coupons/id-inexistente-000', {
      data: { action: 'toggle', currentState: true },
    });
    expect(res.status()).not.toBe(200);
  });

});