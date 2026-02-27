import { DailySalesRepository } from "@/repositories/admin/reports/DailySales.repository";
import { prisma } from "@/lib/prisma";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    payment: {
      aggregate: jest.fn(),
    },
  },
}));

describe("DailySalesRepository (US005-A)", () => {
  it("debe sumar correctamente los pagos aprobados del día especificado", async () => {
    const testDate = new Date("2026-02-26T12:00:00Z");
    const startOfDay = new Date(testDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(testDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Mock del resultado de la base de datos
    (prisma.payment.aggregate as jest.Mock).mockResolvedValue({
      _sum: { amount: 1500.50 }
    });

    const result = await DailySalesRepository.getDailyTotal(testDate);

    // Verificación
    expect(prisma.payment.aggregate).toHaveBeenCalledWith({
      where: {
        status: 'aprobado',
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        amount: true,
      },
    });
    expect(result._sum.amount).toBe(1500.50);
  });
});