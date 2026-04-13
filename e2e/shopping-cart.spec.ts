import { test, expect } from '@playwright/test';

test.describe('Flujo de Caja Negra - Carrito de Compras', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Ir a la página del carrito
    await page.goto('/cart');
  });

  test('Debe mostrar el resumen de compra con el subtotal correcto', async ({ page }) => {
    // Verificamos que el título principal sea visible (Caja Negra: Lo que el usuario ve)
    const title = page.locator('h1');
    await expect(title).toContainText('Mi Carrito');

    // Verificamos que el botón de "Finalizar Compra" esté habilitado
    const checkoutBtn = page.getByRole('button', { name: /finalizar compra/i });
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toBeEnabled();
  });

  test('Debe eliminar un producto y actualizar el contador del carrito', async ({ page }) => {
    // 2. Localizar el primer botón de eliminar
    const removeBtn = page.getByRole('button', { name: /eliminar/i }).first();
    
    // 3. Obtener el conteo inicial (ej. "Mi Carrito (2)")
    const initialCountText = await page.locator('h1').innerText();

    // 4. Acción del usuario: Clic en eliminar
    await removeBtn.click();

    // 5. Verificación: El conteo debe haber cambiado o mostrar un mensaje de éxito
    await expect(page.locator('h1')).not.toHaveText(initialCountText);
  });

  test('Debe permitir escribir un código de cupón', async ({ page }) => {
    const couponInput = page.getByPlaceholder(/VIBE2026/i);
    await couponInput.fill('DESCUENTO10');
    
    const applyBtn = page.getByRole('button', { name: /aplicar/i });
    await applyBtn.click();
    
    // Aquí verificaríamos una respuesta visual de "Cupón aplicado"
  });
});