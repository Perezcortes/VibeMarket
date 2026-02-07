import { PUT } from "@/app/api/support/tickets/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';

// 1. Mocks
jest.mock('@/lib/prisma', () => {
  const { mockDeep } = require('jest-mock-extended');
  return {
    __esModule: true,
    prisma: mockDeep(),
  };
});

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options: any) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("API Soporte (Historia: Gestión de Tickets)", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("PUT: Debe agregar un mensaje y actualizar estado a 'en_proceso'", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
    });

    prismaMock.ticketMessage.create.mockResolvedValue({ id: "msg-1" } as any);
    
    prismaMock.supportTicket.update.mockResolvedValue({ 
        id: "tk-1", 
        status: "en_proceso" 
    } as any);

    const req = new Request("http://localhost:3000/api/support/tickets", {
      method: "PUT",
      body: JSON.stringify({
        ticketId: "tk-1",
        message: "Hola, te ayudo",
        status: "en_proceso"
      }),
    });

    // @ts-ignore
    const response = await PUT(req);

    expect(response.status).toBe(200);
    
    // Verificar que se creó el mensaje en la DB
    expect(prismaMock.ticketMessage.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
            message: "Hola, te ayudo",
            ticket_id: "tk-1"
        })
    }));

    // Verificar que cambió el estado del ticket
    expect(prismaMock.supportTicket.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "tk-1" },
        data: expect.objectContaining({ status: "en_proceso" })
    }));
  });
});