/**
 * TEST 
 * Historia de Usuario: US016-D
 */

import { RutasOptimizadasService } from "@/services/courier/routes/rutasOptimizadas.service";
import { RutasOptimizadasRepository } from "@/repositories/courier/routes/rutasOptimizadas.repository";

//npm test -- __tests__/services/courier/routes/rutasOptimizadas.service.test.ts
jest.mock("@/repositories/courier/routes/rutasOptimizadas.repository", () => ({
  RutasOptimizadasRepository: {
    getPendingOrdersWithAddress: jest.fn(),
  },
}));

describe("Rutas Optimizadas - US016-D", () => {
  let rutasOptimizadasService: RutasOptimizadasService;

  beforeEach(() => {
    rutasOptimizadasService = new RutasOptimizadasService();
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  it("debería obtener los pedidos pendientes con dirección correctamente", async () => {
    const mockOrders = [
      { id: "order1", status: "enviado", address: { street: "Calle 123", city: "Ciudad" } },
      { id: "order2", status: "enviado", address: { street: "Avenida 456", city: "Ciudad" } }
    ];
    (RutasOptimizadasRepository.getPendingOrdersWithAddress as jest.Mock).mockResolvedValue(mockOrders);

    const response = await rutasOptimizadasService.getPendingOrdersWithAddress("courier123");
    
    expect(response).toEqual({
      success: true,
      message: "Se encontraron 2 pedidos pendientes con dirección.",
      data: mockOrders
    });
  });

  it("debería manejar errores al obtener los pedidos pendientes con dirección", async () => {
    (RutasOptimizadasRepository.getPendingOrdersWithAddress as jest.Mock).mockRejectedValue(new Error("Error de base de datos"));

    const response = await rutasOptimizadasService.getPendingOrdersWithAddress("courier123");
    
    expect(response).toEqual({
        success: false, 
        message: "Ocurrió un error al obtener los pedidos pendientes con dirección.",
        error: "Error de base de datos"
    });
  });

  it("debería lanzar un error si no se proporciona un ID de repartidor válido", async () => {
    await expect(rutasOptimizadasService.getPendingOrdersWithAddress("")).rejects.toThrow(
      "Se requiere un ID de repartidor válido para obtener los pedidos pendientes."
    );
  });
});