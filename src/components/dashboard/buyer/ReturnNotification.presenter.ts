import { useState, useEffect } from 'react';

export const useReturnNotificationPresenter = (requestId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletion = async () => {
      setLoading(true);
      // Simulación de datos tras el éxito en la transacción de Prisma
      const mockRefund = {
        id: requestId,
        amount: 1250.00,
        currency: 'MXN',
        method: 'Tarjeta de Débito (Visa ****4321)',
        completedAt: '2026-04-12',
        message: 'Tu reembolso ha sido procesado y debería verse reflejado en tu cuenta en las próximas 48 horas.'
      };
      setData(mockRefund);
      setLoading(false);
    };
    fetchCompletion();
  }, [requestId]);

  return { data, loading };
};