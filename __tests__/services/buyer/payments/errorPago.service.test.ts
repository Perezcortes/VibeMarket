/**
 *TEST 
 * Historia de Usuario: US012-D
 */
import { PaymentErrorService } from "@/services/buyer/payments/errorPago.service";
import { PaymentStatusRepository } from "@/repositories/buyer/payments/errorPago.repository";

//ejecucion npx jest __tests__/services/buyer/errorPago.service.test.ts

// Mock del repositorio para controlar las respuestas en los tests
jest.mock("@/repositories/buyer/payments/errorPago.repository");

//describe es un bloque que agrupa varios tests relacionados,
//  en este caso, todos los tests para PaymentErrorService

describe("Guía de error de pago- US012-D", () => {
    //let reasignara la variable paymentErrorService antes de cada test, para asegurarnos de tener una instancia fresca
  let paymentErrorService: PaymentErrorService;

  //beforeEach se ejecuta antes de cada test dentro del bloque describe,
  //  lo que nos permite configurar el entorno de prueba de manera consistente
  beforeEach(() => {
    paymentErrorService = new PaymentErrorService();
    jest.clearAllMocks(); // Limpiar mocks antes de cada test
  });

  // Aquí comienzan los tests individuales,
  //  cada uno con un it que describe lo que se espera que haga el método checkPaymentStatus
  it("debería retornar estado APROBADO cuando el pago es aprobado", async () => {
    //as jest.Mock le dice a TypeScript que estamos tratando con un mock 
    //lo que nos permite usar métodos como mockResolvedValue 
    // para simular la respuesta del repositorio
    //en este caso simulamos que el estado del pago es 'aprobado' para la orden "order123"
    (PaymentStatusRepository.getPaymentStatusByOrderId as jest.Mock).mockResolvedValue({ status: 'aprobado' });

    // Llamamos al método que estamos probando y verificamos que la respuesta sea la esperada
    //aqui paymentErrorService.checkPaymentStatus("order123") simula la llamada al servicio
    //  con un ID de pedido específico
    const response = await paymentErrorService.checkPaymentStatus("order123");
    //en este caso simulamos que el método checkPaymentStatus devuelve un mensaje de éxito para un pago aprobado
    expect(response).toEqual({
      status: "APROBADO",
      message: "¡Tu pago ha sido aprobado! Gracias por tu compra."
    });
  });

  it("debería retornar estado PENDIENTE cuando el pago está pendiente", async () => {
    (PaymentStatusRepository.getPaymentStatusByOrderId as jest.Mock).mockResolvedValue({ status: 'pendiente' });    

    const response = await paymentErrorService.checkPaymentStatus("order123");
    expect(response).toEqual({
      status: "PENDIENTE",
      message: "Tu pago está pendiente de procesamiento."
    });
  });

  it("debería retornar estado RECHAZADO cuando el pago es rechazado", async () => {
    (PaymentStatusRepository.getPaymentStatusByOrderId as jest.Mock).mockResolvedValue({ status: 'rechazado' });

    const response = await paymentErrorService.checkPaymentStatus("order123");
    expect(response).toEqual({
      status: "RECHAZADO",
      message: "Tu pago ha sido rechazado. Por favor, intenta con otro método de pago o contacta a soporte.",
      action: "RETRY_PAYMENT", 
      redirectUrl: "/checkout/payment-methods",
      savedProgress: true
    });
  });

  it("debería retornar estado REEMBOLSADO cuando el pago es reembolsado", async () => {
    (PaymentStatusRepository.getPaymentStatusByOrderId as jest.Mock).mockResolvedValue({ status: 'reembolsado' });

    const response = await paymentErrorService.checkPaymentStatus("order123");
    expect(response).toEqual({
      status: "REEMBOLSADO",
      message: "Tu pago ha sido reembolsado. Si tienes preguntas, contacta a soporte."
    });
  });

  it("debería retornar estado DESCONOCIDO cuando el estado del pago no es reconocido", async () => {
    (PaymentStatusRepository.getPaymentStatusByOrderId as jest.Mock).mockResolvedValue({ status: 'otro_estado' });

    const response = await paymentErrorService.checkPaymentStatus("order123");
    expect(response).toEqual({
      status: "DESCONOCIDO",
      message: "No se pudo determinar el estado de tu pago. Por favor, contacta a soporte para más información."
    });
  });

  it("debería lanzar un error si no se proporciona un ID de pedido", async () => {
    await expect(paymentErrorService.checkPaymentStatus("")).rejects.toThrow("Se requiere un ID de pedido válido para verificar el estado del pago.");
  });

  it("debería manejar errores internos y lanzar un mensaje adecuado", async () => {
    (PaymentStatusRepository.getPaymentStatusByOrderId as jest.Mock).mockRejectedValue(new Error("Error de base de datos"));

    await expect(paymentErrorService.checkPaymentStatus("order123")).rejects.toThrow("Error en verificación de estado de pago: Error de base de datos");
  });
});