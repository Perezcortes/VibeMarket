import { OrderDetailPersistenceRepository } from "@/repositories/seller/orders/OrderDetails.repository";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: { findUnique: jest.fn() },
  },
}));

describe("OrderDetailPersistenceRepository", () => {
  it("debe incluir productos, dirección, comprador y pagos con la estructura correcta", async () => {
    await OrderDetailPersistenceRepository.findOrderDetailById("order_abc");

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: "order_abc" },
      include: {
        items: {
          include: { product: true } 
        },
        address: true,
        buyer: {
          select: {
            full_name: true,
            email: true,
            phone: true 
          } 
        },
        payments: true
      }
    });
  });
});