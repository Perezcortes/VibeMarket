/**
 *TEST 
 * Historia de Usuario: US012-F
 */

import { FailedPaymentService } from "@/services/buyer/payments/notificacionErrorPago.service";
import { FailedPaymentRepository } from "@/repositories/buyer/payments/notificacionErrorPago.repository";

//ejecucion npx jest __tests__/services/buyer/comprobante/generaPDF.service.test.ts

// Mock del repositorio para controlar las respuestas en los tests
//el jest mock no es de service sino del repository, por que el service es 
// el que tiene la logica de negocio y 
// el repository es el que interactua con la base de datos,
//  entonces al mockear el repository podemos controlar las respuestas que recibe el service 
// y probar su comportamiento en diferentes escenarios

jest.mock("@/repositories/buyer/payments/notificacionErrorPago.repository");

describe("Guía de notificación de error de pago - US012-F", () => {
  let failedPaymentService: FailedPaymentService;

  beforeEach(() => {
    failedPaymentService = new FailedPaymentService();
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  it("debería registrar un intento de pago fallido correctamente", async () => {
    (FailedPaymentRepository.registerFailedAttempt as jest.Mock).mockResolvedValue({ count: 1 });

    const response = await failedPaymentService.registerFailedPayment("order123");
    expect(response).toEqual({
      success: true,
      message: "El intento de pago fallido ha sido registrado correctamente."
    });
  });

  it("debería retornar un mensaje de error si no se encuentra el pago asociado al ID de pedido", async () => {
    (FailedPaymentRepository.registerFailedAttempt as jest.Mock).mockResolvedValue({ count: 0 });

    const response = await failedPaymentService.registerFailedPayment("order123");
    expect(response).toEqual({
      success: false,
      message: "No se encontró ningún pago asociado al ID de pedido proporcionado."
    });
  });

  it("debería manejar errores al registrar un intento de pago fallido", async () => {
    (FailedPaymentRepository.registerFailedAttempt as jest.Mock).mockRejectedValue(new Error("Error de base de datos"));

    const response = await failedPaymentService.registerFailedPayment("order123");
    expect(response).toEqual({
      success: false,
      message: "Ocurrió un error al registrar el intento de pago fallido.",
      error: "Error de base de datos"
    });
  });

  it   ("debería lanzar un error si no se proporciona un ID de pedido válido", async () => {
    await expect(failedPaymentService.registerFailedPayment("")).rejects.toThrow("Se requiere un ID de pedido válido para registrar el intento de pago fallido.");
  });
}); 