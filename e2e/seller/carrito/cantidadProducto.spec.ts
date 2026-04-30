import { test, expect } from '@playwright/test';
test('US011-B: Aumentar cantidad actualiza el subtotal del producto', async ({ page }) => {
  await page.goto('/cart');

  const firstItem = page.locator('div.flex.gap-4.p-4').first();
  const subtotalLocator = firstItem.locator('p.text-xl.font-black.text-primary');
  const initialSubtotal = await subtotalLocator.innerText();

  // Clic en el botón con icono "add"
  await firstItem.locator('button:has-text("add")').click();

  // Esperamos a que la opacidad vuelva a 100 (isUpdating = false)
 // ... después del clic en el botón "add" y esperar la clase opacity-100

// FORMA CORRECTA: Esperar a que el texto sea distinto al inicial
await expect(async () => {
  const currentSubtotal = await subtotalLocator.innerText();
  expect(currentSubtotal).not.toBe(initialSubtotal);
}).toPass({
  timeout: 5000 // Le damos hasta 5 segundos para que la DB y el refresh terminen
});
});