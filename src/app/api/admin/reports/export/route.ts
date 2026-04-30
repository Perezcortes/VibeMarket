/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Presentación / API - ADMINISTRACIÓN Y SEGURIDAD
 * Historia de Usuario: US005-C - Exportación de reportes semanales
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 14/04/2026
 */

import { NextResponse } from "next/server";
import { ReportService } from "@/services/admin/reportService";

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await ReportService.getDailySales(today);

    // Formatear a CSV (LEAN: Sin dependencias externas)
    const csvHeader = "Fecha,Total Ventas,Moneda\n";
    const csvRow = `${today},${data.totalVentas || 0},MXN\n`;
    const csvContent = csvHeader + csvRow;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="Reporte_Ventas_${today}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al generar reporte" }, { status: 500 });
  }
}