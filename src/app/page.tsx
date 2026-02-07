import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Importamos los componentes modulares
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import TrendingSection from "@/components/home/TrendingSection"; // Este ya trae datos reales de la DB
import Footer from "@/components/layout/Footer";

export default async function HomePage() {
  // 1. Obtener sesión del usuario (Backend)
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-text-main">
      
      {/* 2. Navbar (Le pasamos el usuario para el avatar) */}
      <Navbar user={user} />

      {/* 3. Hero (Banner principal estático) */}
      <HeroSection />

      {/* 4. Categorías (Estático) */}
      <CategorySection />

      {/* 5. Tendencias (DINÁMICO: Se conecta a la DB internamente) */}
      <TrendingSection />

      {/* 6. Footer (Estático) */}
      <Footer />
      
    </div>
  );
}