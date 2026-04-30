"use client";
import { useState, useEffect, useRef } from "react";

type ChatMessage = {
  role: 'bot' | 'user';
  text: string;
  time: string;
};

// 1. Sugerencias actualizadas con colores y catálogo de productos
const SUGGESTIONS = [
  { label: "🛍️ Ver Catálogo", query: "que productos venden" },
  { label: "🚚 ¿Costo de envío?", query: "cuanto cuesta el envio" },
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
      text: '¡Hola! Soy tu asistente de Vibe Market. ¿Te gustaría conocer nuestros productos o tienes alguna duda con tu compra?', 
      time: 'Ahora' 
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
      {/* Botón Flotante en Rojo Vibe */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="size-14 bg-red-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'smart_toy'}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-85 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-fade-in-up">
          {/* Header en Rojo */}
          <div className="bg-red-600 p-4 text-white flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <span className="material-symbols-outlined">robot_2</span>
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">Asistente Vibe</p>
              <p className="text-[10px] opacity-90 flex items-center gap-1">
                <span className="size-1.5 bg-green-400 rounded-full animate-pulse"></span> Respuesta inmediata
              </p>
            </div>
          </div>

          {/* Chat Body */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <ChatbotMessage key={i} role={m.role} text={m.text} time={m.time} />
            ))}

            {/* Sugerencias con estilo Rojo suave */}
            {messages.length === 1 && !isTyping && (
              <div className="grid grid-cols-1 gap-2 mt-2">
                <p className="text-[10px] text-gray-400 font-semibold px-1 uppercase tracking-wider">Sugerencias</p>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.query)}
                    className="text-left bg-white border border-red-50 text-red-600 px-3 py-2.5 rounded-xl text-[11px] hover:bg-red-50 transition-all shadow-sm font-medium border-l-4 border-l-red-500"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-500 px-4 py-1.5 rounded-full text-[10px] italic animate-pulse">Escribiendo respuesta...</div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs text-gray-900 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
            <button 
              onClick={() => handleSend()} 
              className="bg-red-600 text-white size-10 rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors shadow-md shadow-red-200"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatbotMessage({ role, text, time }: { role: 'bot' | 'user'; text: string; time: string }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`max-w-[85%] p-3.5 rounded-2xl text-[12px] shadow-sm leading-relaxed ${
        isBot 
          ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
          : 'bg-red-600 text-white rounded-tr-none'
      }`}>
        {isBot && (
          <p className="font-black text-[9px] mb-1 text-red-600 uppercase tracking-widest flex items-center gap-1">
            <span className="size-1 bg-red-600 rounded-full"></span> Vibe Market
          </p>
        )}
        <p>{text}</p>
        <p className={`text-[8px] mt-2 text-right font-medium ${isBot ? 'text-gray-400' : 'text-red-200'}`}>{time}</p>
      </div>
    </div>
  );
}