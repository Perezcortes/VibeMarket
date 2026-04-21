/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Logística / Reparto
 * Historia de Usuario: US016-F - Como repartidor, quiero subir una imagen de prueba del paquete entregado, para evitar problemas de entrega.
 * AUTOR (Responsable): Ariadna Betsabe Espina Ramirez
 * COPILOTO (XP Pair): Jose Alberto Perez Cortes
 * FECHA: 18 de marzo de 2026
 */

// npm test -- __tests__/api/courier/evidency/photoEvidency.api.test.ts

import { PhotoEvidencyService } from "@/services/courier/evidency/photoEvidency.service";

// Mock el repositorio para evitar acceso a DB
jest.mock("@/repositories/courier/evidency/photoEvidency.repository", () => ({
  PhotoEvidencyRepository: {
    uploadEvidency: jest.fn().mockResolvedValue({
      id: "ORD-123",
      evidency: Buffer.from("image-data"),
      updatedAt: new Date()
    })
  }
}));

describe("API Photo Evidency - US016-F (Servicio)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("✅ Caso 1: La imagen es agregada a la base de datos con éxito", async () => {
    // Instanciar el servicio (el repositorio está mockeado)
    const service = new PhotoEvidencyService();
    
    const imageBuffer = Buffer.from("fake-image-data");
    const result = await service.uploadEvidency("ORD-123", imageBuffer);

    // Verificaciones
    expect(result.success).toBe(true);
    expect(result.message).toContain("Evidencia fotográfica subida correctamente");
    expect(result.data).toBeDefined();
    expect(result.data!.id).toBe("ORD-123");
  });

  it("❌ Caso 2: Si ocurre un error en la base de datos, retorna error interno", async () => {
    // Importar y mockear el repositorio para este caso
    const { PhotoEvidencyRepository } = require("@/repositories/courier/evidency/photoEvidency.repository");
    PhotoEvidencyRepository.uploadEvidency.mockRejectedValueOnce(
      new Error("Database connection failed")
    );

    const service = new PhotoEvidencyService();
    
    const imageBuffer = Buffer.from("fake-image-data");
    const result = await service.uploadEvidency("ORD-999", imageBuffer);

    // Verificaciones
    expect(result.success).toBe(false);
    expect(result.message).toContain("Ocurrió un error");
    expect(result.error).toContain("Database connection failed");
  });

  it("❌ Caso 2b: Si faltan datos (orderId vacío), lanza error antes de DB", async () => {
    const service = new PhotoEvidencyService();
    
    const imageBuffer = Buffer.from("fake-image-data");
    
    await expect(
      service.uploadEvidency("", imageBuffer) // orderId vacío
    ).rejects.toThrow("Se requiere un ID de pedido válido");
  });

  it("❌ Caso 2c: Si falta la imagen (Buffer inválido), lanza error", async () => {
    const service = new PhotoEvidencyService();
    
    // Pasar un buffer inválido
    const invalidBuffer = null as any;
    
    await expect(
      service.uploadEvidency("ORD-123", invalidBuffer)
    ).rejects.toThrow("Se requiere un archivo de imagen válido");
  });
});