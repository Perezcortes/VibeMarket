"use client";
import React, { useState } from 'react';

interface Props {
  dispute: any;
  onResolve: (decision: 'REFUND' | 'REJECT') => Promise<void>;
}

export const DisputeResolution = ({ dispute, onResolve }: Props) => {
  const [resolved, setResolved] = useState(false);

  const handleAction = async (decision: 'REFUND' | 'REJECT') => {
    await onResolve(decision);
    setResolved(true);
  };

  if (resolved) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 p-8 rounded-xl text-center animate-in fade-in zoom-in duration-300">
        <span className="text-4xl">⚖️</span>
        <h2 className="text-2xl font-bold text-blue-900 mt-4">Disputa Resuelta</h2>
        <p className="text-blue-700">El veredicto ha sido registrado y las partes han sido notificadas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
          <h3 className="font-bold text-red-700 mb-2">Comprador dice:</h3>
          <p className="text-gray-700 italic">"{dispute.buyerMessage}"</p>
        </div>

        <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
          <h3 className="font-bold text-blue-700 mb-2">Vendedor dice:</h3>
          <p className="text-gray-700 italic">"{dispute.sellerMessage}"</p>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
        <span className="font-semibold text-gray-600">Monto en disputa:</span>
        <span className="text-xl font-bold">${dispute.amount}</span>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => handleAction('REFUND')}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          Reembolsar al Comprador
        </button>
        <button 
          onClick={() => handleAction('REJECT')}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
        >
          Rechazar Disputa
        </button>
      </div>
    </div>
  );
};