import { WeeklyReportRepository } from "@/repositories/admin/reports/WeeklyReport.repository";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: { payment: { findMany: jest.fn() } }
}));

describe("WeeklyReportRepository (US005-C)", () => {
  it("debe traer los datos completos de la semana para el PDF", async () => {
    const start = new Date("2026-02-20");
    const end = new Date("2026-02-27");

    (prisma.payment.findMany as jest.Mock).mockResolvedValue([]);
    await WeeklyReportRepository.getWeeklyData(start, end);

    expect(prisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'aprobado', created_at: { gte: start, lte: end } },
        include: expect.any(Object)
      })
    );
  });
});