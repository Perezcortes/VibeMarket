import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Importamos los tipos de Prisma

/**
 * HU017: Bloqueo de compra por falta de stock
 */
export const StockGuardRepository = {

  /**
   * Ejecuta la compra de forma segura utilizando una transacción de base de datos.
   * Se añade el tipo Prisma.TransactionClient al parámetro tx.
   */
  async secureCheckout(data: {
    userId: string;
    addressId: string;
    cartItems: { productId: string; quantity: number; price: number }[];
  }) {
    // Definimos el tipo explícitamente en el callback de la transacción
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      
      for (const item of data.cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true, name: true }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto: ${product?.name || 'Desconocido'}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      // El resto de tu lógica (Crear Order, OrderItem y limpiar Cart) sigue igual...
      // tx ahora tendrá autocompletado y validación de tipos.
    });
  }
};