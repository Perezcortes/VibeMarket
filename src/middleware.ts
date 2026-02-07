import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Obtenemos el rol del token (asegúrate de que tu authOptions incluya el rol en el token)
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;

    // REGLA DE SEGURIDAD:
    // Si intenta entrar a /dashboard/admin Y NO es admin...
    if (path.startsWith("/dashboard/admin") && role !== "admin") {
      // Lo mandamos al dashboard normal o al home
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      // Esto asegura que el usuario esté logueado antes de ejecutar la lógica de arriba
      authorized: ({ token }) => !!token,
    },
  }
);

// Aquí definimos qué rutas protege el middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};