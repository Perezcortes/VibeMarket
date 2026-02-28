import { prisma } from "@/lib/prisma";

export class ValidaCuponRepository {
  /**
   * Busca un cupón por su ID y regresa únicamente su estado ('activo', 'usado', 'expirado').
   */
  static async getCouponState(couponId: number) {
    return await prisma.cupon.findUnique({
      where: { 
        id: couponId 
      },
      select: { 
        estado: true // ¡Magia! Con "select" le decimos que SOLO traiga esta columna
      }
    });
  }
}