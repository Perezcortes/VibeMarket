import Link from "next/link";

// Definimos que searchParams es una promesa (estándar de Next.js 15+)
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  // Esperamos los parámetros de la URL
  const params = await searchParams;
  const orderId = params.orderId;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icono de éxito */}
        <div className="size-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>

        <h1 className="text-3xl font-black mb-2 text-white">¡Pedido Confirmado!</h1>
        
        <p className="text-zinc-500 mb-8">
          Tu orden 
          <span className="text-white font-mono bg-zinc-800 px-2 py-1 rounded mx-1">
            #{orderId ? orderId.slice(0, 8) : "Cargando..."}
          </span> 
          ha sido registrada con éxito.
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href="/dashboard" 
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all"
          >
            Ver mis pedidos
          </Link>
          
          <Link 
            href="/" 
            className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}