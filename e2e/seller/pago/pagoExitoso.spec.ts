import { test, expect } from '@playwright/test';

test('US012-C: El sistema procesa la orden y muestra el éxito con ID real', async ({ page }) => {
  // 1. PASO OBLIGATORIO: Llenar el formulario de pago primero
  await page.goto('/checkout/payment', { waitUntil: 'networkidle' });

  await page.fill('input[name="street"]', 'Calle Reforma');
  await page.fill('input[name="exterior_number"]', '100');
  await page.fill('input[name="postal_code"]', '69000');
  await page.fill('input[name="neighborhood"]', 'Centro');

  // Seleccionar método de pago
  const cardOption = page.getByText(/Tarjeta/i).first();
  await cardOption.click({ force: true });
  
  await page.fill('input[name="cardNumber"]', '4242424242424242');
  await page.fill('input[name="cardName"]', 'YAMIL MORALES');
  await page.fill('input[name="expiry"]', '12/28');
  await page.fill('input[name="cvv"]', '123');

  // Click para ir al resumen
  await page.getByRole('button', { name: /continuar|confirmar/i }).click();

  // 2. AHORA SÍ: Estamos en Review y podemos dar el clic final
  await expect(page).toHaveURL(/.*checkout\/review/);
  
  const finishBtn = page.getByRole('button', { name: /Pagar y Confirmar|Finalizar/i });
  await expect(finishBtn).toBeEnabled();
  await finishBtn.click();

  // 3. VALIDACIÓN DE ÉXITO: Esperamos la redirección a success
  // Aumentamos el timeout porque crear la orden en MariaDB puede tardar
  await expect(page).toHaveURL(/.*success\?orderId=.*/, { timeout: 15000 });

  // 4. Verificación de UI: Mensaje de éxito
  const successMsg = page.locator('h1');
  await expect(successMsg).toContainText(/¡Pedido Confirmado!|Gracias/i);
});