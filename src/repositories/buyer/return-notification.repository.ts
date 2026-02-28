import { prisma } from "../../lib/prisma";

export class ReturnNotificationRepository {
  /**
   * US013-D: Recupera los datos de contacto y detalles de la devolución 
   * una vez que el estatus es COMPLETED para enviar la notificación.
   */
  async getCompletedReturnData(orderId: string) {
    return await prisma.returnRequest.findUnique({
      where: { 
        orderId: orderId 
      },
      include: {
        order: {
          include: {
            buyer: {
              select: {
                email: true,
                full_name: true
              }
            }
          }
        }
      }
    });
  }
}