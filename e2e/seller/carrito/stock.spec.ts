import { test, expect } from '@playwright/test';
test('US011-E: El sistema avisa cuando se alcanza el límite de stock', async ({ page }) => {
  await page.goto('/cart');

  // Preparamos el escuchador para la alerta de stock insuficiente
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('unidades disponibles');
    await dialog.accept();
  });

  const plusBtn = page.locator('button:has-text("add")').first();
  
  // Intentamos aumentar varias veces (ajusta el loop según el stock de tu prueba)
  for (let i = 0; i < 6; i++) {
    await plusBtn.click();
    await page.waitForTimeout(500); // Esperamos a que termine el isUpdating
  }
});