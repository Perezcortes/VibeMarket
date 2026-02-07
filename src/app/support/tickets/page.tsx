import { getTickets } from "./lib/actions";
import Link from "next/link";
import { TicketPriority, TicketStatus } from "@prisma/client";
// 1. Importamos el componente del formulario
import CreateTicketForm from "./components/CreateTicketForm";

export default async function TicketsDashboard() {
  const tickets = await getTickets();

  return (
    <div className="p-8 text-white space-y-10">
      
      {/* SECCIÓN A: FORMULARIO DE CREACIÓN */}
      <section>
        <CreateTicketForm />
      </section>

      {/* SECCIÓN B: TABLA DE GESTIÓN */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Tickets</h1>
            <p className="text-gray-400 text-sm">Panel de control de soporte técnico</p>
          </div>
          <span className="bg-blue-600/20 text-blue-400 border border-blue-600/50 text-xs font-semibold px-3 py-1 rounded-full">
            {tickets.length} Tickets Encontrados
          </span>
        </div>

        <div className="overflow-hidden bg-[#121212] rounded-xl border border-gray-800 shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1a1a] text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Asunto</th>
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Prioridad</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-100">{ticket.subject}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{ticket.message}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {ticket.user?.full_name || "Desconocido"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusDot(ticket.status)}`} />
                        <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/support/tickets/${ticket.id}`} 
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-all border border-gray-700"
                    >
                      Gestionar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// Funciones auxiliares (Mantén tus funciones getPriorityStyle y getStatusDot aquí abajo)
function getPriorityStyle(prio: TicketPriority) {
  switch (prio) {
    case 'critica': return 'bg-red-500/10 text-red-500 border border-red-500/50';
    case 'alta': return 'bg-orange-500/10 text-orange-500 border border-orange-500/50';
    case 'media': return 'bg-blue-500/10 text-blue-500 border border-blue-500/50';
    case 'baja': return 'bg-gray-500/10 text-gray-400 border border-gray-500/50';
    default: return 'bg-gray-500/10 text-gray-400';
  }
}

function getStatusDot(status: TicketStatus) {
    if (status === 'abierto') return 'bg-green-500 animate-pulse';
    if (status === 'en_proceso') return 'bg-yellow-500';
    if (status === 'cerrado' || status === 'resuelto') return 'bg-gray-600';
    return 'bg-gray-400';
}