"use client";
import { useParams } from 'next/navigation';
import { useReturnTrackingPresenter } from '@/components/dashboard/buyer/ReturnTracking.presenter';
import { ReturnTrackingTimeline } from '@/components/dashboard/buyer/ReturnTrackingTimeline';

export default function TrackingPage() {
  const { id } = useParams();
  const { status, loading } = useReturnTrackingPresenter(id as string);

  if (loading) return <div className="p-10 text-center animate-pulse">Consultando estatus...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => window.history.back()} className="mb-4 text-sm text-blue-600 hover:underline">
        ← Regresar
      </button>
      <ReturnTrackingTimeline history={status.history} />
    </div>
  );
}