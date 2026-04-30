import { test, expect } from '@playwright/test';

test('US010-A: El usuario puede buscar productos por nombre', async ({ page }) => {
  await page.goto('/'); 
  
  const query = 'Laptop';
  const searchInput = page.getByPlaceholder('Buscar productos, marcas y más...');
  
  // 1. Escribir y presionar Enter
  await searchInput.fill(query);
  await searchInput.press('Enter');

  // 2. Verificar URL y resultados
  await expect(page).toHaveURL(new RegExp(`q=${query}`));
// En lugar de buscar en todo el documento, buscamos dentro de la etiqueta <main> o por un texto más único
const resultsText = page.locator('section >> p.text-gray-500').first(); 

// O mejor aún, usa el localizador por texto directamente que es más infalible:
await expect(page.getByText(`Buscando "${query}"`)).toBeVisible();
});