/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Lógistica / Reparto
 * Historia de Usuario: US016-C: Como repartidor, quiero liquidar
 *  pedidos entregados para cerrar mi turno.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): José Peréz Cortes
 * FECHA: 10 de Abril de 2026
 */
import { NextResponse } from "next/server";
import { LiquidarRepartoService } from "@/services/courier/shift/liquidarReparto.service";

// Instanciamos el servicio
const liquidarService = new LiquidarRepartoService();

// 1. OBTENER pedidos a liquidar (GET)
export async function GET(request: Request) {
  // Sacamos el courierId de la URL (ej. /api/.../liquidate?courierId=123)
  const { searchParams } = new URL(request.url);
  const courierId = searchParams.get("courierId");

  if (!courierId) {
    return NextResponse.json({ error: "Falta el ID del repartidor" }, { status: 400 });
  }

  try {
    const result = await liquidarService.getOrdersToLiquidate(courierId);
    
    // Si tu servicio devolvió success: false, mandamos un 400, si no, un 200 OK
    const status = result.success ? 200 : 400; 
    return NextResponse.json(result, { status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. MARCAR pedido como entregado (PATCH)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Falta el ID del pedido" }, { status: 400 });
    }

    const result = await liquidarService.markOrderAsDelivered(orderId);
    
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}