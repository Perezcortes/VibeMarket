import { prisma } from "@/lib/prisma";

/**
 * US005-C: Exportación de reportes semanales.
 * "Como dueño, quiero exportar mi reporte semanal a formato PDF."
 */
export const WeeklyReportRepository = {
  /**
   * Obtiene todos los pagos aprobados de una semana, incluyendo 
   * el detalle de la orden y los productos para armar el PDF.
   */
  async getWeeklyData(startDate: Date, endDate: Date) {
    return prisma.payment.findMany({
      where: {
        status: 'aprobado',
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        order: {
          include: {
            items: {
              include: { product: true }
            },
            buyer: {
              select: { full_name: true, email: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }
};