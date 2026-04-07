// src/app/dashboard/seller/history/page.tsx

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import { BuyHistorialPresenter } from "@/lib/presentation/seller/catalog/BuyHistorial.presenter";
import { PurchaseHistoryService } from "@/services/seller/catalog/BuysHistorial.service";
import { PurchaseHistoryRepository } from "@/repositories/seller/catalog/BuysHistorial.repository";

export default async function HistoryPage() {
  // 1. Instanciamos el servicio y el presenter (Capa de Aplicación -> Capa de Presentación)
  const service = new PurchaseHistoryService(PurchaseHistoryRepository);
  const presenter = new BuyHistorialPresenter(service);

  // 2. Definimos un usuario de prueba (esto soluciona el error "No se encuentra el nombre 'user'")
  // En un futuro, esto vendrá de tu sistema de autenticación (NextAuth)
  const user = {
    name: "Yamil",
    role: "Vendedor"
  };

  // 3. Obtenemos el ViewModel formateado desde el Presenter (HU008)
  // Usamos un ID de usuario ficticio para la consulta
  const viewModel = await presenter.getViewModel("user-123");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 4. "Jalamos" el Navbar pasándole el objeto user */}
      <Navbar user={user} />

      <main className="flex-grow bg-slate-50 dark:bg-[#0f0a0a]">
        {/* 5. Renderizamos el Dashboard pasando TODAS las props que pide:
               - user: para el perfil y saludo.
               - orders: la lista formateada para la tabla.
               - stats: los totales para las tarjetas de resumen.
        */}
        <SellerDashboard 
          user={user} 
          orders={viewModel.orders} 
          stats={viewModel.stats} 
        />
      </main>

      {/* 6. "Jalamos" el Footer global */}
      <Footer />
    </div>
  );
}