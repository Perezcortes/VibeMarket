import { prisma } from "@/lib/prisma";
import { ReceiptRepository } from "@/repositories/buyer/comprobante/generaPDF.repository";
//ejecucion npm test __tests__/repositories/courier/comprobante/generaPDF.test.ts
// Mandamos a mimir a Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findUnique: jest.fn(),
    },
  },
}));

describe("US012-F - Generación de comprobante PDF", () => {
  const mockOrderId = "pedido-uuid-12345";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe obtener los detalles del pedido junto con sus items y pagos", async () => {
    // 1. Preparamos una respuesta falsa gigante que simula lo que regresaría la BD
    const mockOrderData = {
      id: mockOrderId,
      total_amount: 500.00,
      status: "pagado",
      items: [
        { id: "item-1", product_id: "prod-A", quantity: 2, unit_price: 250.00 }
      ],
      payments: [
        { id: "pay-1", provider: "tarjeta", status: "aprobado", amount: 500.00 }
      ],
      buyer: {
        full_name: "Pluplu Hacker",
        email: "pluplu@vibemarket.com"
      }
    };

    (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrderData);

    // 2. Ejecutamos la función
    const result = await ReceiptRepository.getOrderDetailsForReceipt(mockOrderId);

    // 3. Verificamos que el espía haya hecho exactamente lo que pedimos
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: mockOrderId },
      include: {
        items: true,
        payments: true,
        buyer: {
          select: {
            full_name: true,
            email: true,
          }
        }
      },
    });

    // 4. Verificamos que devuelva la información correcta
    expect(result).toEqual(mockOrderData);
  });
});