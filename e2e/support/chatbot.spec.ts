import { test, expect } from '@playwright/test';

test.describe('Pruebas de Caja Negra - Chatbot de Soporte', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Tiempo extra para compilación de Next.js 16
    test.setTimeout(100000); 

    // 2. Ir al login
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });

    // 3. Credenciales
    await page.waitForSelector('input[name="email"]', { timeout: 15000 });
    await page.fill('input[name="email"]', 'marin@ejemplo.com');
    await page.fill('input[name="password"]', '123456');
    
    // 4. Login y espera de Dashboard
    await Promise.all([
      page.waitForURL('**/dashboard', { timeout: 30000 }),
      page.click('button[type="submit"]')
    ]);
    
    // 5. Esperar botón del chatbot
    await page.waitForSelector('text=smart_toy', { state: 'visible', timeout: 20000 });
  });

  test('Debe abrir y cerrar la interfaz de soporte correctamente', async ({ page }) => {
    const chatBtn = page.locator('text=smart_toy');
    await chatBtn.click();
    await expect(page.getByText('Soporte Virtual')).toBeVisible();
    await page.locator('text=close').click();
    await expect(page.getByText('Soporte Virtual')).not.toBeVisible();
  });

  test('Debe responder automáticamente a las sugerencias rápidas', async ({ page }) => {
    await page.locator('text=smart_toy').click();
    const suggestion = page.locator('button:has-text("¿Costo de envío?")');
    await suggestion.click();
    const response = page.getByText(/compras superiores a \$999/i);
    await expect(response).toBeVisible({ timeout: 10000 });
  });

  test('Debe validar la normalización de texto del usuario', async ({ page }) => {
    await page.locator('text=smart_toy').click();
    const input = page.getByPlaceholder('Escribe tu duda...');
    await input.fill('¿¿¿PAGOS???');
    await page.keyboard.press('Enter');
    await expect(page.getByText(/Visa, Mastercard, AMEX/i)).toBeVisible({ timeout: 10000 });
  });

  test('Debe mostrar el mensaje de fallback ante consultas desconocidas', async ({ page }) => {
    await page.locator('text=smart_toy').click();
    const input = page.getByPlaceholder('Escribe tu duda...');
    const sendBtn = page.locator('button:has(span:text("send")), button:has-text("Enviar")');

    await input.fill('¿Cuál es el sentido de la vida?');
    await sendBtn.click();

    // CORRECCIÓN: Alineado con el mensaje real "no tengo una respuesta exacta"
    const fallbackMsg = page.getByText(/no tengo una respuesta exacta/i);
    await expect(fallbackMsg).toBeVisible({ timeout: 10000 });
  });

});