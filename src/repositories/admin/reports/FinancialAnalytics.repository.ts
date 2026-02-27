import { prisma } from "@/lib/prisma";

/**
 * US005-D: Análisis de ventas con descuento.
 * US005-E: Cálculo de ROI (retorno de inversión) mensual.
 */
export const FinancialAnalyticsRepository = {
  /**
   * US005-D: Obtiene los items vendidos para comparar precios y ver cuáles
   * se vendieron con descuento (unit_price menor al precio actual del producto).
   */
  async getDiscountedSales() {
    return prisma.orderItem.findMany({
      include: { product: true, order: true },
      orderBy: { created_at: 'desc' }
    });
  },

  /**
   * US005-E: Obtiene los ingresos totales del mes para calcular el ROI.
   */
  async getMonthlyRevenue(startDate: Date, endDate: Date) {
    return prisma.payment.aggregate({
      where: {
        status: 'aprobado',
        created_at: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });
  }
};