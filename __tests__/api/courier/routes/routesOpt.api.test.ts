import { GET } from "@/app/api/courier/routesOptimizada/route"; // Ajusta la ruta a tu archivo real
import { RutasOptimizadasService } from "@/services/courier/routes/rutasOptimizadas.service";

// 1. Mock del Servicio
jest.mock("@/services/courier/routes/rutasOptimizadas.service");

// 2. Mock de NextResponse (El truco para evitar errores de JSON)
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

describe("API Rutas Optimizadas - US016-D (Ariadna & José)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe devolver 400 si no se proporciona el courierId", async () => {
    const req = new Request("http://localhost/api/routes");
    
    // @ts-ignore
    const response = await GET(req);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Falta el ID del repartidor");
  });

  it("Debe devolver 200 y las rutas si el courierId es válido", async () => {
    const mockRutas = { 
      success: true, 
      data: [
        { id: "ORD-001", address: "Av. Siempre Viva 742", client: "Homer Simpson" },
        { id: "ORD-002", address: "Calle Falsa 123", client: "Bart Simpson" }
      ] 
    };

    // Mockeamos la respuesta del servicio en el prototipo
    (RutasOptimizadasService.prototype.getPendingOrdersWithAddress as jest.Mock).mockResolvedValue(mockRutas);

    const req = new Request("http://localhost/api/routes?courierId=COURIER_007");
    
    // @ts-ignore
    const response = await GET(req);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.length).toBe(2);
    expect(data.data[0].address).toBe("Av. Siempre Viva 742");
  });

  it("Debe devolver 500 si el servicio de optimización falla", async () => {
    (RutasOptimizadasService.prototype.getPendingOrdersWithAddress as jest.Mock)
      .mockRejectedValue(new Error("Error de conexión con el servicio de mapas"));

    const req = new Request("http://localhost/api/routes?courierId=COURIER_007");
    
    // @ts-ignore
    const response = await GET(req);
    
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Error de conexión con el servicio de mapas");
  });
});