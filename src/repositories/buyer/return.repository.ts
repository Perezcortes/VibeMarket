import { prisma } from "@/lib/prisma";
import { ReturnStatus } from "@prisma/client";

export interface CreateReturnInput {
  orderId: string;
  reason: string;
  description?: string;
}

export class ReturnRepository {
  /**
   * US0013-A: Crea una solicitud de devolución vinculada a una orden.
   */
  async createReturnRequest(data: CreateReturnInput) {
    return await prisma.returnRequest.create({
      data: {
        orderId: data.orderId,
        reason: data.reason,
        description: data.description,
        status: ReturnStatus.PENDING,
      },
    });
  }

  /**
   * US013-C: Consultar el estado (Tracking)
   */
  async getReturnStatus(orderId: string) {
    return await prisma.returnRequest.findUnique({
      where: { orderId },
      select: {
        status: true,
        updatedAt: true,
      },
    });
  }
}