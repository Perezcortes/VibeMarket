/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Servicios - ADMINISTRACIÓN Y SEGURIDAD
 * Historia de Usuario: US005 (A, B, C, D, E) - Reportes Administrativos
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 07/03/2026
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
      // CORRECCIÓN: Lo envolvemos en Number()
      totalVentas: Number(result._sum.amount || 0) 
    };
  },

  // US005-B: Ranking de ventas por categorías
  async getCategoryRanking() {
    const items = await CategoryRankingRepository.getSoldItemsWithCategories();
    return items; 
  },

  // US005-C: Exportación de reportes semanales (Preparación para PDF)
  async getWeeklyReport(startDateStr: string, endDateStr: string) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    return await WeeklyReportRepository.getWeeklyData(startDate, endDate);
  },

  // US005-D y E: Análisis de descuentos y Cálculo de ROI mensual
  async getFinancialAnalytics(monthStartStr: string, monthEndStr: string) {
    const discounts = await FinancialAnalyticsRepository.getDiscountedSales();
    const revenueResult = await FinancialAnalyticsRepository.getMonthlyRevenue(new Date(monthStartStr), new Date(monthEndStr));
    
    const ingresosTotales = Number(revenueResult._sum.amount || 0);
    
    // ROI: Asumimos una inversión estática mensual para el cálculo por ahora
    const inversionMensual = 10000; 
    const roi = ingresosTotales > 0 ? ((ingresosTotales - inversionMensual) / inversionMensual) * 100 : 0;

    return {
      ventasConDescuento: discounts.length,
      ingresosTotales,
      roiMensual: `${roi.toFixed(2)}%`
    };
  }
};