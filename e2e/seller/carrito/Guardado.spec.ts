import { test, expect } from '@playwright/test';

test('US011-D: El conteo del Navbar persiste al recargar', async ({ page }) => {
  // 1. Ir al carrito
  await page.goto('/cart', { waitUntil: 'networkidle' });
  
  // Definimos el localizador una sola vez
  const badge = page.locator('nav span.bg-primary');

  // Esperamos un momento a que el badge sea visible si hay productos
  // Si tu carrito empieza vacío en la prueba, esto podría fallar, 
  // asegúrate de que el usuario 'Yamil' tenga items.
  await expect(badge).toBeVisible({ timeout: 10000 });

  // Capturamos el valor inicial
  const countBefore = await badge.innerText();
  console.log(`Cantidad antes de recargar: ${countBefore}`);

  // 2. Recargar la página
  await page.reload({ waitUntil: 'networkidle' });

  // 3. ESPERAR EXPLÍCITAMENTE a que vuelva a aparecer
  // Esto soluciona el timeout de 30s porque le damos tiempo al servidor de Next.js
  await expect(badge).toBeVisible({ timeout: 15000 }); 

  // 4. Validar que el dato sea el mismo
  const countAfter = await badge.innerText();
  console.log(`Cantidad después de recargar: ${countAfter}`);
  
  expect(countAfter).toBe(countBefore);
});