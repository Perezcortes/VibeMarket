"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BuyerDashboard({ user }: { user: any }) {
  const [payments, setPayments] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  useEffect(() => {
    fetch('/api/buyer/history')
      .then(res => res.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Cargando historial...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-black text-red-600 mb-2">Hola, {user?.name || "Aria"}</h1>
        <p className="text-gray-500">Aquí está el resumen de tus compras.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {payments.length === 0 ? (
          <p className="text-center text-gray-400">No hay compras aún.</p>
        ) : (
          payments.map((pay: any) => (
            <div key={pay.id} className="p-[4px] rounded-[1.5rem] bg-gradient-to-r from-[#e3003b] via-[#8c00ff] to-[#1a0045] shadow-xl">
              <div className="bg-white p-6 rounded-[1.3rem] flex justify-between items-center">
                <div className="text-left">
                  <h3 className="font-black text-gray-800 uppercase tracking-tight">Pago #{pay.order_id.substring(0, 8)}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`material-symbols-outlined text-sm ${pay.status === 'aprobado' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {pay.status === 'aprobado' ? 'check_circle' : 'schedule'}
                    </span>
                    <p className="text-xs text-gray-400">{new Date(pay.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black text-gray-900">${pay.amount}</span>
                  <button 
                    onClick={() => setSelectedPayment(pay)}
                    className="text-xs font-bold text-primary mt-2 flex items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Ver detalles
                  </button>
                </div>
              </div>

              
            </div>
          ))
        )}

          <div className="p-[4px] rounded-[1.5rem] bg-gradient-to-r from-[#e3003b] via-[#8c00ff] to-[#1a0045] shadow-xl mt-10">
  <Link 
    href="/" 
    className="bg-black p-6 rounded-[1.3rem] flex items-center justify-center text-white font-black text-lg hover:bg-zinc-900 transition-all gap-3 group"
  >
    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
      arrow_back
    </span>
    Volver a la tienda
  </Link>
</div>
      </div>

      {/* --- MODAL DEL COMPROBANTE --- */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedPayment(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-1">VibeMarket</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 font-bold">Comprobante Oficial</p>
              
              <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3 text-left border border-gray-100">
                <div className="flex flex-col mb-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Cliente:</span>
                  <span className="text-sm font-black text-gray-800">{user?.name || "Usuario"}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
                
                <div className="h-px bg-gray-200 my-2"></div>

                <div className="flex justify-between text-[11px]"><span className="text-gray-400">FECHA:</span> <span className="font-bold">{new Date(selectedPayment.created_at).toLocaleString()}</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">MÉTODO:</span> <span className="font-bold uppercase">{selectedPayment.provider}</span></div>
                
                {/* Mostramos el nombre en la tarjeta si existe */}
                {selectedPayment.card_details && (
                  <>
                    <div className="flex justify-between text-[11px]"><span className="text-gray-400">TARJETAHABIENTE:</span> <span className="font-bold uppercase">{selectedPayment.card_details.card_name}</span></div>
                    <div className="flex justify-between text-[11px]"><span className="text-gray-400">TARJETA:</span> <span className="font-bold">**** {selectedPayment.card_details.card_number.slice(-4)}</span></div>
                  </>
                )}
                
                <div className="pt-4 flex justify-between items-center border-t border-dashed border-gray-300">
                  <span className="text-xs font-black">TOTAL PAGADO:</span>
                  <span className="text-2xl font-black text-red-600">${selectedPayment.amount}</span>
                </div>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">download</span>
                Descargar Ticket
              </button>
            </div>
          </div>

          
        </div>

        
      )}

    
    </div>
  );
}