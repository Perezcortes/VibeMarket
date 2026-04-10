import { CategoryRankingRepository } from "@/repositories/admin/reports/CategoryRanking.repository";
import { prisma } from "@/lib/prisma";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    orderItem: {
      findMany: jest.fn(),
    },
  },
}));

describe("CategoryRankingRepository (US005-B)", () => {
  it("debe traer los items vendidos incluyendo la categoría de su producto", async () => {
    
    // Simular que Prisma devuelve una lista vacía
    (prisma.orderItem.findMany as jest.Mock).mockResolvedValue([]);

    await CategoryRankingRepository.getSoldItemsWithCategories();

    // Verificación de la estructura del Join (Include)
    expect(prisma.orderItem.findMany).toHaveBeenCalledWith({
      include: {
        product: {
          select: {
            name: true,
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  });
});