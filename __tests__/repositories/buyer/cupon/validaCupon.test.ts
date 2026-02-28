import { ValidaCuponRepository } from "@/repositories/buyer/cupon/validaCupon.repository";
import { prisma } from "@/lib/prisma";

//ejecucion npm test -- __tests__/repositories/buyer/cupon/validaCupon.test.ts
// Mockeamos a Prisma (Recuerda cambiar "cupon" si tu modelo se llama distinto)
jest.mock("@/lib/prisma", () => ({
  prisma: {
    cupon: {
      findUnique: jest.fn(),
    },
  },
}));

describe("US012-G - Validación de cupón", () => {
  // Como tu ID en MySQL es int(11), usamos un número real (ej. 1), no un string
  const mockCouponId = 1; 

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Debe buscar el cupón por ID y regresar únicamente su estado", async () => {
    // 1. Preparamos la respuesta falsa de la base de datos (ej. un cupón activo)
    const mockDbResponse = { estado: "activo" };

    (prisma.cupon.findUnique as jest.Mock).mockResolvedValue(mockDbResponse);

    // 2. Ejecutamos nuestra función del repositorio
    const result = await ValidaCuponRepository.getCouponState(mockCouponId);

    // 3. Verificamos que el espía haya buscado con el ID correcto y el "select"
    expect(prisma.cupon.findUnique).toHaveBeenCalledWith({
      where: { id: mockCouponId },
      select: { estado: true },
    });

    // 4. Verificamos que el resultado sea exactamente el estado que simulamos
    expect(result).toEqual(mockDbResponse);
  });
});