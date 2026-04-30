import { test, expect } from '@playwright/test';

test('US012-A: El usuario completa el flujo de pago exitosamente', async ({ page }) => {
  // 1. Ir a la página y esperar a que la red esté inactiva (importante para cálculos de envío)
  await page.goto('/checkout/payment', { waitUntil: 'networkidle' });

  // 2. Llenar los campos de dirección
  await page.fill('input[name="street"]', 'Avenida Universidad');
  await page.fill('input[name="exterior_number"]', '120');
  await page.fill('input[name="postal_code"]', '69000');
  await page.fill('input[name="neighborhood"]', 'Centro');

  // 3. Selección del método de pago
  // Usamos una expresión regular /Tarjeta/i para que no falle por acentos o mayúsculas
  // Además, esperamos a que sea visible antes de intentar el clic
  const cardOption = page.getByText(/Tarjeta/i).first();
  await expect(cardOption).toBeVisible({ timeout: 10000 });
  
  // Usamos force: true por si el diseño de Tailwind tiene un div invisible encima del radio button
  await cardOption.click({ force: true });

  // 4. Llenar datos de la tarjeta
  // Esperamos un momento a que el formulario de tarjeta se despliegue tras el clic anterior
  await page.fill('input[name="cardNumber"]', '4242424242424242');
  await page.fill('input[name="cardName"]', 'YAMIL MORALES');
  
  // Si tus inputs de fecha/cvv tienen placeholders o nombres diferentes, asegúrate que coincidan aquí
  await page.fill('input[name="expiry"]', '12/28');
  await page.fill('input[name="cvv"]', '123');

  // 5. El botón de continuar suele estar deshabilitado hasta que el form sea válido (validación de React)
  // Buscamos un botón que contenga "Continuar" o "Pagar" de forma flexible
  const submitBtn = page.getByRole('button', { name: /continuar|confirmar/i });
  
  // Verificamos que se habilite (esto confirma que no hay errores de validación en los inputs)
  await expect(submitBtn).toBeEnabled({ timeout: 10000 });
  await submitBtn.click();

  // 6. Validación final: Debe llegar a la revisión de la orden (US012-B)
  // Usamos un timeout más largo aquí porque la redirección depende de MariaDB
  await expect(page).toHaveURL(/.*checkout\/review/, { timeout: 15000 });
});