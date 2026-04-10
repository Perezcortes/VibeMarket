/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Filtros Avanzados
 * Historia de Usuario: HU011 - Filtrado de productos por rango de precio
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { ProductPriceFilterRepository } from "@/repositories/seller/search/FilterByPriceRange.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface PriceBoundsDTO {
  min: number;
  max: number;
}

export interface BudgetFilteredProductDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryName: string;
  imageUrl: string | null;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class ProductPriceFilterService {
  constructor(
    private readonly repository: typeof ProductPriceFilterRepository
  ) {}

  /**
   * HU011 — Obtiene los límites reales de precios en la base de datos.
   * Sirve para que el slider de la UI no muestre rangos imposibles.
   */
  async getBudgetLimits(): Promise<PriceBoundsDTO> {
    const bounds = await this.repository.getPriceRangeBounds();

    return {
      min: Number(bounds.min),
      max: Number(bounds.max)
    };
  }

  /**
   * HU011 — Filtra productos por presupuesto y valida la coherencia del rango.
   * @param min - Precio mínimo deseado
   * @param max - Precio máximo deseado
   * @param category - (Opcional) Slug de la categoría
   */
  async getProductsByBudget(
    min: number, 
    max: number, 
    category?: string
  ): Promise<BudgetFilteredProductDTO[]> {
    
    // ── Regla de Negocio: Validar coherencia de rango ──────────────────────
    if (min < 0 || max < 0) {
      throw new Error("Los precios no pueden ser valores negativos.");
    }

    if (min > max) {
      throw new Error("El precio mínimo no puede ser mayor al precio máximo.");
    }

    const products = await this.repository.execute({
      minPrice: min,
      maxPrice: max,
      categorySlug: category
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price), // Conversión de Decimal a number
      categoryName: product.category?.name ?? "General",
      imageUrl: product.images[0]?.url || null,
    }));
  }
}