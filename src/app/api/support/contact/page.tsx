"use client";

export default function Contact() {
  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    await fetch("/api/support/contact", { method: "POST", body: JSON.stringify(data) });
    alert("Mensaje enviado con éxito.");
    e.currentTarget.reset();
  };

  return (
    <div className="bg-white min-h-screen text-black flex items-center">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 py-20">
        
        <div className="flex flex-col justify-center">
          <h1 className="text-7xl font-black text-black leading-[0.8] mb-10">SIN <br/> <span className="text-red-600">FILTROS</span>.</h1>
          <p className="text-black font-bold text-lg mb-12 max-w-sm">Dudas, quejas o saludos. Estamos aquí para responder en menos de 2 horas.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black text-white p-6 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-red-600 mb-2">Email</p>
              <p className="text-sm font-bold truncate">sos@vibe.com</p>
            </div>
            <div className="bg-red-600 text-white p-6 rounded-2xl shadow-xl shadow-red-200">
              <p className="text-[10px] font-black uppercase text-white/70 mb-2">WhatsApp</p>
              <p className="text-sm font-bold">953-123-4567</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleContact} className="bg-white border-4 border-black p-10 rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] space-y-5">
          <input name="nombre" placeholder="NOMBRE COMPLETO" required className="w-full border-2 border-black p-4 font-black outline-none focus:ring-4 focus:ring-red-600/20" />
          <input name="email" type="email" placeholder="EMAIL" required className="w-full border-2 border-black p-4 font-black outline-none focus:ring-4 focus:ring-red-600/20" />
          <textarea name="mensaje" placeholder="MENSAJE..." rows={4} required className="w-full border-2 border-black p-4 font-black outline-none focus:ring-4 focus:ring-red-600/20" />
          <button className="w-full bg-black text-white font-black py-5 rounded-2xl text-lg hover:bg-red-600 transition-all transform hover:-translate-y-1">
            ENVIAR AHORA
          </button>
        </form>

      </div>
    </div>
  );
}