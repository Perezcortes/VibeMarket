import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/ui/ProductCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

// 1. Ampliamos los Props para recibir todos los filtros de la US010
type Props = {
  searchParams: Promise<{ 
    q?: string;          // US010-A: Nombre
    cat?: string;         // US010-B: Categoría
    min?: string;         // US010-C: Precio Min
    max?: string;         // US010-C: Precio Max
    sort?: "asc" | "desc" // US010-D: Ordenamiento
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  
  const resolvedParams = await searchParams;
  
  // Extraemos y normalizamos los filtros
  const query = resolvedParams.q || "";
  const categoryName = resolvedParams.cat || undefined;
  const minPrice = Number(resolvedParams.min) || 0;
  const maxPrice = Number(resolvedParams.max) || 999999;
  const sortOrder = resolvedParams.sort === "desc" ? "desc" : "asc";

  // 2. Consulta dinámica a MariaDB con Prisma (US010 A, B, C, D)
  const products = await prisma.product.findMany({
    where: {
      is_active: true,
      name: { contains: query }, // US010-A
      price: { gte: minPrice, lte: maxPrice }, // US010-C
      category: categoryName ? { name: categoryName } : undefined, // US010-B
    },
    orderBy: {
      price: sortOrder, // US010-D
    },
    include: { images: true, category: true }
  });

  // Obtenemos categorías para el sidebar de filtros
  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen bg-slate-50 text-text-main font-sans">
      <Navbar user={session?.user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* SIDEBAR DE FILTROS (Interfaz US010) */}
          <aside className="w-full md:w-64 space-y-8">
            <div>
              <h3 className="font-black uppercase text-xs text-gray-400 mb-4 tracking-widest">Ordenar por</h3>
              <div className="flex flex-col gap-2">
                <Link href={`/search?q=${query}&sort=asc`} className={`text-sm ${sortOrder === 'asc' ? 'font-bold text-primary' : ''}`}>Menor precio</Link>
                <Link href={`/search?q=${query}&sort=desc`} className={`text-sm ${sortOrder === 'desc' ? 'font-bold text-primary' : ''}`}>Mayor precio </Link>
              </div>
            </div>

            <div>
              <h3 className="font-black uppercase text-xs text-gray-400 mb-4 tracking-widest">Categorías (US010-B)</h3>
              <div className="flex flex-col gap-2">
                <Link href="/search" className="text-sm">Todas</Link>
                {categories.map(c => (
                  <Link key={c.id} href={`/search?cat=${c.name}`} className={`text-sm ${categoryName === c.name ? 'font-bold text-primary' : ''}`}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black uppercase text-xs text-gray-400 mb-4 tracking-widest">Rango de Precio (US010-C)</h3>
              <div className="flex flex-col gap-2">
                <Link href={`/search?q=${query}&max=500`} className="text-sm">Hasta $500</Link>
                <Link href={`/search?q=${query}&min=500&max=2000`} className="text-sm">$500 a $2,000</Link>
                <Link href={`/search?q=${query}&min=2000`} className="text-sm">Más de $2,000</Link>
              </div>
            </div>
          </aside>

          {/* GRILLA DE PRODUCTOS */}
          <section className="flex-1">
            <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black">Resultados</h1>
                <p className="text-gray-500">
                  {query ? `Buscando "${query}"` : "Catálogo completo"} — {products.length} productos
                </p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">inventory_2</span>
                <p className="text-xl font-bold text-gray-400">No hay coincidencias</p>
                <Link href="/search" className="text-primary font-bold mt-4 inline-block">Limpiar filtros</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    productId={product.id} 
                    userId={userId}       
                    slug={product.slug}
                    image={product.images[0]?.url || ""}
                    title={product.name}
                    price={product.price.toString()}
                    category={product.category?.name || "General"}
                    tag={product.stock < 5 ? "Últimas piezas" : undefined} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}