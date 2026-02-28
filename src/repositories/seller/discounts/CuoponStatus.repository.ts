import { prisma } from "@/lib/prisma";

/**
 * US004-C: Gestion de estado de cupones
 * "Como vendedor, quiero activar y desactivar cupones, para gestionar el tiempo de uso."
 */
export const CouponStatusRepository = {

  /**
   * Actualiza el campo 'is_active' en la tabla 'coupons'
   */
  async execute(couponId: string, isActive: boolean) {
    return prisma.coupon.update({
      where: {
        id: couponId,
      },
      data: {
        is_active: isActive,
      },
    });
  }

};