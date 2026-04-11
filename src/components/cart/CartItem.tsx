"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartItemDetailDTO } from "@/services/seller/shoppingCart/SaveCart.service";

export default function CartItem({ item }: { item: CartItemDetailDTO }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // US011-B y E: Cambiar cantidad (Incrementar/Decrementar)
  const updateQty = async (newQty: number) => {
    if (newQty < 1) return; // Para eliminar se usa el botón de basura
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartItemId: item.cartItemId, 
          newQuantity: newQty 
        }),
      });

      const data = await response.json();

      if (data.item?.wasAdjustedByStock) {
        alert(`Lo sentimos, solo hay ${data.item.quantity} unidades disponibles.`);
      }

      router.refresh(); // Actualiza el Navbar y el Total de la página
    } catch (error) {
      alert("Error al actualizar la cantidad");
    } finally {
      setIsUpdating(false);
    }
  };

  // US011-C: Eliminar producto
  const removeItem = async () => {
    if (!confirm(`¿Eliminar ${item.name} del carrito?`)) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/cart?id=${item.cartItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      alert("No se pudo eliminar el producto");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl items-center shadow-sm transition-opacity ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
      <img 
        src={item.imageUrl || ''} 
        alt={item.name} 
        className="size-24 object-cover rounded-xl bg-slate-100" 
      />
      
      <div className="flex-1">
        <h4 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h4>
        <p className="text-xs text-gray-400 mb-3">{item.isActive ? 'Disponible' : 'No disponible'}</p>
        
        <div className="flex items-center gap-4">
          {/* US011-B: Controles de cantidad */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => updateQty(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="size-8 flex items-center justify-center hover:bg-white rounded-md transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            
            <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
            
            <button 
              onClick={() => updateQty(item.quantity + 1)}
              disabled={isUpdating}
              className="size-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>

          {/* US011-C: Botón Eliminar */}
          <button 
            onClick={removeItem}
            className="text-gray-300 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
            <span className="text-xs font-bold uppercase">Quitar</span>
          </button>
        </div>

        {!item.hasStock && (
          <p className="text-red-500 text-[10px] font-bold uppercase mt-2 italic flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">error</span>
            Stock insuficiente
          </p>
        )}
      </div>

      <div className="text-right min-w-[100px]">
        <p className="text-xl font-black text-primary">${item.subtotal.toFixed(2)}</p>
        <p className="text-[10px] text-gray-300 font-medium">u.p. ${item.unitPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}