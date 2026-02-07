import { POST } from "@/app/api/auth/register/route";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import bcrypt from "bcryptjs";

// 1. Mock de Prisma (Base de datos)
jest.mock('@/lib/prisma', () => {
  const { mockDeep } = require('jest-mock-extended');
  return {
    __esModule: true,
    prisma: mockDeep(),
  };
});

// 2. Mock de Bcrypt (Encriptación)
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

// 3. MOCK DE NEXT RESPONSE 
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200, // Si no se manda status, asume 200
      json: async () => data,        // Devuelve los datos directamente
    }),
  },
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("API Registro (Historia: Autenticación)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe crear un usuario con la contraseña encriptada", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pass");
    prismaMock.user.findUnique.mockResolvedValue(null);
    
    prismaMock.user.create.mockResolvedValue({
      id: "1",
      full_name: "Test User",
      email: "new@test.com",
      password_hash: "hashed_pass",
      role: "comprador",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    } as any);

    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        full_name: "Test User",
        email: "new@test.com",
        password: "password123",
      }),
    });

    // @ts-ignore
    const response = await POST(req);
    
    expect(response.status).toBe(200); 

    const data = await response.json();
    expect(data.email).toBe("new@test.com");
  });

  it("Debe fallar si el email ya existe", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "1", email: "exist@test.com" } as any);

    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "exist@test.com", password: "123", full_name: "X" }),
    });

    // @ts-ignore
    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});