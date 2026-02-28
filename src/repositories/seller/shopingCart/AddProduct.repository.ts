import { prisma } from "@/lib/prisma";

/**
 * HU013: Agregar productos al carrito
 * Criterio de aceptación: El comprador puede añadir productos a su carrito persistente.
 * Si el producto ya existe en el carrito, se debe actualizar la cantidad.
 */
export const CartAddProductRepository = {

  /**
   * Ejecuta la lógica de añadir o actualizar un producto en el carrito.
   */
  async execute(data: { userId: string; productId: string; quantity: number }) {
    // 1. Aseguramos que el usuario tenga un carrito (si no existe, lo crea)
    const cart = await prisma.cart.upsert({
      where: { user_id: data.userId },
      update: {},
      create: { user_id: data.userId },
    });

    // 2. Usamos upsert en CartItem para manejar la existencia del producto
    return prisma.cartItem.upsert({
      where: {
        cart_id_product_id: {
          cart_id: cart.id,
          product_id: data.productId,
        },
      },
      update: {
        // Incrementamos la cantidad existente
        quantity: {
          increment: data.quantity,
        },
      },
      create: {
        cart_id: cart.id,
        product_id: data.productId,
        quantity: data.quantity,
      },
    });
  },

  /**
   * Verifica el stock disponible antes de permitir la agregación.
   */
  async checkStock(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, name: true }
    });
  }
};