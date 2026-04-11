"use client";
import React, { useState } from 'react';
import { ReturnForm } from '@/components/dashboard/buyer/ReturnForm';

// Mock de órdenes (En un caso real, esto vendría de un fetch a /api/orders?status=entregado)
const MOCK_DELIVERED_ORDERS = [
  { id: "ord-101", total_amount: 150.00, date: "2026-03-20" },
  { id: "ord-102", total_amount: 85.50, date: "2026-03-25" },
];

export default function ReturnsPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return (
      <main className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-8 rounded">
          <h1 className="text-2xl font-bold">¡Solicitud Enviada!</h1>
          <p className="mt-2">Tu solicitud de devolución ha sido registrada correctamente.</p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="mt-4 text-blue-600 underline"
          >
            Volver a mis pedidos
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Devoluciones</h1>
        <p className="text-gray-600">Selecciona un pedido entregado para iniciar el proceso.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lista de Órdenes Elegibles */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pedidos Recientes</h2>
          {MOCK_DELIVERED_ORDERS.map((order) => (
            <div 
              key={order.id}
              onClick={() => setSelectedOrderId(order.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedOrderId === order.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <p className="font-bold">Orden: {order.id}</p>
              <p className="text-sm text-gray-500">Fecha: {order.date}</p>
              <p className="text-sm text-gray-500">Total: ${order.total_amount}</p>
            </div>
          ))}
        </section>

        {/* Formulario Dinámico */}
        <section>
          {selectedOrderId ? (
            <ReturnForm 
              orderId={selectedOrderId} 
              onComplete={() => setIsSuccess(true)} 
            />
          ) : (
            <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
              Selecciona una orden de la izquierda
            </div>
          )}
        </section>
      </div>
    </main>
  );
}