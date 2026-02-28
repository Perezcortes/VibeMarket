import { RutasOptimizadasRepository } from "@/repositories/courier/routes/rutasOptimizadas.repository";
import { prisma } from "@/lib/prisma";

//Ejecucion npm test __tests__/repositories/courier/routes/rutasOptimizadas.test.ts 
//(mandamos a mimir) a Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
    },
  },
}));

describe("US016-D - Optimización de rutas", () => {
  const mockCourierId = "fceef6c4-f166-47fb-ae70-16f3b15600d0";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe consultar los pedidos pendientes con sus direcciones para un repartidor", async () => {
    // Le decimos al espía que no devuelva nada
    (prisma.order.findMany as jest.Mock).mockResolvedValue([]);

    // Ejecutamos la función del repositorio
    await RutasOptimizadasRepository.getPendingOrdersWithAddress(mockCourierId);

    // Verificamos que se haya llamado con los parámetros correctos
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: {
        courier_id: mockCourierId,
        status: "enviado",
      },
      include: {
        address: true, // Verificamos que sí pida la dirección (TRAIGA LA TABLA ADDRESS)
      },
    });
  });
});