"use client";
import React from 'react';

export const ReturnCompletedView = ({ data }: { data: any }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-green-50">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl text-green-600">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¡Caso Cerrado!</h2>
        <p className="text-gray-500 mt-2">{data.message}</p>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Monto total:</span>
          <span className="font-bold text-gray-900">${data.amount} {data.currency}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Reembolsado a:</span>
          <span className="text-sm font-medium text-gray-700 text-right">{data.method}</span>
        </div>
      </div>

      <button 
        onClick={() => window.location.href = '/dashboard/buyer'}
        className="w-full mt-8 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
      >
        Volver al Dashboard
      </button>
    </div>
  );
};