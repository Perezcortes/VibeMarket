import { LiquidarRepartosRepository } from "@/repositories/courier/shift/liquidarRepartos.repository";
import { prisma } from "@/lib/prisma";

//ejecucion de prueba npm test __tests__/repositories/courier/liquidarRepartos.test.ts
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("US016-C - Liquidación de turno", () => {
  const mockCourierId = "fceef6c4-f166-47fb-ae70-16f3b15600d0";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería consultar solo los pedidos 'enviados' para el repartidor actual", async () => {
    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

    await LiquidarRepartosRepository.getOrdersToLiquidate(mockCourierId);

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        courier_id: mockCourierId,
        status: "enviado",
      },
      include: { address: true },
    });
  });

  it("debería actualizar el estado a 'entregado' al liquidar un pedido", async () => {
    const mockOrderId = "1";
    (prisma.order.update as jest.Mock).mockResolvedValue({ id: mockOrderId, status: "entregado" });

    await LiquidarRepartosRepository.markOrderAsDelivered(mockOrderId);

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: mockOrderId },
      data: { status: "entregado" },
    });
  });
});