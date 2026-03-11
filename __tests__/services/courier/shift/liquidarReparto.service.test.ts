/**
 * TEST 
 * Historia de Usuario: US016-C
 */

import { LiquidarRepartoService } from "@/services/courier/shift/liquidarReparto.service";
import { LiquidarRepartosRepository } from "@/repositories/courier/shift/liquidarRepartos.repository";

//ejecutRar: npm test -- --testNamePattern="Liquidar Reparto - US016-C"
jest.mock("@/repositories/courier/shift/liquidarRepartos.repository", () => ({
  LiquidarRepartosRepository: {
    getOrdersToLiquidate: jest.fn(),
    markOrderAsDelivered: jest.fn(),
  },
}));

describe("Liquidar Reparto - US016-C", () => {
  let liquidarRepartoService: LiquidarRepartoService;

  beforeEach(() => {
    liquidarRepartoService = new LiquidarRepartoService();
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  // ==========================================
  // TESTS PARA: getOrdersToLiquidate
  // ==========================================
  it("debería obtener los pedidos a liquidar correctamente", async () => {
    const mockOrders = [
      { id: "order1", status: "enviado" },
      { id: "order2", status: "enviado" }
    ];
    (LiquidarRepartosRepository.getOrdersToLiquidate as jest.Mock).mockResolvedValue(mockOrders);

    const response = await liquidarRepartoService.getOrdersToLiquidate("courier123");
    
    expect(response).toEqual({
      success: true,
      message: "Se encontraron 2 pedidos para liquidar.",
      data: mockOrders
    });
  });

  it("debería manejar errores al obtener los pedidos a liquidar", async () => {
    (LiquidarRepartosRepository.getOrdersToLiquidate as jest.Mock).mockRejectedValue(new Error("Error de base de datos"));

    const response = await liquidarRepartoService.getOrdersToLiquidate("courier123");
    
    expect(response).toEqual({
      success: false,
      message: "Ocurrió un error al obtener los pedidos a liquidar.",
      error: "Error de base de datos"
    });
  });

  it("debería lanzar un error si no se proporciona un ID de repartidor válido", async () => {
    await expect(liquidarRepartoService.getOrdersToLiquidate("")).rejects.toThrow(
      "Se requiere un ID de repartidor válido para obtener los pedidos a liquidar."
    );
  });

  // ==========================================
  // TESTS PARA: markOrderAsDelivered
  // ==========================================
  it("debería marcar un pedido como entregado correctamente", async () => {
    const mockUpdatedOrder = { id: "order1", status: "entregado" };
    (LiquidarRepartosRepository.markOrderAsDelivered as jest.Mock).mockResolvedValue(mockUpdatedOrder);

    const response = await liquidarRepartoService.markOrderAsDelivered("order1");
    
    expect(response).toEqual({
      success: true,
      message: "El pedido con ID order1 ha sido marcado como entregado.",
      data: mockUpdatedOrder
    });
  });

  it("debería manejar errores al marcar un pedido como entregado", async () => {
    (LiquidarRepartosRepository.markOrderAsDelivered as jest.Mock).mockRejectedValue(new Error("Error de base de datos"));

    const response = await liquidarRepartoService.markOrderAsDelivered("order1");
    
    expect(response).toEqual({
      success: false,
      message: "Ocurrió un error al marcar el pedido como entregado.",
      error: "Error de base de datos"
    });
  });

  // ✨ TEST NUEVO: Para asegurar que valide el ID del pedido vacío
  it("debería lanzar un error si no se proporciona un ID de pedido válido", async () => {
    await expect(liquidarRepartoService.markOrderAsDelivered("")).rejects.toThrow(
      "Se requiere un ID de pedido válido para marcar como entregado."
    );
  });
});