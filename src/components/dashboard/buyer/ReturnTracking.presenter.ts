import { useState, useEffect } from 'react';

export const useReturnTrackingPresenter = (id: string) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de consulta a la DB (Prisma tx)
    const getStatus = async () => {
      setLoading(true);
      // Mock de datos basados en el modelo ReturnRequest
      const mockStatus = {
        current: 'APPROVED', 
        history: [
          { label: 'Solicitud Recibida', date: '2026-04-01', done: true },
          { label: 'Paquete en Camino', date: '2026-04-03', done: true },
          { label: 'Validación Técnica', date: 'Pendiente', done: false },
          { label: 'Reembolso Aplicado', date: 'Pendiente', done: false },
        ]
      };
      setStatus(mockStatus);
      setLoading(false);
    };
    getStatus();
  }, [id]);

  return { status, loading };
};