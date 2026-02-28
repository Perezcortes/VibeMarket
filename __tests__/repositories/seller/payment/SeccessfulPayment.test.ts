import { PaymentConfirmationRepository } from '@/repositories/seller/payment/SeccessfulPayment.repository';
import { prisma } from '@/lib/prisma';

// 1. Mockeamos el cliente de Prisma para interceptar la transacción y las actualizaciones
jest.mock('@/lib/prisma', () => ({
  prisma: {
    // Simulamos que $transaction ejecuta el callback inmediatamente con el mock de prisma
    $transaction: jest.fn((callback) => callback(prisma)),
    payment: {
      update: jest.fn(),
    },
    order: {
      update: jest.fn(),
    },
  },
}));

describe('PaymentConfirmationRepository (HU020)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada prueba [cite: 2026-02-07]
  });

  it('debe actualizar el estado del pago y de la orden atómicamente', async () => {
    const orderId = 'order-123';
    const paymentId = 'pay-456';

    const mockPayment = { id: paymentId, status: 'aprobado' };
    const mockOrder = { 
      id: orderId, 
      status: 'pagado',
      buyer: { full_name: 'Yamil', email: 'yamil@example.com' }
    };

    // Configuramos las respuestas de los mocks
    (prisma.payment.update as jest.Mock).mockResolvedValue(mockPayment);
    (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);

    const result = await PaymentConfirmationRepository.confirmSuccess(orderId, paymentId);

    // 2. Validamos que se inició una transacción [cite: 2026-02-07]
    expect(prisma.$transaction).toHaveBeenCalled();

    // 3. Validamos la actualización del pago
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: paymentId },
      data: { status: 'aprobado' },
    });

    // 4. Validamos la actualización de la orden y la inclusión de datos del comprador [cite: 2026-02-07]
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: orderId },
      data: { status: 'pagado' },
      include: {
        buyer: {
          select: {
            full_name: true,
            email: true
          }
        }
      }
    });

    // 5. Verificamos el resultado consolidado
    expect(result).toEqual({ order: mockOrder, payment: mockPayment });
  });

  it('debe fallar si alguna de las actualizaciones falla (propaga el error)', async () => {
    (prisma.payment.update as jest.Mock).mockRejectedValue(new Error('Error de DB'));

    await expect(PaymentConfirmationRepository.confirmSuccess('id', 'id'))
      .rejects.toThrow('Error de DB');
  });
});