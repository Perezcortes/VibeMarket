import { test, expect } from '@playwright/test'; // Agrega esta línea explícitamente

test('Debe mostrar el Navbar y el total de gastos formateado', async ({ page }) => {
  await page.goto('/dashboard/history');
  
  // Verificamos que los elementos globales "jalados" existan
  await expect(page.locator('nav')).toBeVisible(); 
  await expect(page.locator('footer')).toBeVisible();

  // Verificamos que el formato de moneda (lógica del presenter) sea correcto
  const totalText = await page.innerText('.total-spent-display');
  expect(totalText).toContain('$'); // Caja negra: Solo verifico que sea moneda
});