import { GET, DELETE } from "@/app/api/admin/users/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';

// 1. Mock de Prisma
jest.mock('@/lib/prisma', () => {
  const { mockDeep } = require('jest-mock-extended');
  return {
    __esModule: true,
    prisma: mockDeep(),
  };
});

// 2. Mock de NextAuth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// 3. MOCK DE NEXT RESPONSE (¡La solución definitiva!)
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("API Admin Users (Historia: CRUD y Roles)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe rechazar acceso (401) si el usuario NO es admin", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { name: "Vendedor", role: "vendedor" },
    });

    // @ts-ignore
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("Debe devolver lista de usuarios si es Admin", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "admin" },
    });

    const mockUsers = [
      { id: "1", full_name: "User 1", role: "vendedor", is_active: true }
    ];
    prismaMock.user.findMany.mockResolvedValue(mockUsers as any);

    // @ts-ignore
    const response = await GET();
    expect(response.status).toBe(200);

    // Esto ya no fallará porque estamos usando nuestro mock de json
    const data = await response.json();
    expect(data[0].full_name).toBe("User 1");
  });

  it("Debe eliminar un usuario correctamente", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "admin" },
    });

    prismaMock.user.delete.mockResolvedValue({ id: "123" } as any);

    const req = new Request("http://localhost:3000/api/admin/users?id=123", {
      method: "DELETE",
    });

    // @ts-ignore
    const response = await DELETE(req);

    expect(response.status).toBe(200);
    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: "123" },
    });
  });
});