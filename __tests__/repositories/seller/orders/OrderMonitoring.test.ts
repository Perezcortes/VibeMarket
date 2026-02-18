import { OrderMonitoringRepository } from "@/repositories/seller/orders/OrderMonitoring.repository";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn()
    }
  }
}));

describe("Monitoreo de pedidos recibidos - US003-A", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería filtrar los pedidos por el ID del vendedor correctamente", async () => {
    const mockSellerId = "uuid-vendedor-test";

    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

    await OrderMonitoringRepository.findReceivedOrders(mockSellerId);

    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          items: {
            some: {
              product: { seller_id: mockSellerId }
            }
          }
        }
      })
    );
  });
});
