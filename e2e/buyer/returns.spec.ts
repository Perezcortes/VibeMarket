import { test, expect } from '@playwright/test';

test.describe('Flujo de Devoluciones (US013-A)', () => {

    test.beforeEach(async ({ page }) => {
        // 1. Ir al login
        await page.goto('/login');

        // 2. Autenticación
        await page.fill('input[type="email"]', 'marin@ejemplo.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button:has-text("Iniciar Sesión")');

        // 3. MEJORA: En lugar de esperar la URL, esperamos a que el estado 
        // de "Logueado" sea visible (según tu snapshot: "Hola, Marin M")
        await expect(page.getByRole('button', { name: /Hola, Marin/i })).toBeVisible();

        // 4. Navegación directa a la página de la historia de usuario
        await page.goto('/dashboard/buyer/returns');
    });

    test('CP-01: Debe mostrar error si se intenta enviar sin seleccionar motivo', async ({ page }) => {
        // El resto del test se mantiene igual
        await page.click('text=Orden: ord-101');
        await page.click('button:has-text("Confirmar Devolución")');

        const errorMessage = page.locator('text=Debes seleccionar un motivo');
        await expect(errorMessage).toBeVisible();
    });

    test('CP-02: Debe completar el proceso de devolución exitosamente', async ({ page }) => {
        // 1. MOCK: Interceptamos la llamada a la API para que siempre responda OK
        // Esto hace que el test sea independiente de si la DB tiene la orden o no.
        await page.route('**/api/returns', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            });
        });

        // 2. Seleccionar la orden
        await page.click('text=Orden: ord-101');

        // 3. Llenar el formulario
        await page.selectOption('select', 'defective');
        await page.fill('textarea', 'El producto llegó con el empaque abierto.');

        // 4. Enviar solicitud
        await page.click('button:has-text("Confirmar Devolución")');

        // 5. MEJORA: Esperamos específicamente el encabezado de éxito
        // Usamos un timeout mayor o simplemente un locator más preciso
        const successHeading = page.getByRole('heading', { name: '¡Solicitud Enviada!' });
        await expect(successHeading).toBeVisible({ timeout: 10000 });
    });
});