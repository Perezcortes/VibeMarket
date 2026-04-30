/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Pruebas E2E — Gestión de Inventario
 * Historia de Usuario: US002-C: Creación de alerta de stock bajo
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 *
 * TIPO DE PRUEBA: Caja Negra / E2E (Playwright)
 * RUTA: e2e/presentation/seller/stock/AlertStock.spec.ts
 */

import { test, expect, type Page } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: ir al catálogo y esperar que cargue
//
// CRÍTICO: llamar después de CADA page.reload().
// El reload resetea el estado de React a view='overview'. Si no volvemos a
// navegar al catálogo, el componente no está montado y waitForSelector
// espera un spinner que nunca aparece → timeout de 30s en todos los tests.
// ─────────────────────────────────────────────────────────────────────────────
async function goToCatalog(page: Page) {
  await page.getByRole("button", { name: /Catálogo & Stock/i }).click();
  // El spinner puede no aparecer si los datos cargan muy rápido → catch seguro
  await page.waitForSelector("text=Cargando inventario...", {
    state: "hidden",
    timeout: 10000,
  }).catch(() => {});
  await expect(
    page.getByRole("heading", { name: "Inventario & Catálogo" })
  ).toBeVisible({ timeout: 10000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: forzar stock vía API usando page.request (comparte sesión con page)
// ─────────────────────────────────────────────────────────────────────────────
async function setStock(page: Page, productId: string, stock: number) {
  const res = await page.request.put("/api/seller/products", {
    data: { id: productId, stock },
  });
  expect(res.ok()).toBeTruthy();
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP: login + catálogo antes de cada test
// ─────────────────────────────────────────────────────────────────────────────
test.beforeEach(async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator('input[name="email"]').fill("vendedor@vibemarket1.com");
  await page.locator('input[type="password"]').fill("password123");
  await page.getByRole("button", { name: /entrar|iniciar/i }).click();
  await expect(
    page.getByRole("heading", { name: /Panel de Control/i })
  ).toBeVisible({ timeout: 15000 });
  await goToCatalog(page);
});

// ══════════════════════════════════════════════════════════════════════════════
test.describe("US002-C | Alerta de stock bajo", () => {

  /**
   * CP-001 — ENTRADA: stock = 0 | ESPERADO: badge "Agotado"
   */
  test("CP-001 — debe mostrar badge 'Agotado' cuando el stock es 0", async ({ page }) => {
    const { products } = await page.request.get("/api/seller/products").then(r => r.json());
    const { id, name } = products[0];

    await setStock(page, id, 0);
    await page.reload();
    await goToCatalog(page); // ← necesario tras cada reload

    const row = page.locator(`tr:has-text("${name}")`);
    await expect(row.locator("text=Agotado")).toBeVisible();
  });

  /**
   * CP-002 — ENTRADA: stock = 3 (≤ 5) | ESPERADO: badge "Stock bajo"
   */
  test("CP-002 — debe mostrar badge 'Stock bajo' cuando el stock es menor o igual a 5", async ({ page }) => {
    const { products } = await page.request.get("/api/seller/products").then(r => r.json());
    const { id, name } = products[0];

    await setStock(page, id, 3);
    await page.reload();
    await goToCatalog(page);

    const row = page.locator(`tr:has-text("${name}")`);
    await expect(row.locator("text=Stock bajo")).toBeVisible();
  });

  /**
   * CP-003 — ENTRADA: stock = 6 (> 5) | ESPERADO: sin badge
   */
  test("CP-003 — no debe mostrar alerta cuando el stock es mayor a 5", async ({ page }) => {
    const { products } = await page.request.get("/api/seller/products").then(r => r.json());
    const { id, name } = products[0];

    await setStock(page, id, 6);
    await page.reload();
    await goToCatalog(page);

    const row = page.locator(`tr:has-text("${name}")`);
    await expect(row.locator("text=Stock bajo")).not.toBeVisible();
    await expect(row.locator("text=Agotado")).not.toBeVisible();
  });

  /**
   * CP-004 — ENTRADA: al menos un producto con stock crítico | ESPERADO: contador visible
   */
  test("CP-004 — debe mostrar el contador de alertas en el header del catálogo", async ({ page }) => {
    const { products } = await page.request.get("/api/seller/products").then(r => r.json());

    await setStock(page, products[0].id, 2);
    await page.reload();
    await goToCatalog(page);

    await expect(page.locator("text=/producto\\(s\\) con stock bajo/")).toBeVisible();
  });

  /**
   * CP-005 — ENTRADA: todos con stock > 5 | ESPERADO: contador NO visible
   */
  test("CP-005 — no debe mostrar el contador si todos los productos tienen stock normal", async ({ page }) => {
    const { products } = await page.request.get("/api/seller/products").then(r => r.json());

    await Promise.all(products.map((p: { id: string; }) => setStock(page, p.id, 10)));
    await page.reload();
    await goToCatalog(page);

    await expect(page.locator("text=/producto\\(s\\) con stock bajo/")).not.toBeVisible();
  });


});
