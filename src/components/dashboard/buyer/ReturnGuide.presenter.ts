import { useState, useEffect } from 'react';

export const useReturnGuidePresenter = (requestId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      // Simulación de datos de Prisma/API
      const mockResponse = {
        trackingNumber: `VIBE-${requestId.toUpperCase()}`,
        carrier: "Vibe Express",
        steps: [
          "Coloca el artículo en su empaque original.",
          "Imprime y pega la etiqueta en un lugar visible.",
          "Entrega el paquete en el punto de recolección más cercano."
        ]
      };
      setData(mockResponse);
      setLoading(false);
    };
    fetchGuide();
  }, [requestId]);

  return { data, loading };
};