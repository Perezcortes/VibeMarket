import { test, expect } from '@playwright/test';

test.describe('HU014-B: Log de incidencias técnicas', () => {

  test.beforeEach(async ({ page }) => {
    // Ubuntu a veces necesita un respiro con Next.js
    test.setTimeout(60000); 

    await test.step('PASO 1: Inicio de Sesión de Soporte', async () => {
      await page.goto('/login');
      
      // Usamos los placeholders exactos de tu snapshot
      await page.getByPlaceholder('tucorreo@vibemarket.com').fill('marin@ejemplo.com');
      await page.locator('input[type="password"]').fill('123456');
      
      // Hacemos click y esperamos a que la red se calme (asegura cookies)
      await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
      await page.waitForLoadState('networkidle'); 
    });

    await test.step('PASO 2: Acceso al Panel de Incidencias', async () => {
      // Vamos directo a la URL de soporte
      await page.goto('/dashboard/support/incidents');
      
      // Validamos que cargó el Panel (h1) antes de buscar el formulario
      await expect(page.locator('h1')).toContainText('Panel de Soporte', { timeout: 15000 });
    });
  });

  test('CA1: El sistema debe validar la longitud de la descripción', async ({ page }) => {
    await test.step('Acción: Intento de registro corto', async () => {
      await page.getByPlaceholder(/Título corto del error/i).fill('Error de Login');
      await page.getByPlaceholder(/Pasos para reproducir/i).fill('No funciona');
      await page.getByRole('button', { name: /Registrar Incidencia/i }).click();
    });

    await test.step('APROBADO: El sistema rechazó la descripción por ser muy breve', async () => {
      await expect(page.getByText(/La descripción debe ser más detallada/i)).toBeVisible();
    });
  });

  test('CA2: Registro exitoso de un ticket crítico', async ({ page }) => {
    await test.step('Configuración: Simulación de API (Mock)', async () => {
      await page.route('**/api/incidents', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: { id: 'INC-999' } }),
        });
      });
    });

    await test.step('Acción: Registro de falla crítica', async () => {
      await page.getByPlaceholder(/Título corto del error/i).fill('Error 500 en Checkout');
      await page.selectOption('select', 'critica');
      await page.getByPlaceholder(/Pasos para reproducir/i).fill('Al intentar pagar con Visa, el sistema devuelve un error 500 persistente.');
      await page.getByRole('button', { name: /Registrar Incidencia/i }).click();
    });

    await test.step('APROBADO: Incidente registrado con éxito (ID: INC-999)', async () => {
      await expect(page.getByText(/Incidente registrado: INC-999/i)).toBeVisible();
    });
  });

});