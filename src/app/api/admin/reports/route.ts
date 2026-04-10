/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Presentación / API - ADMINISTRACIÓN Y SEGURIDAD
 * Historia de Usuario: US005 (A, B, D, E) - Reportes del Dashboard
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 24/03/2026
 */

import { NextResponse } from "next/server";
import { ReportService } from "@/services/admin/reportService";

export async function GET() {
  try {
    // Definimos fechas de prueba (En un caso real vendrían de un selector en el frontend)
    const today = new Date().toISOString().split('T')[0]; 
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Ejecutamos todos los servicios en paralelo para que cargue más rápido (LEAN)
    const [dailySales, categoryRanking, financial] = await Promise.all([
      ReportService.getDailySales(today),
      ReportService.getCategoryRanking(),
      ReportService.getFinancialAnalytics(firstDayOfMonth, today)
    ]);

    // Devolvemos todo empaquetado al frontend
    return NextResponse.json({
      dailySales,
      categoryRanking,
      financial
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Error al cargar los reportes" }, { status: 500 });
  }
}