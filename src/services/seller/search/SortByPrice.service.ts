/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Ordenamiento
 * Historia de Usuario: HU012 - Ordenamiento de artículos por precio
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { ProductSortRepository } from "@/repositories/seller/search/SortByPrice.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface SortedProductDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryName: string;
  imageUrl: string | null;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class ProductSortService {
  constructor(
    private readonly repository: typeof ProductSortRepository
  ) {}

  /**
   * HU012 — Obtiene productos ordenados por precio.
   * @param direction - 'asc' (menor a mayor) o 'desc' (mayor a menor)
   */
  async getProductsSortedByPrice(direction: 'asc' | 'desc' = 'desc'): Promise<SortedProductDTO[]> {
    
    // ── Validación de Dirección ───────────────────────────────────────────
    const validDirections = ['asc', 'desc'];
    if (!validDirections.includes(direction)) {
      throw new Error("Dirección de ordenamiento no válida. Use 'asc' o 'desc'.");
    }

    const products = await this.repository.execute(direction);

    // Transformación de datos
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price), // Conversión de Decimal a number para evitar errores
      categoryName: product.category?.name ?? "General",
      imageUrl: product.images[0]?.url || null,
    }));
  }
}