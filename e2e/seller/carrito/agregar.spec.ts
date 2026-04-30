import { test, expect } from '@playwright/test';

test('US011-A: El usuario puede añadir un producto y confirmar la alerta', async ({ page }) => {
  await page.goto('/search');

  // Escuchamos el diálogo nativo de tu función handleAddToCart
  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe('¡Producto añadido!');
    await dialog.accept();
  });

  // Localizamos el botón con el icono exacto que usas: add_shopping_cart
  const addBtn = page.locator('button:has-text("add_shopping_cart")').first();
  await addBtn.click();

  // Validamos que el contador del Navbar (US011-D) ya no sea 0 o inexistente
  const badge = page.locator('nav span.bg-primary');
  await expect(badge).toBeVisible();
});