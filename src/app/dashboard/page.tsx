import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

// Aqui importamos los dashboards
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import CourierDashboard from "@/components/dashboard/CourierDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SupportDashboard from "@/components/dashboard/SupportDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;
  // @ts-ignore
  const role = user.role; 

  // --- REGLA 1: EL COMPRADOR NO ENTRA AL DASHBOARD ---
  if (role === 'comprador') {
      // Lo mandamos a la página principal (tienda)
      redirect("/"); 
  }

  // --- REGLA 2: DISTRIBUCIÓN POR ROLES ---
  switch (role) {
    case "admin":
      // El admin ve TODO (AdminDashboard)
      return <AdminDashboard user={user} />;

    case "vendedor":
      // El vendedor solo ve su negocio
      return <SellerDashboard user={user} />;
    
    case "repartidor":
      // El repartidor solo ve sus rutas
      return <CourierDashboard user={user} />;
    
    case "soporte":
      // Soporte solo ve tickets
      return <SupportDashboard user={user} />;

    default:
      // Si el rol es desconocido o raro, lo sacamos por seguridad
      redirect("/");
  }
}