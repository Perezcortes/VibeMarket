/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Carrito de Compras
 * Historia de Usuario: HU013 - Agregar productos al carrito
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { CartAddProductRepository } from "@/repositories/seller/shopingCart/AddProduct.repository";

// ─── DTO de entrada ────────────────────────────────────────────────────────
export interface AddToCartDTO {
  userId: string;
  productId: string;
  quantity: number;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class CartService {
  constructor(
    private readonly repository: typeof CartAddProductRepository
  ) {}

  /**
   * HU013 — Agrega un producto al carrito validando disponibilidad.
   * * @param data - Datos del producto y cantidad
   * @throws Error si no hay stock suficiente o datos inválidos
   */
  async addProduct(data: AddToCartDTO) {
    // ── Validaciones de entrada ───────────────────────────────────────────
    if (data.quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a 0.");
    }

    // ── Regla de Negocio: Verificar existencia y Stock ────────────────────
    const product = await this.repository.checkStock(data.productId);

    if (!product) {
      throw new Error("El producto seleccionado ya no existe.");
    }

    if (product.stock <= 0) {
      throw new Error(`Lo sentimos, el producto "${product.name}" está agotado.`);
    }

    if (data.quantity > product.stock) {
      throw new Error(`Solo quedan ${product.stock} unidades disponibles de "${product.name}".`);
    }

    // ── Persistencia ──────────────────────────────────────────────────────
    try {
      const cartItem = await this.repository.execute({
        userId: data.userId,
        productId: data.productId,
        quantity: data.quantity,
      });

      return {
        message: "Producto añadido al carrito con éxito.",
        item: cartItem
      };
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      throw new Error("No se pudo actualizar el carrito. Inténtalo de nuevo.");
    }
  }
}