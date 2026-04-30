interface MessageProps {
  role: 'bot' | 'user';
  text: string;
  time: string;
}

export default function ChatbotMessage({ role, text, time }: MessageProps) {
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
            <span className="size-1 bg-red-600 rounded-full"></span> 
            Vibe Market
          </p>
        )}
        
        {/* whitespace-pre-line permite que los \n del catálogo se vean como saltos de línea reales */}
        <p className="whitespace-pre-line">{text}</p>
        
        <p className={`text-[8px] mt-2 text-right font-medium ${
          isBot ? 'text-gray-400' : 'text-red-200'
        }`}>
          {time}
        </p>
      </div>
    </div>
  );
}