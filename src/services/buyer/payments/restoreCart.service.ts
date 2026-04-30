import { RestoreCartRepository } from "@/repositories/buyer/payments/restoreCart.repository";

export class RestoreCartService {
  async restoreCartFromFailedOrder(orderId: string, userId: string) {
    try {
      // 1. Obtener items de la orden
      const orderItems = await RestoreCartRepository.getItemsFromOrder(orderId);
      
      if (!orderItems || orderItems.length === 0) {
        throw new Error("No se encontraron productos en la orden original.");
      }

      // 2. Obtener o crear el carrito del usuario
      const cart = await RestoreCartRepository.getOrCreateCart(userId);

      // 3. ¡EL FIX ESTÁ AQUÍ! Tomamos cart.id (como lo lee Prisma)
      // Usamos el operador || por si acaso Prisma lo lee como cart_id
      const validCartId = cart.id || cart.cart_id; 

      await RestoreCartRepository.replaceCartItems(validCartId, orderItems);

      return { success: true, message: "Carrito recuperado exitosamente" };
    } catch (error: any) {
      console.error("Error en RestoreCartService:", error);
      throw new Error(error.message || "Error al restaurar el carrito");
    }
  }
}

export const restoreCartService = new RestoreCartService();