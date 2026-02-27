import { StockAlertRepository } from "@/repositories/seller/stock/StockAlert.repository";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    product: { findUnique: jest.fn() },
  },
}));

describe("StockAlertRepository (US002-C)", () => {
  it("Debería identificar correctamente un estado de stock bajo (menor al umbral)", async () => {
    const mockProduct = { 
      id: "p1", name: "Producto Test", stock: 2, is_active: true, seller_id: "s1" 
    };
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

    const result = await StockAlertRepository.checkAndTriggerLowStockAlert("p1", 5);

    // Assert: Debe retornar true porque 2 <= 5
    expect(result).toBe(true);
    expect(prisma.product.findUnique).toHaveBeenCalled();
  });
});