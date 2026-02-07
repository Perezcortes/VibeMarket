export default function CategorySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-2 text-gray-800">
          <span className="material-symbols-outlined text-primary">category</span>
          Explora por Categorías
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {['Tecnología', 'Moda', 'Hogar', 'Deportes', 'Juguetes', 'Mascotas'].map((cat, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="bg-slate-50 group-hover:bg-primary/5 border border-gray-100 group-hover:border-primary transition-all rounded-2xl p-6 flex flex-col items-center gap-3 text-center h-full justify-center shadow-sm hover:shadow-md">
                  <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary transition-colors transform group-hover:scale-110 duration-200">
                    {['devices', 'styler', 'chair', 'fitness_center', 'toys', 'pets'][i]}
                  </span>
                  <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}