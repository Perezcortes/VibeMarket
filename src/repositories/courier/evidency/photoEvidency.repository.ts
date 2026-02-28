import { prisma } from "@/lib/prisma";

/**
 * US016-F: Registro de evidencia fotográfica
 * "Como vendedor, quiero ver pedidos recibidos, para estar al pendiente."
 */
export class PhotoEvidencyRepository {
  static async uploadEvidency(orderId: string, imageBuffer: Buffer) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { evidency: imageBuffer },
    });
  }
}