"use client";
import { CartItemDetailDTO } from "@/services/seller/shoppingCart/SaveCart.service";
import CartItem from "./CartItem";

interface CartListProps {
  items: CartItemDetailDTO[];
}

export default function CartList({ items }: CartListProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <CartItem key={item.cartItemId} item={item} />
      ))}
      
      {/* Botón para Limpiar Carrito (HU015) */}
      <div className="pt-4 border-t border-dashed border-gray-200 flex justify-end">
        <button 
          className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
          onClick={() => {/* Aquí llamarías a clearAllCart del servicio */}}
        >
          <span className="material-symbols-outlined text-base">delete_sweep</span>
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}