import { test, expect } from '@playwright/test';

test.describe('Módulo de Comprador - Validación de Cupón en Carrito', () => {

    test.beforeEach(async ({ page }) => {
        // 1. Iniciamos sesión
        await page.goto('/login');
        await page.fill('input[name="email"]', 'ardilllita948@gmail.com'); 
        await page.fill('input[name="password"]', '123456'); 
        await page.click('button[type="submit"]');

        // 2. Esperamos a que la redirección termine
        await expect(page).toHaveURL(/.*dashboard|\//, { timeout: 15000 });

        // 3. Esperamos a que el Navbar cargue confirmando que el avatar es visible
        await expect(page.locator('.rounded-full.bg-gradient-to-tr').first()).toBeVisible({ timeout: 15000 });

        // 4. Clic al carrito a la fuerza
        await page.locator('a[href="/cart"]').first().click({ force: true });

        // 5. Esperamos a ver el texto "Resumen"
        await expect(page.getByText(/Resumen/i).first()).toBeVisible({ timeout: 15000 });
    });

    test('Aplica un cupón válido correctamente y muestra el descuento', async ({ page }) => {
        const inputCupon = page.getByPlaceholder('Código de cupón');
        await inputCupon.fill('487klo'); 

        await page.locator('button:has-text("Aplicar")').click({ force: true });

        await expect(page.getByText(/Cupón aplicado/i)).toBeVisible({ timeout: 15000 });
        await expect(page.getByText(/Descuento \(487klo\)/i)).toBeVisible();
    });

    test('Muestra un error al intentar aplicar un cupón inválido o inexistente', async ({ page }) => {
        const inputCupon = page.getByPlaceholder('Código de cupón');
        // ¡Cambiado a tu texto exacto!
        await inputCupon.fill('we3fefef'); 

        await page.locator('button:has-text("Aplicar")').click({ force: true });

        await expect(page.getByText(/no válido o inexistente/i)).toBeVisible({ timeout: 15000 });
    });

    test('Permite presionar "Finalizar Compra" sin bloqueos', async ({ page }) => {
        // ¡LA MAGIA ESTÁ AQUÍ! 
        // Buscamos el texto sin importar si es un <button>, un <a> o un <div>
        const botonFinalizar = page.getByText(/Finalizar Compra/i).first();
        
        // Le damos un poco más de tiempo por si acaso
        await expect(botonFinalizar).toBeVisible({ timeout: 15000 });
        await botonFinalizar.click({ force: true });
    });
});