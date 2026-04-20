"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData");
    if (!data) router.push("/checkout/payment");
    setCheckoutData(JSON.parse(data || "{}"));
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!session?.user?.id || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          ...checkoutData // Enviamos dirección y método de pago
        })
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.removeItem("checkoutData"); // Limpiamos datos temporales
        router.push(`/checkout/success?orderId=${result.orderId}`);
      } else {
        alert(result.error || "Error al procesar la compra");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) return <div className="p-20 text-center">Cargando resumen...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black mb-8">Revisa tu Pedido</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resumen de Datos Capturados */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Dirección de Envío</h3>
              <Link href="/checkout/payment" className="text-primary text-sm font-bold">Editar</Link>
            </div>
            <p className="text-gray-600">
              {checkoutData.street} #{checkoutData.exterior_number}<br />
              {checkoutData.neighborhood}<br />
              {checkoutData.city}, {checkoutData.state}, CP {checkoutData.postal_code}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Método de Pago</h3>
              <Link href="/checkout/payment" className="text-primary text-sm font-bold">Editar</Link>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400">
                {checkoutData.method === 'card' ? 'credit_card' : 'payments'}
              </span>
              <p className="text-gray-600 capitalize">
                {checkoutData.method === 'card' 
                  ? `Tarjeta terminada en ${checkoutData.cardNumber.slice(-4)}`
                  : checkoutData.method}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de Acción Final */}
        {/* Botón de Acción Final */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl h-fit">
          <h3 className="text-xl font-bold mb-4">Finalizar Compra</h3>
          
          {/* ✨ NUEVO: Mostramos el total a cobrar y el descuento para dar seguridad al cliente */}
          <div className="space-y-2 mb-6 border-b border-slate-700 pb-4">
            {Number(checkoutData.descuentoAplicado) > 0 && (
              <div className="flex justify-between text-green-400 text-sm font-bold">
                <span>Cupón ({checkoutData.cuponUsado})</span>
                <span>-${Number(checkoutData.descuentoAplicado).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-black">
              <span>Total:</span>
              <span className="text-red-500">${Number(checkoutData.totalACobrar).toFixed(2)}</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm mb-6">
            Al hacer clic en el botón, aceptas los términos y condiciones de VibeMarket. El cobro se realizará de forma inmediata.
          </p>
          <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-red-600 transition-all disabled:bg-slate-700"
          >
            {isProcessing ? "Procesando..." : "Pagar y Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}