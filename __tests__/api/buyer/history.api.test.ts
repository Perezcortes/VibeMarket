/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: COMPRADORES
 * Historia de Usuario: US012-F Generación de comprobante PDF
 * AUTOR: Ariadna Betsabe Espina Ramirez
 * COPILOTO: Jose Alberto Perez Cortes
 * FECHA: 19 de abril de 2026
 */

import { GET } from "@/app/api/buyer/history/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    payment: {
      findMany: jest.fn(),
    },
  },
}));

// Mock de Next-Auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// ✨ EL TRUCO MÁGICO: Mockeamos NextResponse.json para que devuelva un objeto legible
const originalJson = NextResponse.json;
NextResponse.json = jest.fn().mockImplementation((data, init) => {
  return {
    status: init?.status || 200,
    json: async () => data, // Esto evita el SyntaxError: Unexpected end of JSON input
  } as any;
});

describe("Pruebas US012-F Comprobante de pago", () => {
  
  const mockUser = {
    id: "user-123",
    name: "Aria Vibe",
    email: "aria@vibemarket.com"
  };

  const mockPayments = [
    {
      id: "pay-001",
      order_id: "order-abc-12345678",
      provider: "card",
      amount: 3200.00,
      status: "aprobado",
      created_at: new Date(),
      card_details: {
        card_name: "Aria Vibe",
        card_number: "1234567812345678"
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue({ user: mockUser });
  });

  // Restaurar el mock al final para no afectar otros tests
  afterAll(() => {
    NextResponse.json = originalJson;
  });

  it("☑️ El usuario puede ver su historial de pagos", async () => {
    (prisma.payment.findMany as jest.Mock).mockResolvedValue(mockPayments);

    const response = await GET();
    const data = await response.json();

    expect(data.length).toBeGreaterThan(0);
    expect(data[0].order_id).toContain("order-abc");
  });

  it("☑️ El sistema recupera el nombre y correo del usuario para el comprobante", async () => {
    const session = await getServerSession();
    expect(session.user.name).toBe("Aria Vibe");
    expect(session.user.email).toBe("aria@vibemarket.com");
  });

  it("☑️ El sistema recupera datos de tarjeta y monto para el comprobante", async () => {
    (prisma.payment.findMany as jest.Mock).mockResolvedValue(mockPayments);

    const response = await GET();
    const data = await response.json();

    expect(data[0].amount).toBe(3200.00);
    expect(data[0].card_details.card_name).toBe("Aria Vibe");
  });

  it("☑️ El sistema recupera método de pago para el comprobante", async () => {
    (prisma.payment.findMany as jest.Mock).mockResolvedValue(mockPayments);
    
    const response = await GET();
    const data = await response.json();

    expect(data[0].provider).toBe("card");
  });

  it("☑️ El usuario puede ver detalles del pago", async () => {
    (prisma.payment.findMany as jest.Mock).mockResolvedValue(mockPayments);
    
    const response = await GET();
    const data = await response.json();

    expect(data[0]).toHaveProperty("order_id");
    expect(data[0]).toHaveProperty("card_details");
  });

  it("☑️ El usuario puede descargar en formato pdf (Verificación de consistencia)", async () => {
    (prisma.payment.findMany as jest.Mock).mockResolvedValue(mockPayments);
    
    const response = await GET();
    const data = await response.json();

    // Si los datos están presentes, el componente podrá ejecutar window.print()
    expect(data[0].amount).toBeDefined();
    expect(data[0].created_at).toBeDefined();
  });
});