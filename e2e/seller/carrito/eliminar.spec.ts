import { test, expect } from '@playwright/test';
test('US011-C: Eliminar un producto tras confirmar el diálogo', async ({ page }) => {
  await page.goto('/cart');

  // Manejamos el confirm(`¿Eliminar ${item.name} del carrito?`)
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('¿Eliminar');
    await dialog.accept();
  });

  const firstItemName = await page.locator('h4.font-bold').first().innerText();
  
  // Clic en el botón con icono "delete"
  await page.locator('button:has-text("delete")').first().click();

  // El producto ya no debe estar en la lista
  await expect(page.locator(`text=${firstItemName}`)).not.toBeVisible();
});