"use client";
import { useState } from "react";

export default function HelpCenter() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const faqs = [
    { id: 1, q: "¿Cómo rastreo mi pedido?", a: "Ve a la sección 'Mis Pedidos' en tu perfil. Allí encontrarás el número de guía y el estado en tiempo real." },
    { id: 2, q: "¿Tienen envíos gratis?", a: "¡Sí! En todas las compras superiores a $999 MXN el envío corre por nuestra cuenta." },
    { id: 3, q: "¿Qué hago si mi producto llega dañado?", a: "No te preocupes. Tienes 48 horas para reportar daños físicos y tramitaremos un reemplazo inmediato." }
  ];

  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/support/report", {
      method: "POST",
      body: JSON.stringify({ message: formData.get("message") }),
    });
    setLoading(false);
    if (res.ok) {
      alert("¡Reporte recibido! Gracias por ayudarnos a mejorar.");
      e.currentTarget.reset();
    }
  };

  return (
    <div className="bg-white min-h-screen text-black font-sans">
      <header className="bg-red-600 py-24 px-6 text-center border-b-4 border-black">
        <h1 className="text-6xl font-black text-white uppercase tracking-tighter">Centro de Ayuda</h1>
        <p className="text-white font-bold mt-4 text-lg">Respuestas rápidas para la comunidad Vibe.</p>
      </header>

      <main className="max-w-3xl mx-auto py-16 px-6">
        <div className="space-y-6">
          {faqs.map((f) => (
            <div key={f.id} className="border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <button 
                onClick={() => setOpenId(openId === f.id ? null : f.id)}
                className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-red-50 transition-colors"
              >
                <span className="font-black text-black text-sm uppercase">{f.q}</span>
                <span className="material-symbols-outlined font-black">{openId === f.id ? 'remove' : 'add'}</span>
              </button>
              {openId === f.id && (
                <div className="p-6 bg-white border-t-4 border-black">
                  <p className="text-black text-sm font-medium leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formulario de Mejora - Contraste Oscuro */}
        <section className="mt-24 bg-black p-10 rounded-[3rem] text-white border-4 border-red-600 shadow-[15px_15px_0px_0px_rgba(220,38,38,1)]">
          <h2 className="text-3xl font-black mb-2 uppercase italic">¿Algo no funciona bien?</h2>
          <p className="text-gray-400 text-xs mb-8 font-bold">Envíanos una crítica o sugerencia de mejora.</p>
          <form onSubmit={handleReport} className="space-y-4">
            <textarea 
              name="message"
              required
              className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-5 text-white font-bold outline-none focus:border-red-600 transition-all"
              placeholder="Escribe aquí tu crítica constructiva..."
              rows={4}
            />
            <button 
              disabled={loading}
              className="w-full bg-red-600 hover:bg-white hover:text-black text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest"
            >
              {loading ? "ENVIANDO..." : "ENVIAR REPORTE"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}