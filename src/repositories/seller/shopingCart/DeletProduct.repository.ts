import { prisma } from "@/lib/prisma";

/**
 * HU015: Eliminar artículos del carrito
 * Criterio de aceptación: El comprador puede remover un producto específico 
 * de su carrito de compras de forma permanente.
 */
export const CartRemoveItemRepository = {

  /**
   * Elimina un ítem específico del carrito utilizando su ID único.
   */
  async execute(cartItemId: string) {
    return prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  },

  /**
   * Vacía por completo el carrito de un usuario.
   * Útil para la opción de "Limpiar carrito" o tras completar una orden.
   */
  async clearCart(userId: string) {
    // Buscamos el carrito del usuario
    const cart = await prisma.cart.findUnique({
      where: { user_id: userId },
      select: { id: true }
    });

    if (!cart) return null;

    // Eliminamos todos los items asociados a ese ID de carrito
    return prisma.cartItem.deleteMany({
      where: {
        cart_id: cart.id,
      },
    });
  }

};