import { prisma } from "@/lib/prisma";

/**
 * HU003: Visualización de ofertas y descuentos
 * Criterio de aceptación: El sistema debe mostrar si un producto tiene 
 * cupones de descuento activos asociados al vendedor.
 */
export const ProductDiscountRepository = {

  /**
   * Obtiene un producto junto con los cupones activos de su vendedor
   */
  async execute(productSlug: string) {
    return prisma.product.findUnique({
      where: {
        slug: productSlug,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        price: true, // Precio original
        seller_id: true,
        // Traemos los cupones activos del vendedor de este producto
        seller: {
          select: {
            full_name: true,
            coupons: {
              where: {
                is_active: true,
                // Filtramos cupones que no hayan expirado
                OR: [
                  { expires_at: null },
                  { expires_at: { gt: new Date() } }
                ]
              },
              select: {
                code: true,
                type: true,  // "porcentaje" o "monto_fijo"
                value: true, // El valor del descuento
                expires_at: true
              }
            }
          }
        }
      }
    });
  }

};