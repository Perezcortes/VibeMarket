"use client";
import { useState, useEffect } from "react";
import FormularioCupon from "./formularioCupon";
import Link from "next/link";

interface CartSummaryProps {
  cart: any;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const [mounted, setMounted] = useState(false); // ✨ NUEVO: Estado de montaje
  const [discount, setDiscount] = useState(0);
  const [couponData, setCouponData] = useState<any>(null);

  // ✨ NUEVO: Le decimos a React que ya estamos en el navegador
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDiscount = (val: number, data: any) => {
    setDiscount(val);
    setCouponData(data);
  };

  // Si no ha montado, mostramos un "esqueleto" para evitar el Hydration Error
  if (!mounted) {
    return <div className="bg-white p-8 rounded-3xl border border-gray-100 h-96 shadow-xl sticky top-24 animate-pulse"></div>;
  }

  const shipping = cart.totalAmount > 500 ? 0 : 99;
  const finalTotal = cart.totalAmount + shipping - discount;

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 h-fit shadow-xl sticky top-24">
      <h2 className="text-2xl font-black mb-6 text-gray-800">Resumen</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Subtotal</span>
          <span>${cart.totalAmount.toFixed(2)}</span>
        </div>

        {couponData && (
          <div className="flex flex-col">
            <div className="flex justify-between text-green-500 font-bold">
              <span>Descuento ({couponData?.code})</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <span className="text-[10px] text-gray-400 italic">Aplicado a: {couponData?.appliedToNames}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-500 font-medium">
          <span>Envío</span>
          <span className={shipping === 0 ? "text-green-500 font-bold" : ""}>
            {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end font-black text-3xl border-t border-gray-100 pt-6 mb-8 text-gray-900">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-gray-400 tracking-widest mb-1">Total a pagar</span>
          <span>Total</span>
        </div>
        <span className="text-primary">${finalTotal.toFixed(2)}</span>
      </div>

      {/* DISPARADOR DEL CHECKOUT (US012-A) */}
      <Link
        href={`/checkout/payment?total=${finalTotal}&discount=${discount}&coupon=${couponData?.code || ''}`}
        className="w-full bg-primary text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95 text-center"
      >
        <span className="material-symbols-outlined">payments</span>
        Finalizar Compra
      </Link>

      {/* SECCIÓN DE CUPÓN (US012-G) */}
      <FormularioCupon cartItems={cart.items} onDiscountChange={handleDiscount} />

      <p className="text-center text-gray-400 text-[10px] mt-4 uppercase font-bold tracking-tighter">
        Pago 100% Seguro en VibeMarket
      </p>
    </div>
  );
}