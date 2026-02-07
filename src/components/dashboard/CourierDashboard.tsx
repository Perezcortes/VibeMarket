export default function CourierDashboard({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center justify-center">
      <span className="material-symbols-outlined text-6xl text-primary mb-4">local_shipping</span>
      <h1 className="text-2xl font-bold">Panel de Repartidor</h1>
      <p>Ruta Norte #4 asignada a: {user.name}</p>
    </div>
  )
}