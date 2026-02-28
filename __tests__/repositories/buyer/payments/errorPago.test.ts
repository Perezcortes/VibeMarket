import { prisma } from "@/lib/prisma";
import { PaymentStatusRepository } from "@/repositories/buyer/payments/errorPago.repository";

//ejecucion npm test -- __tests__/repositories/buyer/payments/errorPago.test.ts
// Mockeamos a Prisma, esta vez para la tabla "payment"
jest.mock("@/lib/prisma", () => ({
  prisma: {
    payment: {
      findFirst: jest.fn(),
    },
  },
}));

describe("Consulta de Estado de Pago", () => {
  const mockOrderId = "uuid-del-pedido-12345";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería buscar el pago usando el order_id y regresar solo su status", async () => {
    // 1. Simulamos que la base de datos nos responde que el pago está "aprobado"
    const mockDbResponse = { status: "aprobado" };

    (prisma.payment.findFirst as jest.Mock).mockResolvedValue(mockDbResponse);

    // 2. Ejecutamos nuestra función
    const result = await PaymentStatusRepository.getPaymentStatusByOrderId(mockOrderId);

    // 3. Verificamos que el espía fue a la tabla correcta con los datos correctos
    expect(prisma.payment.findFirst).toHaveBeenCalledWith({
      where: { order_id: mockOrderId },
      select: { status: true },
    });

    // 4. Verificamos que el resultado sea el esperado
    expect(result).toEqual(mockDbResponse);
  });
});