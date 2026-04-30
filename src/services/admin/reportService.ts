/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Servicios - ADMINISTRACIÓN Y SEGURIDAD
 * Historia de Usuario: US005 (A, B, C, D, E) - Reportes Administrativos
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 14/04/2026
 */

import { DailySalesRepository } from "@/repositories/admin/reports/DailySales.repository";
import { CategoryRankingRepository } from "@/repositories/admin/reports/CategoryRanking.repository";
import { WeeklyReportRepository } from "@/repositories/admin/reports/WeeklyReport.repository";
import { FinancialAnalyticsRepository } from "@/repositories/admin/reports/FinancialAnalytics.repository";

export const ReportService = {
  // US005-A: Cierre de ventas diario
  async getDailySales(dateString: string) {
    const targetDate = new Date(dateString);
    const result = await DailySalesRepository.getDailyTotal(targetDate);
    return {
      fecha: dateString,
      totalVentas: Number(result._sum?.amount || 0) 
    };
  },

  // US005-B: Ranking de ventas por categorías
  async getCategoryRanking() {
    const items = await CategoryRankingRepository.getSoldItemsWithCategories();
    
    // LÓGICA DE NEGOCIO: Agrupar y sumar los artículos por categoría
    const rankingMap: Record<string, number> = {};
    
    items.forEach(item => {
      // Usamos encadenamiento opcional por si un producto fue borrado o no tiene categoría
      const catName = item.product?.category?.name || "Sin categoría";
      const quantity = Number(item.quantity) || 1; // Asumimos 1 si no hay cantidad
      
      rankingMap[catName] = (rankingMap[catName] || 0) + quantity;
    });

    // Convertir el mapa a un arreglo de objetos y ordenar de mayor a menor
    const sortedRanking = Object.entries(rankingMap)
      .map(([categoria, cantidad]) => ({ categoria, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5); // Tomamos el TOP 5 para el Dashboard

    return sortedRanking; 
  },

  // US005-C: Exportación de reportes semanales (Preparación para CSV)
  async getWeeklyReport(startDateStr: string, endDateStr: string) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    return await WeeklyReportRepository.getWeeklyData(startDate, endDate);
  },

  // US005-D y E: Análisis de descuentos y Cálculo de ROI mensual
  async getFinancialAnalytics(monthStartStr: string, monthEndStr: string) {
    // 1. Obtener todos los items vendidos
    const sales = await FinancialAnalyticsRepository.getDiscountedSales();
    
    // LÓGICA DE NEGOCIO (US005-D): Filtrar solo los que realmente se vendieron con descuento
    const discountedItemsCount = sales.filter(item => {
      const precioOriginal = Number(item.product?.price || 0);
      const precioVendido = Number(item.unit_price || 0);
      // Si el precio vendido es menor al original, hubo descuento
      return precioVendido < precioOriginal;
    }).length;

    // 2. Obtener Ingresos Mensuales
    const revenueResult = await FinancialAnalyticsRepository.getMonthlyRevenue(new Date(monthStartStr), new Date(monthEndStr));
    const ingresosTotales = Number(revenueResult._sum?.amount || 0);
    
    // LÓGICA DE NEGOCIO (US005-E): ROI Mensual (Fórmula: (Ingresos - Inversión) / Inversión * 100)
    // Nota: Como no hay tabla de gastos en VibeMarket, se asume un costo operativo (LEAN)
    const inversionMensual = 10000; 
    const roi = ingresosTotales > 0 ? ((ingresosTotales - inversionMensual) / inversionMensual) * 100 : 0;

    return {
      ventasConDescuento: discountedItemsCount,
      ingresosTotales,
      roiMensual: `${roi.toFixed(2)}%`
    };
  }
};