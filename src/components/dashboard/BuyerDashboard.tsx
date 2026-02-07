export default function BuyerDashboard({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-primary">Hola, {user.name}</h1>
      <p className="text-gray-500">Aquí verás tus compras recientes y favoritos.</p>
      {/* Aquí irá el diseño de la tienda para compradores */}
    </div>
  )
}