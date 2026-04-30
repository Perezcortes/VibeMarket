import { test, expect } from '@playwright/test';

test('US010-C: El usuario puede filtrar por rangos de precio predefinidos', async ({ page }) => {
  await page.goto('/search');

  // 1. Seleccionar rango "Hasta $500"
  await page.click('text=Hasta $500');
  await expect(page).toHaveURL(/.*max=500/);

  // 2. Seleccionar rango "$500 a $2,000"
  await page.click('text=$500 a $2,000');
  await expect(page).toHaveURL(/.*min=500/);
  await expect(page).toHaveURL(/.*max=2000/);
});