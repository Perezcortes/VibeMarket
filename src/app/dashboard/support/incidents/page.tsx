"use client";
import React, { useState } from 'react';
import { IncidentLogForm } from '@/components/dashboard/support/IncidentLogForm';

export default function IncidentLogPage() {
  const [createdId, setCreatedId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Soporte Técnico</h1>
          <p className="text-gray-600">Registro oficial de incidencias y fallos del sistema VibeMarket.</p>
        </header>

        {/* Estado de Éxito */}
        {createdId ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded shadow-md animate-in fade-in duration-500">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">✅</span>
              <h3 className="text-lg font-bold">¡Incidente Registrado!</h3>
            </div>
            <p className="mb-4">
              El reporte ha sido guardado con el ID: <span className="font-mono font-bold underline">Incidente registrado: {createdId}</span>
            </p>
            <button 
              onClick={() => setCreatedId(null)}
              className="text-sm font-semibold text-green-800 hover:underline"
            >
              ← Registrar otra incidencia
            </button>
          </div>
        ) : (
          /* Formulario de Registro */
          <IncidentLogForm onCreated={(id) => setCreatedId(id)} />
        )}

        <section className="mt-10 p-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Notas de Arquitectura
          </h4>
          <p className="text-xs text-gray-500 italic">
            Este log alimenta directamente la cola de trabajo del equipo de DevOps. 
            Asegúrate de adjuntar logs de servidor si la prioridad es "Crítica".
          </p>
        </section>
      </div>
    </main>
  );
}