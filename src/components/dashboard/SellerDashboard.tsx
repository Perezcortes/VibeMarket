"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import CatalogManager from "@/components/dashboard/seller/CatalogManager";
import OrdersManager from "@/components/dashboard/seller/orderManager";
import DiscountsPage from "@/components/dashboard/seller/discountsManager";

interface SellerDashboardProps {
    user: any;
    orders: any[];    
    stats: any;      
}

export default function SellerDashboard({ user, orders, stats }: SellerDashboardProps) {
    const [view, setView] = useState("overview");
    const [returnRequests, setReturnRequests] = useState<any[]>([]);
    const [loadingReturns, setLoadingReturns] = useState(false);
    const [managingId, setManagingId] = useState<string | null>(null);

    useEffect(() => {
        if (view === 'returns') {
            setLoadingReturns(true);
            fetch('/api/seller/returns')
                .then(res => res.json())
                .then(data => {
                    setReturnRequests(Array.isArray(data) ? data : []);
                    setLoadingReturns(false);
                })
                .catch(() => setLoadingReturns(false));
        }
    }, [view]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/seller/returns', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, newStatus })
            });

            if (res.ok) {
                setReturnRequests(prev =>
                    prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
                );
                setManagingId(null);
            }
        } catch (err) {
            console.error("Error al actualizar en VibeMarket:", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0f0a0a] flex font-sans">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white dark:bg-[#1a1010] border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto z-20">
                <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-gray-800">
                    <h1 className="text-2xl font-black tracking-tighter flex items-center gap-1">
                        <span className="text-primary">Vibe</span>
                        <span className="text-text-main dark:text-white">Seller</span>
                    </h1>
                </div>

                <nav className="p-4 space-y-2 flex-1">
                    <SidebarItem icon="dashboard" label="Resumen" active={view === 'overview'} onClick={() => setView('overview')} />
                    <SidebarItem icon="history_edu" label="Historial de Gastos" active={view === 'history'} onClick={() => setView('history')} />
                    <SidebarItem icon="inventory_2" label="Catálogo & Stock" active={view === 'catalog'} onClick={() => setView('catalog')} />
                    <SidebarItem icon="local_shipping" label="Pedidos" badge={orders?.length > 0 ? orders.length.toString() : "0"} active={view === 'orders'} onClick={() => setView('orders')} />
                    <SidebarItem icon="assignment_return" label="Devoluciones" active={view === 'returns'} onClick={() => setView('returns')} />
                    <SidebarItem icon="sell" label="Descuentos" active={view === 'descuentos'} onClick={() => setView('descuentos')} />
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 text-sm">
                            {user?.name?.charAt(0).toUpperCase() || "V"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.name || "Vendedor"}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role || "Panel Vendedor"}</p>
                        </div>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-xl transition-all text-xs font-bold shadow-sm hover:shadow-md group">
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="flex-1 p-8 overflow-y-auto relative">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase">
                            {view === 'returns' ? 'Gestión de Retornos' : view === 'history' ? 'Historial de Gastos' : view === 'descuentos' ? 'Promociones' : 'Panel de Control'}
                        </h2>
                        <p className="text-gray-500 font-medium">Hola {user?.name?.split(' ')[0]}, administra tu tienda aquí.</p>
                    </div>
                </header>

                {view === 'overview' && <div className="animate-in fade-in text-gray-400 font-black uppercase text-xs tracking-widest">Resumen General de VibeMarket</div>}
                {view === 'catalog' && <CatalogManager />}
                {view === 'orders' && <OrdersManager />}
                {view === 'descuentos' && <DiscountsPage />}

                {/* --- VISTA DE HISTORIAL (INTEGRADA DE MAIN) --- */}
                {view === 'history' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                             <div className="bg-white dark:bg-[#1a1010] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-500 mb-2">Total Gastado</h3>
                                <p className="text-3xl font-black text-primary">{stats?.totalSpent || "$0.00"}</p>
                             </div>
                             <div className="bg-white dark:bg-[#1a1010] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-500 mb-2">Ticket Promedio</h3>
                                <p className="text-3xl font-black text-gray-800 dark:text-white">{stats?.avgTicket || "$0.00"}</p>
                             </div>
                             <div className="bg-white dark:bg-[#1a1010] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-500 mb-2">Total de Órdenes</h3>
                                <p className="text-3xl font-black text-gray-800 dark:text-white">{stats?.count || "0"}</p>
                             </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a1010] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Orden ID</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {orders?.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-sm font-bold text-gray-700 dark:text-gray-300">#{order.id}</td>
                                            <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                            <td className="p-4 text-sm font-black text-gray-800 dark:text-white">{order.total}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    order.statusLabel === 'Entregado' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                    {order.statusLabel}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'returns' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        {loadingReturns ? (
                            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-[3rem]">
                                <p className="animate-pulse font-black text-gray-400 uppercase text-xs tracking-widest">Sincronizando protocolos...</p>
                            </div>
                        ) : returnRequests.length === 0 ? (
                            <div className="p-20 text-center bg-white dark:bg-[#1a1010] rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                                <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-800 mb-4">inventory_2</span>
                                <p className="font-black text-gray-400 uppercase text-xs tracking-widest">No hay solicitudes de devolución</p>
                            </div>
                        ) : (
                            returnRequests.map((req) => (
                                <div key={req.id} className="bg-white dark:bg-[#1a1010] p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center group hover:border-primary/20 transition-all">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase italic ${req.status === 'APPROVED' ? 'bg-green-100 text-green-600' : req.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' : 'bg-primary text-white'}`}>{req.status}</span>
                                            <h3 className="font-black text-xl tracking-tighter dark:text-white">ORDEN #{req.orderId.substring(0, 8).toUpperCase()}</h3>
                                        </div>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Motivo: {req.reason}</p>
                                        <p className="text-gray-500 text-sm font-medium italic">"{req.description}"</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {managingId === req.id ? (
                                            <div className="flex gap-2 animate-in zoom-in-95 duration-300">
                                                <button onClick={() => handleStatusChange(req.id, 'APPROVED')} className="px-6 py-3 bg-green-500 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-green-600">Aprobar</button>
                                                <button onClick={() => handleStatusChange(req.id, 'REJECTED')} className="px-6 py-3 bg-rose-500 text-white rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-rose-600">Rechazar</button>
                                                <button onClick={() => setManagingId(null)} className="px-4 py-3 text-gray-400 font-black uppercase text-[9px] hover:text-black dark:hover:text-white"><span className="material-symbols-outlined text-lg">close</span></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setManagingId(req.id)} className="px-8 py-4 bg-gray-900 dark:bg-white dark:text-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all">Gestionar</button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {![ 'overview', 'catalog', 'history', 'orders', 'returns', 'descuentos' ].includes(view) && (
                    <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-[#1a1010] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <span className="material-symbols-outlined text-4xl text-gray-400">construction</span>
                        <p className="text-gray-500 mt-2">Módulo {view} en construcción.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick, badge }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? "bg-red-50 dark:bg-red-900/20 text-primary font-bold shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"}`}>
            <span className={`material-symbols-outlined ${active ? "fill-1" : ""} group-hover:scale-110 transition-transform`}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
            {badge && badge !== "0" && <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</span>}
        </button>
    )
}