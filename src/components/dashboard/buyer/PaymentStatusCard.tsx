"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentStatusCard({ orderId }: { orderId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/buyer/payments/status?orderId=${orderId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Error del servidor: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchStatus();
  }, [orderId]);

  // 1. Estado de Carga
  if (loading) {
    return (
      <div className="max-w-lg w-full mx-auto p-[10px] rounded-[2rem] bg-gradient-to-r from-red-500 via-purple-600 to-indigo-900 animate-pulse">
        <div className="bg-white p-8 rounded-2xl w-full h-full">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
          <div className="h-24 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // 2. Estado de Error
  if (error || !data) {
    return (
      <div className="max-w-lg w-full mx-auto p-[10px] rounded-[2rem] bg-gradient-to-r from-red-500 via-purple-600 to-indigo-900">
        <div className="bg-white p-8 rounded-2xl w-full h-full text-center">
          <span className="material-symbols-outlined text-4xl text-red-300 mb-2">warning</span>
          <h3 className="font-bold text-red-600 mb-1">No pudimos cargar el estado</h3>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <p className="text-xs text-gray-400">ID de Orden: {orderId}</p>
        </div>
      </div>
    );
  }

  // 3. Estado Exitoso
  const isRejected = data.status === "RECHAZADO";
  const isApproved = data.status === "APROBADO";

  return (
    <div className="max-w-lg w-full mx-auto p-[10px] rounded-[2rem] bg-gradient-to-r from-[#e3003b] via-[#8c00ff] to-[#1a0045] shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
      
      <div className="bg-white p-8 rounded-2xl w-full h-full text-center">
        
        <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-wide">
          Pago #{String(orderId).substring(0, 8)}
        </h2>

        <div className={`p-6 rounded-xl border ${
          isRejected ? 'bg-red-50 border-red-200 text-red-800' : 
          isApproved ? 'bg-green-50 border-green-200 text-green-800' : 
          'bg-yellow-50 border-yellow-200 text-yellow-800'
        }`}>
          <span className="material-symbols-outlined text-4xl mb-2">
            {isRejected ? 'cancel' : isApproved ? 'check_circle' : 'schedule'}
          </span>
          <h3 className="font-bold text-lg mb-2">
            {data.status === "RECHAZADO" ? "Pago Rechazado" : 
             data.status === "APROBADO" ? "¡Pago Exitoso!" : "Procesando Pago..."}
          </h3>
          <p className={`text-sm ${isRejected ? 'text-red-600' : isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
            {data.message}
          </p>

          {data.savedProgress && isRejected && (
            <p className="text-xs font-semibold mt-3 text-red-500 bg-red-100/50 p-2 rounded-lg inline-block">
              🛒 Tu carrito y progreso están guardados a salvo.
            </p>
          )}
        </div>

        {isRejected && data.action === "RETRY_PAYMENT" && data.redirectUrl && (
          <div className="mt-8">
            <Link 
              href={data.redirectUrl}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#e3003b] hover:bg-[#c20032] text-white px-6 py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md"
            >
              <span className="material-symbols-outlined">refresh</span>
              Volver a hacer el pago
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}