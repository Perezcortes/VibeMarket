"use client";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

// --- TIPOS DE DATOS ---
type Message = {
    id: string;
    message: string;
    created_at: string;
    sender: {
        full_name: string;
        role: string;
    };
};

type Ticket = {
    id: string;
    user: { full_name: string; email: string };
    subject: string;
    status: string;
    priority: string;
    updated_at: string;
    chat_messages: Message[];
};

export default function SupportDashboard({ user }: { user: any }) {
    const [view, setView] = useState("tickets");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);

    // 1. CARGAR DATOS REALES AL INICIO
    useEffect(() => {
        fetchTickets();
        
        // Opcional: Polling cada 30 segundos para ver nuevos mensajes
        const interval = setInterval(fetchTickets, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/support/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
                
                // Si hay un ticket seleccionado, actualizamos su info también
                if (selectedTicket) {
                    const updatedSelected = data.find((t: Ticket) => t.id === selectedTicket.id);
                    if (updatedSelected) setSelectedTicket(updatedSelected);
                }
            }
        } catch (error) {
            console.error("Error al cargar tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. ABRIR UN TICKET
    const handleOpenTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setView("ticket_detail");
    };

    const handleBackToList = () => {
        setSelectedTicket(null);
        setView("tickets");
        fetchTickets(); // Refrescar lista al volver
    };

    // 3. ENVIAR MENSAJE (REAL)
    const handleSendMessage = async (text: string) => {
        if (!selectedTicket) return;

        // Optimismo UI: Mostrar mensaje inmediatamente antes de que confirme el servidor
        const tempMessage: Message = {
            id: "temp-" + Date.now(),
            message: text,
            created_at: new Date().toISOString(),
            sender: { full_name: user.name || "Soporte", role: "soporte" } // Asumimos rol soporte
        };
        
        const updatedTicketState = {
            ...selectedTicket,
            status: "en_proceso",
            chat_messages: [...selectedTicket.chat_messages, tempMessage]
        };
        setSelectedTicket(updatedTicketState);

        try {
            const res = await fetch("/api/support/tickets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId: selectedTicket.id,
                    message: text,
                    status: "en_proceso"
                })
            });

            if (res.ok) {
                fetchTickets(); // Sincronizar con DB real
            }
        } catch (error) {
            alert("Error al enviar mensaje. Revisa tu conexión.");
        }
    };

    // 4. CAMBIAR ESTADO (REAL)
    const handleChangeStatus = async (newStatus: string) => {
        if (!selectedTicket) return;
        
        // Actualizar UI Localmente
        setSelectedTicket({ ...selectedTicket, status: newStatus });

        try {
            await fetch("/api/support/tickets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId: selectedTicket.id,
                    status: newStatus
                })
            });
            fetchTickets();
        } catch (error) {
            console.error("Error cambiando estado", error);
        }
    };

    // Calcular KPIs rápidos
    const pendingCount = tickets.filter(t => t.status !== 'resuelto' && t.status !== 'cerrado').length;
    const urgentCount = tickets.filter(t => t.priority === 'alta' || t.priority === 'critica').length;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <h1 className="text-2xl font-black text-blue-600 tracking-tight flex gap-2 items-center">
                        Vibe<span className="text-gray-800">Help</span>
                    </h1>
                </div>
                
                <nav className="p-4 space-y-2 flex-1">
                    <SidebarItem 
                        icon="confirmation_number" 
                        label="Tickets Activos" 
                        badge={pendingCount > 0 ? pendingCount.toString() : undefined}
                        active={view === 'tickets' || view === 'ticket_detail'} 
                        onClick={handleBackToList} 
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

                <div className="p-4 border-t border-gray-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
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
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                
                {/* HEADER */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">
                            {view === 'tickets' && 'Centro de Tickets'}
                            {view === 'ticket_detail' && `Gestionando Caso`}
                            {view === 'chat' && 'Sala de Chat'}
                            {view === 'history' && 'Historial de Casos'}
                        </h2>
                        <p className="text-gray-500">
                           {view === 'ticket_detail' 
                                ? `Ticket ID: ${selectedTicket?.id}` 
                                : `Hola ${user?.name}, tienes ${pendingCount} casos pendientes.`}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span> En Línea
                        </span>
                    </div>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* VISTA: LISTA DE TICKETS */}
                        {view === 'tickets' && (
                            <div className="animate-fade-in-up">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <StatCard label="Pendientes" value={pendingCount} icon="inbox" color="text-blue-600" bg="bg-blue-50" />
                                    <StatCard label="Prioridad Alta" value={urgentCount} icon="warning" color="text-red-500" bg="bg-red-50" />
                                    <StatCard label="Total Casos" value={tickets.length} icon="folder" color="text-gray-600" bg="bg-gray-50" />
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-gray-800">Cola de Atención</h3>
                                    </div>
                                    
                                    <div className="divide-y divide-gray-100">
                                        {tickets.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400">No hay tickets pendientes</div>
                                        ) : (
                                            tickets.map((ticket) => (
                                                <TicketRow 
                                                    key={ticket.id}
                                                    ticket={ticket}
                                                    onClick={() => handleOpenTicket(ticket)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VISTA: DETALLE DEL TICKET */}
                        {view === 'ticket_detail' && selectedTicket && (
                            <TicketDetailView 
                                ticket={selectedTicket} 
                                onBack={handleBackToList}
                                onSend={handleSendMessage}
                                onChangeStatus={handleChangeStatus}
                            />
                        )}

                        {/* VISTAS PLACEHOLDER */}
                        {(view === 'chat' || view === 'history') && (
                            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">engineering</span>
                                <p className="text-gray-500 font-medium">Sección en construcción</p>
                            </div>
                        )}
                    </>
                )}

            </main>
        </div>
    );
}

// ==========================================
// SUBCOMPONENTES
// ==========================================

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

function TicketRow({ ticket, onClick }: { ticket: Ticket, onClick: () => void }) {
    // Lógica de colores según el status que viene de la DB
    const statusColor = 
        ticket.status === 'alta' || ticket.status === 'critica' ? 'bg-red-100 text-red-600' : 
        ticket.status === 'en_proceso' ? 'bg-blue-100 text-blue-600' : 
        ticket.status === 'resuelto' ? 'bg-green-100 text-green-600' : 
        'bg-gray-100 text-gray-600';

    const lastMsg = ticket.chat_messages.length > 0 
        ? ticket.chat_messages[ticket.chat_messages.length - 1].message 
        : ticket.subject;

    // Formatear fecha (Ej: 10:30 AM o Ayer)
    const date = new Date(ticket.updated_at);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div onClick={onClick} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-gray-500 text-sm uppercase">
                    {ticket.user.full_name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-gray-800 group-hover:text-blue-600">
                        {ticket.subject} 
                        <span className="text-gray-400 font-normal ml-2 text-xs">#{ticket.id.slice(0, 8)}</span>
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                        {ticket.user.full_name} • {lastMsg}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColor}`}>
                    {ticket.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400 font-bold">{timeStr}</span>
                <button className="size-8 rounded-full hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
            </div>
        </div>
    )
}

function TicketDetailView({ ticket, onBack, onSend, onChangeStatus }: { ticket: Ticket, onBack: () => void, onSend: (text: string) => void, onChangeStatus: (status: string) => void }) {
    const [replyText, setReplyText] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Scroll al fondo al abrir o recibir mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ticket.chat_messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!replyText.trim()) return;
        onSend(replyText);
        setReplyText("");
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-180px)] animate-fade-in">
            
            {/* CHAT AREA */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                         <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                         </button>
                         <div>
                             <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
                             <p className="text-xs text-gray-500">{ticket.user.full_name} • {ticket.user.email}</p>
                         </div>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
                    {/* Mensaje de bienvenida/sistema */}
                    <div className="flex justify-center">
                         <span className="bg-gray-100 text-gray-400 text-[10px] px-3 py-1 rounded-full">
                            Ticket creado el {new Date(ticket.chat_messages[0]?.created_at || ticket.updated_at).toLocaleDateString()}
                         </span>
                    </div>

                    {ticket.chat_messages.map((msg, idx) => {
                        // Lógica para determinar si el mensaje es del soporte (derecha) o del cliente (izquierda)
                        const isSupport = msg.sender.role === 'soporte' || msg.sender.role === 'admin';
                        
                        return (
                            <div key={msg.id || idx} className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${
                                    isSupport 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                }`}>
                                    <p className="font-bold text-[10px] mb-1 opacity-70">{msg.sender.full_name}</p>
                                    <p>{msg.message}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isSupport ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Escribe una respuesta profesional..." 
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                        <button type="submit" disabled={!replyText.trim()} className="bg-blue-600 disabled:bg-gray-300 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center">
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* SIDEBAR DERECHO */}
            <div className="w-80 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Gestionar Estado</h4>
                    
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 block">Estado Actual</label>
                        <select 
                            value={ticket.status} 
                            onChange={(e) => onChangeStatus(e.target.value)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 focus:outline-none focus:border-blue-500"
                        >
                            <option value="abierto">🟢 Abierto</option>
                            <option value="en_proceso">🔵 En Proceso</option>
                            <option value="resuelto">✅ Resuelto</option>
                            <option value="cerrado">🔒 Cerrado</option>
                        </select>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                         <button 
                            onClick={() => onChangeStatus('resuelto')} 
                            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            Marcar como Resuelto
                         </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Cliente</h4>
                    <div className="flex items-center gap-3 mb-4">
                         <div className="size-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold uppercase">
                            {ticket.user.full_name.charAt(0)}
                         </div>
                         <div>
                             <p className="font-bold text-gray-800 text-sm">{ticket.user.full_name}</p>
                             <p className="text-xs text-gray-500">Usuario Registrado</p>
                         </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 break-all">
                        {ticket.user.email}
                    </div>
                </div>
            </div>
        </div>
    )
}