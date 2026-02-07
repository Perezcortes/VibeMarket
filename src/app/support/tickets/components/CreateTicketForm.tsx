"use client";

import { createTicket } from "../lib/actions";
import { useRef } from "react";

export default function CreateTicketForm() {
  const formRef = useRef<HTMLFormElement>(null);

  // Forzamos a que la función devuelva Promise<void> para cumplir con el tipo de 'action'
  const handleAction = async (formData: FormData): Promise<void> => {
    await createTicket(formData);
    
    // Feedback visual y limpieza
    alert("¡Ticket enviado con éxito!");
    formRef.current?.reset();
    
    // Al no retornar nada aquí, la función cumple con ser Promise<void>
  };

  return (
    <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl mb-10 shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">Crear Nuevo Ticket</h2>
      
      <form 
        ref={formRef}
        action={handleAction} 
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Asunto</label>
            <input 
              name="subject"
              required
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
              placeholder="Ej. Problema con mi pedido"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Prioridad</label>
            <select 
              name="priority"
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none transition-all"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Mensaje / Descripción</label>
          <textarea 
            name="message"
            required
            rows={4}
            className="w-full bg-black border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-blue-500 outline-none transition-all resize-none"
            placeholder="Describe detalladamente el problema..."
          />
        </div>

        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl text-xs transition-all shadow-lg shadow-blue-900/20"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}