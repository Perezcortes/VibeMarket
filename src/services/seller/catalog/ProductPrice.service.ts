/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Información de Producto
 * Historia de Usuario: HU007 - Visualización de precio de producto
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { ProductPriceRepository } from "@/repositories/seller/catalog/ProductPrice.repository";

// ─── DTO de salida ─────────────────────────────────────────────────────────
export interface ProductPriceDTO {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  stock: number;
  isAvailable: boolean;
  categoryName: string; // Nombre de la categoría o "Sin categoría"
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class ProductPriceService {
  constructor(
    private readonly repository: typeof ProductPriceRepository
  ) {}

  /**
   * HU007 — Obtiene la información de precio y disponibilidad.
   * * @param productId - ID único del producto
   * @returns Datos financieros y de stock formateados
   * @throws Error si el producto no existe o no está activo
   */
  async getProductPriceInfo(productId: string): Promise<ProductPriceDTO> {
    const product = await this.repository.execute(productId);

    if (!product) {
      throw new Error("El producto solicitado no está disponible actualmente.");
    }

    const numericPrice = Number(product.price);

    return {
      id: product.id,
      name: product.name,
      price: numericPrice,
      formattedPrice: this.formatCurrency(numericPrice),
      stock: product.stock,
      isAvailable: product.is_active && product.stock > 0,
      // SOLUCIÓN AL ERROR: Uso de optional chaining y valor por defecto
      categoryName: product.category?.name ?? "Sin categoría"
    };
  }

  /**
   * HU007 — Utilidad para formatear el precio a moneda local (MXN).
   * * @param value - Valor numérico del precio
   */
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  }
}