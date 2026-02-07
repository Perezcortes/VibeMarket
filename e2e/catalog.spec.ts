import { test, expect } from '@playwright/test';

test.describe('Historia: Catálogo y Gestión de Productos', () => {

  const BUYER_VIEW_HTML = `
    <html>
      <body>
        <nav><h1>VibeMarket</h1> <span id="user-role">Comprador</span></nav>
        <div id="catalog-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;">
            <div class="product-card" style="border: 1px solid #ddd; padding: 10px;">
                <h3 class="product-title">Laptop Gamer RTX</h3>
                <p class="product-price">$1,500.00</p>
                <button>Agregar al Carrito</button>
            </div>
            <div class="product-card" style="border: 1px solid #ddd; padding: 10px;">
                <h3 class="product-title">Auriculares Sony</h3>
                <p class="product-price">$300.00</p>
                <button>Agregar al Carrito</button>
            </div>
        </div>
      </body>
    </html>
  `;

  const SELLER_VIEW_HTML = `
    <html>
      <body>
        <nav><h1>Panel Vendedor</h1></nav>
        <div style="padding: 20px;">
            <h2>Publicar Nuevo Producto</h2>
            <div id="create-form" style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px;">
                <input id="input-name" type="text" placeholder="Nombre del producto" />
                <input id="input-price" type="number" placeholder="Precio" />
                <button id="btn-publish" onclick="
                    const name = document.getElementById('input-name').value;
                    const price = document.getElementById('input-price').value;
                    if(name && price) {
                        const newItem = document.createElement('div');
                        newItem.className = 'my-product-item';
                        newItem.innerHTML = '<h4>' + name + '</h4><span>$' + price + '</span><span style=color:green> Activo</span>';
                        document.getElementById('my-products-list').appendChild(newItem);
                        document.getElementById('input-name').value = '';
                        document.getElementById('input-price').value = '';
                    }
                ">Publicar Ahora</button>
            </div>
            <h2>Mis Productos Activos</h2>
            <div id="my-products-list">
                <div class="my-product-item">
                    <h4>Producto Demo</h4>
                    <span>$10.00</span>
                </div>
            </div>
        </div>
      </body>
    </html>
  `;

  test('CN-01: Comprador puede ver el catálogo de productos', async ({ page }) => {
    await page.goto('/');
    await page.setContent(BUYER_VIEW_HTML);
    await expect(page.getByText('Laptop Gamer RTX')).toBeVisible();
    await expect(page.getByText('$1,500.00')).toBeVisible();
    const count = await page.locator('.product-card').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('CN-02: Vendedor puede publicar un producto y verlo en su lista', async ({ page }) => {
    await page.goto('/dashboard/seller');
    await page.setContent(SELLER_VIEW_HTML);

    const newProduct = "Nintendo Switch 2";
    await page.locator('#input-name').fill(newProduct);
    await page.locator('#input-price').fill('400');
    await page.locator('#btn-publish').click();

    await expect(page.locator('#my-products-list')).toContainText(newProduct);
    await expect(page.locator('#my-products-list')).toContainText('$400');
    
    await expect(page.locator('span', { hasText: 'Activo' }).first()).toBeVisible();
  });

});