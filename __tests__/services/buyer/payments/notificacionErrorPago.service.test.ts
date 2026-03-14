/**
 *TEST 
 * Historia de Usuario: US012-E
 */

 //importamos ambos tanto repository como service para poder probar la lógica de negocio
 //  y su interacción con el repositorio
 import { FailedPaymentService } from "@/services/buyer/payments/notificacionErrorPago.service";
 import { FailedPaymentRepository } from "@/repositories/buyer/payments/notificacionErrorPago.repository";

 //ejecucion npx jest __tests__/services/buyer/notificacionErrorPago.service.test.ts

 // Mock del repositorio para controlar las respuestas en los tests
 jest.mock("@/repositories/buyer/payments/notificacionErrorPago.repository");

 describe("Guía de notificación de error de pago - US012-E", () => {
   let failedPaymentService: FailedPaymentService;

   beforeEach(() => {
     failedPaymentService = new FailedPaymentService();
     jest.clearAllMocks(); // Limpiar mocks antes de cada test
   });

   it("debería registrar un intento de pago fallido correctamente", async () => {
    //le ponemos count por que el metodo tambien tiene el nombre count, 
    // que indica cuántos registros fueron actualizados, y 1 por que simula que se encontró el pago 
    // y se actualizó su estado
     (FailedPaymentRepository.registerFailedAttempt as jest.Mock).mockResolvedValue({ count: 1 });

     const response = await failedPaymentService.registerFailedPayment("order123");
     expect(response).toEqual({
       success: true,
       message: "El intento de pago fallido ha sido registrado correctamente."
     });
   });

   it("debería retornar un mensaje de error si no se encuentra el pago asociado al ID de pedido", async () => {
    //cero por que simula que no se encontró ningún pago asociado al ID de pedido proporcionado
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





 