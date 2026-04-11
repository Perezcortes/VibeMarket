import { GET, PATCH } from "@/app/api/courier/shiftLiquidar/route";
import { LiquidarRepartoService } from "@/services/courier/shift/liquidarReparto.service";

// 1. Mock del Servicio (Igual que mockeas Prisma)
jest.mock("@/services/courier/shift/liquidarReparto.service");

// 2. Mock de NextResponse (EL TRUCO MÁGICO que usa tu equipo)
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

describe("API Liquidar Repartos - US016-C (Ariadna & José)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET: Obtener pedidos", () => {
    it("Debe devolver 400 si falta el courierId", async () => {
      // Simulamos la URL sin el parámetro
      const req = new Request("http://localhost/api/liquidate");
      
      // @ts-ignore
      const response = await GET(req);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Falta el ID del repartidor");
    });

    it("Debe devolver 200 y los pedidos si el courierId es válido", async () => {
      const mockResult = { success: true, data: [{ id: "order123" }] };
      // Forzamos el mock del método en la instancia
      (LiquidarRepartoService.prototype.getOrdersToLiquidate as jest.Mock).mockResolvedValue(mockResult);

      const req = new Request("http://localhost/api/liquidate?courierId=C001");
      
      // @ts-ignore
      const response = await GET(req);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockResult);
    });
  });

  describe("PATCH: Liquidar pedido", () => {
    it("Debe devolver 400 si falta el orderId en el body", async () => {
      const req = new Request("http://localhost/api/liquidate", {
        method: "PATCH",
        body: JSON.stringify({}), // Body vacío
      });

      // @ts-ignore
      const response = await PATCH(req);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Falta el ID del pedido");
    });

    it("Debe devolver 200 si se liquida correctamente", async () => {
      const mockResult = { success: true, message: "Liquidado" };
      (LiquidarRepartoService.prototype.markOrderAsDelivered as jest.Mock).mockResolvedValue(mockResult);

      const req = new Request("http://localhost/api/liquidate", {
        method: "PATCH",
        body: JSON.stringify({ orderId: "ORD-001" }),
      });

      // @ts-ignore
      const response = await PATCH(req);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("Debe devolver 500 si el servicio falla catastróficamente", async () => {
      (LiquidarRepartoService.prototype.markOrderAsDelivered as jest.Mock).mockRejectedValue(new Error("Fallo de DB"));

      const req = new Request("http://localhost/api/liquidate", {
        method: "PATCH",
        body: JSON.stringify({ orderId: "ORD-999" }),
      });

      // @ts-ignore
      const response = await PATCH(req);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe("Fallo de DB");
    });
  });
});