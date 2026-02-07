import { test, expect } from '@playwright/test';

test.describe('Historia: Gestión de Usuarios (Admin)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    // USA CREDENCIALES REALES EN TU DB 
    await page.locator('input[name="email"]').fill('admin@vibemarket.com'); 
    await page.locator('input[name="password"]').fill('123456'); 
    
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
    
    // Esperar a entrar. Si tu admin va a /dashboard, ajusta esto:
    await expect(page).toHaveURL(/\/dashboard/); 
  });

  test('CN-04: Admin puede ver la lista de usuarios', async ({ page }) => {
    // Navegar a usuarios (Ajusta el texto según tu Sidebar real)
    // Por ahora intentamos buscar el texto "Usuarios"
    await page.getByText('Usuarios').first().click();
    
    // Verificar tabla
    await expect(page.getByRole('table')).toBeVisible();
    
    // Verificar que se ve el admin
    await expect(page.getByText('admin@vibemarket.com')).toBeVisible();
  });

  test('CN-05: Admin puede abrir modal de creación', async ({ page }) => {
    await page.getByText('Usuarios').first().click();
    
    // Busca el botón por texto parcial "Nuevo" o "Crear"
    await page.getByRole('button', { name: /nuevo|crear/i }).click();
    
    // Verificar modal
    await expect(page.getByRole('heading', { name: 'Crear Usuario' })).toBeVisible();  });
});