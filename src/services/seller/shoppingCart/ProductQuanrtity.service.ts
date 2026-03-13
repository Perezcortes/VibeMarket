/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras
 * Historia de Usuario: HU014 - Selección de cantidad de artículos
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { CartQuantityRepository } from "@/repositories/seller/shopingCart/ProductQuanrtity.repository";

// ─── DTO de salida ─────────────────────────────────────────────────────────
export interface UpdatedCartItemDTO {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  wasAdjustedByStock: boolean;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class CartQuantityService {
  constructor(
    private readonly repository: typeof CartQuantityRepository
  ) {}

  /**
   * HU014 — Ajusta la cantidad de un producto a un valor específico.
   * Si la cantidad es 0, elimina el producto del carrito automáticamente.
   * * @param cartItemId - ID del registro en el carrito
   * @param quantity - Nueva cantidad deseada
   */
  async setItemQuantity(cartItemId: string, quantity: number): Promise<UpdatedCartItemDTO | { message: string }> {
    
    // ── Validaciones iniciales ───────────────────────────────────────────
    if (quantity < 0) {
      throw new Error("La cantidad no puede ser negativa.");
    }

    // ── Regla de Negocio: Si es cero, eliminar ────────────────────────────
    if (quantity === 0) {
      await this.repository.removeItem(cartItemId);
      return { message: "Producto eliminado del carrito." };
    }

    // ── Persistencia y Ajuste de Stock ────────────────────────────────────
    const result = await this.repository.updateQuantity({
      cartItemId,
      newQuantity: quantity
    });

    const unitPrice = Number(result.product.price);
    
    // Comprobar si el repositorio tuvo que limitar la cantidad por falta de stock
    const wasAdjusted = quantity > result.quantity;

    return {
      id: result.id,
      productName: result.product.name,
      quantity: result.quantity,
      unitPrice: unitPrice,
      totalPrice: unitPrice * result.quantity,
      wasAdjustedByStock: wasAdjusted
    };
  }
}