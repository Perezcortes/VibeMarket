"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { ReturnForm } from '@/components/dashboard/buyer/ReturnForm';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";

function ReturnsContent() {
  const searchParams = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(searchParams.get('orderId'));
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sincronización con el historial de compras del usuario
  useEffect(() => {
    fetch('/api/buyer/history')
      .then(res => res.json())
      .then(data => {
        const ordersData = Array.isArray(data) ? data : (data.orders || []);
        setOrders(ordersData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error técnico al recuperar compras:", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (isSuccess) {
    return (
      <main className="min-h-screen p-12 max-w-2xl mx-auto text-center bg-black relative flex flex-col items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-tr from-[#f05cf0] via-[#c242f3] to-black opacity-40"></div>
         
         <div className="relative z-10 p-16 border-4 border-dotted border-[#f05cf0]/40 rounded-[4rem] bg-[#1a0a29]/80 animate-in zoom-in-95">
          <span className="material-symbols-outlined text-8xl text-[#f05cf0] mb-6 font-black">verified</span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Solicitud Exitosa</h1>
          <p className="mt-4 text-white/70 font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed">
            Tu protocolo ha sido registrado. El vendedor revisará los detalles de la devolución.
          </p>
          <Link href="/dashboard" className="mt-10 inline-block bg-white text-black px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#f05cf0] hover:text-white transition-all shadow-xl active:scale-95">
            Volver al Menú Principal
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-12 bg-black relative text-white font-sans overflow-hidden">
       {/* Estética Sofisticada VibeMarket */}
       <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a29] via-black to-[#2d1145] opacity-100"></div>
       <div className="absolute -top-24 -right-24 size-96 bg-[#f05cf0] rounded-full blur-[120px] opacity-20"></div>

       <div className="relative z-10 max-w-6xl mx-auto">
          <header className="mb-16 flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
                <h1 className="text-7xl font-black tracking-tighter italic uppercase text-white leading-none">
                    Gestión de <br /> <span className="text-[#f05cf0]">Devoluciones</span>
                </h1>
                <p className="text-white/50 font-bold uppercase text-[10px] tracking-[0.4em] mt-6">Protocolo Técnico de Retorno / VibeMarket 2026</p>
            </div>

            <Link href="/dashboard" className="group flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full transition-all hover:bg-[#f05cf0] hover:text-white shadow-2xl">
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                <span className="text-xs font-black uppercase tracking-widest">Regresar al menú</span>
            </Link>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <section className="space-y-6">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-8 text-[#f05cf0]">Pedidos Recientes</h2>
              
              {loading ? (
                <div className="p-12 border-2 border-dotted border-white/10 rounded-[2rem] text-center">
                    <p className="font-bold text-white/30 animate-pulse uppercase text-xs tracking-widest">Sincronizando base de datos...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-16 border-4 border-dotted border-white/10 rounded-[3rem] bg-white/5 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-5xl mb-4 text-white/20">shopping_bag</span>
                    <p className="font-black uppercase text-xs tracking-widest text-white">Sin registros de compra</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {orders.map((order: any) => (
                    <div 
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${
                        selectedOrderId === order.id ? 'border-[#f05cf0] bg-[#f05cf0]/10 shadow-[0_0_30px_rgba(240,92,240,0.1)]' : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                        <div>
                            <p className="font-black text-xl text-white tracking-tighter">#{order.id?.substring(0,8).toUpperCase()}</p>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Total Pagado: ${order.total_amount}</p>
                        </div>
                        <span className={`material-symbols-outlined text-3xl transition-colors ${selectedOrderId === order.id ? 'text-[#f05cf0]' : 'text-white/10'}`}>
                            {selectedOrderId === order.id ? 'check_circle' : 'add_circle'}
                        </span>
                        </div>
                    </div>
                    ))}
                </div>
              )}
            </section>

            <section>
              {selectedOrderId ? (
                <div className="animate-in fade-in slide-in-from-right-8">
                   <ReturnForm orderId={selectedOrderId} onComplete={() => setIsSuccess(true)} />
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center border-4 border-dotted border-white/5 rounded-[4rem] bg-black/40 text-white/20">
                  <span className="material-symbols-outlined text-7xl mb-6">target</span>
                  <p className="font-black uppercase text-[10px] tracking-[0.4em] text-center px-12 leading-relaxed">
                    Selecciona una referencia <br /> para iniciar el protocolo
                  </p>
                </div>
              )}
            </section>
          </div>
       </div>
    </main>
  );
}

export default function ReturnsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-[1em]">VIBE...</div>}>
      <ReturnsContent />
    </Suspense>
  );
}