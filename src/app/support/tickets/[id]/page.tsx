import { getTicketById, updateTicketStatus } from "../lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: Props) {
  // 1. Desempaquetamos el ID de la URL
  const { id } = await params;
  
  // 2. Obtenemos los datos reales de MariaDB
  const ticket = await getTicketById(id);

  // Si el ticket no existe en la DB, mostramos error 404
  if (!ticket) notFound();

  // 3. Acción del servidor para actualizar el estado
  async function handleUpdate(formData: FormData) {
    "use server";
    const status = formData.get("status") as any;
    await updateTicketStatus(id, status);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      {/* Navegación de regreso */}
      <Link href="/support/tickets" className="text-blue-400 text-sm hover:underline flex items-center gap-2 mb-6">
        ← Volver al Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lado Izquierdo: Contenido y Usuario */}
        <div className="lg:col-span-2 space-y-6">
          <header className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">{ticket.subject}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPriorityClass(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <div className="bg-black/40 p-5 rounded-xl border border-gray-800/50">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {ticket.message}
              </p>
            </div>
          </header>

          <section className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Detalles del Solicitante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nombre Cliente</p>
                <p className="font-medium">{ticket.user.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Correo Electrónico</p>
                <p className="font-medium text-blue-300">{ticket.user.email}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Lado Derecho: Acciones y Estado */}
        <aside className="space-y-6">
          <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl sticky top-24">
            <h2 className="text-sm font-bold text-gray-400 mb-6">Gestión de Ticket</h2>
            
            <form action={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-2">Cambiar Estado</label>
                <select 
                  name="status" 
                  defaultValue={ticket.status}
                  className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="abierto">🟢 Abierto</option>
                  <option value="en_proceso">🟡 En Proceso</option>
                  <option value="resuelto">🔵 Resuelto</option>
                  <option value="cerrado">🔴 Cerrado</option>
                </select>
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                Guardar Cambios
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800 text-[11px] text-gray-500 space-y-2">
              <p>ID: <span className="text-gray-400 font-mono">{ticket.id}</span></p>
              <p>Creado: {new Date(ticket.created_at).toLocaleString()}</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

// Estilos dinámicos para prioridades
function getPriorityClass(prio: string) {
  switch (prio) {
    case 'critica': return 'text-red-500 border-red-500/30 bg-red-500/10';
    case 'alta': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    case 'media': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
    case 'baja': return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    default: return 'text-gray-400 border-gray-800 bg-gray-800/50';
  }
}