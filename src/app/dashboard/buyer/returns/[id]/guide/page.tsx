"use client";
import { useParams } from 'next/navigation';
import { useReturnGuidePresenter } from '@/components/dashboard/buyer/ReturnGuide.presenter';
import { ReturnGuideView } from '@/components/dashboard/buyer/ReturnGuideView';

export default function ReturnGuidePage() {
  const { id } = useParams();
  const { data, loading } = useReturnGuidePresenter(id as string);

  if (loading) return <div className="p-10 text-center">Cargando guía...</div>;

  return (
    <div className="p-8">
      <ReturnGuideView data={data} />
    </div>
  );
}