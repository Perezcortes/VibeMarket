import { prisma } from "@/lib/prisma";

/**
 * HU016: Persistencia del carrito entre sesiones
 * Criterio de aceptación: El comprador debe recuperar sus productos guardados 
 * al iniciar sesión en cualquier dispositivo.
 */
export const CartPersistenceRepository = {

  /**
   * Recupera el carrito completo del usuario con los datos actuales de los productos.
   * Esto asegura que, aunque el carrito se guardó hace días, el usuario vea 
   * el precio y stock actualizados.
   */
  async getSavedCart(userId: string) {
    return prisma.cart.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true, // Para validar si el precio cambió mientras no estaba
                stock: true, // Para validar si aún hay disponibilidad
                slug: true,
                is_active: true,
                images: {
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        }
      }
    });
  },

  /**
   * Actualiza la fecha de modificación del carrito.
   * Útil para implementar lógicas de "Carrito abandonado" posteriormente.
   */
  async touchCart(cartId: string) {
    return prisma.cart.update({
      where: { id: cartId },
      data: { updated_at: new Date() }
    });
  }
};