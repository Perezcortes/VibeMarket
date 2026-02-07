"use client";
import { useState, useEffect } from "react";

// Tipo de dato para TypeScript
type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    fetchUsers(); // Recargar tabla
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Agregar ID si estamos editando
    if (editingUser) {
        Object.assign(data, { id: editingUser.id });
    }

    const method = editingUser ? "PUT" : "POST";
    
    const res = await fetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchUsers();
    } else {
      alert("Error al guardar");
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Gestión de Usuarios</h3>
        <button 
            onClick={openCreate}
            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2"
        >
            <span className="material-symbols-outlined">add</span> Nuevo Usuario
        </button>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <p className="font-bold text-gray-800">{user.full_name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase
                                ${user.role === 'admin' ? 'bg-black text-white' : 
                                  user.role === 'vendedor' ? 'bg-primary/10 text-primary' : 
                                  user.role === 'soporte' ? 'bg-blue-100 text-blue-600' :
                                  user.role === 'repartidor' ? 'bg-amber-100 text-amber-600' :
                                  'bg-gray-100 text-gray-500'}`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            {user.is_active ? (
                                <span className="text-green-600 font-bold text-xs flex items-center gap-1"><span className="size-2 bg-green-500 rounded-full"></span> Activo</span>
                            ) : (
                                <span className="text-red-500 font-bold text-xs flex items-center gap-1"><span className="size-2 bg-red-500 rounded-full"></span> Inactivo</span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button onClick={() => openEdit(user)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg mr-2">
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* MODAL (CREAR / EDITAR) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                <h3 className="text-xl font-bold mb-4">{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Nombre Completo</label>
                        <input name="full_name" defaultValue={editingUser?.full_name} required className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Correo Electrónico</label>
                        <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full border rounded-lg p-2" />
                    </div>
                    
                    {!editingUser && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Contraseña</label>
                            <input name="password" type="password" required className="w-full border rounded-lg p-2" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Rol</label>
                            <select name="role" defaultValue={editingUser?.role || 'comprador'} className="w-full border rounded-lg p-2 bg-white">
                                <option value="admin">Administrador</option>
                                <option value="vendedor">Vendedor</option>
                                <option value="comprador">Comprador</option>
                                <option value="repartidor">Repartidor</option>
                                <option value="soporte">Soporte</option>
                            </select>
                        </div>
                        {editingUser && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Estado</label>
                                <select name="is_active" defaultValue={editingUser.is_active ? "true" : "false"} className="w-full border rounded-lg p-2 bg-white">
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-red-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}