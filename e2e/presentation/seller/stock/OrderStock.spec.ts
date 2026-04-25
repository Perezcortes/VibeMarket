/**
 * SISTEMA VIBEMARKET - PRUEBAS DE INVENTARIO
 * Sincronizado con CatalogManager.tsx, SellerDashboard.tsx y seed.ts
 */

import { test, expect } from "@playwright/test";

// ─── Helper: navegar al catálogo y esperar que cargue ──────────────────────
async function goToCatalog(page: any) {
  await page.getByRole("button", { name: /Catálogo & Stock/i }).click();
  await page.waitForSelector("text=Cargando inventario...", {
    state: "hidden",
    timeout: 15000,
  });
  await expect(
    page.getByRole("heading", { name: "Inventario & Catálogo" })
  ).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });

  // FIX: esperar que React hidrate el input antes de escribir.
  // Con domcontentloaded el HTML existe pero los event handlers de React
  // aún no están conectados → fill() se pierde y el login falla.
  const emailInput = page.locator('input[name="email"]');
  await emailInput.waitFor({ state: "visible" });   // ← garantiza hidratación

  await emailInput.fill("vendedor@vibemarket1.com");
  await page.locator('input[type="password"]').fill("password123");
  await page.getByRole("button", { name: /entrar|iniciar/i }).click();

  await expect(
    page.getByRole("heading", { name: /Panel de Control/i })
  ).toBeVisible({ timeout: 15000 });

  await goToCatalog(page);
});

test.describe("US002-B | Decremento automático de stock", () => {

  test("CP-001 — el stock debe decrementar tras confirmar una compra", async ({ page }) => {
    // 1. Producto con stock > 0
    const productsRes = await page.request.get("/api/seller/products");
    const productsData = await productsRes.json();
    const products = productsData.products || (Array.isArray(productsData) ? productsData : []);
    if (products.length === 0) throw new Error("No hay productos vinculados a este vendedor.");

    const product = products.find((p: any) => p.stock > 0) || products[0];
    const stockInicial = product.stock;

    // 2. Obtener cualquier orden disponible
    //    NOTA: La API mapea el status a texto formateado (ej: "Pendiente (Preparando)")
    //    por lo que NO se puede filtrar por valor exacto del enum.
    //    Se toma la primera orden disponible y se intenta confirmar.
    const ordersRes = await page.request.get("/api/seller/orders");
    const ordersData = await ordersRes.json();
    const orders: any[] = ordersData.orders || ordersData.data || (Array.isArray(ordersData) ? ordersData : []);

    // Log de diagnóstico para ver la estructura real que devuelve la API
    console.log("Total órdenes:", orders.length);
    if (orders.length > 0) {
      console.log("Ejemplo de orden (campos):", JSON.stringify(orders[0], null, 2));
    }

    if (orders.length === 0) {
      test.skip(true, "No hay órdenes en la base de datos. Ejecuta el seed para generarlas.");
      return;
    }

    // Priorizar órdenes cuyo status (en cualquier formato) sugiera "pendiente"
    const orderToConfirm =
      orders.find((o: any) =>
        String(o.status ?? o.estado ?? "")
          .toLowerCase()
          .includes("pend")
      ) ?? orders[0]; // fallback: primera orden disponible

    console.log("Orden a confirmar:", orderToConfirm.id, "| status:", orderToConfirm.status);

    // 3. Confirmar orden
    const confirm = await page.request.post("/api/seller/orders/confirm", {
      data: { orderId: orderToConfirm.id },
    });
    expect(confirm.ok()).toBeTruthy();

    // 4. Recargar y volver al catálogo
    await page.reload();
    await goToCatalog(page);

    // 5. Verificar que el stock del producto bajó
    const stockCell = page.locator(
      `tr:has-text("${product.name}") span.w-8.text-center`
    );
    await expect(stockCell).not.toHaveText(stockInicial.toString(), {
      timeout: 10000,
    });

    const stockFinal = parseInt((await stockCell.innerText()) || "0");
    expect(stockFinal).toBeLessThan(stockInicial);
  });

  test("CP-004 — el botón menos debe decrementar el stock visualmente", async ({ page }) => {
    const firstRow = page.locator("tbody tr").first();
    const stockSpan = firstRow.locator("span.w-8.text-center");

    const stockAntes = parseInt((await stockSpan.innerText()) || "0");

    if (stockAntes > 0) {
      await firstRow.locator('button:has-text("-")').click();
      await expect(stockSpan).toHaveText((stockAntes - 1).toString());
    }
  });

  test("CP-005 — el stock no debe bajar de cero", async ({ page }) => {
    const res = await page.request.get("/api/seller/products");
    const data = await res.json();
    const products = data.products || [];
    const productId = products[0].id;

    await page.request.put("/api/seller/products", {
      data: { id: productId, stock: 0 },
    });

    await page.reload();
    await goToCatalog(page);

    const firstRow = page.locator("tbody tr").first();
    const stockSpan = firstRow.locator("span.w-8.text-center");

    await firstRow.locator('button:has-text("-")').click();
    await expect(stockSpan).toHaveText("0");
  });

  test("CP-003 — debe retornar 400 si no se envía orderId", async ({ page }) => {
    const res = await page.request.post("/api/seller/orders/confirm", {
      data: {},
    });
    expect(res.status()).toBe(400);
  });
});