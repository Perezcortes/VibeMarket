/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Monitoreo de Pedidos Recibidos (Pruebas Unitarias)
 * Historia de Usuario: US003-A: Monitoreo de Pedidos Recibidos 
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ari Ramirez
 * FECHA: 11 de marzo de 2026
 */

import { OrderMonitoringService } from "@/services/seller/orders/Ordermonitoring.service";

// ─── Mock del Repositorio ──────────────────────────────────────────────────
const mockRepository = {
  findReceivedOrders: jest.fn(),
};

// ─── Datos de Prueba ───────────────────────────────────────────────────────
const SELLER_ID = "seller-abc-123";

const mockOrders = [
  {
    id: "order-1",
    status: "pendiente",
    buyer: { full_name: "Carlos López", email: "carlos@mail.com" },
    address: { street: "Calle 5", city: "CDMX" },
    items: [
      {
        id: "item-1",
        quantity: 2,
        product: { id: "prod-1", name: "Camiseta", seller_id: SELLER_ID },
      },
    ],
  },
  {
    id: "order-2",
    status: "shipped",
    buyer: { full_name: "Ana Torres", email: "ana@mail.com" },
    address: { street: "Av. Reforma", city: "Guadalajara" },
    items: [
      {
        id: "item-2",
        quantity: 1,
        product: { id: "prod-2", name: "Tenis", seller_id: SELLER_ID },
      },
    ],
  },
];

// ─── Suite de Pruebas ──────────────────────────────────────────────────────
describe("OrderMonitoringService — US003-A", () => {
  let service: OrderMonitoringService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OrderMonitoringService(mockRepository as any);
  });

  // ── getReceivedOrders ────────────────────────────────────────────────────
  describe("getReceivedOrders()", () => {
    it("debería retornar la lista de pedidos del vendedor", async () => {
      mockRepository.findReceivedOrders.mockResolvedValue(mockOrders);

      const result = await service.getReceivedOrders(SELLER_ID);

      expect(mockRepository.findReceivedOrders).toHaveBeenCalledWith(SELLER_ID);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("order-1");
    });

    it("debería retornar arreglo vacío cuando no hay pedidos", async () => {
      mockRepository.findReceivedOrders.mockResolvedValue([]);

      const result = await service.getReceivedOrders(SELLER_ID);

      expect(result).toEqual([]);
    });

    it("debería lanzar error si sellerId está vacío", async () => {
      await expect(service.getReceivedOrders("")).rejects.toThrow(
        "El ID del vendedor es requerido."
      );
      expect(mockRepository.findReceivedOrders).not.toHaveBeenCalled();
    });

    it("debería lanzar error si sellerId es solo espacios", async () => {
      await expect(service.getReceivedOrders("   ")).rejects.toThrow(
        "El ID del vendedor es requerido."
      );
    });

    it("debería propagar error del repositorio", async () => {
      mockRepository.findReceivedOrders.mockRejectedValue(
        new Error("DB connection failed")
      );

      await expect(service.getReceivedOrders(SELLER_ID)).rejects.toThrow(
        "DB connection failed"
      );
    });
  });

  // ── hasPendingOrders ─────────────────────────────────────────────────────
  describe("hasPendingOrders()", () => {
    it("debería retornar true cuando existe al menos un pedido PENDING", async () => {
      mockRepository.findReceivedOrders.mockResolvedValue(mockOrders);

      const result = await service.hasPendingOrders(SELLER_ID);

      expect(result).toBe(true);
    });

    it("debería retornar false cuando no hay pedidos PENDING", async () => {
      const nopendings = mockOrders.map((o) => ({ ...o, status: "SHIPPED" }));
      mockRepository.findReceivedOrders.mockResolvedValue(nopendings);

      const result = await service.hasPendingOrders(SELLER_ID);

      expect(result).toBe(false);
    });

    it("debería retornar false cuando no hay pedidos", async () => {
      mockRepository.findReceivedOrders.mockResolvedValue([]);

      const result = await service.hasPendingOrders(SELLER_ID);

      expect(result).toBe(false);
    });

    it("debería lanzar error si sellerId está vacío", async () => {
      await expect(service.hasPendingOrders("")).rejects.toThrow(
        "El ID del vendedor es requerido."
      );
    });
  });
});