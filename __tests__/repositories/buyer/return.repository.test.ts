import { ReturnRepository } from "@/repositories/buyer/return.repository";
import { prisma } from "@/lib/prisma";

// Mockeamos prisma para que sea una prueba unitaria pura
jest.mock("@/lib/prisma", () => ({
  prisma: {
    returnRequest: {
      create: jest.fn(),
    },
  },
}));

describe("ReturnRepository Unit Test - US0013-A", () => {
  const repository = new ReturnRepository();

  it("debería llamar a prisma.create con los datos correctos", async () => {
    const mockInput = {
      orderId: "uuid-orden-123",
      reason: "Producto defectuoso",
      description: "No enciende"
    };

    const mockResponse = {
      id: "return-id-999",
      ...mockInput,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulamos que Prisma responde con éxito
    (prisma.returnRequest.create as jest.Mock).mockResolvedValue(mockResponse);

    const result = await repository.createReturnRequest(mockInput);

    // Verificaciones
    expect(prisma.returnRequest.create).toHaveBeenCalledWith({
      data: {
        orderId: mockInput.orderId,
        reason: mockInput.reason,
        description: mockInput.description,
        status: "PENDING",
      },
    });
    expect(result.status).toBe("PENDING");
    expect(result.id).toBe("return-id-999");
  });
});