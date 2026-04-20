import { useState, useEffect } from 'react';

export const useDisputePresenter = (disputeId: string) => {
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispute = async () => {
      setLoading(true);
      // Simulación de datos de la base de datos
      const mockData = {
        id: disputeId,
        reason: "Producto no coincide con la descripción",
        buyerMessage: "El color es azul, yo pedí rojo.",
        sellerMessage: "En la foto se veía claramente que era azul cobalto.",
        amount: 450.00,
        status: 'UNDER_REVIEW'
      };
      setDispute(mockData);
      setLoading(false);
    };
    fetchDispute();
  }, [disputeId]);

  const resolveDispute = async (decision: 'REFUND' | 'REJECT'): Promise<void> => {
    // Simulación de llamada a la API
    console.log(`Disputa ${disputeId} resuelta como: ${decision}`);
    // No devolvemos nada para cumplir con el tipo void
  };

  return { dispute, loading, resolveDispute };
};