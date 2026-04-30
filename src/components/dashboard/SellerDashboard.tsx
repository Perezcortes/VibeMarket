"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import CatalogManager from "@/components/dashboard/seller/CatalogManager";
import OrdersManager from "@/components/dashboard/seller/orderManager";
// Al inicio del archivo, agregar el import:
import DiscountsPage from "@/components/dashboard/seller/discountsManager"; // Ajusta la ruta si es necesario
// --- NUEVA INTERFAZ PARA INTEGRAR CON EL PRESENTER ---
interface SellerDashboardProps {
  user: any;
  orders: any[];    // Datos de HU008 formateados por el Presenter
  stats: any;       // Resumen de gastos de HU008
}

// --- NUEVA INTERFAZ PARA INTEGRAR CON EL PRESENTER ---
interface SellerDashboardProps {
  user: any;
  orders: any[];    // Datos de HU008 formateados por el Presenter
  stats: any;       // Resumen de gastos de HU008
}

export default function SellerDashboard({ user, orders, stats }: SellerDashboardProps) {
  const [view, setView] = useState("overview");

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
            <SidebarItem 
                icon="dashboard" 
                label="Resumen" 
                active={view === 'overview'} 
                onClick={() => setView('overview')} 
            />
            {/* NUEVA OPCIÓN PARA TU HISTORIA DE USUARIO HU008 */}
           <SidebarItem 
    icon="sell"          // ← icono correcto de Material Symbols
    label="Descuentos" 
    active={view === 'descuentos'} 
    onClick={() => setView('descuentos')} 
/>
            <SidebarItem 
                icon="inventory_2" 
                label="Catálogo & Stock" 
                active={view === 'catalog'} 
                onClick={() => setView('catalog')} 
            />
            <SidebarItem 
    icon="local_shipping" 
    label="Pedidos" 
    badge={orders.length > 0 ? orders.length.toString() : undefined} 
    active={view === 'orders'} 
    onClick={() => setView('orders')} 
/>
         </nav>

         <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
            <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "V"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                        {user?.name || "Vendedor"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                        {user?.role || "Panel Vendedor"}
                    </p>
                </div>
            </div>

            <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 rounded-xl transition-all text-xs font-bold shadow-sm hover:shadow-md group"
            >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">logout</span> 
                Cerrar Sesión
            </button>
         </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {view === 'history' ? 'Historial de Gastos' : 'Panel de Control'}
                </h2>
                <p className="text-gray-500 font-medium">Hola {user?.name?.split(' ')[0]}, administra tu tienda aquí.</p>
            </div>
        </header>

        {/* --- VISTA DE HISTORIAL (HU008 INTEGRADA) --- */}
        {view === 'history' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Cards desde el Presenter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 mb-2">Total Gastado</h3>
                        <p className="text-3xl font-black text-primary">{stats.totalSpent}</p>
                     </div>
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 mb-2">Ticket Promedio</h3>
                        <p className="text-3xl font-black text-gray-800">{stats.avgTicket}</p>
                     </div>
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-500 mb-2">Total de Órdenes</h3>
                        <p className="text-3xl font-black text-gray-800">{stats.count}</p>
                     </div>
                </div>

                {/* Tabla de órdenes formateadas */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Orden ID</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 text-sm font-bold text-gray-700">#{order.id}</td>
                                    <td className="p-4 text-sm text-gray-500">{order.date}</td>
                                    <td className="p-4 text-sm font-black text-gray-800">{order.total}</td>
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

        {/* 1. Resumen Original */}
        {view === 'overview' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* ... tu código de resumen ... */}
             </div>
        )}

        {/* 2. Catálogo */}
        {view === 'catalog' && <CatalogManager />}

         {/* 3. Pedidos */}
        {view === 'orders' && <OrdersManager />}
        {/* descuentos */}
{view === 'descuentos' && <DiscountsPage />}


        {/* 3. Otros */}
        {(view !== 'overview' && view !== 'catalog' && view !== 'history' && view !== 'orders' && view !== 'descuentos') && (
       
            <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-[#1a1010] rounded-3xl border-2 border-dashed border-gray-200">
                <span className="material-symbols-outlined text-4xl text-gray-400">construction</span>
                <p className="text-gray-500 mt-2">Módulo {view} en construcción.</p>
            </div>
        )}

      </main>
    </div>
  );
}

// Subcomponente de Botón Sidebar (Sin cambios)
function SidebarItem({ icon, label, active, onClick, badge }: any) {
    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                ? "bg-red-50 dark:bg-red-900/20 text-primary font-bold shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
            }`}
        >
            <span className={`material-symbols-outlined ${active ? "fill-1" : ""} group-hover:scale-110 transition-transform`}>{icon}</span>
            <span className="text-sm font-medium">{label}</span>
            {badge && <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</span>}
        </button>
    )
}