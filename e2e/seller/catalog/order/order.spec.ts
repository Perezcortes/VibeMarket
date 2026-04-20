import { test, expect } from '@playwright/test';

/**
 * PRUEBA DE CAJA NEGRA (E2E) - Módulo de Pedidos
 * Basado en las Historias de Usuario desarrolladas por Leonides Lopez
 */
test.describe('Módulo de Gestión de Pedidos - Vendedor', () => {

    // 1. CAMBIO: Le damos más tiempo a Playwright para esperar al servidor lento
    test.slow(); 

    test.beforeEach(async ({ page }) => {
        // 2. CAMBIO: Usamos waitUntil: 'networkidle' para asegurar que la página cargó bien
        await page.goto('/login', { waitUntil: 'networkidle' });
        await page.fill('input[name="email"]', 'vendedor@vibe.com');
        await page.fill('input[name="password"]', 'password123');
        
        // Esperamos a que el botón sea cliqueable
        await page.click('button[type="submit"]');
        
        // 3. CAMBIO: Esperar a estar en el dashboard antes de buscar el menú "Pedidos"
        await expect(page).toHaveURL(/.*dashboard/);
        await page.click('text=Pedidos');
    });

    // ─── US003-A: MONITOREO DE PEDIDOS ───────────────────────────────────────
    test('US003-A: El vendedor puede ver su lista de pedidos recibidos', async ({ page }) => {
        // Esperamos a que la tabla aparezca (caja negra: no nos importa el ID, solo que sea una tabla)
        const table = page.locator('table');
        await expect(table).toBeVisible({ timeout: 15000 });
        
        const rowCount = await page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
    });

    // ─── US003-C: DETALLE DEL PEDIDO ─────────────────────────────────────────
    test('US003-C: El vendedor puede abrir y ver el detalle completo de un pedido', async ({ page }) => {
        // 4. CAMBIO: Usar un selector más específico para el botón de la tabla
        await page.locator('button:has-text("Ver detalle")').first().click();

        await expect(page.locator('h2:has-text("Pedido #")')).toBeVisible();
        await expect(page.locator('text=Dirección de Envío')).toBeVisible();
        await expect(page.locator('text=Artículos del Pedido')).toBeVisible();
    });

    // ─── US003-B: ACTUALIZACIÓN DE ESTADO ────────────────────────────────────
    test('US003-B: El vendedor puede cambiar el estado de un pedido exitosamente', async ({ page }) => {
        await page.locator('button:has-text("Ver detalle")').first().click();

        const statusSelect = page.locator('select');
        // Asegúrate de que el valor 'enviado' coincida con el value de tu <option>
        await statusSelect.selectOption('enviado');

        const toast = page.locator('text=Estado actualizado correctamente');
        await expect(toast).toBeVisible();
    });

    // ─── US003-D: NOTIFICACIONES ─────────────────────────────────────────────
    test('US003-D: El vendedor puede enviar una notificación manual al comprador', async ({ page }) => {
        await page.locator('button:has-text("Ver detalle")').first().click();

        const notifyButton = page.locator('button:has-text("Notificar Cliente")');
        await notifyButton.click();

        await expect(page.locator('text=Notificación enviada al cliente')).toBeVisible();
    });

});