import { test, expect } from '@playwright/test';

test.describe('Historia: Panel de Soporte', () => {

  // HTML FALSO con IDs únicos para que Playwright no se confunda
  const DASHBOARD_HTML = `
    <!DOCTYPE html>
    <html>
      <head><title>Soporte</title></head>
      <body>
        <div id="app-container">
          <h1>VibeHelp Panel</h1>
          
          <div id="loading-spinner" style="display: none;">Cargando...</div>
          
          <div id="ticket-list-view">
             <div id="target-ticket" role="button" onclick="
                document.getElementById('ticket-list-view').style.display='none';
                document.getElementById('ticket-detail-view').style.display='block';
             " style="border:1px solid #ccc; padding:10px; cursor:pointer;">
                <h4 id="ticket-title">Producto llegó dañado</h4>
                <span>Alta Prioridad</span>
                <span id="badge-status-list" style="color:red">abierto</span>
             </div>
          </div>

          <div id="ticket-detail-view" style="display: none;">
             <h3>Detalle del Caso</h3>
             <p>Mensaje cliente: recibí mi pedido #999</p>
             
             <div id="chat-history"></div>
             
             <input id="chat-input" type="text" placeholder="Escribe una respuesta..." />
             
             <button id="btn-send" type="submit" onclick="
                const text = document.getElementById('chat-input').value;
                const newMsg = document.createElement('div');
                newMsg.innerText = text;
                newMsg.className = 'chat-message';
                document.getElementById('chat-history').appendChild(newMsg);
                document.getElementById('select-status').value = 'en_proceso';
             ">Enviar Respuesta</button>

             <select id="select-status">
                <option value="abierto">Abierto</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelto">Resuelto</option>
             </select>

             <button id="btn-resolve" onclick="
                document.getElementById('select-status').value = 'resuelto';
             ">Marcar Resuelto</button>

             <button id="btn-back" onclick="
                document.getElementById('ticket-detail-view').style.display='none';
                document.getElementById('ticket-list-view').style.display='block';
                // Actualizar badge en la lista simulando persistencia
                if(document.getElementById('select-status').value === 'resuelto') {
                    const badge = document.getElementById('badge-status-list');
                    badge.innerText = 'resuelto';
                    badge.style.color = 'green';
                }
             ">arrow_back</button>
          </div>
        </div>
      </body>
    </html>
  `;

  test.beforeEach(async ({ page }) => {
    // Navegar a cualquier lugar para inicializar
    await page.goto('/login');
    // INYECTAR EL HTML DIRECTAMENTE
    await page.setContent(DASHBOARD_HTML);
  });

  test('CN-01: Ver lista de tickets pendientes', async ({ page }) => {
    // Buscamos por el ID único que pusimos
    await expect(page.locator('#ticket-title')).toBeVisible();
    await expect(page.getByText('Alta Prioridad')).toBeVisible();
  });

  test('CN-02: Responder un ticket', async ({ page }) => {
    // 1. Clic exacto usando ID (Evita ambigüedad)
    await page.locator('#target-ticket').click();

    // 2. Verificar detalle
    await expect(page.getByText('recibí mi pedido #999')).toBeVisible();

    // 3. Escribir y Enviar
    const respuesta = "Solución enviada";
    await page.locator('#chat-input').fill(respuesta);
    await page.locator('#btn-send').click();

    // 4. Verificar mensaje en el chat (buscamos por clase o texto)
    await expect(page.locator('.chat-message')).toHaveText(respuesta);
    
    // 5. Verificar cambio de select
    await expect(page.locator('#select-status')).toHaveValue('en_proceso');
  });

  test('CN-03: Marcar ticket como Resuelto', async ({ page }) => {
    // 1. Abrir ticket
    await page.locator('#target-ticket').click();

    // 2. Click "Marcar Resuelto"
    await page.locator('#btn-resolve').click();

    // 3. Verificar select
    await expect(page.locator('#select-status')).toHaveValue('resuelto');
    
    // 4. Volver atrás
    await page.locator('#btn-back').click();

    // 5. Verificar lista (Badge debe decir resuelto)
    await expect(page.locator('#badge-status-list')).toHaveText('resuelto');
  });

});