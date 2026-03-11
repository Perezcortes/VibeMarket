/**
 * TEST 
 * Historia de Usuario: US016-E
 */

import { ActualizarEstatusService } from "@/services/courier/delivery/actualizarEstatus.service";
import { ActualizarEstatusRepository } from "@/repositories/courier/delivery/actualizarEstatus.repository";

jest.mock("@/repositories/courier/delivery/actualizarEstatus.repository", () => ({
  ActualizarEstatusRepository: {
    getActiveOrders: jest.fn(),
    updateOrderStatus: jest.fn(),
  },
}));

describe("Actualización de estatus de entrega - US016-E", () => {
  let actualizarEstatusService: ActualizarEstatusService;

  beforeEach(() => {
    actualizarEstatusService = new ActualizarEstatusService();
    jest.clearAllMocks();
  });

  it("debería actualizar el estatus del pedido a 'enviado' correctamente", async () => {
    // Simulamos que la BD responde bien
    (ActualizarEstatusRepository.updateOrderStatus as jest.Mock).mockResolvedValue({ id: "order123", status: "enviado" });

    const response = await actualizarEstatusService.updateOrderStatus("order123", "enviado");
    
    expect(response).toEqual({
      success: true,
      message: "El estatus del pedido order123 se ha actualizado a enviado."
    });
  });

  it("debería lanzar un error si no se proporciona un ID de pedido válido", async () => {
    await expect(actualizarEstatusService.updateOrderStatus("", "enviado")).rejects.toThrow(
      "Se requiere un ID de pedido válido para actualizar el estatus."
    );
  });

  it("debería lanzar un error si el estatus ingresado no es válido", async () => {
    // Si intentan meter un estado inventado como "volando" o "en camino"
    await expect(actualizarEstatusService.updateOrderStatus("order123", "volando")).rejects.toThrow(
      "El estatus debe ser 'entregado' o 'enviado'."
    );
  });

  it("debería manejar errores si la base de datos falla", async () => {
    // Simulamos que la base de datos se cayó
    (ActualizarEstatusRepository.updateOrderStatus as jest.Mock).mockRejectedValue(new Error("Error de conexión"));

    const response = await actualizarEstatusService.updateOrderStatus("order123", "enviado");
    
    expect(response).toEqual({
      success: false,
      message: "Ocurrió un error al actualizar el estatus del pedido.",
      error: "Error de conexión"
    });
  });
});