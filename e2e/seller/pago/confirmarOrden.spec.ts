import { test, expect } from '@playwright/test';

test('US012-B: El resumen de orden muestra los datos correctos antes de confirmar', async ({ page }) => {
  // 1. IMPORTANTE: Tenemos que hacer el proceso de pago primero para que existan datos que revisar
  await page.goto('/checkout/payment', { waitUntil: 'networkidle' });

  // Llenamos con los datos que el test va a buscar después
  await page.fill('input[name="street"]', 'Calle Reforma');
  await page.fill('input[name="exterior_number"]', '100');
  await page.fill('input[name="postal_code"]', '69000');
  await page.fill('input[name="neighborhood"]', 'Centro');

  // Seleccionar tarjeta (usando el selector robusto que arreglamos antes)
  const cardOption = page.getByText(/Tarjeta/i).first();
  await cardOption.click({ force: true });
  
  await page.fill('input[name="cardNumber"]', '4242424242424242');
  await page.fill('input[name="cardName"]', 'YAMIL MORALES');
  await page.fill('input[name="expiry"]', '12/28');
  await page.fill('input[name="cvv"]', '123');

  // Avanzamos a la revisión
  const nextBtn = page.getByRole('button', { name: /continuar|confirmar/i });
  await nextBtn.click();

  // 2. AHORA SÍ: Estamos en /checkout/review con datos reales
  await expect(page).toHaveURL(/.*checkout\/review/);

  // Verificamos que la dirección que escribimos arriba aparezca en el resumen
  await expect(page.locator('text=Calle Reforma #100')).toBeVisible({ timeout: 10000 });

  // Verificamos que el método de pago muestre los últimos 4 dígitos de la tarjeta 4242...
  await expect(page.locator('text=4242')).toBeVisible();

  // 3. El botón de pagar final debe estar listo
  const confirmBtn = page.getByRole('button', { name: /Pagar y Confirmar|Finalizar/i });
  await expect(confirmBtn).toBeEnabled();
});