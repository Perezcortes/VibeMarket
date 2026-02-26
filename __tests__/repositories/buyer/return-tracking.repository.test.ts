import { ReturnTrackingRepository } from "../../../src/repositories/buyer/return-tracking.repository";
import { prisma } from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  prisma: {
    returnRequest: {
      findUnique: jest.fn(),
    },
  },
}));

describe("ReturnTrackingRepository Unit Test - US013-C", () => {
  const repository = new ReturnTrackingRepository();

  it("debería retornar el estado y fecha de actualización para el tracking", async () => {
    const mockOrderId = "order-track-123";
    const mockResponse = {
      id: "ret-123",
      status: "APPROVED",
      updatedAt: new Date(),
      createdAt: new Date(),
      reason: "Defectuoso"
    };

    (prisma.returnRequest.findUnique as jest.Mock).mockResolvedValue(mockResponse);

    const result = await repository.getReturnStatus(mockOrderId);

    expect(result?.status).toBe("APPROVED");
    expect(result).toHaveProperty("updatedAt");
    expect(prisma.returnRequest.findUnique).toHaveBeenCalledWith({
      where: { orderId: mockOrderId },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        reason: true
      }
    });
  });
});