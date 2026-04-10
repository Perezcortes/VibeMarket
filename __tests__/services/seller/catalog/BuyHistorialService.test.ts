/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Control de Gastos y Compras (Pruebas Unitarias)
 * Historia de Usuario: HU008 - Historial de compras para control de gastos
 * AUTOR (Responsable): Yamil Morales
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 12 de marzo de 2026
 */

import { PurchaseHistoryService } from "@/services/seller/catalog/BuysHistorial.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  execute: jest.fn(),
  getExpenseSummary: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const USER_ID = "user-123";

const mockOrders = [
  {
    id: "order-001",
    total_amount: 1500.50,
    status: "pagado",
    history: [{ changed_at: new Date("2026-03-01T10:00:00Z") }],
    payments: [
      {
        provider: "PayPal",
        created_at: new Date("2026-03-01T10:05:00Z"),
      },
    ],
    items: [
      {
        quantity: 2,
        unit_price: 750.25,
        product: {
          name: "Tenis Deportivos",
          images: [{ url: "http://image.com/tenis.jpg" }],
        },
      },
    ],
  },
];

const mockStats = {
  _sum: { total_amount: 3000.00 },
  _count: { id: 2 },
};

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("PurchaseHistoryService — HU008", () => {
  let service: PurchaseHistoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PurchaseHistoryService(mockRepository as any);
  });

  // ── getFullHistory ───────────────────────────────────────────────────────
  describe("getFullHistory()", () => {
    it("debería retornar el historial de compras procesado correctamente", async () => {
      mockRepository.execute.mockResolvedValue(mockOrders);

      const result = await service.getFullHistory(USER_ID);

      expect(mockRepository.execute).toHaveBeenCalledWith(USER_ID);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("order-001");
      expect(result[0].total).toBe(1500.50);
      expect(result[0].paymentMethod).toBe("PayPal");
      expect(result[0].items[0].subtotal).toBe(1500.50); // 2 * 750.25
    });

    it("debería manejar órdenes sin pagos estableciendo 'No especificado'", async () => {
      const orderNoPayment = [{ ...mockOrders[0], payments: [] }];
      mockRepository.execute.mockResolvedValue(orderNoPayment);

      const result = await service.getFullHistory(USER_ID);

      expect(result[0].paymentMethod).toBe("No especificado");
      expect(result[0].purchaseDate).not.toBeNull(); // Debería tomar el de history
    });

    it("debería retornar un arreglo vacío si el usuario no tiene compras", async () => {
      mockRepository.execute.mockResolvedValue([]);

      const result = await service.getFullHistory(USER_ID);

      expect(result).toEqual([]);
      expect(mockRepository.execute).toHaveBeenCalled();
    });

    it("debería propagar errores si el repositorio falla", async () => {
      mockRepository.execute.mockRejectedValue(new Error("Error de conexión"));

      await expect(service.getFullHistory(USER_ID)).rejects.toThrow("Error de conexión");
    });
  });

  // ── getUserExpenseSummary ────────────────────────────────────────────────
  describe("getUserExpenseSummary()", () => {
    it("debería calcular el resumen de gastos y el ticket promedio", async () => {
      mockRepository.getExpenseSummary.mockResolvedValue(mockStats);

      const result = await service.getUserExpenseSummary(USER_ID);

      expect(mockRepository.getExpenseSummary).toHaveBeenCalledWith(USER_ID);
      expect(result.totalSpent).toBe(3000.00);
      expect(result.totalOrders).toBe(2);
      expect(result.averageTicket).toBe(1500.00); // 3000 / 2
    });

    it("debería retornar valores en cero si no hay gastos registrados", async () => {
      mockRepository.getExpenseSummary.mockResolvedValue({
        _sum: { total_amount: null },
        _count: { id: 0 },
      });

      const result = await service.getUserExpenseSummary(USER_ID);

      expect(result.totalSpent).toBe(0);
      expect(result.averageTicket).toBe(0);
      expect(result.totalOrders).toBe(0);
    });

    it("debería manejar correctamente montos que vienen como Decimal de Prisma", async () => {
      // Simulando que el valor viene como objeto Decimal o string numérico
      mockRepository.getExpenseSummary.mockResolvedValue({
        _sum: { total_amount: "500.50" },
        _count: { id: 1 },
      });

      const result = await service.getUserExpenseSummary(USER_ID);

      expect(result.totalSpent).toBe(500.50);
      expect(typeof result.totalSpent).toBe("number");
    });

    it("debería propagar errores del repositorio en estadísticas", async () => {
      mockRepository.getExpenseSummary.mockRejectedValue(new Error("Database error"));

      await expect(service.getUserExpenseSummary(USER_ID)).rejects.toThrow("Database error");
    });
  });
});