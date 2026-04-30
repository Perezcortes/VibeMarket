"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BuyerDashboard({ user }: { user: any }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  useEffect(() => {
    // Fetch real desde tu API de historial
    fetch('/api/buyer/history')
      .then(res => res.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-black">Cargando historial...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfd] p-8 text-black">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-5xl font-black tracking-tighter mb-2 italic">Hola, {user?.full_name || "Usuario"}</h1>
        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Resumen de actividad en VibeMarket</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* BOTÓN DE ACCESO RÁPIDO A DEVOLUCIONES */}
        <Link
          href="/dashboard/buyer/returns"
          className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-rose-600 font-black">assignment_return</span>
            <span className="font-black uppercase text-xs tracking-widest">Gestionar Devoluciones</span>
          </div>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
        </Link>

        {payments.map((pay: any) => (
          <div key={pay.id} className="p-[2px] rounded-[2rem] bg-gradient-to-r from-rose-500 to-indigo-600 shadow-lg shadow-slate-200/50">
            <div className="bg-white p-6 rounded-[1.9rem] flex justify-between items-center">
              <div className="text-left">
                <h3 className="font-black text-black uppercase tracking-tight text-lg">Orden #{pay.id.substring(0, 8)}</h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  {new Date(pay.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-2xl font-black text-black">${pay.total_amount}</span>
                <div className="flex gap-3">
                  <button onClick={() => setSelectedPayment(pay)} className="text-[10px] font-black uppercase text-zinc-400 hover:text-black">Detalles</button>
                  {/* Botón dinámico para iniciar devolución si el pedido está pagado */}
                  <Link href={`/dashboard/buyer/returns?orderId=${pay.id}`} className="text-[10px] font-black uppercase text-rose-600 hover:underline">Devolver</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ... Resto del Modal (Mantener igual con texto en negro) ... */}
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

