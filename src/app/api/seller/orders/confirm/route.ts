import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

// Importamos tus servicios de lógica de negocio
import { orderStockService } from "@/services/seller/stock/orderStock.service";
import { stockAlertService } from "@/services/seller/stock/stockAlert.service";

export async function POST(req: NextRequest) {
  try {
    // 1. Validación de Seguridad
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Extracción de datos
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId es requerido" }, { status: 400 });
    }

    // ─── PASO 1: US002-B (Decremento Automático) ───────────────────────────
    // Delegamos al servicio que creaste. Este ya se encarga de hablar con el 
    // repositorio y realizar los cambios en la base de datos MySQL.
    const reductionResult = await orderStockService.processStockReduction(orderId);

    // ─── PASO 2: US002-C (Evaluación de Alertas) ────────────────────────────
    // Obtenemos los productos de la orden para revisar sus niveles de stock.
    // Usamos los nombres de tabla de tu esquema de Prisma (order_items).
    const items = await prisma.orderItem.findMany({
      where: { order_id: orderId },
      select: { product_id: true }
    });

    // Ejecutamos las alertas en paralelo. Usamos Promise.allSettled para que 
    // si una alerta falla, no interrumpa la respuesta exitosa al cliente.
    // No usamos 'await' aquí si queremos que la respuesta sea instantánea (background task).
    Promise.allSettled(
      items.map(item => stockAlertService.evaluateProductStock(item.product_id))
    ).catch(err => console.error("Error procesando alertas en segundo plano:", err));

    // 3. Respuesta Exitosa
    return NextResponse.json({
      success: true,
      message: "Compra procesada, inventario actualizado y alertas verificadas.",
      data: reductionResult
    }, { status: 200 });

  } catch (error: any) {
    // Manejo de errores centralizado
    console.error("[API Confirm Error]:", error.message);
    return NextResponse.json(
      { error: error.message || "Error al procesar la confirmación de orden" }, 
      { status: 500 }
    );
  }
}