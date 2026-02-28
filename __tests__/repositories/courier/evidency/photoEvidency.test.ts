// Fíjate bien en esta primera línea, debe tener las llaves { }
import { PhotoEvidencyRepository } from "@/repositories/courier/evidency/photoEvidency.repository";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      update: jest.fn(),
    },
  },
}));

describe("US016-F - Registro de evidencia fotográfica", () => {
  const mockOrderId = "1c4d1fca-e81d-4bae-8567-cb5e8d423353";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería actualizar el pedido guardando la imagen como Buffer", async () => {
    const mockImageBuffer = Buffer.from("foto-falsa");

    (prisma.order.update as jest.Mock).mockResolvedValue({
      id: mockOrderId,
      evidency: mockImageBuffer,
    });

    // Aquí es donde marcaba el error, asegúrate de que esté escrito idéntico:
    await PhotoEvidencyRepository.uploadEvidency(mockOrderId, mockImageBuffer);

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: mockOrderId },
      data: { evidency: mockImageBuffer },
    });
  });
});