import { prisma } from "@/lib/prisma";

/**
 * HU007: Visualización de precio de producto
 * Criterio de aceptación: El comprador debe ver el precio actual y exacto 
 * del producto para tomar una decisión de compra informada.
 */
export const ProductPriceRepository = {

  /**
   * Obtiene exclusivamente la información financiera de un producto.
   * Útil para componentes de "Quick View" o actualizaciones de precio en tiempo real.
   */
  async execute(productId: string) {
    return prisma.product.findUnique({
      where: {
        id: productId,
        is_active: true, // No mostramos precios de productos que no se pueden comprar
      },
      select: {
        id: true,
        name: true,
        price: true,     // El valor Decimal(10, 2) definido en tu esquema
        stock: true,     // El precio es relevante solo si hay disponibilidad
        is_active: true,
        // Incluimos la categoría para posibles impuestos o tasas relativas al rubro
        category: {
          select: {
            name: true
          }
        }
      }
    });
  }

};