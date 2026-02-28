import { prisma } from "@/lib/prisma";

/**
 * US005-A: Cierre de ventas diario.
 * "Como dueño quiero ver el reporte de ventas diario, para tener un control de mi tienda."
 */
export const DailySalesRepository = {
  /**
   * Obtiene la suma total de los pagos aprobados en una fecha específica.
   */
  async getDailyTotal(targetDate: Date) {
    // Configurar el inicio y fin del día para la consulta
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.payment.aggregate({
      where: {
        status: 'aprobado', // Solo dinero real que ya entró
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        amount: true,
      },
    });
  }
};