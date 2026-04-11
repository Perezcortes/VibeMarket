import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { FC } from "react";
import CourierDashboard from "@/components/dashboard/CourierDashboard";

// Simulamos la función fetch nativa del navegador para interceptar la llamada a la API
global.fetch = jest.fn();

describe("CourierDashboard - UI de Liquidación", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe enviar el ID de la orden correcta al presionar 'Confirmar Entrega'", async () => {
    // 1. Preparamos el fetch para que responda con éxito simulado (Status 200)
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "Pedido entregado" }),
    });

    // 2. Renderizamos tu componente
    render(<CourierDashboard user={undefined}  />); 

    // 3. Buscamos el botón por su texto
    const botonLiquidar = screen.getByText("Confirmar Entrega");
    
    // Comprobamos que el botón existe en la pantalla
    expect(botonLiquidar).toBeInTheDocument();

    // 4. ¡Hacemos clic!
    fireEvent.click(botonLiquidar);

    // 5. Esperamos a que la petición fetch se dispare y la validamos
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Verificamos que llamó al endpoint PATCH correcto y le mandó el ID
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/courier/shiftLiquidar"), // Tu ruta
        expect.objectContaining({
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          // Asegúrate de que el ID coincida con el que tiene tu componente (ej. "5" o "ORD-999")
          body: expect.stringContaining('"orderId"'), 
        })
      );
    });
  });

  // --- PRUEBA DE GESTIÓN DE RUTAS (US016-D) ---
  it("USU016.D Debe permitir cambiar el orden de visita de una entrega en cola", async () => {
    render(<CourierDashboard user={{ name: "Ariadna" }} />);

    // 1. Buscamos el selector de visita de la primera entrega en cola
    // Nota: Como hay varios, podemos buscar el que tenga el valor inicial (ej. 2)
    const selectores = screen.getAllByRole("combobox"); 
    const selectorVisita = selectores[0]; // El primer selector de la lista "En cola"

    expect(selectorVisita).toBeInTheDocument();

    // 2. Simulamos que el repartidor cambia la prioridad a "Visita 10"
    fireEvent.change(selectorVisita, { target: { value: "10" } });

    // 3. Verificamos que el valor del select haya cambiado
    expect(selectorVisita).toHaveValue("10");
  });

  it("Debe mostrar el indicador de proximidad correctamente", () => {
    render(<CourierDashboard user={{ name: "Ariadna" }} />);

    // Usamos una función personalizada para encontrar el texto 
    // Esto es mucho más potente que getByText normal
    expect(screen.getByText((content, element) => {
      return element?.textContent !== null && content.includes("Muy Cerca");
    })).toBeInTheDocument();

    expect(screen.getAllByText((content) => content.includes("Cerca")).length).toBeGreaterThan(0);
    
    expect(screen.getByText((content) => content.includes("Lejos"))).toBeInTheDocument();
  });


  // --- PRUEBAS DE ACTUALIZACIÓN DE ESTATUS (US016-E) ---

  it("☑️ Debe permitir cambiar el estado del pedido a 'pendiente'", async () => {
    render(<CourierDashboard user={{ name: "Ariadna" }} />);

    // Buscamos todos los selectores de estado. 
    // En tu estructura, son los que tienen los valores de estatus.
    const selectoresEstado = screen.getAllByRole("combobox").filter(sel => 
      ["pendiente", "pagado", "enviado"].includes((sel as HTMLSelectElement).value)
    );

    // Actuamos sobre el primero
    fireEvent.change(selectoresEstado[0], { target: { value: "pendiente" } });
    expect(selectoresEstado[0]).toHaveValue("pendiente");
  });

  it("☑️ Debe permitir cambiar el estado del pedido a 'pagado'", async () => {
    render(<CourierDashboard user={{ name: "Ariadna" }} />);

    const selectoresEstado = screen.getAllByRole("combobox").filter(sel => 
      ["pendiente", "pagado", "enviado"].includes((sel as HTMLSelectElement).value)
    );

    fireEvent.change(selectoresEstado[1], { target: { value: "pagado" } });
    expect(selectoresEstado[1]).toHaveValue("pagado");
  });

  it("☑️ Debe permitir cambiar el estado del pedido a 'enviado'", async () => {
    render(<CourierDashboard user={{ name: "Ariadna" }} />);

    const selectoresEstado = screen.getAllByRole("combobox").filter(sel => 
      ["pendiente", "pagado", "enviado"].includes((sel as HTMLSelectElement).value)
    );

    fireEvent.change(selectoresEstado[2], { target: { value: "enviado" } });
    expect(selectoresEstado[2]).toHaveValue("enviado");
  });
});
