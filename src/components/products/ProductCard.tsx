// components/ProductCard.tsx
export default function ProductCard({ image, title, price, category, tag, discount }: any) {
    const isImagePath = image && (image.startsWith("http") || image.startsWith("/"));

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-gray-100 relative cursor-pointer flex flex-col">
            
            {/* Contenedor Multimedia Ajustable */}
            <div className="w-full bg-slate-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden min-h-[200px]">
                {isImagePath ? (
                    <img 
                        src={image} 
                        alt={title} 
                        /* CONSEJO: 'object-contain' mantiene la proporción original 
                           sin recortar la imagen, adaptándose al contenedor.
                        */
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <span className="material-symbols-outlined text-6xl text-gray-300">
                        {image || "shopping_bag"}
                    </span>
                )}
            </div>

            {/* El resto de la información se mantiene igual */}
            <div className="mt-auto">
                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">{category}</p>
                <h3 className="font-bold text-gray-800 mb-2 truncate text-base">{title}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-primary">${price.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}