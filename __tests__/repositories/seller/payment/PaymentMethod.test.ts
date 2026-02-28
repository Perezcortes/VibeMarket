import { PaymentMethodRepository } from '@/repositories/seller/payment/PaymentMethod.repository';
import { prisma } from '@/lib/prisma';
import { PaymentStatus } from '@prisma/client';

// 1. Mockeamos el cliente de Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    payment: {
      upsert: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('PaymentMethodRepository (HU018)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test [cite: 2026-02-07]
  });

  describe('execute', () => {
    it('debe registrar un nuevo método de pago o actualizar uno existente como pendiente', async () => {
      const inputData = {
        order_id: 'order-123',
        provider: 'PayPal',
        amount: 250.00
      };

      const mockResponse = {
        id: 'order-123',
        ...inputData,
        status: 'pendiente'
      };

      (prisma.payment.upsert as jest.Mock).mockResolvedValue(mockResponse);

      const result = await PaymentMethodRepository.execute(inputData);

      // Verificamos que se use upsert para manejar la persistencia del intento de pago [cite: 2026-02-07]
      expect(prisma.payment.upsert).toHaveBeenCalledWith({
        where: { id: inputData.order_id },
        update: {
          provider: inputData.provider,
          amount: inputData.amount,
          status: 'pendiente',
        },
        create: {
          order_id: inputData.order_id,
          provider: inputData.provider,
          amount: inputData.amount,
          status: 'pendiente',
        },
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateStatus', () => {
    it('debe actualizar el estado del pago (ej. a aprobado o rechazado)', async () => {
      const paymentId = 'pay-789';
      const newStatus: PaymentStatus = 'aprobado';

      const mockUpdateResponse = { id: paymentId, status: newStatus };
      (prisma.payment.update as jest.Mock).mockResolvedValue(mockUpdateResponse);

      const result = await PaymentMethodRepository.updateStatus(paymentId, newStatus);

      // Verificamos la actualización directa del estado tras la respuesta de la pasarela [cite: 2026-02-07]
      expect(prisma.payment.update).toHaveBeenCalledWith({
        where: { id: paymentId },
        data: { status: newStatus },
      });

      expect(result.status).toBe('aprobado');
    });
  });
});