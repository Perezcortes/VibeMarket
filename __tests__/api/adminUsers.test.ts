import { GET, POST as POST_USER, PUT, DELETE } from "@/app/api/admin/users/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import bcrypt from "bcryptjs";

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

// 3. Mock de Bcrypt (Para la creación de usuario)
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

// 4. Mock de NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("API Admin Users (Historia: CRUD Completo)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- GET (VER) ---
  it("GET: Debe devolver lista de usuarios si es Admin", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "admin" } });
    const mockUsers = [{ id: "1", full_name: "User 1", role: "vendedor" }];
    prismaMock.user.findMany.mockResolvedValue(mockUsers as any);

    // @ts-ignore
    const response = await GET();
    expect(response.status).toBe(200);
  });

  // --- POST (CREAR) ---
  it("POST: Debe crear un usuario nuevo correctamente", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "admin" } });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hash123");
    
    // Simulamos que el correo NO existe
    prismaMock.user.findUnique.mockResolvedValue(null);
    // Simulamos creación exitosa
    prismaMock.user.create.mockResolvedValue({ id: "new", email: "new@test.com" } as any);

    const req = new Request("http://localhost:3000/api/admin/users", {
      method: "POST",
      body: JSON.stringify({ full_name: "Nuevo", email: "new@test.com", password: "123", role: "vendedor" }),
    });

    // @ts-ignore
    const response = await POST_USER(req);
    expect(response.status).toBe(200); // Prisma create retorna el objeto
    expect(prismaMock.user.create).toHaveBeenCalled();
  });

  // --- PUT (EDITAR) ---
  it("PUT: Debe actualizar un usuario existente", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "admin" } });
    
    // Simulamos actualización exitosa
    prismaMock.user.update.mockResolvedValue({ id: "1", role: "admin" } as any);

    const req = new Request("http://localhost:3000/api/admin/users", {
      method: "PUT",
      body: JSON.stringify({ id: "1", full_name: "Editado", role: "admin", is_active: "true" }),
    });

    // @ts-ignore
    const response = await PUT(req);
    expect(response.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalled();
  });

  // --- DELETE (ELIMINAR) ---
  it("DELETE: Debe eliminar un usuario correctamente", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { role: "admin" } });
    prismaMock.user.delete.mockResolvedValue({ id: "123" } as any);

    const req = new Request("http://localhost:3000/api/admin/users?id=123", { method: "DELETE" });

    // @ts-ignore
    const response = await DELETE(req);
    expect(response.status).toBe(200);
  });
});