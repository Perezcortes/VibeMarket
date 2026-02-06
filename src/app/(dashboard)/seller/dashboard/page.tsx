import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata = {
  title: 'Resumen General | VibeMarket',
  description: 'Panel de control del vendedor',
};

/**
 * Página: Dashboard Principal (Resumen General)
 * Ruta: /seller/dashboard
 * 
 * Vista principal con estadísticas y resumen de ventas
 */
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel De Control
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bienvenido de nuevo, aquí tienes tu resumen diario.
          </p>
        </div>

        <Link href="/seller/products/create">
          <Button
            variant="primary"
            size="lg"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Publicar Producto
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="VENTAS HOY"
          value="$450.00"
          change="+12%"
          changeType="positive"
          color="from-pink-500 to-pink-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="VISITAS TIENDA"
          value="1,203"
          change="+5%"
          changeType="positive"
          color="from-purple-500 to-purple-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />

        <StatCard
          title="PEDIDOS"
          value="12"
          badge="3 pendientes"
          color="from-blue-500 to-blue-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />

        <StatCard
          title="CONVERSIÓN"
          value="3.2%"
          change="+0.4%"
          changeType="positive"
          color="from-green-500 to-green-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rendimiento de Ventas (Sprint 1)
            </h3>
            <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
              <option>Último mes</option>
            </select>
          </div>

          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-4">
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day, index) => {
              const heights = [40, 60, 45, 70, 55, 30, 50];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-[#EE2B34] to-pink-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${heights[index]}%` }} />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Categorías Top
          </h3>

          <div className="space-y-6">
            <CategoryBar
              name="Tecnología"
              percentage={45}
              color="bg-purple-500"
            />
            <CategoryBar
              name="Moda"
              percentage={30}
              color="bg-pink-500"
            />
            <CategoryBar
              name="Hogar"
              percentage={15}
              color="bg-yellow-500"
            />
          </div>

          {/* Tip */}
          <div className="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-pink-900 dark:text-pink-300">
                  Tip de Vendedor
                </p>
                <p className="text-xs text-pink-700 dark:text-pink-400 mt-1">
                  Las ventas de "Tecnología" subieron 12% esta semana. Crea un cupón Flash.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Gestionar Productos"
          description="Ver y editar tu catálogo completo"
          href="/seller/products"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="text-purple-600 dark:text-purple-400"
        />

        <QuickActionCard
          title="Ver Órdenes"
          description="Revisa pedidos pendientes y completados"
          href="/seller/orders"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="text-blue-600 dark:text-blue-400"
        />

        <QuickActionCard
          title="Estadísticas"
          description="Análisis detallado de tu negocio"
          href="/seller/analytics"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="text-green-600 dark:text-green-400"
        />
      </div>
    </div>
  );
}

// Componente de tarjeta de estadística
function StatCard({
  title,
  value,
  change,
  changeType,
  badge,
  color,
  icon,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  badge?: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg`}>
      {/* Icon */}
      <div className="absolute top-4 right-4 opacity-20">
        {icon}
      </div>

      {/* Content */}
      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90 mb-2">
          {title}
        </p>
        <p className="text-4xl font-bold mb-2">{value}</p>

        {/* Change indicator or badge */}
        {change && (
          <div className="flex items-center gap-1 text-sm">
            <svg
              className={`w-4 h-4 ${changeType === 'positive' ? 'rotate-0' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{change}</span>
          </div>
        )}

        {badge && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de barra de categoría
function CategoryBar({
  name,
  percentage,
  color,
}: {
  name: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${color}`} />
          {name}
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Componente de acción rápida
function QuickActionCard({
  title,
  description,
  href,
  icon,
  color,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-[#EE2B34] group">
        <div className={`${color} mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="mt-4 flex items-center text-[#EE2B34] font-medium text-sm group-hover:gap-2 transition-all">
          <span>Ver más</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}