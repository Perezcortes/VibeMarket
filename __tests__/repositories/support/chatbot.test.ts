import { buscarEnFaq } from "@/repositories/support/chatbot";

describe("US015-A: Prueba Unitaria - Chatbot FAQ", () => {
  it("Debe devolver un arreglo de resultados al buscar un término común", async () => {
    // Probamos con la palabra "pago" que ya pusimos en el seed
    const resultados = await buscarEnFaq("pago");
    
    expect(Array.isArray(resultados)).toBe(true);
    if (resultados.length > 0) {
      expect(resultados[0]).toHaveProperty("answer");
    }
  });
});