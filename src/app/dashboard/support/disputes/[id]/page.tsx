"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useDisputePresenter } from '@/components/dashboard/support/Dispute.presenter';
import { DisputeResolution } from '@/components/dashboard/support/DisputeResolution';

export default function DisputePage() {
  const { id } = useParams();
  const { dispute, loading, resolveDispute } = useDisputePresenter(id as string);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="animate-pulse font-medium text-gray-500">Analizando argumentos técnicos...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mediación de Disputa: {id}</h1>
          <p className="text-gray-500">Motivo: {dispute.reason}</p>
        </header>

        <DisputeResolution 
          dispute={dispute} 
          onResolve={resolveDispute} 
        />
      </div>
    </main>
  );
}