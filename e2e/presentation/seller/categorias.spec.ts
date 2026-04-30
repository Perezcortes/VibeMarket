import { test, expect } from '@playwright/test';
test('US010-B: El usuario puede filtrar por categorías desde el sidebar', async ({ page }) => {
  await page.goto('/search');

  // 1. Esperamos a que el sidebar cargue (por si la DB es lenta)
  const categoryLink = page.locator('aside a[href*="cat="]').first();
  
  // 2. Verificamos que al menos exista una categoría para hacer clic
  await expect(categoryLink).toBeVisible({ timeout: 10000 });

  const categoryName = await categoryLink.innerText();
  console.log(`Probando categoría: ${categoryName}`);

  // 3. Acción: Clic en la categoría encontrada
  await categoryLink.click();

  // 4. Validación: La URL debe contener el nombre de esa categoría
  // Usamos encodeURIComponent porque los nombres pueden tener espacios o acentos
  const expectedParam = encodeURIComponent(categoryName);
  await expect(page).toHaveURL(new RegExp(`cat=${expectedParam}`));
});