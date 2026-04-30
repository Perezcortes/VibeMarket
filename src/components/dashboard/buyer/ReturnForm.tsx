"use client";
import React, { useState } from 'react';

interface ReturnFormProps {
  orderId: string;
  onComplete: () => void;
}

export function ReturnForm({ orderId, onComplete }: ReturnFormProps) {
  const [reason, setReason] = useState("Cambio de opinión / No deseado");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/support/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason, description }),
      });

      const data = await response.json();

      if (response.ok) {
        onComplete(); // Activa la vista de éxito en la página principal
      } else {
        // Muestra el error específico (ej: "Ya existe una solicitud")
        setError(data.error || "Error al procesar la devolución.");
      }
    } catch (err) {
      setError("Fallo de conexión con el protocolo técnico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl animate-in fade-in slide-in-from-right-10 duration-500">
      <h2 className="text-4xl font-black italic uppercase tracking-tighter text-black mb-2">Nueva Solicitud</h2>
      <p className="text-[9px] font-black text-rose-600 uppercase tracking-[0.3em] mb-10">Referencia: {orderId}</p>

      {error && (
        <div className="mb-8 p-6 bg-rose-50 border-l-4 border-rose-600 rounded-2xl flex items-center gap-4 animate-shake">
          <span className="material-symbols-outlined text-rose-600">warning</span>
          <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        <div>
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mb-4 block">Motivo del Retorno</label>
          <select 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-50 border-none p-6 rounded-[1.5rem] font-black text-black outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#f05cf0]/20 transition-all"
          >
            <option>Cambio de opinión / No deseado</option>
            <option>Producto defectuoso / Error técnico</option>
            <option>No coincide con la descripción</option>
            <option>Paquete dañado durante transporte</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mb-4 block">Diagnóstico del Usuario</label>
          <textarea 
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el estado técnico del producto..."
            className="w-full bg-slate-50 border-none p-8 rounded-[2rem] font-bold text-black outline-none h-40 resize-none focus:ring-2 focus:ring-[#f05cf0]/20 transition-all placeholder:text-zinc-300"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-6 rounded-full font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-[#f05cf0] transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Procesando...</span>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              Confirmar Solicitud Técnica
            </>
          )}
        </button>
      </form>
    </div>
  );
}