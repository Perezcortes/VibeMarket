"use client";
import { CartItemDetailDTO } from "@/services/seller/shoppingCart/SaveCart.service";
import { useRouter } from "next/navigation";

export default function CartItem({ item }: { item: CartItemDetailDTO }) {
  const router = useRouter();

  const handleRemove = async () => {
    // Aquí conectamos con el servicio de eliminar
    // En el cliente solemos llamar a una API Route que invoque al servicio
    const res = await fetch(`/api/cart/remove?id=${item.cartItemId}`, { method: 'DELETE' });
    if (res.ok) router.refresh(); // Refresca la página para actualizar el total
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="size-20 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
        {item.imageUrl?.startsWith('http') ? (
          <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
        ) : (
          <span className="material-symbols-outlined text-gray-400">image</span>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
      </div>

      <div className="text-right">
        <p className="font-black text-primary text-lg">${item.subtotal.toFixed(2)}</p>
        <button 
          onClick={handleRemove}
          className="text-red-400 text-xs font-bold hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}