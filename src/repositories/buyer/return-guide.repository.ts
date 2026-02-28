import { prisma } from "@/lib/prisma";

export class ReturnGuideRepository {
  /**
   * US013-B: Recupera la información de la devolución y datos de la orden
   * para generar la guía de pasos al usuario.
   */
  async getReturnInstructions(orderId: string) {
    return await prisma.returnRequest.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
  }
}