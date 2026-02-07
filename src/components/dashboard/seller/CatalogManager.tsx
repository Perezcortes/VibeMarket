"use client";
import { useState, useEffect } from "react";

export default function CatalogManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // ¿Estamos editando?
  const [editId, setEditId] = useState<string | null>(null); // ID del producto a editar

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stock: "", category_id: "", image: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/seller/products');
    const data = await res.json();
    if (res.ok) {
        setProducts(data.products || []);
        setCategories(data.categories || []);
    }
    setLoading(false);
  };

  // --- ACCIONES ---

  // 1. Guardar (Crear o Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing ? { ...formData, id: editId } : formData;

    const res = await fetch('/api/seller/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    
    if (res.ok) {
        alert(isEditing ? "Producto actualizado" : "Producto creado");
        setShowForm(false);
        resetForm();
        fetchProducts();
    } else {
        alert("Error al guardar");
    }
  };

  // 2. Preparar Edición
  const handleEditClick = (product: any) => {
    setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        image: product.images[0]?.url || ""
    });
    setEditId(product.id);
    setIsEditing(true);
    setShowForm(true);
  };

  // 3. Eliminar
  const handleDelete = async (id: string) => {
    if(!confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) return;

    const res = await fetch(`/api/seller/products?id=${id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
    } else {
        alert("Error al eliminar");
    }
  };

  // 4. Actualización Rápida (Stock / Estado)
  const handleQuickUpdate = async (id: string, field: string, value: any) => {
    // Optimismo UI
    const oldProducts = [...products];
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));

    const res = await fetch('/api/seller/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value })
    });

    if (!res.ok) setProducts(oldProducts);
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", stock: "", category_id: "", image: "" });
    setIsEditing(false);
    setEditId(null);
  };

  if (loading) return <div className="p-8 text-center">Cargando inventario...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-[#1a1010] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Inventario & Catálogo</h2>
            <p className="text-sm text-gray-500">Total: {products.length} productos</p>
        </div>
        <button 
            onClick={() => { setShowForm(!showForm); resetForm(); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${showForm ? 'bg-gray-200 text-gray-800' : 'bg-black text-white hover:bg-gray-800'}`}
        >
            <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
            {showForm ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1010] p-6 rounded-3xl border-2 border-primary/10 shadow-lg grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2 mb-2">
                <h3 className="font-bold text-lg text-primary">{isEditing ? 'Editar Producto' : 'Publicar Nuevo Item'}</h3>
            </div>
            
            <input required placeholder="Nombre del producto" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <select required className="input-field" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                <option value="">Selecciona Categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            
            <input required type="number" placeholder="Precio ($)" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <input required type="number" placeholder="Stock Inicial" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            
            <input required placeholder="URL de Imagen (https://...)" className="input-field md:col-span-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            <textarea required placeholder="Descripción detallada..." className="input-field md:col-span-2 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <button type="submit" className="md:col-span-2 bg-primary text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-primary/20">
                {isEditing ? 'Guardar Cambios' : 'Publicar Ahora'}
            </button>
        </form>
      )}

      {/* Tabla */}
      <div className="bg-white dark:bg-[#1a1010] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-500 font-bold">
                        <th className="p-4">Producto</th>
                        <th className="p-4">Precio</th>
                        <th className="p-4">Control Stock</th>
                        <th className="p-4">Visibilidad</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                        {p.images[0] ? <img src={p.images[0].url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 p-2">image</span>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.category?.name}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                                ${p.price}
                            </td>
                            <td className="p-4">
                                {/* STOCK REAL */}
                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/10 w-fit rounded-lg p-1">
                                    <button onClick={() => handleQuickUpdate(p.id, 'stock', Math.max(0, p.stock - 1))} className="size-6 bg-white dark:bg-black rounded shadow-sm hover:text-red-500 font-bold">-</button>
                                    <span className={`w-8 text-center font-bold text-sm ${p.stock === 0 ? 'text-red-500' : ''}`}>{p.stock}</span>
                                    <button onClick={() => handleQuickUpdate(p.id, 'stock', p.stock + 1)} className="size-6 bg-white dark:bg-black rounded shadow-sm hover:text-green-500 font-bold">+</button>
                                </div>
                            </td>
                            <td className="p-4">
                                {/* MOSTRAR / ELIMINAR OFERTA (VISIBILIDAD) */}
                                <button 
                                    onClick={() => handleQuickUpdate(p.id, 'is_active', !p.is_active)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                                        p.is_active 
                                        ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" 
                                        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-sm">{p.is_active ? 'visibility' : 'visibility_off'}</span>
                                    {p.is_active ? 'Visible' : 'Oculto'}
                                </button>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => handleEditClick(p)}
                                        className="size-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                        title="Editar"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(p.id)}
                                        className="size-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                        title="Eliminar permanentemente"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay productos. ¡Empieza a vender!</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
      
      <style jsx>{`
        .input-field {
            @apply w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm;
        }
      `}</style>
    </div>
  );
}