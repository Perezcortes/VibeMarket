"use client";

export default function Returns() {
  const handleReturnRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/support/returns", { method: "POST", body: JSON.stringify(data) });
    if (res.ok) alert("Solicitud de devolución iniciada. Revisa tu correo.");
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <aside className="space-y-8">
            <span className="bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">Garantía Vibe</span>
            <h1 className="text-5xl font-black leading-none">DEVOLVER <br/> ES <span className="text-red-600">SIMPLE</span>.</h1>
            <div className="space-y-6 prose prose-sm font-bold text-black">
              <p>1. Tienes 30 días para cambiar de opinión.</p>
              <p>2. El producto debe estar impecable.</p>
              <p>3. Nosotros pagamos la primera guía.</p>
            </div>
            <div className="bg-red-50 border-l-8 border-red-600 p-6">
              <p className="text-xs font-black text-red-600">RECUERDA: Los productos de higiene personal no tienen devolución.</p>
            </div>
          </aside>

          <form onSubmit={handleReturnRequest} className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <h2 className="text-xl font-black uppercase underline decoration-red-600 decoration-4">Iniciar Devolución</h2>
            <div className="space-y-4">
              <input name="orderId" placeholder="NÚMERO DE PEDIDO (#12345)" required className="w-full border-2 border-black p-4 font-bold outline-none focus:bg-red-50" />
              <input name="email" type="email" placeholder="TU CORREO REGISTRADO" required className="w-full border-2 border-black p-4 font-bold outline-none focus:bg-red-50" />
              <select name="reason" className="w-full border-2 border-black p-4 font-bold outline-none">
                <option>No me quedó la talla</option>
                <option>No es lo que esperaba</option>
                <option>Llegó dañado</option>
              </select>
              <button className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-black transition-colors uppercase tracking-widest">
                GENERAR GUÍA DE RETORNO
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}