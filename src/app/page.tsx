import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Intentamos obtener usuarios (estará vacío, pero probará la conexión)
  const users = await prisma.user.findMany();
  
  // Intentamos obtener categorías
  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <h1 className="text-4xl font-bold text-green-600 flex items-center gap-2">
        <span className="material-symbols-outlined text-4xl">Yes</span>
        ¡Conexión Exitosa!
      </h1>
      
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <p className="text-lg text-gray-700">Estado de la Base de Datos:</p>
        <ul className="list-disc pl-5 mt-2 text-gray-600">
          <li><strong>Usuarios registrados:</strong> {users.length}</li>
          <li><strong>Categorías creadas:</strong> {categories.length}</li>
        </ul>
      </div>

      <p className="text-sm text-gray-400">Si ves esto, Prisma y MySQL funcionan al 100%.</p>
    </div>
  );
}