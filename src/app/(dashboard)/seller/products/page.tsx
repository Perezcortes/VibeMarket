'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductTable } from '@/components/products/Producttable';

// --- ACTUALIZACIÓN AQUÍ ---
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string; // O 'number', depende de cómo lo devuelva tu API (Prisma Decimal suele ser string)
  stock: number;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
  };
  // Agregamos esto para poder mostrar la foto en la tabla
  images: {
    id: string;
    url: string;
  }[];
}
// --------------------------

/**
 * Página: Listado de Productos del Vendedor
 * Ruta: /seller/products
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Esto llama a tu API, que ahora devuelve { include: { images: true } }
      const response = await fetch('/api/seller/products?includeInactive=true');

      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }

      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (id: string) => {
    // Confirmación visual básica antes de borrar
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/seller/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar el producto');
      }
      
      // Recargar la lista tras eliminar
      loadProducts();
      
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Productos
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestiona tu catálogo de productos
          </p>
        </div>

        <Link href="/seller/products/create">
          <Button
            variant="primary"
            size="lg"
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Crear Producto
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total de productos"
          value={products.length}
          icon="📦"
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Productos activos"
          value={products.filter((p) => p.is_active).length}
          icon="✅"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Productos inactivos"
          value={products.filter((p) => !p.is_active).length}
          icon="⏸️"
          color="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
        />
        <StatCard
          title="Stock bajo"
          value={products.filter((p) => p.stock > 0 && p.stock <= 5).length}
          icon="⚠️"
          color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-[#EE2B34] mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-bold text-lg text-red-800 dark:text-red-300 mb-2">
            Error al cargar productos
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button variant="primary" onClick={loadProducts}>
            Reintentar
          </Button>
        </div>
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDelete}
          onRefresh={loadProducts}
        />
      )}
    </div>
  );
}

// Componente de tarjeta de estadística (Sin cambios)
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}