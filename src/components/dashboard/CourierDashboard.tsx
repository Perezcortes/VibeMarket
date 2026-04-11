"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function CourierDashboard({ user }: { user: any }) {
    const [view, setView] = useState("route");
    const [isOnline, setIsOnline] = useState(true);
    const [routes, setRoutes] = useState([
        { id: "1", address: "Av. Insurgentes Sur 1500", time: "14:30 PM", distance: "2.5 km", visitOrder: 2, currentStatus: "enviado" },
        { id: "2", address: "Calle Liverpool 45", time: "15:00 PM", distance: "4.1 km", visitOrder: 3, currentStatus: "enviado" },
        { id: "3", address: "Calle Liverpool 20", time: "12:00 PM", distance: "0.5 km", visitOrder: 3, currentStatus: "pagado" },
        { id: "4", address: "Calle Cafe 45", time: "18:00 PM", distance: "7.1 km", visitOrder: 3, currentStatus: "pendiente" },
    ]);
    // ✨ NUEVO ESTADO: Para saber si estamos procesando la liquidación
    const [isLiquidating, setIsLiquidating] = useState(false);
    const handleOrderChange = (id: string, newOrder: number) => {
        const updated = routes.map(r => r.id === id ? { ...r, visitOrder: newOrder } : r)
            .sort((a, b) => a.visitOrder - b.visitOrder);
        setRoutes(updated);
    };

    const handleUpdateStatus = (orderId: string, newStatus: string) => {
        const updated = routes.map(r => r.id === orderId ? { ...r, currentStatus: newStatus } : r);
        setRoutes(updated);
    };
    // ✨ NUEVA FUNCIÓN: La magia que conecta con tu API (US016-C)
    const handleConfirmarEntrega = async (orderId: string) => {
        setIsLiquidating(true);
        try {
            // Llamamos a nuestro puente PATCH
            const res = await fetch("/api/courier/shiftLiquidar", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await res.json();

            if (res.ok) {
                // ¡Éxito! Aquí puedes poner un toast o alerta bonita
                alert(`¡Éxito! ${data.message}`);

                // 👉 A FUTURO: Aquí agregarías la lógica para borrar este pedido 
                // de la vista y subir el siguiente pedido de "En cola" hacia arriba.
            } else {
                alert(`Error al liquidar: ${data.error}`);
            }
        } catch (error) {
            alert("Error de conexión al intentar liquidar el pedido.");
        } finally {
            setIsLiquidating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* --- SIDEBAR (Tema Amarillo/Logística) --- */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">

                {/* Header */}
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <h1 className="text-2xl font-black text-amber-500 tracking-tight flex gap-2 items-center">
                        Vibe<span className="text-gray-800">Express</span>
                    </h1>
                </div>

                {/* Navegación */}
                <nav className="p-4 space-y-2 flex-1">
                    <SidebarItem
                        icon="alt_route"
                        label="Ruta Activa"
                        badge="5"
                        active={view === 'route'}
                        onClick={() => setView('route')}
                    />
                    <SidebarItem
                        icon="history"
                        label="Historial"
                        active={view === 'history'}
                        onClick={() => setView('history')}
                    />
                    <SidebarItem
                        icon="account_balance_wallet"
                        label="Mis Ganancias"
                        active={view === 'wallet'}
                        onClick={() => setView('wallet')}
                    />
                </nav>

                {/* Footer: Perfil y Logout */}
                <div className="p-4 border-t border-gray-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-sm">
                            {user?.name?.charAt(0) || "R"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">Repartidor Pro</p>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm hover:shadow-md"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Terminar Turno
                    </button>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="flex-1 p-8 overflow-y-auto">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">
                            {view === 'route' && 'Tu Ruta de Hoy'}
                            {view === 'history' && 'Historial de Entregas'}
                            {view === 'wallet' && 'Billetera'}
                        </h2>
                        <p className="text-gray-500">
                            {isOnline ? '🟢 Estás conectado y visible.' : '🔴 Estás desconectado.'}
                        </p>
                    </div>

                    {/* Toggle de Estado */}
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 ${isOnline ? 'bg-amber-400 text-black hover:bg-amber-500' : 'bg-gray-200 text-gray-500'
                            }`}
                    >
                        <span className="material-symbols-outlined">{isOnline ? 'local_shipping' : 'garage'}</span>
                        {isOnline ? 'En Turno' : 'Descansando'}
                    </button>
                </header>

                {/* VISTA: RUTA ACTIVA */}
                {view === 'route' && (
                    <div className="max-w-4xl">
                        {/* KPIs Rápidos */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatCard label="Entregados" value="12" icon="check_circle" color="text-green-600" bg="bg-green-50" />
                            <StatCard label="Pendientes" value="5" icon="schedule" color="text-amber-600" bg="bg-amber-50" />
                            <StatCard label="Km Recorridos" value="34.2" icon="speed" color="text-blue-600" bg="bg-blue-50" />
                            <StatCard label="Ganancia Hoy" value="$480" icon="attach_money" color="text-purple-600" bg="bg-purple-50" />
                        </div>

                        {/* TARJETA PRINCIPAL: PRÓXIMA PARADA */}
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-400 uppercase text-xs mb-3 ml-1">Siguiente Entrega (Prioridad Alta)</h3>
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-l-8 border-amber-400 relative overflow-hidden">

                                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Paquete #9921</span>
                                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pago Contra Entrega</span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-black text-gray-800">Calle Reforma 222, Piso 4</h2>
                                            <p className="text-gray-500 font-medium">Col. Juárez, Ciudad de México</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-400">person</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">Recibe: Ana P.</p>
                                                <p className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">Ver instrucciones de entrega</p>
                                            </div>
                                            <button className="ml-2 size-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
                                                <span className="material-symbols-outlined">call</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="flex flex-col gap-3 min-w-[200px]">
                                        <button className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined">map</span>
                                            Ir con GPS
                                        </button>
                                        <button
                                            onClick={() => handleConfirmarEntrega("5")} // Le pasas el ID del pedido actual
                                            disabled={isLiquidating}
                                            className={`flex-1 text-black py-4 rounded-xl font-bold shadow-lg transition-transform flex items-center justify-center gap-2 
        ${isLiquidating ? 'bg-amber-200 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-500 active:scale-95'}`}
                                        >
                                            <span className="material-symbols-outlined">
                                                {isLiquidating ? 'hourglass_empty' : 'signature'}
                                            </span>
                                            {isLiquidating ? 'Liquidando...' : 'Confirmar Entrega'}
                                        </button>
                                        <button className="py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg">
                                            Reportar Problema
                                        </button>
                                    </div>
                                </div>

                                {/* Decoración de fondo */}
                                <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[180px] text-gray-50 z-0">local_shipping</span>
                            </div>
                        </div>

                        {/* LISTA DE SIGUIENTES PARADAS */}
                        <h3 className="font-bold text-gray-400 uppercase text-xs mb-3 ml-1">En cola (4)</h3>
                        <div className="space-y-3">
                            {routes.map((route) => (
                                <DeliveryRow
                                    key={route.id}
                                    orderId={route.id} // 👈 Asegúrate de pasar el ID
                                    address={route.address}
                                    time={route.time}
                                    distance={route.distance}
                                    currentOrder={route.visitOrder}
                                    currentStatus={route.currentStatus} // 👈 Pasa el estatus actual
                                    onOrderChange={(val: string) => handleOrderChange(route.id, parseInt(val))}
                                    onStatusChange={handleUpdateStatus} // 👈 ¡ESTA ES LA QUE FALTA!
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* OTRAS VISTAS (Placeholder) */}
                {view !== 'route' && (
                    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">construction</span>
                        <p className="text-gray-500 font-medium">Módulo en construcción</p>
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? "bg-amber-50 text-amber-600 font-bold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="text-sm">{label}</span>
            {badge && <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        </button>
    )
}

function StatCard({ label, value, icon, color, bg }: any) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-2">
            <div className={`size-10 rounded-lg ${bg} ${color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-black text-gray-800">{value}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{label}</p>
            </div>
        </div>
    )
}

function DeliveryRow({ address, time, distance, onOrderChange, currentOrder, currentStatus, onStatusChange, orderId }: any) {
    // Lógica simple para la proximidad basada en la distancia (string "2.5 km")
    const distNum = parseFloat(distance);
    let proximity = { text: "Lejos", color: "text-gray-400" };

    if (distNum < 2) proximity = { text: "Muy Cerca", color: "text-green-600" };
    else if (distNum < 5) proximity = { text: "Cerca", color: "text-blue-600" };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Visita</span>
                    <select
                        value={currentOrder}
                        onChange={(e) => onOrderChange(e.target.value)}
                        className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg focus:ring-amber-500 block p-1"
                    >
                        {[...Array(50)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </select>
                </div>

                <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>

                <div>
                    <p className="font-bold text-gray-800 text-sm">{address}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <select
                            value={currentStatus}
                            onChange={(e) => onStatusChange(orderId, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border-none focus:ring-0 cursor-pointer
                                ${currentStatus === 'enviado' ? 'bg-blue-100 text-blue-700' :
                                    currentStatus === 'pagado' ? 'bg-green-100 text-green-700' :
                                        'bg-gray-100 text-gray-700'}`}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Envíado</option>
                        </select>
                        <span className="text-[10px] text-gray-400">• {distance}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <p className="text-xs text-gray-400">{time} • {distance}</p>
                        <span className={`text-[10px] font-black uppercase ${proximity.color}`}>
                            {proximity.text}
                        </span>
                    </div>
                </div>
            </div>

            <button className="opacity-0 group-hover:opacity-100 bg-gray-100 p-2 rounded-lg hover:bg-amber-100 hover:text-amber-600 transition-all">
                <span className="material-symbols-outlined text-sm">near_me</span>
            </button>
        </div>
    );
}