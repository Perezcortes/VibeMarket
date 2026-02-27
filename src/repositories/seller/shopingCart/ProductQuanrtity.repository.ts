import { prisma } from "@/lib/prisma";

/**
 * HU014: Selección de cantidad de artículos
 * Criterio de aceptación: El comprador puede definir exactamente cuántas unidades 
 * desea de un producto. El sistema debe validar que no supere el stock disponible.
 */
export const CartQuantityRepository = {

  /**
   * Actualiza la cantidad de un ítem específico en el carrito a un valor exacto.
   */
  async updateQuantity(params: { cartItemId: string; newQuantity: number }) {
    // Primero verificamos el stock actual del producto vinculado a este ítem
    const item = await prisma.cartItem.findUnique({
      where: { id: params.cartItemId },
      include: { product: { select: { stock: true } } }
    });

    if (!item) throw new Error("El artículo no existe en el carrito");

    // Validación de persistencia: No permitir más de lo que hay en stock
    const finalQuantity = params.newQuantity > item.product.stock 
      ? item.product.stock 
      : params.newQuantity;

    return prisma.cartItem.update({
      where: { id: params.cartItemId },
      data: {
        quantity: finalQuantity,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true
          }
        }
      }
    });
  },

  /**
   * Elimina el ítem si la cantidad se reduce a cero.
   */
  async removeItem(cartItemId: string) {
    return prisma.cartItem.delete({
      where: { id: cartItemId }
    });
  }
};