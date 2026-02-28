import { OrderNotificationPersistenceRepository } from "@/repositories/seller/orders/OrderNotification.repository";
import { prisma } from "@/lib/prisma";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findUnique: jest.fn(),
    },
  },
}));

describe("OrderNotificationPersistenceRepository (US003-D)", () => {
  it("debe solicitar específicamente el id, status y datos de contacto del comprador", async () => {
    const orderId = "test-order-id";
    
    // Ejecutar el método
    await OrderNotificationPersistenceRepository.getNotificationData(orderId);

    // Verificar que findUnique se llamó con el select correcto
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        buyer: {
          select: {
            full_name: true,
            email: true
          }
        }
      }
    });
  });
});