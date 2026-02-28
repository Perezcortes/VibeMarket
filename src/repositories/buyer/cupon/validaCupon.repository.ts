import { prisma } from "@/lib/prisma";

export class ValidaCuponRepository {
  /**
   * Busca un cupón por su ID y calcula su estado actual.
   * Nota: El ID ahora es String (UUID).
   */
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