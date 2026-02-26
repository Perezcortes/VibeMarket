import { OrderPersistenceRepository } from "@/repositories/seller/orders/Orderstatus.repository";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: { update: jest.fn() },
    orderStatusHistory: { create: jest.fn() },
  },
}));

describe("OrderPersistenceRepository", () => {
  const orderId = "1";
  const sellerId = "user_vendedor";

  it("debe actualizar el estado del pedido correctamente", async () => {
    await OrderPersistenceRepository.updateStatus(orderId, OrderStatus.enviado);
    
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: orderId },
      data: { status: OrderStatus.enviado }
    });
  });

  it("debe registrar el cambio en el historial", async () => {
    await OrderPersistenceRepository.createStatusHistory(orderId, OrderStatus.entregado, sellerId);

    expect(prisma.orderStatusHistory.create).toHaveBeenCalledWith({
      data: {
        order_id: orderId,
        status: OrderStatus.entregado,
        changed_by: sellerId
      }
    });
  });
});