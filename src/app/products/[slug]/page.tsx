import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { notFound } from "next/navigation";
import Link from "next/link";

// 1. Definimos el tipo como una Promesa
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  
  // 2. DESEMPAQUETAMOS LOS PARÁMETROS CON AWAIT 
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: { category: true, images: true, seller: true }
  });

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-text-main">
      <Navbar user={session?.user} />

      <main className="container mx-auto px-4 py-12">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-primary">Catálogo</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            
            {/* IZQUIERDA: IMAGEN GRANDE */}
            <div className="bg-gray-50 p-8 flex items-center justify-center h-[400px] md:h-[600px] relative group border-r border-gray-100">
               {product.images[0] ? (
                 <img 
                   src={product.images[0].url} 
                   alt={product.name} 
                   className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
                 />
               ) : (
                 <span className="material-symbols-outlined text-9xl text-gray-300">image</span>
               )}
            </div>

            {/* DERECHA: INFO Y COMPRA */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
               <div className="mb-4">
                 <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.category?.name || "General"}
                 </span>
               </div>

               <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                 {product.name}
               </h1>

               {/* Precio y Stock */}
               <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                 <span className="text-5xl font-black text-primary tracking-tight">
                    ${Number(product.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                 </span>
                 {product.stock > 0 ? (
                    <span className="flex items-center gap-1 text-green-700 font-bold text-sm bg-green-100 px-3 py-1.5 rounded-full">
                        <span className="material-symbols-outlined text-lg">check_circle</span> Disponible ({product.stock})
                    </span>
                 ) : (
                    <span className="text-red-700 font-bold text-sm bg-red-100 px-3 py-1.5 rounded-full">Agotado</span>
                 )}
               </div>

               {/* Descripción */}
               <div className="prose prose-slate mb-8 text-gray-600 leading-relaxed">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined">info</span>
                    Descripción del Producto
                  </h3>
                  <p className="text-lg">{product.description}</p>
                  
                  <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500">verified</span> Garantía de calidad VibeMarket.</li>
                          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-blue-500">store</span> Vendido por: <strong>{product.seller.full_name}</strong></li>
                          <li className="flex items-center gap-2"><span className="material-symbols-outlined text-purple-500">local_shipping</span> Envío asegurado a todo México.</li>
                      </ul>
                  </div>
               </div>

               {/* Botones */}
               <div className="flex gap-4 mt-auto pt-4">
                  <button className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-2 group">
                     <span className="material-symbols-outlined group-hover:animate-bounce">shopping_bag</span>
                     Añadir al Carrito
                  </button>
                  <button className="px-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                     <span className="material-symbols-outlined text-2xl">favorite</span>
                  </button>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}