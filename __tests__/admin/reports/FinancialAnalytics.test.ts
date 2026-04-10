import { FinancialAnalyticsRepository } from "@/repositories/admin/reports/FinancialAnalytics.repository";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    orderItem: { findMany: jest.fn() },
    payment: { aggregate: jest.fn() }
  }
}));

describe("FinancialAnalyticsRepository (US005-D & US005-E)", () => {
  it("debe consultar los items vendidos para el análisis de descuentos (US005-D)", async () => {
    (prisma.orderItem.findMany as jest.Mock).mockResolvedValue([]);
    await FinancialAnalyticsRepository.getDiscountedSales();
    expect(prisma.orderItem.findMany).toHaveBeenCalled();
  });

  it("debe calcular los ingresos del mes para el ROI (US005-E)", async () => {
    const start = new Date("2026-02-01");
    const end = new Date("2026-02-28");
    (prisma.payment.aggregate as jest.Mock).mockResolvedValue({ _sum: { amount: 5000 } });
    
    await FinancialAnalyticsRepository.getMonthlyRevenue(start, end);
    expect(prisma.payment.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.any(Object), _sum: { amount: true } })
    );
  });
});