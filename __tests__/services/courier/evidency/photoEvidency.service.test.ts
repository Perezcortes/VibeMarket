/**
 * TEST
 * Historia de Usuario: US016-F (Registro de evidencia fotográfica)
 */

// npm test -- __tests__/services/courier/evidency/photoEvidency.service.test.ts

import { PhotoEvidencyService } from "@/services/courier/evidency/photoEvidency.service";
import { PhotoEvidencyRepository } from "@/repositories/courier/evidency/photoEvidency.repository";


jest.mock("@/repositories/courier/evidency/photoEvidency.repository", () => ({
  PhotoEvidencyRepository: {
    uploadEvidency: jest.fn(),
  },
}));

describe("Registro de evidencia fotográfica - US016-F", () => {
  let photoEvidencyService: PhotoEvidencyService;

  beforeEach(() => {
    photoEvidencyService = new PhotoEvidencyService();
    jest.clearAllMocks();
  });

  it("debería subir la evidencia fotográfica correctamente", async () => {
    // Creamos un Buffer falso (simulando una imagen)
    const mockBuffer = Buffer.from("soy-una-foto-falsa");
    const mockUpdatedOrder = { id: "order123", evidency: mockBuffer };
    
    (PhotoEvidencyRepository.uploadEvidency as jest.Mock).mockResolvedValue(mockUpdatedOrder);

    const response = await photoEvidencyService.uploadEvidency("order123", mockBuffer);
    
    expect(response).toEqual({
      success: true,
      message: "Evidencia fotográfica subida correctamente para el pedido order123.",
      data: mockUpdatedOrder
    });
  });

  it("debería lanzar un error si no se proporciona un ID de pedido", async () => {
    const mockBuffer = Buffer.from("soy-una-foto-falsa");
    
    await expect(photoEvidencyService.uploadEvidency("", mockBuffer)).rejects.toThrow(
      "Se requiere un ID de pedido válido para subir la evidencia."
    );
  });

  it("debería lanzar un error si no se proporciona un Buffer de imagen válido", async () => {
    // Ignoramos TypeScript aquí un segundo para forzar el error y probar que nuestro 'if' funciona
    // @ts-ignore
    await expect(photoEvidencyService.uploadEvidency("order123", "esto-es-un-texto-no-un-buffer")).rejects.toThrow(
      "Se requiere un archivo de imagen válido (formato Buffer)."
    );
  });

  it("debería manejar errores de la base de datos al subir la evidencia", async () => {
    const mockBuffer = Buffer.from("soy-una-foto-falsa");
    
    (PhotoEvidencyRepository.uploadEvidency as jest.Mock).mockRejectedValue(new Error("Prisma explotó"));

    const response = await photoEvidencyService.uploadEvidency("order123", mockBuffer);
    
    expect(response).toEqual({
      success: false,
      message: "Ocurrió un error al subir la evidencia fotográfica.",
      error: "Prisma explotó"
    });
  });
});