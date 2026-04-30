"use client";
import React, { useState, useEffect } from 'react';

export default function SellerReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/seller/returns')
      .then(res => res.json())
      .then(data => {
        setReturns(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10 font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">
          Gestión de <span className="text-[#f05cf0]">Devoluciones</span>
        </h1>
        <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">
          Protocolos técnicos de retorno recibidos
        </p>
      </header>

      <div className="grid gap-8">
        {loading ? (
          <div className="h-64 flex items-center justify-center border-2 border-dotted border-white/10 rounded-[3rem]">
            <p className="animate-pulse font-black uppercase text-xs tracking-widest text-white/20">Sincronizando registros...</p>
          </div>
        ) : returns.length === 0 ? (
          <div className="p-20 text-center border-4 border-dotted border-white/5 rounded-[4rem] bg-[#111]">
            <span className="material-symbols-outlined text-6xl text-white/10 mb-6">inventory_2</span>
            <p className="font-black uppercase text-xs tracking-[0.3em] text-white/40">Tu inventario está seguro. No hay retornos.</p>
          </div>
        ) : (
          returns.map((req) => (
            <div key={req.id} className="group relative p-[1px] rounded-[2.5rem] bg-gradient-to-r from-white/10 to-transparent hover:from-[#f05cf0]/40 transition-all">
              <div className="bg-[#0a0a0a] p-10 rounded-[2.4rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1 bg-[#f05cf0] text-white text-[9px] font-black uppercase rounded-full">
                      {req.status}
                    </span>
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">
                      #{req.orderId.substring(0, 8)}
                    </h3>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Cliente Solicitante</p>
                    <p className="font-bold text-white/80">{req.order.buyer?.full_name || "Comprador Vibe"}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-rose-500/50 uppercase tracking-widest">Motivo de la falla</p>
                    <p className="font-bold text-[#f05cf0] italic">{req.reason}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                  <button className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#f05cf0] hover:text-white transition-all shadow-xl">
                    Aprobar Retorno
                  </button>
                  <button className="px-10 py-5 border border-white/10 text-white/40 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white hover:bg-white/5 transition-all">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}