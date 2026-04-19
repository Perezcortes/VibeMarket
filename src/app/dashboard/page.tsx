import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Aqui importamos los dashboards
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import CourierDashboard from "@/components/dashboard/CourierDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SupportDashboard from "@/components/dashboard/SupportDashboard";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";

export default async function DashboardPage(props: any) { 
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user;
  // @ts-ignore
  const role = user.role; 

  // --- REGLA 1: EL COMPRADOR NO ENTRA AL DASHBOARD ---
  //if (role === 'comprador') {
      // Lo mandamos a la página principal (tienda)
    //  redirect("/"); 
  //}

    if (role === 'comprador') {
      // Si la URL tiene la contraseña "?seccion=compras", lo dejamos entrar a su vista
      if (searchParams?.seccion === 'compras') {
          const ultimaOrden = await prisma.payment.findFirst({
            where: { order: { buyer_id: user.id } },
            orderBy: { id: 'desc' },
            select: { order_id: true }
          });
          return <BuyerDashboard user={user} lastOrderId={ultimaOrden?.order_id || null} />;
      } 
      
      // Si no trae la contraseña (entró normal al /dashboard), lo mandamos a la tienda
      redirect("/"); 
  }
  // --- REGLA 2: DISTRIBUCIÓN POR ROLES ---
  switch (role) {
    case "admin":
      // El admin ve TODO (AdminDashboard)
      return <AdminDashboard user={user} />;

    case "vendedor":
      // El vendedor solo ve su negocio
      return <SellerDashboard user={user} orders={[]} stats={undefined} />;
    
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