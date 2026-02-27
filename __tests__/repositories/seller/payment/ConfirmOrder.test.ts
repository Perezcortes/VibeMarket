import { OrderConfirmationRepository } from '@/repositories/seller/payment/ConfirmOrder.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar la consulta única
jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findUnique: jest.fn(),
    },
  },
}));

describe('OrderConfirmationRepository (HU019)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test para garantizar independencia
  });

  it('debe recuperar el resumen completo de la orden incluyendo dirección, productos y pagos', async () => {
    const orderId = 'order-uuid-999';
    
    // Simulación del objeto relacional complejo que devuelve MariaDB
    const mockOrderSummary = {
      id: orderId,
      total_amount: 1500.50,
      status: 'pendiente',
      address: {
        street: 'Av. Reforma 100',
        city: 'Ciudad de México',
        state: 'CDMX',
        postal_code: '01000',
        country: 'México'
      },
      items: [
        {
          quantity: 1,
          unit_price: 1500.50,
          product: {
            name: 'Smartphone Vibe',
            images: [{ url: 'vibe.jpg' }]
          }
        }
      ],
      payments: [
        {
          provider: 'PayPal',
          amount: 1500.50,
          status: 'pendiente'
        }
      ]
    };

    (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrderSummary);

    const result = await OrderConfirmationRepository.getOrderSummary(orderId);

    // Verificamos que se llame con el ID correcto
    expect(prisma.order.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: orderId }
      })
    );

    // Validamos la integridad de los datos de la "vista previa" de compra
    expect(result).toEqual(mockOrderSummary);
    expect(result?.address.city).toBe('Ciudad de México');
    expect(result?.items[0].product.name).toBe('Smartphone Vibe');
    expect(result?.payments[0].provider).toBe('PayPal');
  });

  it('debe devolver null si la orden no existe en la base de datos', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await OrderConfirmationRepository.getOrderSummary('id-inexistente');

    expect(result).toBeNull();
  });
});