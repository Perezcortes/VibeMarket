'use client';

import { useState, FormEvent, useEffect, useRef, useTransition } from 'react'; // 1. Importamos useTransition
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Category {
  id: number;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category_id: string;
  is_active: boolean;
  images: string[]; // URLs existentes o agregadas por texto
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  productId?: string;
  mode: 'create' | 'edit';
  categories: Category[];
}

export function ProductForm({ initialData, productId, mode, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // 2. Inicializamos el hook
  const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input oculto
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input para URLs manuales
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  // Estado para archivos locales seleccionados
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Estado para previsualizaciones de archivos locales
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price ? String(initialData.price) : '',
    stock: initialData?.stock ? String(initialData.stock) : '0',
    category_id: initialData?.category_id ? String(initialData.category_id) : '',
    is_active: initialData?.is_active ?? true,
    images: initialData?.images || [], 
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // Efecto para limpiar las URLs de previsualización (evitar fugas de memoria)
  useEffect(() => {
    return () => {
      localPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [localPreviews]);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) newErrors.price = 'Precio inválido';

    const stock = parseInt(formData.stock);
    if (!formData.stock || isNaN(stock) || stock < 0) newErrors.stock = 'Stock inválido';

    if (!formData.category_id) newErrors.category_id = 'Selecciona una categoría';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- MANEJO DE IMÁGENES POR URL (TEXTO) ---
  const handleAddUrlImage = () => {
    if (!imageUrlInput.trim()) return;
    if (!imageUrlInput.startsWith('http')) {
      alert('Ingresa una URL válida');
      return;
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  };

  // --- MANEJO DE ARCHIVOS LOCALES ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Agregar archivos al estado
      setSelectedFiles(prev => [...prev, ...newFiles]);

      // Generar URLs de previsualización
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setLocalPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeLocalFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revocar URL para liberar memoria
    URL.revokeObjectURL(localPreviews[index]); 
    setLocalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeUrlImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- ENVÍO DEL FORMULARIO ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = mode === 'create' 
        ? '/api/seller/products' 
        : `/api/seller/products/${productId}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      // IMPORTANTE: Usamos FormData para poder enviar archivos y texto juntos
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name.trim());
      dataToSend.append('description', formData.description.trim() || '');
      dataToSend.append('price', formData.price);
      dataToSend.append('stock', formData.stock);
      dataToSend.append('category_id', formData.category_id);
      dataToSend.append('is_active', String(formData.is_active));

      // 1. Enviamos las URLs existentes (imágenes que ya estaban o se agregaron por link)
      formData.images.forEach(imgUrl => {
        dataToSend.append('existing_images', imgUrl);
      });

      // 2. Enviamos los archivos nuevos (desde la carpeta de la PC)
      selectedFiles.forEach(file => {
        dataToSend.append('files', file); 
      });

      const response = await fetch(url, {
        method,
        body: dataToSend, 
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Error al guardar el producto');
      }

      // 3. AQUÍ ESTÁ LA SOLUCIÓN AL ERROR DE "removeChild"
      // Usamos startTransition para coordinar el refresh y la navegación
      startTransition(() => {
        router.refresh();
        router.push('/seller/products');
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Combinamos el estado de carga local con el de la transición
  const isSaving = isLoading || isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Nombre */}
      <Input
        label="Nombre del producto"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      {/* Categoría */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría *</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="">Selecciona...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
      </div>

      {/* Descripción, Precio y Stock */}
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descripción..."
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
        rows={4}
      />
      
      <div className="grid grid-cols-2 gap-4">
         <Input label="Precio" name="price" type="number" value={formData.price} onChange={handleChange} error={errors.price} />
         <Input label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} error={errors.stock} />
      </div>

      {/* --- SECCIÓN IMÁGENES --- */}
      <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Imágenes del Producto
        </label>
        
        {/* Opciones de carga */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Opción 1: Subir desde PC */}
          <div className="flex-1">
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*"
                className="hidden" 
             />
             <Button 
                type="button" 
                variant="secondary" 
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
             >
              Subir Imagen
             </Button>
          </div>

          {/* Opción 2: URL Externa */}
          <div className="flex-[2] flex gap-2">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="o pega una URL..."
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
            />
            <Button type="button" onClick={handleAddUrlImage} variant="ghost">
             URL
            </Button>
          </div>
        </div>

        {/* --- GRID DE VISTA PREVIA (MIXTO) --- */}
        {(formData.images.length > 0 || localPreviews.length > 0) ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            
            {/* 1. Mostrar imágenes por URL (Existentes) */}
            {formData.images.map((url, index) => (
              <div key={`url-${index}`} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">URL</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeUrlImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* 2. Mostrar imágenes Locales  */}
            {localPreviews.map((previewUrl, index) => (
              <div key={`local-${index}`} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-blue-500">
                <img src={previewUrl} alt="Local preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">NUEVO (PC)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeLocalFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic text-center py-4">No hay imágenes seleccionadas.</p>
        )}
      </div>

      {/* Checkbox Activo y Botones */}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4" />
        <label>Producto activo</label>
      </div>

      <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={isSaving} // Usamos la variable combinada
          className="flex-1"
        >
          {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}