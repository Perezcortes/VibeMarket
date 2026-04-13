"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Paso 1: Envío, Paso 2: Pago

  // Estado con todos los datos que MariaDB y el usuario esperan
  const [formData, setFormData] = useState({
    street: "",
    exterior_number: "",
    neighborhood: "",
    city: "Huajuapan de León",
    state: "Oaxaca",
    postal_code: "",
    method: "card", // card, transfer, cash
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2); // Avanzamos al formulario de pago
    } else {
      // Guardamos todo el objeto para la API
      sessionStorage.setItem("checkoutData", JSON.stringify(formData));
      router.push("/checkout/review");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Indicador de pasos */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-red-500' : 'text-gray-600'}`}>
            <span className={`size-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-red-500 font-black' : 'border-gray-600'}`}>1</span>
            <span className="text-xs font-bold uppercase tracking-tighter">Envío</span>
          </div>
          <div className={`w-12 h-px ${step >= 2 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-red-500' : 'text-gray-600'}`}>
            <span className={`size-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-red-500 font-black' : 'border-gray-600'}`}>2</span>
            <span className="text-xs font-bold uppercase tracking-tighter">Pago</span>
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-6">
          
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-right duration-500">
              <h2 className="text-2xl font-black mb-6 text-center">Dirección de Envío</h2>
              <div className="space-y-4">
                <input required name="street" placeholder="Calle" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none transition-all" onChange={handleChange} />
                <div className="grid grid-cols-2 gap-4">
                  <input required name="exterior_number" placeholder="Núm. Ext" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none" onChange={handleChange} />
                  <input required name="postal_code" placeholder="C.P." maxLength={5} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none" onChange={handleChange} />
                </div>
                <input required name="neighborhood" placeholder="Colonia / Fraccionamiento" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none" onChange={handleChange} />
                <p className="text-zinc-500 text-sm text-center italic">Huajuapan de León, Oaxaca</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right duration-500">
              <h2 className="text-2xl font-black mb-6 text-center">Método de Pago</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {['card', 'transfer', 'cash'].map((m) => (
                  <button key={m} type="button" onClick={() => setFormData({...formData, method: m})}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.method === m ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-zinc-800 text-zinc-500'}`}>
                    <span className="material-symbols-outlined">{m === 'card' ? 'credit_card' : m === 'transfer' ? 'account_balance' : 'payments'}</span>
                    <span className="text-[10px] font-bold uppercase">{m}</span>
                  </button>
                ))}
              </div>

              {formData.method === 'card' && (
                <div className="space-y-4">
                  <input required name="cardName" placeholder="Nombre en la tarjeta" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none" onChange={handleChange} />
                  <input required name="cardNumber" placeholder="0000 0000 0000 0000" maxLength={16} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none" onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <input required name="expiry" placeholder="MM/YY" maxLength={5} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none" onChange={handleChange} />
                    <input required name="cvv" placeholder="CVV" maxLength={3} className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl focus:border-red-500 outline-none" onChange={handleChange} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="flex-1 p-4 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-all">Atrás</button>
            )}
            <button type="submit" className="flex-[2] p-4 bg-red-600 rounded-xl font-bold hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all active:scale-95">
              {step === 1 ? "Continuar al Pago" : "Ver Resumen de Compra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}