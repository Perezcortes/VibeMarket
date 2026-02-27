import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Importación corregida

/**
 * HU020: Confirmación de pago exitoso
 */
export const PaymentConfirmationRepository = {
  /**
   * Actualiza el pago a 'aprobado' y la orden a 'pagado'.
   */
  async confirmSuccess(orderId: string, paymentId: string) {
    // Definimos tx como Prisma.TransactionClient
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      
      // 1. Actualizar el estado del pago
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: { status: "aprobado" },
      });

      // 2. Actualizar el estado de la orden
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: "pagado" },
        include: {
          buyer: {
            select: {
              full_name: true,
              email: true
            }
          }
        }
      });

      return { order, payment };
    });
  }
};