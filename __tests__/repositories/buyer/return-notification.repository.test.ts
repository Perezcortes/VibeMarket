import { ReturnNotificationRepository } from "../../../src/repositories/buyer/return-notification.repository";
import { prisma } from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    returnRequest: {
      findUnique: jest.fn(),
    },
  },
}));

describe("ReturnNotificationRepository Unit Test - US013-D", () => {
  const repository = new ReturnNotificationRepository();

  it("debería obtener el email del comprador cuando la devolución está completada", async () => {
    const mockOrderId = "order-final-123";
    const mockResponse = {
      orderId: mockOrderId,
      status: "COMPLETED",
      order: {
        buyer: {
          email: "comprador@vibe.com",
          full_name: "Juan Pérez"
        }
      }
    };

    (prisma.returnRequest.findUnique as jest.Mock).mockResolvedValue(mockResponse);

    const result = await repository.getCompletedReturnData(mockOrderId);

    // Verificación de los datos para la notificación
    expect(result?.status).toBe("COMPLETED");
    expect(result?.order.buyer.email).toBe("comprador@vibe.com");
    expect(prisma.returnRequest.findUnique).toHaveBeenCalledWith({
      where: { orderId: mockOrderId },
      include: {
        order: {
          include: {
            buyer: {
              select: { email: true, full_name: true }
            }
          }
        }
      }
    });
  });
});