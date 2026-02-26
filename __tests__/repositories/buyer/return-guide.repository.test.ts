import { ReturnGuideRepository } from "../../../src/repositories/buyer/return-guide.repository";
import { prisma } from "../../../src/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    returnRequest: {
      findUnique: jest.fn(),
    },
  },
}));

describe("ReturnGuideRepository Unit Test - US013-B", () => {
  const repository = new ReturnGuideRepository();

  it("debería obtener la información completa para la guía de retorno", async () => {
    const mockOrderId = "order-full-123";
    
    const mockResponse = {
      orderId: mockOrderId,
      status: "PENDING",
      reason: "Producto equivocado",
      order: {
        id: mockOrderId,
        items: [
          { product: { name: "Smartphone Vibe" } }
        ]
      }
    };

    (prisma.returnRequest.findUnique as jest.Mock).mockResolvedValue(mockResponse);

    const result = await repository.getReturnInstructions(mockOrderId);

    // Verificaciones de contenido
    expect(result).toHaveProperty("order");
    expect(result?.order.items[0].product.name).toBe("Smartphone Vibe");

    // Verificación de la llamada (Ajustada a la estructura real del repositorio)
    expect(prisma.returnRequest.findUnique).toHaveBeenCalledWith({
      where: { orderId: mockOrderId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
  });
});