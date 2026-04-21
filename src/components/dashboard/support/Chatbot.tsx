"use client";
import { useState, useEffect, useRef } from "react";

type ChatMessage = {
  role: 'bot' | 'user';
  text: string;
  time: string;
};

// 1. Definimos las preguntas frecuentes para los botones
const SUGGESTIONS = [
  { label: "🚚 ¿Costo de envío?", query: "cuanto cuesta el envio" },
  { label: "📦 ¿Dónde está mi pedido?", query: "rastrear mi pedido" },
  { label: "💳 Métodos de pago", query: "que metodos de pago aceptan" },
  { label: "🔄 Devoluciones", query: "como hacer una devolucion" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'bot', 
      text: '¡Hola! Soy tu asistente de soporte. ¿En qué puedo ayudarte? Aquí tienes algunas dudas comunes:', 
      time: 'Ahora' 
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Función para enviar mensajes (manual o por botón)
  const handleSend = async (textToSend?: string) => {
    const finalMsg = textToSend || input;
    if (!finalMsg.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { role: 'user', text: finalMsg, time };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/support/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMsg }),
      });
      const data = await res.json();
      
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply, time }]);
        setIsTyping(false);
      }, 600);
    } catch (error) {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="size-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-all"
      >
        <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'smart_toy'}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-fade-in-up">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
            <span className="material-symbols-outlined">robot_2</span>
            <div>
              <p className="text-sm font-bold">Soporte Virtual</p>
              <p className="text-[10px] opacity-80 flex items-center gap-1">
                <span className="size-1.5 bg-green-400 rounded-full animate-pulse"></span> En línea
              </p>
            </div>
          </div>

          {/* Chat Body */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <ChatbotMessage key={i} role={m.role} text={m.text} time={m.time} />
            ))}

            {/* MOSTRAR BOTONES DE SUGERENCIA SI SOLO HAY UN MENSAJE (EL DE BIENVENIDA) */}
            {messages.length === 1 && !isTyping && (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.query)}
                    className="text-left bg-white border border-blue-100 text-blue-600 px-3 py-2 rounded-xl text-[11px] hover:bg-blue-50 transition-colors shadow-sm font-medium"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-[10px] animate-pulse">Escribiendo...</div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda..."
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-900 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button onClick={() => handleSend()} className="bg-blue-600 text-white size-9 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponente de Mensaje
function ChatbotMessage({ role, text, time }: { role: 'bot' | 'user'; text: string; time: string }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-sm ${isBot ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-blue-600 text-white rounded-tr-none'}`}>
        {isBot && <p className="font-bold text-[10px] mb-1 text-blue-600 uppercase tracking-tighter">Asistente Vibe</p>}
        <p className="leading-relaxed">{text}</p>
        <p className={`text-[9px] mt-1 text-right ${isBot ? 'text-gray-400' : 'text-blue-200'}`}>{time}</p>
      </div>
    </div>
  );
}