import { test, expect } from '@playwright/test';

test('US09-E: La card del producto muestra el promedio de calificación correctamente', async ({ page }) => {
  await page.goto('/search');

  // 1. Localizar el contenedor de estrellas en la primera card
  const ratingBadge = page.locator('div.flex.items-center.gap-1').first();
  
  // 2. Verificar que el icono de estrella de Google esté presente
  await expect(ratingBadge.locator('span:has-text("star")')).toBeVisible();

  // 3. Validar que el texto sea un número o "N/A"
  const ratingText = await ratingBadge.innerText();
  // Esta expresión regular acepta un número decimal (ej. 4.5) o el texto N/A
  expect(ratingText).toMatch(/(\d\.\d|N\/A)/);
});