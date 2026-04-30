/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Pruebas E2E — Gestión de Cupones
 * Historia de Usuario:
 *   US004-A: Configuración de vigencia de cupones
 *   US004-B: Reglas de descuento
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 *
 * TIPO DE PRUEBA: Caja Negra / E2E (Playwright)
 * RUTA: e2e/presentation/seller/coupons/couponCreate.spec.ts
 */

import { test, expect, type Page } from "@playwright/test";

// ─── Helpers de fecha ─────────────────────────────────────────────────────
const FUTURE_DATE = () => {
  const d = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  return d.toISOString().slice(0, 16);
};

const PAST_DATE = () => {
  const d = new Date(Date.now() - 1000 * 60 * 60 * 24);
  return d.toISOString().slice(0, 16);
};

// ─── Helper: navegar a Descuentos desde el dashboard ─────────────────────
async function goToDiscounts(page: Page) {
  await page.getByRole("button", { name: /Descuentos/i }).click();
  await expect(page.locator("text=Nuevo Cupón")).toBeVisible({ timeout: 10000 });
}

// ─── Setup: login antes de cada test ─────────────────────────────────────
test.beforeEach(async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  const emailInput = page.locator('input[name="email"]');
  await emailInput.waitFor({ state: "visible" });
  await emailInput.fill("vendedor@vibemarket1.com");
  await page.locator('input[type="password"]').fill("password123");
  await page.getByRole("button", { name: /entrar|iniciar/i }).click();
  await expect(
    page.getByRole("heading", { name: /Panel de Control/i })
  ).toBeVisible({ timeout: 15000 });
  await goToDiscounts(page);
});

// ══════════════════════════════════════════════════════════════════════════════
test.describe("US004-A + US004-B | Creación de cupones", () => {

  test.describe("US004-B — Reglas de descuento", () => {

    /**
     * CP-001
     * ENTRADA:  Formulario enviado sin código
     * ESPERADO: El formulario no avanza (sigue visible el botón "Crear Cupón")
     */
    test("CP-001 — debe requerir el campo código", async ({ page }) => {
      await page.selectOption("select", "porcentaje");
      await page.fill("input[type='number']", "10");
      await page.click("button:has-text('Crear Cupón')");
      // El formulario no debe desaparecer ni crear el cupón
      await expect(page.locator("text=Nuevo Cupón")).toBeVisible();
    });

    /**
     * CP-002
     * ENTRADA:  Tipo = Porcentaje, Valor = 101
     * ESPERADO: El cupón NO se crea (la UI muestra el hint "máx. 100%" como límite)
     */
    test("CP-002 — debe bloquear la creación si el porcentaje supera 100", async ({ page }) => {
      const code = `OVER100-${Date.now()}`;
      await page.fill("input[placeholder='Ej: VERANO20']", code);
      await page.selectOption("select", "porcentaje");
      await page.fill("input[type='number']", "101");
      await page.click("button:has-text('Crear Cupón')");
      // El cupón no debe aparecer en la tabla
      await expect(page.locator(`text=${code}`)).not.toBeVisible({ timeout: 3000 });
    });

    /**
     * CP-003
     * ENTRADA:  Tipo = Porcentaje, Valor = 0
     * ESPERADO: El cupón NO se crea (valor inválido)
     */
    test("CP-003 — debe bloquear el envío si el valor es 0", async ({ page }) => {
      const code = `ZERO-${Date.now()}`;
      await page.fill("input[placeholder='Ej: VERANO20']", code);
      await page.selectOption("select", "porcentaje");
      await page.fill("input[type='number']", "0");
      await page.click("button:has-text('Crear Cupón')");
      // El cupón no debe aparecer en la tabla
      await expect(page.locator(`text=${code}`)).not.toBeVisible({ timeout: 3000 });
    });

    /**
     * CP-004
     * ENTRADA:  Tipo = Porcentaje, Valor = 100 (límite exacto)
     * ESPERADO: El cupón se crea y aparece en la tabla
     */
    test("CP-004 — debe crear cupón con porcentaje igual a 100", async ({ page }) => {
      const code = `FULL100-${Date.now()}`;
      await page.fill("input[placeholder='Ej: VERANO20']", code);
      await page.selectOption("select", "porcentaje");
      await page.fill("input[type='number']", "100");
      await page.click("button:has-text('Crear Cupón')");
      await expect(page.locator(`text=${code}`)).toBeVisible({ timeout: 10000 });
    });

    /**
     * CP-005
     * ENTRADA:  Tipo = Monto fijo, Valor = 999
     * ESPERADO: El cupón se crea sin error
     */
    test("CP-005 — debe crear cupón de monto fijo sin límite superior", async ({ page }) => {
      const code = `FIXED999-${Date.now()}`;
      await page.fill("input[placeholder='Ej: VERANO20']", code);
      await page.selectOption("select", "monto_fijo");
      await page.fill("input[type='number']", "999");
      await page.click("button:has-text('Crear Cupón')");
      await expect(page.locator(`text=${code}`)).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("US004-A — Configuración de vigencia", () => {

    /**
     * CP-006
     * ENTRADA:  expires_at = fecha pasada
     * ESPERADO: El cupón NO se crea (fecha inválida)
     */
    test("CP-006 — debe bloquear la creación si la fecha de expiración es pasada", async ({ page }) => {
      const code = `PASADO-${Date.now()}`;
      await page.fill("input[placeholder='Ej: VERANO20']", code);
      await page.selectOption("select", "porcentaje");
      await page.fill("input[type='number']", "10");
      await page.fill("input[type='datetime-local']", PAST_DATE());
      await page.click("button:has-text('Crear Cupón')");
      // El cupón no debe aparecer en la tabla
      await expect(page.locator(`text=${code}`)).not.toBeVisible({ timeout: 3000 });
    });

    /**
     * CP-007
     * ENTRADA:  expires_at = fecha futura válida
     * ESPERADO: El cupón se crea y aparece en la tabla
     */
    test("CP-007 — debe crear cupón con fecha de expiración futura", async ({ page }) => {
      const code = `FUTURO-${Date.now()}`;
      await page.fill("input[placeholder='Ej: VERANO20']", code);
      await page.selectOption("select", "porcentaje");
      await page.fill("input[type='number']", "15");
      await page.fill("input[type='datetime-local']", FUTURE_DATE());
      await page.click("button:has-text('Crear Cupón')");
      const row = page.locator(`tr:has-text("${code}")`);
      await expect(row).toBeVisible({ timeout: 10000 });
    });

    /**
     * CP-008
     * ENTRADA:  Sin fecha de expiración
     * ESPERADO: La tabla muestra "Sin vencimiento"
     */
    test("CP-008 — debe mostrar 'Sin vencimiento' si no se proporciona fecha", async ({ page }) => {
      const code = `SINVENCE-${Date.now()}`;
      await page.fill("input[placeholder='Ej: VERANO20']", code);
      await page.selectOption("select", "monto_fijo");
      await page.fill("input[type='number']", "50");
      await page.click("button:has-text('Crear Cupón')");
      const row = page.locator(`tr:has-text("${code}")`);
      await expect(row.locator("text=Sin vencimiento")).toBeVisible({ timeout: 10000 });
    });

    /**
     * CP-009
     * ENTRADA:  Cupón vencido (creado vía API con fecha pasada)
     * ESPERADO: Badge "Inactivo" visible en la tabla
     */
    test("CP-009 — cupón vencido debe mostrarse como Inactivo", async ({ page }) => {
      // Crear cupón vencido vía API usando la sesión activa
      await page.request.post("/api/seller/coupons", {
        data: {
          code: `VENCIDO-${Date.now()}`,
          type: "porcentaje",
          value: 10,
          expires_at: new Date(Date.now() - 1000).toISOString(),
        },
      });

      // Recargar la vista para que aparezca en la tabla
      await page.reload({ waitUntil: "domcontentloaded" });
      await goToDiscounts(page);

      await expect(page.locator("text=Inactivo").first()).toBeVisible({ timeout: 10000 });
    });
  });

});