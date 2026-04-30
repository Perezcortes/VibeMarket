import { test, expect } from '@playwright/test';
import path from 'path';

// 📸 MAGIA PARA PLAYWRIGHT: Va a nivel de archivo (¡Afuera del describe!)
// Forzamos el uso de una cámara falsa para evitar colapsos en paralelo
test.use({
    launchOptions: {
        args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream'
        ]
    }
});

/**
 * PRUEBA DE CAJA NEGRA (E2E) - Módulo de Repartidor (Courier)
 * US-016F: Registro de Evidencia Fotográfica
 * Responsable: Ariadna Betsabe Espina Ramirez
 */
test.describe('Módulo de Evidencia Fotográfica - Repartidor', () => {

    test.slow();

    test.beforeEach(async ({ page, context }) => {
        
        await context.grantPermissions(['camera']);

        await page.goto('/login', { waitUntil: 'networkidle' });
        await page.fill('input[name="email"]', 'pluplus@gmail.com');
        await page.fill('input[name="password"]', '123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
        
        // Listener global de alertas
        page.on('dialog', async dialog => {
            console.log('Alerta detectada:', dialog.message());
            await dialog.accept(); 
        });

        const botonDetalle = page.locator('button:has-text("Confirmar Entrega")').first();
        await botonDetalle.waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000); 

        await botonDetalle.click({ force: true });

        // Ahora esto nunca va a fallar porque la cámara falsa ya está inyectada
        await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 15000 });
    });

    // ☑️ Test 1 
    test('La estructura del dashboard muestra las opciones de subir evidencia', async ({ page }) => {
        const inputFile = page.locator('input[type="file"]');
        await expect(inputFile).toBeAttached(); 
        
        await expect(page.locator('button:has-text("Capturar Foto")')).toBeVisible();
        await expect(page.locator('text=Seleccionar de la Galería')).toBeVisible();
    });

    // ☑️ Test 2 
    test('Permite al repartidor seleccionar una imagen de la galería', async ({ page }) => {
        const imagePath = path.join(__dirname, 'dummy.jpg');
        await page.setInputFiles('input[type="file"]', imagePath);

        const preview = page.locator('img');
        await expect(preview).toBeVisible();
        await expect(page.locator('button:has-text("Subir")')).toBeVisible();
    });

    // ☑️ Test 3
    test('Permite retomar o borrar la foto antes de enviarla', async ({ page }) => {
        const imagePath = path.join(__dirname, 'dummy.jpg');
        await page.setInputFiles('input[type="file"]', imagePath);

        await page.click('button:has-text("Retomar")');

        const input = page.locator('input[type="file"]');
        await expect(input).toHaveValue('');
    });
    
    // ☑️ Test 4
    test('Sube la evidencia y verifica que se consuma el endpoint de la API con éxito', async ({ page }) => {
        const imagePath = path.join(__dirname, 'dummy.jpg');
        
        const responsePromise = page.waitForResponse(response => 
            response.url().includes('/api/courier/evidency') && response.request().method() === 'POST'
        );

        await page.setInputFiles('input[type="file"]', imagePath);
        await page.click('button:has-text("Subir")');

        const response = await responsePromise;
        expect(response.status()).toBe(200);

        await expect(page.locator('text=Documentar Entrega')).toBeHidden();
    });

    // ☑️ Test 5
    test('Maneja correctamente un error interno de la Base de Datos (Error 500)', async ({ page }) => {
        const imagePath = path.join(__dirname, 'dummy.jpg');

        await page.route('**/api/courier/evidency', route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Error interno del servidor al actualizar el estatus' })
            });
        });

        await page.setInputFiles('input[type="file"]', imagePath);
        
        const dialogPromise = page.waitForEvent('dialog');
        await page.click('button:has-text("Subir")');

        const dialog = await dialogPromise;
        
        expect(dialog.message()).toContain('Error'); 
    });
});