"use client";
import { useState, useEffect, useCallback } from "react";

// ─── HOOKS NATIVOS (Sin SWR) ─────────────────────────────────────────────────

function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetch("/api/seller/orders");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setOrders(json.data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Se ejecuta solo al montar el componente
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, isLoading, isError, refreshOrders: fetchOrders };
}

function useOrderDetail(orderId: string | null) {
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/seller/orders/${orderId}`);
      const json = await res.json();
      if (json.success) setOrder(json.data);
    } catch (err) {
      console.error("Error fetching detail:", err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { order, isLoading, refreshDetail: fetchDetail };
}

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────

export default function OrdersManager() {
  const { orders, isLoading, isError, refreshOrders } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Estado para nuestra notificación nativa (Toast casero)
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000); // Se oculta a los 3 segundos
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center animate-pulse">
        <div className="size-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold">Cargando pedidos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-64 flex items-center justify-center bg-red-50 rounded-3xl border border-red-100">
        <p className="text-red-500 font-bold">Error al cargar los pedidos. Intenta nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Nuestro Toast Nativo */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm transition-all animate-in slide-in-from-top-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.msg}
        </div>
      )}

      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-black text-gray-800">Gestión de Pedidos</h3>
          <p className="text-sm text-gray-500 font-medium">Administra los envíos y notifica a tus clientes.</p>
        </div>
        <button 
          onClick={refreshOrders} 
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:shadow-md"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Actualizar
        </button>
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID Pedido</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Comprador</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 text-sm font-bold text-gray-700">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-4 text-sm text-gray-500 font-medium">{order.buyer.full_name}</td>
                <td className="p-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => setSelectedOrderId(order.id)}
                    className="text-xs font-bold text-primary bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors"
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-sm font-bold text-gray-400">
                  No tienes pedidos pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle */}
      {selectedOrderId && (
        <OrderDetailModal 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
          onStatusChanged={refreshOrders}
          onNotify={showNotification} // Pasamos la función del toast al modal
        />
      )}
    </div>
  );
}

// ─── COMPONENTES SECUNDARIOS ────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-600",
    SHIPPED: "bg-blue-100 text-blue-600",
    DELIVERED: "bg-green-100 text-green-600",
    CANCELLED: "bg-gray-100 text-gray-600"
  };

  const labels: Record<string, string> = {
    PENDING: "Pendiente",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado"
  };

  const style = styles[status] || styles.PENDING;
  const label = labels[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${style}`}>
      {label}
    </span>
  );
}

function OrderDetailModal({ orderId, onClose, onStatusChanged, onNotify }: any) {
  const { order, isLoading, refreshDetail } = useOrderDetail(orderId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      
      if (!json.success) throw new Error(json.error);
      
      onNotify("Estado actualizado correctamente", "success");
      refreshDetail();
      onStatusChanged();
    } catch (err: any) {
      onNotify(err.message || "Error al actualizar", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotifyBuyer = async () => {
    setIsNotifying(true);
    try {
      const res = await fetch(`/api/seller/orders/${orderId}/notify`, { method: "POST" });
      const json = await res.json();
      
      if (!json.success) throw new Error(json.error);
      
      onNotify("Notificación enviada al cliente", "success");
    } catch (err: any) {
      onNotify(err.message || "Error al enviar notificación", "error");
    } finally {
      setIsNotifying(false);
    }
  };

  if (isLoading || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-black text-gray-800">
            Pedido #{(order?.id || orderId).slice(-6).toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Cuerpo Modal */}
        <div className="p-8 overflow-y-auto bg-slate-50/30">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cliente</h3>
              {/* Escudos aplicados aquí */}
              <p className="font-bold text-gray-800">{order?.buyer?.full_name || "Desconocido"}</p>
              <p className="text-sm text-gray-500 font-medium">{order?.buyer?.email || "Sin correo"}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dirección de Envío</h3>
              {/* Escudos aplicados aquí */}
              <p className="text-sm font-bold text-gray-800">{order?.address?.street || "Sin calle"}</p>
              <p className="text-sm text-gray-500 font-medium">
                {order?.address?.city || "Sin ciudad"}, {order?.address?.postal_code || order?.address?.zip || ""}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cambiar Estado</label>
              <select 
                value={order?.status || "pendiente"} 
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdating}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl block w-full p-3 font-bold focus:ring-primary focus:border-primary transition-all outline-none disabled:opacity-50"
              >
                {/* Opciones ajustadas a minúsculas como en Prisma */}
                <option value="pendiente">Pendiente (Preparando)</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <button 
              onClick={handleNotifyBuyer}
              disabled={isNotifying}
              className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-xl shadow-md hover:bg-primary font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
              {isNotifying ? 'Enviando...' : 'Notificar Cliente'}
            </button>
          </div>

          <div>
            <h3 className="font-black text-gray-800 mb-4 text-lg">Artículos del Pedido</h3>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-50">
                {/* Escudo para evitar que falle si no hay items */}
                {(order?.items || []).map((item: any) => (
                  <li key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-black">
                        {item.quantity}x
                      </span>
                      {/* Escudos en el producto */}
                      <span className="font-bold text-gray-700 text-sm">{item?.product?.name || "Producto desconocido"}</span>
                    </div>
                    <span className="font-black text-gray-800">${(item?.product?.price || 0) * item.quantity}</span>
                  </li>
                ))}
                
                {/* Mensaje por si el arreglo de items viene vacío */}
                {(!order?.items || order.items.length === 0) && (
                   <li className="p-4 text-center text-sm text-gray-500">No se encontraron artículos</li>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}