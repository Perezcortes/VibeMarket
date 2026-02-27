import { OrderStockRepository } from "@/repositories/seller/stock/orderStock.repository";
import { StockAlertRepository } from "@/repositories/seller/stock/StockAlert.repository";
import { prisma } from "@/lib/prisma";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    orderItem: { findMany: jest.fn() },
    product: { update: jest.fn() },
    $transaction: jest.fn(),
  },
}));

// Mock del repositorio de alertas
jest.mock("@/repositories/seller/stock/StockAlert.repository", () => ({
  StockAlertRepository: {
    checkAndTriggerLowStockAlert: jest.fn(),
  },
}));

describe("OrderStockRepository (US002-B)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debería descontar stock e invocar la validación del StockAlertRepository", async () => {
    const orderId = "order-123";
    const mockOrderItems = [{ product_id: "prod-A", quantity: 2 }];
    
    (prisma.orderItem.findMany as jest.Mock).mockResolvedValue(mockOrderItems);
    (prisma.$transaction as jest.Mock).mockResolvedValue([{ id: "prod-A" }]);

    await OrderStockRepository.decrementStockOnPurchase(orderId);

    // Assert: Verifica la transacción y la llamada al otro repositorio
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(StockAlertRepository.checkAndTriggerLowStockAlert).toHaveBeenCalledWith("prod-A");
  });
});