"use client";
import React from 'react';

export const ReturnGuideView = ({ data }: { data: any }) => {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Instrucciones de Retorno</h2>
      <div className="bg-blue-50 p-4 rounded mb-4 border border-blue-100">
        <p className="text-sm text-blue-600 font-semibold">Número de Guía:</p>
        <p className="text-xl font-mono font-bold">{data.trackingNumber}</p>
      </div>
      <h3 className="font-bold mb-2">Pasos a seguir:</h3>
      <ul className="space-y-2 list-decimal list-inside text-gray-600">
        {data.steps.map((step: string, i: number) => (
          <li key={i}>{step}</li>
        ))}
      </ul>
      <button 
        onClick={() => window.print()}
        className="w-full mt-6 bg-black text-white py-2 rounded font-bold hover:bg-gray-800"
      >
        Imprimir Etiqueta
      </button>
    </div>
  );
};