/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras
 * Historia de Usuario: HU016 - Persistencia del carrito entre sesiones
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { CartPersistenceRepository } from "@/repositories/seller/shopingCart/SaveCart.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface CartItemDetailDTO {
  cartItemId: string;
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  hasStock: boolean;
  isActive: boolean;
}

export interface FullCartDTO {
  cartId: string;
  items: CartItemDetailDTO[];
  totalAmount: number;
  itemCount: number;
  updatedAt: Date;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class CartPersistenceService {
  constructor(
    private readonly repository: typeof CartPersistenceRepository
  ) {}

  /**
   * HU016 — Recupera el carrito guardado y calcula los totales actuales.
   * @param userId - ID del comprador
   * @returns El carrito completo procesado o null si no tiene uno
   */
  async getCartContent(userId: string): Promise<FullCartDTO | null> {
    const cart = await this.repository.getSavedCart(userId);

    if (!cart) return null;

    let totalAmount = 0;
    
    // Transformamos los items y calculamos subtotales
    const items: CartItemDetailDTO[] = cart.items.map((item) => {
      const price = Number(item.product.price);
      const subtotal = price * item.quantity;
      
      // Sumamos al total general solo si el producto está activo
      if (item.product.is_active) {
        totalAmount += subtotal;
      }

      return {
        cartItemId: item.id,
        productId: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        imageUrl: item.product.images[0]?.url || null,
        unitPrice: price,
        quantity: item.quantity,
        subtotal: subtotal,
        hasStock: item.product.stock >= item.quantity,
        isActive: item.product.is_active
      };
    });

    return {
      cartId: cart.id,
      items: items,
      totalAmount: totalAmount,
      itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
      updatedAt: cart.updated_at
    };
  }
}