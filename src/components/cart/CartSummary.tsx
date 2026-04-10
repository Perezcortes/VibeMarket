"use client";

interface CartSummaryProps {
  total: number;
}

export default function CartSummary({ total }: CartSummaryProps) {
  const shipping = total > 500 ? 0 : 99; // Lógica de ejemplo: Envío gratis > $500
  const finalTotal = total + shipping;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
      <h2 className="text-xl font-black mb-6">Resumen</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-500">
          <span>Envío</span>
          <span className="font-bold text-gray-800">
            {shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {/* Espacio para que el compañero de Cupones trabaje */}
        <div className="pt-4">
          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">¿Tienes un cupón?</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="VIBE2026"
              className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 focus:outline-primary"
            />
            <button className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold">Aplicar</button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-gray-500">Total</span>
          <span className="text-3xl font-black text-primary">${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined">payments</span>
        Finalizar Compra
      </button>
      
      <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest">
        Pagos seguros mediante VibePay
      </p>
    </div>
  );
}