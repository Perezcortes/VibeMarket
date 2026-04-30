import { test, expect } from '@playwright/test';

test('US010-D: El usuario puede ordenar los resultados de mayor a menor precio', async ({ page }) => {
  await page.goto('/search');

  // 1. Hacer clic en el link de ordenamiento descendente
  const sortDescLink = page.locator('aside >> text=Mayor precio');
  await sortDescLink.click();

  // 2. Verificar URL y estado visual
  await expect(page).toHaveURL(/.*sort=desc/);
  await expect(sortDescLink).toHaveClass(/font-bold text-primary/);

  // 3. Verificación de lógica: que el primer precio sea >= al segundo (si existen)
  const priceElements = await page.locator('span.text-xl.font-black.text-primary').allTextContents();
  const prices = priceElements.map(p => parseFloat(p.replace('$', '').replace(',', '')));

  if (prices.length > 1) {
    expect(prices[0]).toBeGreaterThanOrEqual(prices[1]);
  }
});