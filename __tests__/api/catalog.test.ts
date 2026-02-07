import { GET, POST } from "@/app/api/products/route"; // Asumimos que esta es tu ruta
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';

// 1. MOCK DE LA BASE DE DATOS (PRISMA)
jest.mock('@/lib/prisma', () => {
  const { mockDeep } = require('jest-mock-extended');
  return {
    __esModule: true,
    prisma: mockDeep(),
  };
});

// 2. MOCK DE LA SESIÓN (NEXT-AUTH)
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// 3. MOCK DE LA RESPUESTA (NextResponse)
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("Gestión de Catálogo (Unitarias)", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------------------------------------------
  // HISTORIA 1: Como COMPRADOR, quiero ver el catálogo...
  // ------------------------------------------------------------------
  describe("GET /api/products (Ver Catálogo)", () => {
    
    it("Debe devolver una lista de productos activos correctamente", async () => {
      // A. PREPARAR EL ESCENARIO (GIVEN)
      const mockProducts = [
        { id: "1", name: "Laptop Gamer", price: 1500, stock: 5 },
        { id: "2", name: "Mouse RGB", price: 50, stock: 100 }
      ];
      
      prismaMock.product.findMany.mockResolvedValue(mockProducts as any);

      // B. EJECUTAR LA ACCIÓN (WHEN)
      const req = new Request("http://localhost:3000/api/products");
      // @ts-ignore
      const response = await GET(req);

      // C. VERIFICAR EL RESULTADO (THEN)
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe("Laptop Gamer");
      
      // Verificamos que se llamó a la DB
      expect(prismaMock.product.findMany).toHaveBeenCalled();
    });
  });

  // ------------------------------------------------------------------
  // HISTORIA 2: Como VENDEDOR, quiero gestionar (crear) productos...
  // ------------------------------------------------------------------
  describe("POST /api/products (Publicar Producto)", () => {

    it("Debe permitir crear un producto si el usuario es VENDEDOR", async () => {
      // A. PREPARAR (GIVEN)
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "seller-123", role: "vendedor" },
      });

      // 2. Simulamos que la DB crea el producto exitosamente
      const newProduct = { id: "prod-new", name: "Teclado Mecánico", price: 100 };
      prismaMock.product.create.mockResolvedValue(newProduct as any);

      // B. EJECUTAR (WHEN)
      const req = new Request("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({
          name: "Teclado Mecánico",
          price: 100,
          category_id: 1
        }),
      });

      // @ts-ignore
      const response = await POST(req);

      // C. VERIFICAR (THEN)
      expect(response.status).toBe(201); // Esperamos "Created"
      
      const data = await response.json();
      expect(data.name).toBe("Teclado Mecánico");

      // Verificamos que se llamó a create con los datos correctos
      expect(prismaMock.product.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          name: "Teclado Mecánico",
          seller: { 
            connect: { id: "seller-123" } 
          }
        })
      }));
    });

    it("Debe rechazar la creación (401) si es COMPRADOR", async () => {
      // A. PREPARAR
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: "buyer-1", role: "comprador" },
      });

      // B. EJECUTAR
      const req = new Request("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({ name: "Intento Hack" }),
      });

      // @ts-ignore
      const response = await POST(req);

      // C. VERIFICAR
      // Debe prohibirlo
      expect(response.status).toBe(401); 
      // Aseguramos que NO se llamó a la base de datos para crear nada
      expect(prismaMock.product.create).not.toHaveBeenCalled();
    });
  });

});