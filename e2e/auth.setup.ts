import { test as setup, expect } from '@playwright/test';

// Ruta donde se guardará la sesión para no repetirla
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // 1. Ir a la página de login
  await page.goto('/login');

  // 2. Llenar el formulario usando tus credenciales reales
  await page.fill('input[name="email"]', 'Yamil@gmail.com');
  await page.fill('input[name="password"]', 'unodos34');
  
  // 3. Hacer clic en el botón de Iniciar Sesión
  await page.click('button[type="submit"]');

  // 4. Esperar a que redirija al dashboard (según tu código router.push("/dashboard"))
  // Aumentamos el timeout por si el servidor de NextAuth tarda en responder
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

  // 5. Guardar el estado de autenticación (Cookies y LocalStorage)
  await page.context().storageState({ path: authFile });
});