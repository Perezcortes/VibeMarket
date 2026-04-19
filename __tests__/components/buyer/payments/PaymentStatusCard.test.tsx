import { render, screen, waitFor } from "@testing-library/react";
import PaymentStatusCard from "@/components/dashboard/buyer/PaymentStatusCard";
// Importamos esto para tener acceso a validaciones como "toBeInTheDocument"
import "@testing-library/jest-dom"; 

//ejecutamos con jest --testPathPattern=PaymentStatusCard.test.ts para correr solo este test
// Hacemos un "mock" global de la función fetch del navegador
global.fetch = jest.fn();

describe("Componente: PaymentStatusCard (Historia: US012-D / US012-E)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe mostrar el botón rojo de reintento cuando el pago es RECHAZADO", async () => {
    // 1. Simulamos que la API nos responde que el pago fue rechazado
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "RECHAZADO",
        message: "Tu pago ha sido rechazado.",
        action: "RETRY_PAYMENT",
        redirectUrl: "/checkout/payment-methods",
        savedProgress: true,
      }),
    });

    // 2. Renderizamos la tarjeta pasándole un ID de orden falso
    render(<PaymentStatusCard orderId="ORD-12345" />);

    // 3. Esperamos a que quite el "cargando..." y dibuje la tarjeta
    await waitFor(() => {
      expect(screen.getByText("Pago Rechazado")).toBeInTheDocument();
    });

    // 4. ✨ VERIFICAMOS EL BOTÓN ROJO ✨
    // Buscamos un enlace (link) que diga "Volver a hacer el pago"
    const botonReintento = screen.getByRole("link", { name: /volver a hacer el pago/i });
    
    expect(botonReintento).toBeInTheDocument(); // Comprobamos que sí se pintó
    expect(botonReintento).toHaveAttribute("href", "/checkout/payment-methods"); // Comprobamos que lleve a la ruta correcta
    
    // Verificamos el mensajito de progreso guardado
    expect(screen.getByText(/Tu carrito y progreso están guardados a salvo/i)).toBeInTheDocument();
  });

  it("NO debe mostrar el botón rojo cuando el pago es APROBADO", async () => {
    // 1. Simulamos que la API nos responde que el pago fue exitoso
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "APROBADO",
        message: "¡Tu pago ha sido aprobado! Gracias por tu compra.",
      }),
    });

    // 2. Renderizamos la tarjeta
    render(<PaymentStatusCard orderId="ORD-99999" />);

    // 3. Esperamos a que cargue el estado exitoso
    await waitFor(() => {
      expect(screen.getByText("¡Pago Exitoso!")).toBeInTheDocument();
    });

    // 4. ✨ VERIFICAMOS QUE EL BOTÓN ROJO NO EXISTA ✨
    // Usamos queryByRole (en lugar de getByRole) porque queryBy devuelve null si no lo encuentra, en vez de tronar
    const botonReintento = screen.queryByRole("link", { name: /volver a hacer el pago/i });
    
    expect(botonReintento).not.toBeInTheDocument(); // Comprobamos que NO se pintó el botón
  });
});