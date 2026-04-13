// src/components/dashboard/buyer/ReturnForm.tsx
"use client";
import React, { useState } from 'react';
import { useReturnRequestPresenter } from '@/components/dashboard/buyer/ReturnRequest.presenter';

interface Props {
  orderId: string;
  onComplete: () => void;
}

export const ReturnForm = ({ orderId, onComplete }: Props) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  
  const { submitReturn, loading, error } = useReturnRequestPresenter(orderId, onComplete);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Solicitar Devolución</h3>
      
      {error && <p className="text-red-500 text-sm mb-3">⚠️ {error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Motivo</label>
          <select 
            className="mt-1 block w-full border rounded-md p-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="">Selecciona una opción...</option>
            <option value="defective">Producto defectuoso</option>
            <option value="not_as_described">No es lo que pedí</option>
            <option value="changed_mind">Ya no lo quiero</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Comentarios adicionales</label>
          <textarea 
            className="mt-1 block w-full border rounded-md p-2 h-24"
            placeholder="Describe brevemente el problema..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          onClick={() => submitReturn(reason, description)}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-bold transition-colors ${
            loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loading ? 'Procesando...' : 'Confirmar Devolución'}
        </button>
      </div>
    </div>
  );
};