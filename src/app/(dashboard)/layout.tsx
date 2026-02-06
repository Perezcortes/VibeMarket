import { DashboardLayout } from '@/components/layout/Dashboardlayout';

export const metadata = {
  title: 'Dashboard | VibeMarket',
  description: 'Panel de control del vendedor',
};

/**
 * Layout del dashboard - Envuelve todas las páginas del dashboard con sidebar
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}