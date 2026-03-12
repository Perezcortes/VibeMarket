/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Gestión de Inventario (Pruebas Unitarias)
 * Historia de Usuario: US002-B: Decremento automático de stock
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari
 * FECHA: 5 de marzo de 2026
 */

import { OrderStockService } from "@/services/seller/stock/orderStock.service";
import { OrderStockRepository } from "@/repositories/seller/stock/orderStock.repository";

jest.mock("@/repositories/seller/stock/orderStock.repository");

describe("OrderStockService - Unit Tests", () => {
  let service: OrderStockService;

  beforeEach(() => {
    service = new OrderStockService();
    jest.clearAllMocks();

    // 💡 SILENCIADOR DE CONSOLA: Mantiene la terminal limpia durante los tests
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaura la consola después de cada prueba
  });

  it("debe lanzar un error si el orderId no es proporcionado", async () => {
    await expect(service.processStockReduction(""))
      .rejects
      .toThrow("El ID del pedido es obligatorio.");
  });

  it("debe retornar éxito cuando los productos se actualizan correctamente", async () => {
    const mockUpdatedProducts = [{ id: "p1" }, { id: "p2" }];
    (OrderStockRepository.decrementStockOnPurchase as jest.Mock).mockResolvedValue(mockUpdatedProducts);

    const result = await service.processStockReduction("order-123");

    expect(result.success).toBe(true);
    expect(result.updatedItemsCount).toBe(2);
  });

  it("debe capturar y relanzar errores del repositorio (Simulación P2002)", async () => {
    const dbError = new Error("P2002: Unique constraint failed");
    (OrderStockRepository.decrementStockOnPurchase as jest.Mock).mockRejectedValue(dbError);

    await expect(service.processStockReduction("order-123"))
      .rejects
      .toThrow("Error al actualizar stock: P2002: Unique constraint failed");
  });
});