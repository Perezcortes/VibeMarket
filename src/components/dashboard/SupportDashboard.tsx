"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SupportDashboard({ user }: { user: any }) {
  const [view, setView] = useState("tickets");

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* --- SIDEBAR (Tema Azul) --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
        
        {/* Header */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
           <h1 className="text-2xl font-black text-blue-600 tracking-tight flex gap-2 items-center">
             Vibe<span className="text-gray-800">Help</span>
           </h1>
        </div>
        
        {/* Navegación */}
        <nav className="p-4 space-y-2 flex-1">
            <SidebarItem 
                icon="confirmation_number" 
                label="Tickets Activos" 
                badge="3"
                active={view === 'tickets'} 
                onClick={() => setView('tickets')} 
            />
            <SidebarItem 
                icon="chat" 
                label="Chat en Vivo" 
                active={view === 'chat'} 
                onClick={() => setView('chat')} 
            />
             <SidebarItem 
                icon="history" 
                label="Historial" 
                active={view === 'history'} 
                onClick={() => setView('history')} 
            />
        </nav>

        {/* Footer: Perfil y Logout */}
        <div className="p-4 border-t border-gray-100 bg-slate-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {user?.name?.charAt(0) || "S"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">Agente de Soporte</p>
                </div>
            </div>

            <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm"
            >
                <span className="material-symbols-outlined text-lg">logout</span> 
                Cerrar Turno
            </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-black text-gray-800">
                    {view === 'tickets' && 'Centro de Tickets'}
                    {view === 'chat' && 'Sala de Chat'}
                    {view === 'history' && 'Historial de Casos'}
                </h2>
                <p className="text-gray-500">
                    Hola {user?.name}, tienes <span className="font-bold text-blue-600">3 casos urgentes</span> hoy.
                </p>
            </div>
            <div className="flex gap-3">
                 <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <span className="size-2 bg-green-500 rounded-full animate-pulse"></span> En Línea
                 </span>
            </div>
        </header>

        {/* KPIs RAPIDOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Pendientes" value="12" icon="inbox" color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="Tiempo Promedio" value="15m" icon="timer" color="text-orange-500" bg="bg-orange-50" />
            <StatCard label="Satisfacción" value="4.8/5" icon="thumb_up" color="text-green-600" bg="bg-green-50" />
        </div>

        {/* VISTA DE TICKETS */}
        {view === 'tickets' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Cola de Atención</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs font-bold bg-gray-100 rounded-lg hover:bg-gray-200">Más Recientes</button>
                        <button className="px-3 py-1 text-xs font-bold bg-red-50 text-red-500 rounded-lg hover:bg-red-100">Urgentes</button>
                    </div>
                </div>
                
                {/* Lista de Tickets Simulada */}
                <div className="divide-y divide-gray-100">
                    <TicketRow 
                        id="#TK-8832" 
                        user="Ana García" 
                        issue="Problema con devolución" 
                        status="Urgente" 
                        time="Hace 10 min" 
                    />
                    <TicketRow 
                        id="#TK-8831" 
                        user="Carlos Lopez" 
                        issue="Pregunta sobre envío" 
                        status="Abierto" 
                        time="Hace 35 min" 
                    />
                    <TicketRow 
                        id="#TK-8830" 
                        user="Marta Diaz" 
                        issue="Cupón no funciona" 
                        status="En Proceso" 
                        time="Hace 1h" 
                    />
                    <TicketRow 
                        id="#TK-8829" 
                        user="Pedro Pascal" 
                        issue="Producto dañado" 
                        status="Abierto" 
                        time="Hace 2h" 
                    />
                </div>
            </div>
        ) : (
            // VISTA GENÉRICA PARA OTRAS SECCIONES
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">engineering</span>
                <p className="text-gray-500 font-medium">Sección en construcción</p>
            </div>
        )}

      </main>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function SidebarItem({ icon, label, active, onClick, badge }: any) {
    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                ? "bg-blue-50 text-blue-600 font-bold" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="text-sm">{label}</span>
            {badge && <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        </button>
    )
}

function StatCard({ label, value, icon, color, bg }: any) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`size-12 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase">{label}</p>
                <p className="text-2xl font-black text-gray-800">{value}</p>
            </div>
        </div>
    )
}

function TicketRow({ id, user, issue, status, time }: any) {
    // Definir colores según estado
    const statusColor = status === 'Urgente' ? 'bg-red-100 text-red-600' : status === 'En Proceso' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600';

    return (
        <div className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                    {user.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-gray-800 group-hover:text-blue-600">{issue} <span className="text-gray-400 font-normal ml-2 text-xs">{id}</span></h4>
                    <p className="text-xs text-gray-500">Reportado por {user}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColor}`}>
                    {status}
                </span>
                <span className="text-xs text-gray-400 font-bold">{time}</span>
                <button className="size-8 rounded-full hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
            </div>
        </div>
    )
}