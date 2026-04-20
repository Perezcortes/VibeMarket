"use client";
import { useState } from "react";
import { CartItemDetailDTO } from "@/services/seller/shoppingCart/SaveCart.service";

interface FormularioCuponProps {
    cartItems: CartItemDetailDTO[]; // 👈 Usamos el tipo correcto
    onDiscountChange: (discount: number, couponData: any) => void;
}

export default function FormularioCupon({ cartItems, onDiscountChange }: FormularioCuponProps) {
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const [applied, setApplied] = useState(false);

    const handleApplyCoupon = async () => {
        setCouponError("");
        try {
            // 1. Extraemos los IDs basándonos en el DTO de Leonides
            const validIds = cartItems.map(item => item.productId).filter(Boolean);

            const res = await fetch("/api/cart/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: couponCode,
                    cartProductIds: validIds
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // 2. Filtramos los items del carrito usando los IDs que el backend autorizó
            const sellerProducts = cartItems.filter(item => 
                data.coupon.appliedProductIds.includes(item.productId)
            );

            // 3. Calculamos usando la variable de precio de Leonides (unitPrice)
            const sellerSubtotal = sellerProducts.reduce((acc, item) => {
                return acc + (Number(item.unitPrice) * Number(item.quantity));
            }, 0);

            // 4. Aplicamos el descuento
            let discountValue = 0;
            const couponValue = Number(data.coupon.value);

            if (data.coupon.type === "porcentaje") {
                discountValue = (sellerSubtotal * couponValue) / 100;
            } else if (data.coupon.type === "monto_fijo") {
                discountValue = Math.min(couponValue, sellerSubtotal);
            }

            console.log(`Aplicando ${data.coupon.type}: ${couponValue} sobre subtotal ${sellerSubtotal}`);

            setApplied(true);
            onDiscountChange(discountValue, data.coupon);
        } catch (err: any) {
            setApplied(false);
            setCouponError(err.message);
            onDiscountChange(0, null);
        }
    };

    return (
        <div className="pt-4 border-t border-gray-50 mt-4">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-tight">¿Tienes un cupón?</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código de cupón"
                    className={`bg-slate-50 border ${couponError ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-2 text-sm flex-1 focus:outline-primary transition-all`}
                />
                <button
                    onClick={handleApplyCoupon}
                    className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all"
                >
                    Aplicar
                </button>
            </div>
            {couponError && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{couponError}</p>}
            {applied && <p className="text-green-500 text-[10px] font-bold mt-1 ml-1">✓ Cupón aplicado</p>}
        </div>
    );
}