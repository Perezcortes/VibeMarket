/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Lógistica / Reparto
 * Historia de Usuario: US016-D: Como repartidor, quiero gestionar 
 * mis rutas diarias para optimizar tiempo.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): Jose Perez Cortes
 * FECHA: 8 de Abril de 2026
 */
import { NextResponse } from "next/server";
import { RutasOptimizadasService } from "@/services/courier/routes/rutasOptimizadas.service";

const rutasService = new RutasOptimizadasService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courierId = searchParams.get("courierId");

  if (!courierId) {
    return NextResponse.json({ error: "Falta el ID del repartidor" }, { status: 400 });
  }

  try {
    // Llamamos al método que creaste
    const result = await rutasService.getPendingOrdersWithAddress(courierId);
    
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}