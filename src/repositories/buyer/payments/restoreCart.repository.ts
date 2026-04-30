import { prisma } from "@/lib/prisma";

export class RestoreCartRepository {
  // 1. Buscamos los productos de la orden que falló
  static async getItemsFromOrder(orderId: string) {
    return await prisma.orderItem.findMany({
      where: { order_id: orderId }
    });
  }

  // 2. Buscamos el carrito del usuario usando 'user_id'
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { user_id: userId }
      });
    }
    return cart;
  }

  // 3. Limpiamos el carrito actual y metemos los productos de la orden
  static async replaceCartItems(cartId: string, orderItems: any[]) {
    // Borramos los items que tenga el carrito ahorita usando cartItem
    await prisma.cartItem.deleteMany({
      where: { cart_id: cartId }
    });

    // ¡EL FIX ESTÁ AQUÍ! 
    // Solo mandamos lo que el carrito realmente necesita: ID del carrito, ID del producto y Cantidad.
    const newCartItems = orderItems.map(item => ({
      cart_id: cartId, 
      product_id: item.product_id,
      quantity: item.quantity
    }));

    // Insertamos los productos clonados
    await prisma.cartItem.createMany({
      data: newCartItems
    });
  }
}