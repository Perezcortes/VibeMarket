import { test, expect } from '@playwright/test';

test.describe('US005: Reportes Administrativos', () => {
  
  // ==========================================
  // PRUEBAS DEL SPRINT 5
  // ==========================================

  test('US005-A: Cierre de ventas diario > CA1: Muestra total de ventas', async ({ page }) => {
    // 1. Ir al login e iniciar sesión como Administrador
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // 2. Esperar a que cargue el Dashboard y buscar la tarjeta de Ventas
    await expect(page.locator('text=Ventas del Día')).toBeVisible({ timeout: 10000 });
  });

  test('US005-B: Ranking de ventas > CA1: Tabla de categorías carga correctamente', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // Buscar el título de la tabla
    await expect(page.locator('text=Top Categorías Más Vendidas')).toBeVisible({ timeout: 10000 });
  });

  test('US005-D: Análisis de descuentos > CA1: Muestra tarjeta de artículos en oferta', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // Buscar la tarjeta de Descuentos
    await expect(page.locator('text=Artículos con Descuento')).toBeVisible({ timeout: 10000 });
  });

  // ==========================================
  // NUEVAS PRUEBAS DEL SPRINT 6
  // ==========================================

  test('Exportación de reportes semanales > CA1: El botón descarga el archivo CSV', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    
    // Esperar al dashboard, hacer clic en exportar y atrapar la descarga
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await page.click('text=Exportar Reporte');
    const download = await downloadPromise;
    
    // Validar que el archivo sugerido sea un .csv
    expect(download.suggestedFilename()).toContain('.csv');
  });

  test('Cálculo de ROI mensual > CA1: La gráfica de rentabilidad es visible', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sadmin@vibemarket.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    // Verificar que el título de la gráfica exista
    await expect(page.locator('text=Evolución de Rentabilidad (ROI)')).toBeVisible({ timeout: 10000 });
    
    // Verificar que el eje X de la gráfica se haya renderizado
    await expect(page.locator('text=Semana 1').first()).toBeVisible(); 
  });

});