interface MessageProps {
  role: 'bot' | 'user';
  text: string;
  time: string;
}

export default function ChatbotMessage({ role, text, time }: MessageProps) {
  const isBot = role === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-sm ${
        isBot 
        ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
        : 'bg-blue-600 text-white rounded-tr-none'
      }`}>
        {isBot && (
          <p className="font-bold text-[10px] mb-1 text-blue-600 uppercase tracking-tighter">
            Asistente Vibe
          </p>
        )}
        <p className="leading-relaxed">{text}</p>
        <p className={`text-[9px] mt-1 text-right ${isBot ? 'text-gray-400' : 'text-blue-200'}`}>
          {time}
        </p>
      </div>
    </div>
  );
}