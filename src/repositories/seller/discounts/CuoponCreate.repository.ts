import { prisma } from "@/lib/prisma";
import { DiscountType  } from "@prisma/client";



/**
 * US004-A: Configuración de vigencia de cupones
 * US004-B: Reglas de descuento
 */
export const CouponCreateRepository = {

  /**
   * Crea un nuevo cupón con sus reglas de descuento y fecha de expiración
   */
  async execute(data: {
    seller_id: string;
    code: string;
    type: DiscountType; 
    value: number;
    expires_at?: Date; 
  }) {
    return prisma.coupon.create({
      data: {
        seller_id: data.seller_id,
        code: data.code.toUpperCase(),
        type: data.type,       // US004-B: Porcentaje o monto fijo
        value: data.value,     // US004-B: Valor del descuento
        expires_at: data.expires_at, // US004-A: Vigencia
        is_active: true,       // Por defecto activo al crearse
      },
    });
  }

};