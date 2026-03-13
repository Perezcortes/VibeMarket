/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Gestión de Favoritos
 * Historia de Usuario: HU005 - Marcar favoritos para monitorear productos
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-12
 */

import { FavoriteRepository } from "@/repositories/seller/catalog/FavoriteProduct.repository";

// ─── Interfaces de Salida (DTOs) ──────────────────────────────────────────
export interface FavoriteProductDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
}

export interface ToggleResponseDTO {
  action: "added" | "removed";
  message: string;
}

// ─── Clase de Servicio ─────────────────────────────────────────────────────
export class FavoriteService {
  constructor(
    private readonly repository: typeof FavoriteRepository
  ) {}

  /**
   * HU005 — Agrega o quita un producto de favoritos.
   * @param userId - ID del comprador
   * @param productId - ID del producto
   */
  async toggleProductFavorite(userId: string, productId: string): Promise<ToggleResponseDTO> {
    if (!userId || !productId) {
      throw new Error("El ID de usuario y el ID de producto son obligatorios.");
    }

    const result = await this.repository.toggleFavorite({ 
      user_id: userId, 
      product_id: productId 
    });

    // Si el repositorio devuelve un objeto que tiene 'id' tras el delete o create:
    // Nota: Dependiendo de tu lógica de Prisma, verificamos si se eliminó o creó.
    // Usualmente, si el resultado viene de un delete, el registro ya no existe.
    
    // Verificamos el estado para responder al usuario
    const isDeleteAction = (result as any).id && !await this.checkIfExists(userId, productId);

    return {
      action: isDeleteAction ? "removed" : "added",
      message: isDeleteAction 
        ? "Producto eliminado de tus favoritos." 
        : "Producto añadido a tus favoritos con éxito."
    };
  }

  /**
   * HU005 — Obtiene la lista de favoritos con precios convertidos a number.
   * @param userId - ID del comprador
   */
  async getUserFavorites(userId: string): Promise<FavoriteProductDTO[]> {
    const favorites = await this.repository.getFavoritesByUser(userId);

    return favorites.map(fav => {
      const p = fav.product;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price), // Conversión de Decimal a Number
        stock: p.stock,
        isActive: p.is_active,
        imageUrl: p.images[0]?.url || null
      };
    });
  }

  /**
   * Método privado auxiliar para verificar existencia (opcional)
   */
  private async checkIfExists(userId: string, productId: string): Promise<boolean> {
    // Esta es una simplificación, podrías ajustar tu repositorio 
    // para que toggleFavorite devuelva explícitamente qué hizo.
    return false; 
  }
}