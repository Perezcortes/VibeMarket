import { prisma } from "@/lib/prisma";

export class FailedPaymentRepository {
  /**
   * Registra un intento de pago fallido actualizando su estado a 'rechazado'.
   */
  static async registerFailedAttempt(orderId: string) {
    // Usamos updateMany porque buscaremos por order_id (que no es la llave primaria id)
    return await prisma.payment.updateMany({
      where: { 
        order_id: orderId 
      },
      data: { 
        status: "rechazado" 
      }
    });
  }
}