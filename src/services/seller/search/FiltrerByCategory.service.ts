/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Filtros
 * Historia de Usuario: HU010 - Filtrado de productos por categoría
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { ProductCategoryFilterRepository } from "@/repositories/seller/search/FiltrerByCategory.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface CategoryMenuDTO {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface FilteredProductDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  categoryName: string;
  imageUrl: string | null;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class ProductCategoryFilterService {
  constructor(
    private readonly repository: typeof ProductCategoryFilterRepository
  ) {}

  /**
   * HU010 — Obtiene el catálogo de categorías para el menú de filtros.
   * Útil para mostrar cuántos productos hay en cada una.
   */
  async getCategoryMenu(): Promise<CategoryMenuDTO[]> {
    const categories = await this.repository.getAllCategories();

    return categories.map((cat) => ({
      // Convertimos el id numérico a string para que coincida con la interfaz
      id: String(cat.id), 
      name: cat.name,
      slug: cat.slug,
      productCount: cat._count.products,
    }));
  }

  /**
   * HU010 — Filtra productos por categoría y transforma los datos financieros.
   * @param categorySlug - El slug de la categoría seleccionada
   */
  async getProductsByCategory(categorySlug: string): Promise<FilteredProductDTO[]> {
    if (!categorySlug || categorySlug.trim() === "") {
      throw new Error("El slug de la categoría es requerido para filtrar.");
    }

    const products = await this.repository.execute(categorySlug);

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price), // Conversión de Decimal a number
      stock: product.stock,
      categoryName: product.category?.name ?? "Sin categoría",
      imageUrl: product.images[0]?.url || null,
    }));
  }
}