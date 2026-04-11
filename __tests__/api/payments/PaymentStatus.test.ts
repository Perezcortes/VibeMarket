import { GET } from "@/app/api/buyer/payments/status/route";
import { paymentErrorService } from "@/services/buyer/payments/errorPago.service";

//ejecutamos con jest --testPathPattern=PaymentStatus.test.ts para correr solo este test
// 1. Mock del servicio de pagos (No queremos llamar a la BD real en la prueba)
jest.mock("@/services/buyer/payments/errorPago.service", () => ({
  paymentErrorService: {
    checkPaymentStatus: jest.fn(),
  },
}));

// 2. Mock de NextResponse (Idéntico a tu ejemplo)
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

describe("API Payment Status (Historia: US012-D Compradores / Pago)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe retornar Error 400 si falta el orderId en la URL", async () => {
    // Simulamos una petición SIN el orderId
    const req = new Request("http://localhost:3000/api/buyer/payments/status");

    // @ts-ignore
    const response = await GET(req);
    
    expect(response.status).toBe(400); 

    const data = await response.json();
    expect(data.error).toBe("Falta el ID del pedido");
  });

  it("Debe retornar 200,la información del pago si el orderId es válido", async () => {
    // Simulamos la respuesta que nos daría el servicio
    const mockStatusResponse = {
      status: "RECHAZADO",
      message: "Tu pago ha sido rechazado.",
      action: "RETRY_PAYMENT",
      savedProgress: true
    };
    
    (paymentErrorService.checkPaymentStatus as jest.Mock).mockResolvedValue(mockStatusResponse);

    // Simulamos una petición CON el orderId
    const req = new Request("http://localhost:3000/api/buyer/payments/status?orderId=ORD-12345");

    // @ts-ignore
    const response = await GET(req);
    
    expect(response.status).toBe(200); 

    const data = await response.json();
    expect(data.status).toBe("RECHAZADO");
    expect(data.savedProgress).toBe(true);
    expect(paymentErrorService.checkPaymentStatus).toHaveBeenCalledWith("ORD-12345");
  });

  it("Debe retornar Error 500 si el servicio lanza una excepción", async () => {
    // Simulamos que la base de datos explotó
    (paymentErrorService.checkPaymentStatus as jest.Mock).mockRejectedValue(new Error("Error de conexión a la BD"));

    const req = new Request("http://localhost:3000/api/buyer/payments/status?orderId=ORD-FAIL");

    // @ts-ignore
    const response = await GET(req);
    
    expect(response.status).toBe(500); 

    const data = await response.json();
    expect(data.error).toBe("Error de conexión a la BD");
  });
});