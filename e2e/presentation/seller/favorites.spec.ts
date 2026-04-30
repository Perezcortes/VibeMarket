import { test, expect } from '@playwright/test';

test('US09-D: El usuario puede marcar y desmarcar un producto como favorito', async ({ page }) => {
  await page.goto('/search'); // O donde tengas tus cards

  // 1. Localizar el primer botón de favoritos (el que tiene el icono 'favorite')
  const heartBtn = page.locator('button:has-text("favorite")').first();
  const heartIcon = heartBtn.locator('span');

  // 2. Acción: Clic para agregar a favoritos
  await heartBtn.click();

  // 3. Validación visual: El icono debe tener la clase de color rojo
  // En tu código usas: favorited ? 'fill-1 text-red-500' : 'text-gray-400'
  await expect(heartIcon).toHaveClass(/text-red-500/);

  // 4. Acción: Clic para quitar de favoritos
  await heartBtn.click();

  // 5. Validación: Debe volver al color gris original
  await expect(heartIcon).toHaveClass(/text-gray-400/);
});