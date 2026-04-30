/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Capa de Presentación (UI) - COMPRADORES
 * Historia de Usuario: US009-G - Historial de compras del cliente
 * AUTOR (Responsable): Amaury Yamil Morales Diaz
 * COPILOTO (XP Pair): Leonides Lopez Robles
 * FECHA: 14/04/2026
 */

"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerDashboard({ user }: { user: any }) {
  const [payments, setPayments] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  
  const router = useRouter();
  const [restoring, setRestoring] = useState(false);

  // US009-G: Mock Data LEAN para el Historial de Pedidos
  const orderHistory = [
    { id: "ORD-9281", date: "10/04/2026", total: 1450.00, status: "ENTREGADO", items: 3 },
    { id: "ORD-9102", date: "05/04/2026", total: 320.50, status: "EN_CAMINO", items: 1 },
    { id: "ORD-8834", date: "28/03/2026", total: 890.00, status: "DEVUELTO", items: 2 },
  ];

  useEffect(() => {
    fetch('/api/buyer/history')
      .then(res => res.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  // FUNCIÓN PARA RECUPERAR EL CARRITO Y REINTENTAR EL PAGO
  const handleRetryPayment = async (orderId: string) => {
    setRestoring(true);
    try {
      // Usamos userId en lugar de buyerId para que coincida con la API
      const res = await fetch('/api/buyer/cart/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, userId: user.id }) 
      });

      if (res.ok) {
        // Si se restauró el carrito, lo mandamos a pagar (o al carrito)
        router.push('/cart'); 
      } else {
        alert("Hubo un problema al recuperar tu carrito. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al restaurar el carrito:", error);
    } finally {
      setRestoring(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-gray-400">Cargando historial...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-black text-red-600 mb-2">Hola, {user?.name || "Aria"}</h1>
        <p className="text-gray-500">Aquí está el resumen de tus compras y pagos.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* SECCIÓN 1: PAGOS RECIENTES */}
        <div>
          <h2 className="text-2xl font-black text-gray-800 mb-6">Pagos Recientes</h2>
          <div className="space-y-6">
            {payments.length === 0 ? (
              <p className="text-center text-gray-400 bg-gray-50 p-6 rounded-2xl">No hay pagos recientes aún.</p>
            ) : (
              payments.map((pay: any) => (
                <div key={pay.id} className="p-[4px] rounded-[1.5rem] bg-gradient-to-r from-[#e3003b] via-[#8c00ff] to-[#1a0045] shadow-xl max-w-2xl mx-auto">
                  <div className="bg-white p-6 rounded-[1.3rem] flex justify-between items-center">
                    
                    {/* INFO DEL PAGO */}
                    <div className="text-left">
                      <h3 className="font-black text-gray-800 uppercase tracking-tight">Pago #{pay.order_id.substring(0, 8)}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`material-symbols-outlined text-sm ${
                          pay.status === 'aprobado' ? 'text-green-500' : 
                          pay.status === 'rechazado' ? 'text-red-500' : 
                          'text-yellow-500'
                        }`}>
                          {pay.status === 'aprobado' ? 'check_circle' : 
                           pay.status === 'rechazado' ? 'cancel' : 
                           'schedule'}
                        </span>
                        <p className="text-xs text-gray-400">
                          {new Date(pay.created_at).toLocaleDateString()}
                          <span className="ml-2 uppercase font-bold" style={{
                            color: pay.status === 'rechazado' ? '#ef4444' : 
                                   pay.status === 'aprobado' ? '#22c55e' : '#eab308'
                          }}>
                            • {pay.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black text-gray-900">${pay.amount}</span>
                      <button 
                        onClick={() => setSelectedPayment(pay)}
                        className="text-xs font-bold text-primary mt-2 flex items-center gap-1 hover:scale-105 transition-transform"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Ver detalles
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECCIÓN 2: US009-G HISTORIAL DE PEDIDOS */}
        <div>
          <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600">history</span>
            Historial de Pedidos
          </h2>
          <div className="bg-white rounded-[1.5rem] shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Nº Orden</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Artículos</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {orderHistory.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items} unid.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                          order.status === 'ENTREGADO' ? 'bg-green-100 text-green-700' :
                          order.status === 'EN_CAMINO' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-gray-400 hover:text-primary transition-colors flex items-center justify-end w-full">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTÓN VOLVER */}
        <div className="max-w-2xl mx-auto pt-8">
          <div className="p-[4px] rounded-[1.5rem] bg-gradient-to-r from-[#e3003b] via-[#8c00ff] to-[#1a0045] shadow-xl">
            <Link href="/" className="bg-black p-6 rounded-[1.3rem] flex items-center justify-center text-white font-black text-lg hover:bg-zinc-900 transition-all gap-3 group">
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
              Volver a la tienda
            </Link>
          </div>
        </div>

      </div>

      {/* --- MODAL DEL COMPROBANTE --- */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedPayment(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 mb-1">VibeMarket</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 font-bold">
                COMPROBANTE
              </p>
              
              {/* VISTA 1: APROBADO O PENDIENTE */}
              {selectedPayment.status !== 'rechazado' && (
                <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3 text-left border border-gray-100">
                  <div className="flex flex-col mb-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Cliente:</span>
                    <span className="text-sm font-black text-gray-800">{user?.name || "Usuario"}</span>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-2"></div>

                  <div className="flex justify-between text-[11px]"><span className="text-gray-400">FECHA:</span> <span className="font-bold">{new Date(selectedPayment.created_at).toLocaleString()}</span></div>
                  <div className="flex justify-between text-[11px]"><span className="text-gray-400">MÉTODO:</span> <span className="font-bold uppercase">{selectedPayment.provider}</span></div>
                  
                  <div className="pt-4 flex justify-between items-center border-t border-dashed border-gray-300">
                    <span className="text-xs font-black">TOTAL:</span>
                    <span className="text-2xl font-black text-gray-900">${selectedPayment.amount}</span>
                  </div>
                </div>
              )}

              {/* VISTA 2: RECHAZADO (Aquí cumplimos la US012-D y US012-E) */}
              {selectedPayment.status === 'rechazado' && (
                <div className="bg-red-50 rounded-2xl p-5 mb-6 border border-red-100 text-center">
                  <span className="material-symbols-outlined text-5xl text-red-500 mb-2">error</span>
                  <h3 className="font-black text-red-700 text-lg">Pago Fallido</h3>
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    No pudimos procesar tu pago por <strong>${selectedPayment.amount}</strong>.
                    <br/><br/>
                    🛒 <strong>No te preocupes</strong>, tu carrito y tu progreso están guardados a salvo.
                  </p>
                </div>
              )}

              {/* BOTONES DE ACCIÓN CORRECTOS DEPENDIENDO DEL ESTADO */}
              {selectedPayment.status === 'rechazado' ? (
                <button 
                  onClick={() => handleRetryPayment(selectedPayment.order_id)}
                  disabled={restoring}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  <span className={restoring ? "animate-spin material-symbols-outlined" : "material-symbols-outlined"}>
                    {restoring ? 'autorenew' : 'refresh'}
                  </span>
                  {restoring ? 'Recuperando carrito...' : 'Volver a intentar pago'}
                </button>
              ) : selectedPayment.status === 'aprobado' ? (
                <button 
                  onClick={() => window.print()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">download</span>
                  Descargar Ticket
                </button>
              ) : (
                <button 
                  onClick={() => setSelectedPayment(null)}
                  className="w-full bg-yellow-400 text-yellow-900 py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-yellow-200 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">hourglass_empty</span>
                  Entendido
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}