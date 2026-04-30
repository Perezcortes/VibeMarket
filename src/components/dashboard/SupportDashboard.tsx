"use client";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import Chatbot from "./support/Chatbot";

// --- BASE DE DATOS EXTENDIDA (15 TICKETS + 25 RESEÑAS) ---
const DATA = {
  pendientes: [
    { id: "TK-701", order: "#V-101", user: "Julian C.", issue: "Duda con método de pago SPEI", time: "2 min", priority: "Media", error: "PAY_AUTH_01" },
    { id: "TK-702", order: "#V-102", user: "Paul B.", issue: "Cupón de temporada no aplica", time: "5 min", priority: "Baja", error: "DISCOUNT_LOGIC_FAIL" },
    { id: "TK-703", order: "#V-103", user: "Albert H.", issue: "Error en dirección de envío", time: "8 min", priority: "Media", error: "MAP_API_LATENCY" },
    { id: "TK-704", order: "#V-104", user: "Fabrizio M.", issue: "Consulta sobre stock de PS5", time: "15 min", priority: "Baja", error: "INV_SYNC_ERROR" },
    { id: "TK-705", order: "#V-105", user: "Nick V.", issue: "Problema con validación de SMS", time: "20 min", priority: "Media", error: "AUTH_SMS_TIMEOUT" },
    { id: "TK-706", order: "#V-106", user: "Matt H.", issue: "Solicitud de factura pendiente", time: "30 min", priority: "Baja", error: "TAX_SERV_DOWN" },
    { id: "TK-707", order: "#V-107", user: "Alex T.", issue: "Error al cargar foto de perfil", time: "45 min", priority: "Media", error: "IMG_UPLOAD_DENIED" },
    { id: "TK-708", order: "#V-108", user: "Jamie C.", issue: "Duda sobre garantía de laptop", time: "1h", priority: "Baja", error: "LEGAL_DOC_MISSING" }
  ],
  criticos: [
    { id: "TK-001", order: "#V-901", user: "Thom Y.", issue: "Error 500 en confirmación de compra", time: "1 min", priority: "Crítica", error: "INTERNAL_SERVER_500" },
    { id: "TK-002", order: "#V-902", user: "Gustavo C.", issue: "Doble cargo en tarjeta de crédito", time: "3 min", priority: "Crítica", error: "GATEWAY_DUPLICATE_TX" },
    { id: "TK-003", order: "#V-903", user: "Zoe K.", issue: "Fuga de datos en formulario login", time: "4 min", priority: "Crítica", error: "SEC_XSS_DETECTED" },
    { id: "TK-004", order: "#V-904", user: "Dave G.", issue: "Pasarela de pago no responde", time: "6 min", priority: "Crítica", error: "STRIPE_API_UNREACHABLE" },
    { id: "TK-005", order: "#V-905", user: "Martin G.", issue: "Orden pagada desapareció de cuenta", time: "10 min", priority: "Crítica", error: "DB_CONSISTENCY_LOCKED" },
    { id: "TK-006", order: "#V-906", user: "Andy F.", issue: "Error en base de datos de envíos", time: "15 min", priority: "Crítica", error: "LOGISTICS_DB_CRASH" },
    { id: "TK-007", order: "#V-907", user: "Robert S.", issue: "Certificado SSL expirado en subdominio", time: "20 min", priority: "Crítica", error: "SSL_EXP_HANDSHAKE" }
  ],
  resenas: [
    { id: 1, user: "Mariana S.", comment: "Resolvieron mi duda del envío en segundos.", rating: 5, order: "#V-101" },
    { id: 2, user: "Roberto D.", comment: "Muy amables, aunque el chat tardó un poco.", rating: 4, order: "#V-202" },
    { id: 3, user: "Elena F.", comment: "Atención técnica de primer nivel.", rating: 5, order: "#V-303" },
    { id: 4, user: "Carlos L.", comment: "El agente fue muy paciente conmigo.", rating: 5, order: "#V-404" },
    { id: 5, user: "Sofia G.", comment: "Solucionaron el cargo doble rápido.", rating: 5, order: "#V-505" },
    { id: 6, user: "Andrés M.", comment: "Excelente plataforma de ayuda.", rating: 5, order: "#V-606" },
    { id: 7, user: "Lucía P.", comment: "Me gustaría que el chatbot fuera más rápido.", rating: 3, order: "#V-707" },
    { id: 8, user: "Fernando V.", comment: "Soporte técnico muy eficiente.", rating: 5, order: "#V-808" },
    { id: 9, user: "Gabriela H.", comment: "No pude aplicar mi cupón al principio.", rating: 4, order: "#V-909" },
    { id: 10, user: "Javier R.", comment: "Todo perfecto con mi devolución.", rating: 5, order: "#V-111" },
    { id: 11, user: "Monica S.", comment: "Muy buena estética de la página.", rating: 5, order: "#V-222" },
    { id: 12, user: "David B.", comment: "El agente sabía mucho del tema.", rating: 5, order: "#V-333" },
    { id: 13, user: "Sara K.", comment: "Un poco de lag en el chat, pero bien.", rating: 4, order: "#V-444" },
    { id: 14, user: "Raul O.", comment: "Me resolvieron el problema de login.", rating: 5, order: "#V-555" },
    { id: 15, user: "Isabel N.", comment: "La mejor tienda online que he usado.", rating: 5, order: "#V-666" },
    { id: 16, user: "Pablo Q.", comment: "Duda de envío resuelta.", rating: 4, order: "#V-777" },
    { id: 17, user: "Clara T.", comment: "Muy sutil y elegante el diseño.", rating: 5, order: "#V-888" },
    { id: 18, user: "Hugo W.", comment: "Esperaba menos, me sorprendieron.", rating: 5, order: "#V-999" },
    { id: 19, user: "Beatriz M.", comment: "Atención humana de verdad.", rating: 5, order: "#V-121" },
    { id: 20, user: "Jorge F.", comment: "El sistema de tickets es muy claro.", rating: 4, order: "#V-232" },
    { id: 21, user: "Teresa L.", comment: "Gracias por la rapidez.", rating: 5, order: "#V-343" },
    { id: 22, user: "Samuel G.", comment: "Ficha técnica muy detallada.", rating: 5, order: "#V-454" },
    { id: 23, user: "Paty J.", comment: "Lo recomiendo al 100%.", rating: 5, order: "#V-565" },
    { id: 24, user: "Luis E.", comment: "Tuve un error 500 pero me ayudaron.", rating: 4, order: "#V-676" },
    { id: 25, user: "Sonia D.", comment: "Excelente manejo de incidencias.", rating: 5, order: "#V-787" }
  ]
};

export default function SupportDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [category, setCategory] = useState("pendientes");

  const renderContent = () => {
    if (selectedTicket) return <TicketDetail ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />;
    
    switch (activeTab) {
      case "dashboard": return <MainDashboard setView={(cat:string) => {setActiveTab("tickets"); setCategory(cat);}} />;
      case "tickets": return <TicketsList category={category} onSelect={setSelectedTicket} />;
      case "chat": return <LiveReviews reviews={DATA.resenas} />;
      default: return <div className="p-20 text-center text-black font-black uppercase">En Mantenimiento</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex font-sans text-black">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 px-6 py-10 shadow-sm">
        <div className="mb-12 px-4">
          <h1 className="text-2xl font-black italic bg-gradient-to-r from-rose-500 to-indigo-600 bg-clip-text text-transparent">
            VibeMarket<span className="text-black not-italic font-bold">Help</span>
          </h1>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem icon="dashboard" label="Dashboard" active={activeTab === "dashboard"} onClick={() => {setActiveTab("dashboard"); setSelectedTicket(null);}} />
          <NavItem icon="confirmation_number" label="Casos Activos" active={activeTab === "tickets"} onClick={() => {setActiveTab("tickets"); setSelectedTicket(null);}} />
          <NavItem icon="auto_awesome" label="Reseñas" active={activeTab === "chat"} onClick={() => {setActiveTab("chat"); setSelectedTicket(null);}} />
          <NavItem icon="history" label="Historial" active={activeTab === "history"} onClick={() => setActiveTab("history")} />
        </nav>

        <div className="pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-[2rem] mb-4 border border-slate-100">
            <div className="size-10 rounded-full bg-gradient-to-tr from-rose-400 to-purple-500 text-white flex items-center justify-center font-black shadow-lg shadow-rose-500/20">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-black truncate">Agente de Soporte</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">ID #2026-VIBE</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-rose-600 font-black text-[10px] uppercase tracking-widest py-3 hover:bg-rose-50 rounded-2xl transition-all">
            Finalizar Turno
          </button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        {renderContent()}
      </main>
      <Chatbot />
    </div>
  );
}

// --- SUBCOMPONENTES ---

function MainDashboard({ setView }: any) {
  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12">
        <h2 className="text-5xl font-black text-black tracking-tighter">Consola de Control</h2>
        <p className="text-zinc-500 mt-2 font-bold text-sm uppercase tracking-widest">Resumen de Misiones</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard label="Tickets Pendientes" value={DATA.pendientes.length} gradient="from-blue-500 to-indigo-600" onClick={() => setView("pendientes")} />
        <MetricCard label="Prioridad Crítica" value={DATA.criticos.length} gradient="from-rose-500 to-orange-500" onClick={() => setView("criticos")} />
        <MetricCard label="Rating del Servicio" value="5.0" gradient="from-purple-500 to-indigo-800" onClick={() => {}} />
      </div>
    </div>
  );
}

function TicketsList({ category, onSelect }: any) {
  const tickets = category === "pendientes" ? DATA.pendientes : DATA.criticos;
  
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-4xl font-black mb-8 capitalize tracking-tight text-black">{category}</h2>
      <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        {tickets.map((t) => (
          <div key={t.id} onClick={() => onSelect(t)} className="p-7 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer flex justify-between items-center group">
            <div className="flex items-center gap-6">
               <div className="size-14 rounded-[1.5rem] bg-slate-100 text-black flex items-center justify-center font-black text-xs">
                 {t.id}
               </div>
               <div>
                 <p className="font-black text-black text-lg group-hover:text-rose-600 transition-colors">{t.issue}</p>
                 <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight">{t.user} • Orden {t.order}</p>
               </div>
            </div>
            <div className="flex items-center gap-8">
              <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${category === 'criticos' ? 'bg-rose-600 text-white' : 'bg-black text-white'}`}>
                {t.priority}
              </span>
              <span className="material-symbols-outlined text-zinc-300 group-hover:text-black transition-all">arrow_forward_ios</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketDetail({ ticket, onBack }: any) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [text, setText] = useState("");

  const handleSimulateSend = () => {
    if(!text.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setText("");
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="animate-in zoom-in-95 duration-500">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-black font-black text-xs uppercase tracking-widest hover:text-rose-600 transition-all">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Regresar al Listado
      </button>
      
      <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200/60 border border-slate-100">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="text-4xl font-black text-black tracking-tighter">{ticket.issue}</h3>
            <p className="text-zinc-500 font-bold mt-2 uppercase text-xs tracking-widest">Solicitante: {ticket.user} — Referencia {ticket.order}</p>
          </div>
          <span className="bg-rose-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/30">
            {sent ? "Protocolo Enviado" : "En Resolución"}
          </span>
        </div>

        {/* --- FICHA TÉCNICA --- */}
        <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-10 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-rose-600 font-black">terminal</span>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-black">Ficha Técnica de Incidencia</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TechnicalInfo label="Error Producido" value={ticket.error || "SYS_ERR_2026"} />
            <TechnicalInfo label="Fecha Registro" value="2026-04-30" />
            <TechnicalInfo label="Hora Local" value="01:31 AM" />
            <TechnicalInfo label="País de Origen" value="México" />
          </div>
        </div>

        {/* --- INTERACCIÓN DE ENVÍO --- */}
        <div className="mt-10 flex gap-4">
          <input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending}
            className="flex-1 bg-white border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 text-sm font-bold text-black outline-none focus:border-black transition-all disabled:opacity-50" 
            placeholder={sent ? "Respuesta enviada con éxito..." : "ESCRIBE TU RESPUESTA TÉCNICA..."} 
          />
          <button 
            onClick={handleSimulateSend}
            disabled={isSending || !text.trim()}
            className="bg-black text-white px-10 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-rose-600 transition-all shadow-xl disabled:bg-zinc-300 flex items-center gap-2"
          >
            {isSending ? (
              <span className="animate-spin material-symbols-outlined">sync</span>
            ) : sent ? (
              <span className="material-symbols-outlined">check</span>
            ) : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveReviews({ reviews }: any) {
  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <h2 className="text-4xl font-black mb-10 tracking-tight text-black italic">Vibe Reviews (25 Reseñas)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {reviews.map((r: any) => (
          <div key={r.id} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-100 transition-transform hover:scale-[1.03]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-black text-black text-sm uppercase tracking-widest">{r.user}</p>
                <p className="text-[9px] font-black text-zinc-400 mt-1 uppercase">Pedido: {r.order}</p>
              </div>
              <InteractiveStars currentRating={r.rating} />
            </div>
            <p className="text-black text-sm italic font-bold leading-relaxed">"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- UTILIDADES ---

function TechnicalInfo({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-black">{value}</p>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-300 ${active ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-zinc-400 hover:text-black hover:bg-slate-50'}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-[0.1em]">{label}</span>
    </button>
  );
}

function MetricCard({ label, value, gradient, onClick }: any) {
  return (
    <button onClick={onClick} className={`relative overflow-hidden p-10 rounded-[3rem] text-left transition-all hover:scale-[1.05] active:scale-95 shadow-2xl shadow-slate-200/60 bg-white group border border-slate-100`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-4 ${gradient ? 'group-hover:text-white/80 text-zinc-400' : ''}`}>{label}</p>
        <p className={`text-6xl font-black tracking-tighter ${gradient ? 'group-hover:text-white text-black' : ''}`}>{value}</p>
      </div>
      <div className="absolute top-[-20%] right-[-10%] size-40 bg-white/20 rounded-full blur-3xl group-hover:translate-y-6 transition-transform duration-700" />
    </button>
  );
}

function InteractiveStars({ currentRating }: { currentRating: number }) {
  const [rating, setRating] = useState(currentRating);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(star)}
          className={`material-symbols-outlined text-xl transition-all duration-300 ${ (hover || rating) >= star ? 'text-rose-500 fill-current' : 'text-slate-200' }`}
        >
          star
        </button>
      ))}
    </div>
  );
}