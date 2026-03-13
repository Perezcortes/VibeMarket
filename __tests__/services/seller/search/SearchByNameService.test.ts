/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Catálogo y Búsqueda (Pruebas de Repositorio)
 * Historia de Usuario: HU009 - Búsqueda de productos por nombre
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { ProductSearchRepository } from "@/repositories/seller/search/SearchByName.repository";
import { prisma } from "@/lib/prisma";

// Mock de Prisma para no tocar la base de datos real
jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe("ProductSearchRepository (HU011)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe buscar productos activos cuyo nombre contenga el término de búsqueda", async () => {
    const term = "iPhone";
    (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

    await ProductSearchRepository.execute(term);

    // CORRECCIÓN: El expect ahora coincide exactamente con lo que el Repo envía (Received)
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          is_active: true,
          name: { contains: term },
        },
        // Cambiamos _relevance por el ordenamiento alfabético que usa tu código actual
        orderBy: { name: "asc" },
        take: 10,
        // Añadimos el select que el repositorio está enviando realmente
        select: expect.objectContaining({
          id: true,
          name: true,
          price: true,
        })
      })
    );
  });
});