// src/lib/presentation/buyer/returns/ReturnRequest.presenter.ts
import { useState } from 'react';

export const useReturnRequestPresenter = (orderId: string, onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReturn = async (reason: string, description: string) => {
    if (!reason) {
      setError("Debes seleccionar un motivo de devolución.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason, description }),
      });

      if (!response.ok) throw new Error("Error al procesar la devolución.");

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitReturn, loading, error };
};