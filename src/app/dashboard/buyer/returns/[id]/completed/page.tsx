"use client";
import { useParams } from 'next/navigation';
import { useReturnNotificationPresenter } from '@/components/dashboard/buyer/ReturnNotification.presenter';
import { ReturnCompletedView } from '@/components/dashboard/buyer/ReturnCompletedView';

export default function ReturnCompletedPage() {
  const { id } = useParams();
  const { data, loading } = useReturnNotificationPresenter(id as string);

  if (loading) return <div className="p-10 text-center animate-pulse">Cargando confirmación...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ReturnCompletedView data={data} />
    </div>
  );
}