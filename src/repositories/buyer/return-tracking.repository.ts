import { prisma } from "../../lib/prisma";

export class ReturnTrackingRepository {
  /**
   * US013-C: Obtiene el estatus actual de una devolución para el monitoreo del comprador.
   */
  async getReturnStatus(orderId: string) {
    return await prisma.returnRequest.findUnique({
      where: { orderId },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        reason: true
      },
    });
  }
}