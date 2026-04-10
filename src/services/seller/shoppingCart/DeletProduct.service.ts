/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras
 * Historia de Usuario: HU015 - Eliminar artículos del carrito
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { CartRemoveItemRepository } from "@/repositories/seller/shopingCart/DeletProduct.repository";

// ─── DTO de salida ─────────────────────────────────────────────────────────
export interface CartActionResponseDTO {
  success: boolean;
  message: string;
  action: "remove_item" | "clear_cart";
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class CartRemoveService {
  constructor(
    private readonly repository: typeof CartRemoveItemRepository
  ) {}

  /**
   * HU015 — Elimina un producto específico del carrito.
   * @param cartItemId - ID único del ítem en la tabla CartItem
   */
  async removeSingleItem(cartItemId: string): Promise<CartActionResponseDTO> {
    if (!cartItemId) {
      throw new Error("El ID del artículo es requerido para eliminarlo.");
    }

    try {
      await this.repository.execute(cartItemId);
      
      return {
        success: true,
        message: "Producto removido del carrito correctamente.",
        action: "remove_item"
      };
    } catch (error) {
      // Manejo de error si el ítem ya no existía (por ejemplo, doble clic)
      console.error("Error al eliminar ítem:", error);
      throw new Error("No se pudo eliminar el artículo. Es posible que ya haya sido removido.");
    }
  }

  /**
   * HU015 — Elimina todos los productos del carrito de un usuario.
   * @param userId - ID del comprador
   */
  async clearAllCart(userId: string): Promise<CartActionResponseDTO> {
    if (!userId) {
      throw new Error("El ID de usuario es requerido para vaciar el carrito.");
    }

    const result = await this.repository.clearCart(userId);

    if (!result) {
      return {
        success: false,
        message: "No se encontró un carrito activo para este usuario.",
        action: "clear_cart"
      };
    }

    return {
      success: true,
      message: "Se han eliminado todos los productos de tu carrito.",
      action: "clear_cart"
    };
  }
}