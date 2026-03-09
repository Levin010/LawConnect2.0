import ClientNavbar from '@/components/client/ClientNavbar';
import DashboardStats from '@/components/client/DashboardStats';
import OpenCasesTable from '@/components/client/OpenCasesTable';

export default function ClientDashboard() {
  return (
    <>
      <ClientNavbar />
      <main className="min-h-screen bg-gray-50 px-6 py-8 mx-auto">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}
        >
          Client Dashboard
        </h1>
        <DashboardStats />
        <OpenCasesTable />
      </main>
    </>
  );
}