import { test, expect } from '@playwright/test';

/**
 * PRUEBA DE CAJA NEGRA (E2E) - Módulo de Comprador
 * Descarga de Comprobante de Pago en PDF
 */
test.describe('Módulo de Comprador - Comprobante de Pago', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        
        await page.fill('input[name="email"]', 'ardilllita948@gmail.com'); 
        await page.fill('input[name="password"]', '123456'); 
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*dashboard|\//, { timeout: 15000 });
        await expect(page.locator('.rounded-full.bg-gradient-to-tr').first()).toBeVisible({ timeout: 15000 });
    });

    // ☑️ Prueba 1: Navegación correcta al historial de pagos (¡ESTA YA PASA! 🎉)
    test('Permite al comprador navegar a su historial de pagos desde el menú', async ({ page }) => {
        await page.locator('.rounded-full.bg-gradient-to-tr').first().click();
        await page.locator('a[href="/dashboard?seccion=compras"]').click();

        await expect(page.locator('text="Aquí está el resumen de tus compras."')).toBeVisible({ timeout: 15000 });
    });

    // ☑️ Prueba 2: Apertura del modal
    test('Abre el comprobante oficial al hacer clic en "Ver detalles"', async ({ page }) => {
        await page.locator('.rounded-full.bg-gradient-to-tr').first().click();
        await page.locator('a[href="/dashboard?seccion=compras"]').click();

        // Esperamos el botón y forzamos el clic por si algo lo está tapando
        await page.waitForSelector('button:has-text("Ver detalles")', { timeout: 15000 });
        await page.locator('button:has-text("Ver detalles")').first().click({ force: true });

        // Buscamos la palabra con Regex (ignora mayúsculas/minúsculas y espacios extra)
        await expect(page.getByText(/COMPROBANTE/i).first()).toBeVisible({ timeout: 15000 });
        await expect(page.locator('button:has-text("Descargar Ticket")')).toBeVisible();
    });

    // ☑️ Prueba 3: El reto de la impresión en PDF
    test('Genera la ventana de impresión/descarga del ticket PDF', async ({ page }) => {
        await page.locator('.rounded-full.bg-gradient-to-tr').first().click();
        await page.locator('a[href="/dashboard?seccion=compras"]').click();
        
        await page.waitForSelector('button:has-text("Ver detalles")', { timeout: 15000 });
        await page.locator('button:has-text("Ver detalles")').first().click({ force: true });

        // Magia para simular la ventana de impresión
        await page.evaluate(() => {
            window.print = () => {
                (window as any).impresionExitosa = true;
            };
        });

        // Le metemos force: true también aquí por si las moscas
        await page.locator('button:has-text("Descargar Ticket")').click({ force: true });

        const seEjecutoImpresion = await page.evaluate(() => (window as any).impresionExitosa);
        expect(seEjecutoImpresion).toBe(true);
    });
});