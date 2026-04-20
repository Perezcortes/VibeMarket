import { prisma } from "@/lib/prisma";

export class ValidaCuponRepository {
  /**
   * Busca un cupón por su ID y calcula su estado actual.
   * Nota: El ID ahora es String (UUID).
   */

  /**
   * Busca un cupón por su código (ej. "487695")
   */
  static async getCouponByCode(code: string) {
    return await prisma.coupon.findFirst({
      where: { code },
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
        seller_id: true,
        is_active: true,
        expires_at: true
      }
    });
  }
  /**
   * Busca los productos en el carrito que pertenecen al vendedor del cupón
   */
  static async getMatchingProducts(productIds: string[], sellerId: string) {
    return await prisma.product.findMany({
      where: {
        id: { in: productIds },
        seller_id: sellerId
      }
    });
  }
  
  static async getCouponState(couponId: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { 
        id: couponId 
      },
      select: { 
        is_active: true,
        expires_at: true
      }
    });

    // Validamos lógica de negocio
    if (!coupon) return 'inexistente';

    // Si tiene fecha de vencimiento y hoy es mayor a esa fecha -> Expirado
    if (coupon.expires_at && new Date() > coupon.expires_at) {
      return 'expirado';
    }

    // Si el vendedor lo desactivó manualmente -> Inactivo
    if (!coupon.is_active) {
      return 'inactivo';
    }

    return 'activo';
  }
}