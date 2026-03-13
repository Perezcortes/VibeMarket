/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Búsqueda
 * Historia de Usuario: HU009 - Búsqueda de productos por nombre
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { ProductSearchRepository } from "@/repositories/seller/search/SearchByName.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface SearchResultDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  categoryName: string;
  imageUrl: string | null;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class ProductSearchService {
  constructor(
    private readonly repository: typeof ProductSearchRepository
  ) {}

  /**
   * HU009 — Busca productos por nombre y procesa los resultados.
   * @param searchTerm - Palabra o frase a buscar
   * @returns Lista de productos que coinciden con la búsqueda
   */
  async searchProducts(searchTerm: string): Promise<SearchResultDTO[]> {
    // ── Regla de Negocio: Validar longitud de búsqueda ─────────────────────
    const cleanQuery = searchTerm.trim();

    if (!cleanQuery || cleanQuery.length < 2) {
      // Si la búsqueda es muy corta, devolvemos lista vacía para no saturar la BD
      return [];
    }

    const products = await this.repository.execute(cleanQuery);

    // Transformación de los datos para el Frontend
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price), // Conversión de Decimal a number
      stock: product.stock,
      // Manejo de seguridad para categorías nulas (visto en HU007)
      categoryName: product.category?.name ?? "General",
      imageUrl: product.images[0]?.url || null,
    }));
  }
}