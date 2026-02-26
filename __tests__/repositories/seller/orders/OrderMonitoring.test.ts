import { OrderMonitoringRepository } from "@/repositories/seller/orders/OrderMonitoring.repository";
import { prisma } from "@/lib/prisma";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
    },
  },
}));

describe("OrderMonitoringRepository (US003-A)", () => {
  it("debe aplicar correctamente los filtros de vendedor, privacidad y ordenamiento", async () => {
    const sellerId = "seller_123";
    
    // Mock del resultado esperado
    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

    await OrderMonitoringRepository.findReceivedOrders(sellerId);

    // Verificación detallada de la consulta
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        items: {
          some: {
            product: {
              seller_id: sellerId // 1. Filtro global de pedidos
            }
          }
        }
      },
      include: {
        items: {
          where: {
            product: {
              seller_id: sellerId // 2. Filtro de PRIVACIDAD (Solo ve sus items)
            }
          },
          include: {
            product: true
          }
        },
        buyer: {
          select: {
            full_name: true,
            email: true
          }
        },
        address: true
      },
      orderBy: {
        id: "desc" // 3. Ordenamiento por lo más reciente
      }
    });
  });
});