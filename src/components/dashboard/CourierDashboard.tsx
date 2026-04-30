"use client";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

export default function CourierDashboard({ user }: { user: any }) {

    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // 👈 Referencia para limpiar el input en las pruebas
    const [view, setView] = useState("route");
    const [isOnline, setIsOnline] = useState(true);

    // ✨ Cambiamos esto para que inicie vacío y se llene con la BD
    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLiquidating, setIsLiquidating] = useState(false);

    // ✨ 1. CARGAMOS LOS PEDIDOS DESDE LA API AL INICIAR
    useEffect(() => {
        if (user?.id) {
            fetch(`/api/courier/shiftLiquidar?courierId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && Array.isArray(data.data)) {
                        // Adaptamos los datos de la BD a tu diseño
                        const pedidosCargados = data.data.map((order: any, index: number) => ({
                            id: order.id,
                            address: order.address?.street || "Dirección no registrada",
                            time: "Calculando...",
                            distance: "0.0 km",
                            visitOrder: index + 1,
                            currentStatus: order.status
                        }));
                        setRoutes(pedidosCargados);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [user]);

    // --- Lógica de la Cámara ---
    const startCamera = async (orderId: string) => {
        setCurrentOrderId(orderId);
        setShowCamera(true);
        setCapturedImage(null);

        // 🐛 Fix para Playwright: Limpiamos el input file al retomar foto
        if (fileInputRef.current) fileInputRef.current.value = '';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert("No se pudo acceder a la cámara");
            setShowCamera(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvasRef.current.toDataURL("image/jpeg");
            setCapturedImage(dataUrl);

            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleUploadEvidency = async () => {
        if (!capturedImage || !currentOrderId) return;

        try {
            const response = await fetch(capturedImage);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append("orderId", currentOrderId);
            formData.append("image", blob, "evidencia.jpg");

            const res = await fetch("/api/courier/evidency", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("✅ Foto subida y evidencia guardada.");
                setShowCamera(false);
                setCapturedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = ''; // Limpiamos input
            } else {
                alert("Error al subir la foto.");
            }
        } catch (error) {
            alert("Error de red.");
        }
    };

    const handleOrderChange = (id: string, newOrder: number) => {
        const updated = routes.map(r => r.id === id ? { ...r, visitOrder: newOrder } : r)
            .sort((a, b) => a.visitOrder - b.visitOrder);
        setRoutes(updated);
    };

    const handleUpdateStatus = (orderId: string, newStatus: string) => {
        const updated = routes.map(r => r.id === orderId ? { ...r, currentStatus: newStatus } : r);
        setRoutes(updated);
    };

    // ✨ 2. LA FUNCIÓN MÁGICA DE LIQUIDACIÓN
    const handleConfirmarEntrega = async (orderId: string) => {
        setIsLiquidating(true);
        try {
            const res = await fetch("/api/courier/shiftLiquidar", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(`¡Éxito! ${data.message}`);

                // ✨ MAGIA: Borramos el pedido entregado de la lista para que el siguiente tome su lugar
                setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== orderId));

                // Iniciamos cámara para la evidencia
                startCamera(orderId);
            } else {
                alert(`Error al liquidar: ${data.error}`);
            }
        } catch (error) {
            alert("Error de conexión al intentar liquidar el pedido.");
        } finally {
            setIsLiquidating(false);
        }
    };

    // ✨ 3. LÓGICA DE DIVISIÓN DE PEDIDOS
    const nextOrder = routes.length > 0 ? routes[0] : null;
    const queuedOrders = routes.length > 1 ? routes.slice(1) : [];
    // ✨ 4. VALIDACIÓN PARA IR A DESCANSO
    const handleToggleStatus = () => {
        // Si está "En Turno" (isOnline = true) y quiere pasar a Descanso
        if (isOnline) {
            // Revisamos si la lista de rutas tiene algún pedido
            if (routes.length > 0) {
                alert("¡No puedes irte a descansar todavía! Tienes entregas pendientes en tu ruta. 📦🚫");
                return; // Cortamos la ejecución aquí, NO cambiamos el estado
            }
        }
        // Si la ruta está vacía, o si estaba en descanso y quiere volver "En turno", lo dejamos
        setIsOnline(!isOnline);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-screen sticky top-0">
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <h1 className="text-2xl font-black text-amber-500 tracking-tight flex gap-2 items-center">
                        Vibe<span className="text-gray-800">Express</span>
                    </h1>
                </div>
                <nav className="p-4 space-y-2 flex-1">

                    <SidebarItem icon="history" label="Historial" active={view === 'history'} onClick={() => setView('history')} />

                </nav>
                <div className="p-4 border-t border-gray-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-sm">
                            {user?.name?.charAt(0) || "R"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">Repartidor Pro</p>
                        </div>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl transition-all text-sm font-bold shadow-sm hover:shadow-md">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Terminar Turno
                    </button>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-800">
                            {view === 'route' && 'Tu Ruta de Hoy'}
                            {view === 'history' && 'Historial de Entregas'}
                            {view === 'wallet' && 'Billetera'}
                        </h2>
                        <p className="text-gray-500">
                            {isOnline ? '🟢 Estás conectado y visible.' : '🔴 Estás desconectado.'}
                        </p>
                    </div>
                    <button onClick={handleToggleStatus} className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold shadow-lg transition-all active:scale-95 ${isOnline ? 'bg-amber-400 text-black hover:bg-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                        <span className="material-symbols-outlined">{isOnline ? 'local_shipping' : 'garage'}</span>
                        {isOnline ? 'En Turno' : 'Descansando'}
                    </button>
                </header>

                {/* VISTA: RUTA ACTIVA */}
                {view === 'route' && (
                    <div className="max-w-4xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatCard label="Entregados" value="-" icon="check_circle" color="text-green-600" bg="bg-green-50" />
                            <StatCard label="Pendientes" value={routes.length.toString()} icon="schedule" color="text-amber-600" bg="bg-amber-50" />
                            <StatCard label="Km Recorridos" value="-" icon="speed" color="text-blue-600" bg="bg-blue-50" />
                            <StatCard label="Ganancia Hoy" value="-" icon="attach_money" color="text-purple-600" bg="bg-purple-50" />
                        </div>

                        {loading ? (
                            <p className="text-center text-gray-400 font-bold py-10">Cargando tu ruta... 🚚</p>
                        ) : !nextOrder ? (
                            <div className="text-center bg-white p-10 rounded-3xl border border-dashed border-gray-300">
                                <span className="material-symbols-outlined text-6xl text-amber-300 mb-4">check_circle</span>
                                <h3 className="text-xl font-bold text-gray-600">¡Ruta finalizada!</h3>
                                <p className="text-gray-400">Has entregado todos los paquetes asignados.</p>
                            </div>
                        ) : (
                            <>
                                {/* TARJETA PRINCIPAL: PRÓXIMA PARADA (Usando nextOrder) */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-400 uppercase text-xs mb-3 ml-1">Siguiente Entrega (Prioridad Alta)</h3>
                                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-l-8 border-amber-400 relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                                            Paquete #{nextOrder.id.substring(0, 8)}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-2xl md:text-3xl font-black text-gray-800">{nextOrder.address}</h2>
                                                    <p className="text-gray-500 font-medium">Destino Asignado</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-gray-400">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">Cliente VibeMarket</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 min-w-[200px]">

                                                <button
                                                    onClick={() => handleConfirmarEntrega(nextOrder.id)} // 👈 AQUÍ USAMOS EL ID REAL
                                                    disabled={isLiquidating}
                                                    className={`flex-1 text-black py-4 rounded-xl font-bold shadow-lg transition-transform flex items-center justify-center gap-2 
                                                    ${isLiquidating ? 'bg-amber-200 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-500 active:scale-95'}`}
                                                >
                                                    <span className="material-symbols-outlined">
                                                        {isLiquidating ? 'hourglass_empty' : 'signature'}
                                                    </span>
                                                    {isLiquidating ? 'Liquidando...' : 'Confirmar Entrega'}
                                                </button>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-[180px] text-gray-50 z-0">local_shipping</span>
                                    </div>
                                </div>

                                {/* LISTA DE SIGUIENTES PARADAS (Usando queuedOrders) */}
                                {queuedOrders.length > 0 && (
                                    <>
                                        <h3 className="font-bold text-gray-400 uppercase text-xs mb-3 ml-1">En cola ({queuedOrders.length})</h3>
                                        <div className="space-y-3">
                                            {queuedOrders.map((route) => (
                                                <DeliveryRow
                                                    key={route.id}
                                                    orderId={route.id}
                                                    address={route.address}
                                                    time={route.time}
                                                    distance={route.distance}
                                                    currentOrder={route.visitOrder}
                                                    currentStatus={route.currentStatus}
                                                    onOrderChange={(val: string) => handleOrderChange(route.id, parseInt(val))}
                                                    onStatusChange={handleUpdateStatus}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* --- MODAL CÁMARA / EVIDENCIA --- */}
            {showCamera && (
                <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
                    <h2 className="text-white font-bold mb-4 text-lg">Documentar Entrega - ID: {currentOrderId?.substring(0, 8)}</h2>

                    {/* 🐛 Playwright Fix: ref={fileInputRef} agreado */}
                    <input
                        type="file"
                        id="gallery-upload"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <div className="relative w-full max-w-md aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400">
                        {!capturedImage ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={capturedImage} className="w-full h-full object-cover" />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="mt-8 flex gap-4 w-full max-w-md">
                        {!capturedImage ? (
                            <button onClick={takePhoto} className="w-full bg-amber-400 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">photo_camera</span>
                                Capturar Foto
                            </button>
                        ) : (
                            <>
                                <button onClick={() => startCamera(currentOrderId!)} className="flex-1 bg-gray-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">cached</span>
                                    Retomar
                                </button>
                                <button onClick={handleUploadEvidency} className="flex-1 bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">cloud_upload</span>
                                    Subir
                                </button>
                            </>
                        )}
                    </div>

                    <label
                        htmlFor="gallery-upload"
                        className="mt-6 text-center text-gray-400 text-sm underline cursor-pointer hover:text-amber-400 transition-colors"
                        onClick={() => {
                            if (videoRef.current && videoRef.current.srcObject) {
                                const stream = videoRef.current.srcObject as MediaStream;
                                stream.getTracks().forEach(track => track.stop());
                            }
                        }}
                    >
                        Seleccionar de la Galería
                    </label>
                </div>
            )}
        </div>
    )
}

// --- SUBCOMPONENTES ---
function SidebarItem({ icon, label, active, onClick, badge }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? "bg-amber-50 text-amber-600 font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="text-sm">{label}</span>
            {badge && <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        </button>
    )
}

function StatCard({ label, value, icon, color, bg }: any) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start gap-2">
            <div className={`size-10 rounded-lg ${bg} ${color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-black text-gray-800">{value}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{label}</p>
            </div>
        </div>
    )
}

function DeliveryRow({ address, time, distance, onOrderChange, currentOrder, currentStatus, onStatusChange, orderId }: any) {
    const distNum = parseFloat(distance);
    let proximity = { text: "Lejos", color: "text-gray-400" };
    if (distNum < 2) proximity = { text: "Muy Cerca", color: "text-green-600" };
    else if (distNum < 5) proximity = { text: "Cerca", color: "text-blue-600" };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Visita</span>
                    <select value={currentOrder} onChange={(e) => onOrderChange(e.target.value)} className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-lg focus:ring-amber-500 block p-1">
                        {[...Array(50)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                    </select>
                </div>
                <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>
                <div>
                    <p className="font-bold text-gray-800 text-sm">{address}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <select value={currentStatus} onChange={(e) => onStatusChange(orderId, e.target.value)} className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border-none focus:ring-0 cursor-pointer ${currentStatus === 'enviado' ? 'bg-blue-100 text-blue-700' : currentStatus === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Envíado</option>
                        </select>
                        <span className="text-[10px] text-gray-400">• {distance}</span>
                    </div>
                </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 bg-gray-100 p-2 rounded-lg hover:bg-amber-100 hover:text-amber-600 transition-all">
                <span className="material-symbols-outlined text-sm">near_me</span>
            </button>
        </div>
    );
}