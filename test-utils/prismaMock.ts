import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { prisma } from '@/lib/prisma' 

// Esto le dice a Jest: "Cuando alguien pida importar la base de datos, dale este mock en su lugar"
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>