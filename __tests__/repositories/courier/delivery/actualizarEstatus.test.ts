import { ActualizarEstatusRepository } from "@/repositories/courier/delivery/actualizarEstatus.repository";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

//ejeucion npm test __tests__/repositories/courier/delivery/actualizarEstatus.test.ts
// Mockeamos (mandamos a mimir) a Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("US016-E - Actualización de estatus", () => {
  const mockCourierId = "fceef6c4-f166-47fb-ae70-16f3b15600d0";
  const mockOrderId = "1c4d1fca-e81d-4bae-8567-cb5e8d423353";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe consultar los pedidos en curso (pendiente, pagado, enviado) del repartidor", async () => {
    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

    await ActualizarEstatusRepository.getActiveOrders(mockCourierId);

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        courier_id: mockCourierId,
        status: {
          in: ['pendiente', 'pagado', 'enviado'],
        },
      },
    });
  });

  it("Debe actualizar correctamente el estado del pedido a pagado", async () => {
    const newStatus = OrderStatus.pagado; // Simulamos que el repartidor lo pasó a pagado
    (prisma.order.update as jest.Mock).mockResolvedValue({ 
      id: mockOrderId, 
      status: newStatus 
    });
    await ActualizarEstatusRepository.updateOrderStatus(mockOrderId, newStatus);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: mockOrderId },
      data: { status: newStatus },
    });
  });

  it("Debe actualizar correctamente el estado del pedido a enviado", async () => {
    (prisma.order.update as jest.Mock).mockResolvedValue({ 
      id: mockOrderId, 
      status: newStatus 
    });
    await ActualizarEstatusRepository.updateOrderStatus(mockOrderId, newStatus);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: mockOrderId },
      data: { status: newStatus },
    });
  });

    const newStatus = OrderStatus.enviado; // Simulamos que el repartidor lo pasó a enviado
  it("Debe actualizar correctamente el estado del pedido a entregado", async () => {
    const newStatus = OrderStatus.entregado; // Simulamos que el repartidor lo pasó a entregado
    (prisma.order.update as jest.Mock).mockResolvedValue({ 
      id: mockOrderId, 
      status: newStatus 
    });
    await ActualizarEstatusRepository.updateOrderStatus(mockOrderId, newStatus);
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: mockOrderId },
      data: { status: newStatus },
    });
  });
}); 
