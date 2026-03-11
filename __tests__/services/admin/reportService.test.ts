/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Módulo 2 - Administración y Seguridad
 * Historia de Usuario: US005 (A, B, C, D, E) Reportes
 * AUTOR (Responsable): Jose Perez
 * COPILOTO (XP Pair): Yamil Morales
 * FECHA: 07/03/2026
 */

import { ReportService } from "@/services/admin/reportService";
import { DailySalesRepository } from "@/repositories/admin/reports/DailySales.repository";
import { CategoryRankingRepository } from "@/repositories/admin/reports/CategoryRanking.repository";
import { WeeklyReportRepository } from "@/repositories/admin/reports/WeeklyReport.repository";
import { FinancialAnalyticsRepository } from "@/repositories/admin/reports/FinancialAnalytics.repository";

jest.mock("@/repositories/admin/reports/DailySales.repository");
jest.mock("@/repositories/admin/reports/CategoryRanking.repository");
jest.mock("@/repositories/admin/reports/WeeklyReport.repository");
jest.mock("@/repositories/admin/reports/FinancialAnalytics.repository");

describe("US005-A: Pruebas Unitarias - Capa de Servicio", () => {
  it("Debe calcular y formatear correctamente el total de ventas diarias", async () => {
    (DailySalesRepository.getDailyTotal as jest.Mock).mockResolvedValue({ _sum: { amount: 5000 } });
    const result = await ReportService.getDailySales("2026-03-10");
    expect(result.totalVentas).toBe(5000);
  });
});

describe("US005-B: Pruebas Unitarias - Capa de Servicio", () => {
  it("Debe recuperar los items vendidos para el ranking de categorías", async () => {
    (CategoryRankingRepository.getSoldItemsWithCategories as jest.Mock).mockResolvedValue([]);
    const result = await ReportService.getCategoryRanking();
    expect(CategoryRankingRepository.getSoldItemsWithCategories).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

describe("US005-C: Pruebas Unitarias - Capa de Servicio", () => {
  it("Debe procesar las fechas y recuperar la data para el reporte semanal", async () => {
    (WeeklyReportRepository.getWeeklyData as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const result = await ReportService.getWeeklyReport("2026-03-01", "2026-03-07");
    expect(WeeklyReportRepository.getWeeklyData).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });
});

describe("US005-D y US005-E: Pruebas Unitarias - Capa de Servicio", () => {
  it("Debe contabilizar las ventas con descuento correctamente", async () => {
    (FinancialAnalyticsRepository.getDiscountedSales as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);
    (FinancialAnalyticsRepository.getMonthlyRevenue as jest.Mock).mockResolvedValue({ _sum: { amount: 15000 } });
    
    const result = await ReportService.getFinancialAnalytics("2026-03-01", "2026-03-31");
    expect(result.ventasConDescuento).toBe(2);
  });

  it("Debe calcular el ROI mensual aplicando la fórmula sobre los ingresos", async () => {
    (FinancialAnalyticsRepository.getDiscountedSales as jest.Mock).mockResolvedValue([]);
    (FinancialAnalyticsRepository.getMonthlyRevenue as jest.Mock).mockResolvedValue({ _sum: { amount: 15000 } });
    
    const result = await ReportService.getFinancialAnalytics("2026-03-01", "2026-03-31");
    expect(result.roiMensual).toBe("50.00%");
  });
});