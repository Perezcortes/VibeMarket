import Link from "next/link";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Tickets", href: "/support/tickets", icon: "🎫" },
    { name: "Chatbot AI", href: "/support/chatbot", icon: "🤖" },
    { name: "Arbitraje", href: "/support/arbitration", icon: "⚖️" },
    { name: "Logs de Sistema", href: "/support/logs", icon: "📄" },
    { name: "Impersonación", href: "/support/impersonation", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar Lateral */}
      <aside className="w-64 border-r border-gray-800 bg-[#111] p-6 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-blue-500">VibeMarket</h2>
          <p className="text-xs text-gray-500 uppercase font-bold mt-1">Panel de Soporte</p>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-800 flex items-center px-8 bg-[#111]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="text-xs text-gray-500">
            Support Dashboard / <span className="text-gray-300">Overview</span>
          </div>
        </header>
        
        <section className="animate-in fade-in duration-500">
          {children}
        </section>
      </main>
    </div>
  );
}