import { PurchaseHistoryRepository } from '@/repositories/seller/catalog/BuysHistorial.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
  },
}));

describe('PurchaseHistoryRepository (HU008)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test
  });

  describe('execute', () => {
    it('debe listar el historial de órdenes de un usuario con detalles de productos y pagos', async () => {
      const userId = 'usuario-uuid-123';
      
      // Simulación de respuesta de la BD con la estructura de select definida
      const mockOrders = [
        {
          id: 'order-1',
          total_amount: 500.00,
          status: 'entregado',
          address: { city: 'Huajuapan', street: 'Calle Ficticia 123' },
          items: [
            {
              quantity: 2,
              unit_price: 250.00,
              product: { name: 'Camisa', images: [{ url: 'img.jpg' }] }
            }
          ],
          payments: [{ provider: 'PayPal', status: 'aprobado', amount: 500.00 }],
          history: [{ changed_at: new Date() }]
        }
      ];

      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

      const result = await PurchaseHistoryRepository.execute(userId);

      // Verificamos que se llamó con el filtro de usuario correcto
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { buyer_id: userId }
        })
      );
      
      expect(result).toEqual(mockOrders);
      expect(result[0].total_amount).toBe(500.00);
    });
  });

  describe('getExpenseSummary', () => {
    it('debe devolver el resumen estadístico de gastos (suma y conteo)', async () => {
      const userId = 'usuario-uuid-123';
      
      // Respuesta simulada de la agregación de Prisma
      const mockAggregate = {
        _sum: { total_amount: 1250.50 },
        _count: { id: 3 }
      };

      (prisma.order.aggregate as jest.Mock).mockResolvedValue(mockAggregate);

      const result = await PurchaseHistoryRepository.getExpenseSummary(userId);

      // Verificamos que solo cuente órdenes con status 'pagado'
      expect(prisma.order.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { 
            buyer_id: userId,
            status: 'pagado'
          }
        })
      );

      expect(result._sum.total_amount).toBe(1250.50);
      expect(result._count.id).toBe(3);
    });
  });
});