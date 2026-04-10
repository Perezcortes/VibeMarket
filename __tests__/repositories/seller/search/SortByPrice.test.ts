import { ProductSortRepository } from '@/repositories/seller/search/SortByPrice.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar las consultas de ordenamiento
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}));

describe('ProductSortRepository (HU012)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada ejecución [cite: 2026-02-07]
  });

  it('debe ordenar los productos por precio de forma descendente (mayor a menor) por defecto', async () => {
    const mockProducts = [
      { id: '1', name: 'Producto Caro', price: 1000.00 },
      { id: '2', name: 'Producto Barato', price: 100.00 }
    ];

    (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

    const result = await ProductSortRepository.execute(); // Usamos el valor por defecto 'desc'

    // Verificamos que se aplique el orden descendente y los filtros de stock [cite: 2026-02-07]
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          is_active: true,
          stock: { gt: 0 }
        },
        orderBy: {
          price: 'desc'
        }
      })
    );
    expect(result).toEqual(mockProducts);
  });

  it('debe ordenar los productos por precio de forma ascendente (menor a mayor) cuando se especifica', async () => {
    await ProductSortRepository.execute('asc');

    // Verificamos que se pase la dirección correcta al método orderBy de Prisma [cite: 2026-02-07]
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          price: 'asc'
        }
      })
    );
  });

  it('debe solicitar la información básica necesaria para las tarjetas del catálogo', async () => {
    await ProductSortRepository.execute();

    // Validamos que la selección de campos incluya imágenes y categorías [cite: 2026-02-07]
    expect(prisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          id: true,
          price: true,
          images: { take: 1, select: { url: true } },
          category: { select: { name: true } }
        })
      })
    );
  });
});