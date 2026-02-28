import { prisma } from "@/lib/prisma";
import { FailedPaymentRepository } from "@/repositories/buyer/payments/notificacionErrorPago.repository";


//ejecucion npm test -- __tests__/repositories/buyer/payments/notificacionErrorPago.test.ts
// Mockeamos a Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    payment: {
      updateMany: jest.fn(),
    },
  },
}));

describe("US012-E - Notificación de pago fallido", () => {
  const mockOrderId = "pedido-error-12345";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería actualizar el estado del pago a 'rechazado' en la base de datos", async () => {
    // 1. Simulamos que Prisma actualizó 1 registro con éxito
    const mockDbResponse = { count: 1 };

    (prisma.payment.updateMany as jest.Mock).mockResolvedValue(mockDbResponse);

    // 2. Ejecutamos nuestra función del repositorio
    const result = await FailedPaymentRepository.registerFailedAttempt(mockOrderId);

    // 3. Verificamos que el espía haya mandado a cambiar el status a "rechazado"
    expect(prisma.payment.updateMany).toHaveBeenCalledWith({
      where: { order_id: mockOrderId },
      data: { status: "rechazado" },
    });

    // 4. Verificamos la respuesta
    expect(result).toEqual(mockDbResponse);
  });
});