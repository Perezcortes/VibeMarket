import React from 'react';
import PaymentStatusCard from '@/components/dashboard/buyer/PaymentStatusCard';

export default function BuyerDashboard({ user, lastOrderId }: { user: any, lastOrderId: string | null }) {
  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col items-center justify-center p-8">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-primary mb-2">
          Hola, {user?.name?.split(' ')[0] || "Comprador"} 
        </h1>
        <p className="text-gray-500">Aquí está el resumen de tu última compra.</p>
      </div>

      {lastOrderId ? (
        <PaymentStatusCard orderId={lastOrderId} />
      ) : (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
          <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">shopping_bag</span>
          <h2 className="text-xl font-bold text-gray-400">No hay compras recientes</h2>
          <p className="text-gray-400 text-sm mt-2">Cuando intentes realizar un pago, aparecerá aquí.</p>
        </div>
      )}

    </div>
  );
}