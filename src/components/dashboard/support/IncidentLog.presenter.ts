import { useState } from 'react';

export const useIncidentLogPresenter = (onSuccess: (id: string) => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitIncident = async (title: string, description: string, priority: string) => {
    // Validaciones de arquitectura
    if (title.length < 5) {
      setError("El título es demasiado corto para un reporte técnico.");
      return;
    }
    if (description.length < 20) {
      setError("La descripción debe ser más detallada para ayudar a los desarrolladores.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Error al registrar");

      onSuccess(result.data.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitIncident, loading, error };
};