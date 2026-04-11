"use client";
import React, { useState } from 'react';
import { useIncidentLogPresenter } from '@/components/dashboard/support/IncidentLog.presenter';

export const IncidentLogForm = ({ onCreated }: { onCreated: (id: string) => void }) => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'media' });
  const { submitIncident, loading, error } = useIncidentLogPresenter(onCreated);

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Registrar Incidencia Técnica</h2>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">⚠️ {error}</div>}

      <div className="space-y-4">
        <input 
          type="text"
          placeholder="Título corto del error (ej. Falla en pasarela de pago)"
          className="w-full border p-2 rounded"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />

        <select 
          className="w-full border p-2 rounded"
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
        >
          <option value="baja">Prioridad Baja</option>
          <option value="media">Prioridad Media</option>
          <option value="alta">Prioridad Alta</option>
          <option value="critica">Prioridad Crítica</option>
        </select>

        <textarea 
          placeholder="Pasos para reproducir el error y comportamiento esperado..."
          className="w-full border p-2 rounded h-32"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        <button 
          onClick={() => submitIncident(formData.title, formData.description, formData.priority)}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? "Guardando en Log..." : "Registrar Incidencia"}
        </button>
      </div>
    </div>
  );
};