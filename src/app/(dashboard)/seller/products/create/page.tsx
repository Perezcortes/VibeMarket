import Link from 'next/link';
import { ProductForm } from '@/components/products/Productform';
import { prisma } from '@/lib/prisma'; // Asegúrate de importar tu instancia de prisma

export const metadata = {
  title: 'Crear Producto | VibeMarket',
  description: 'Crea un nuevo producto para tu catálogo',
};

/**
 * Página: Crear Nuevo Producto
 * Ruta: /seller/products/create
 */
export default async function CreateProductPage() {
  // 1. OBTENER CATEGORÍAS (Nuevo)
  // Consultamos la BD para llenar el select del formulario
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/seller/products"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Crear Producto
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Completa los detalles de tu nuevo producto
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        {/* 2. PASAR LAS CATEGORÍAS AL FORMULARIO (Nuevo) */}
        <ProductForm mode="create" categories={categories} />
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex gap-4">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
              Tips para crear productos exitosos
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
              <li>• Usa nombres descriptivos y específicos</li>
              <li>• Escribe descripciones detalladas</li>
              <li>• Establece precios competitivos</li>
              <li>• Mantén el stock actualizado</li>
              <li>• Asigna la categoría correcta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}