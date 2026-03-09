import AdvocateNavbar from '@/components/advocate/AdvocateNavbar';
import DashboardStats from '@/components/advocate/DashboardStats';
import OpenCasesTable from '@/components/advocate/OpenCasesTable';

export default function AdvocateDashboard() {
  return (
    <>
      <AdvocateNavbar />
      <main className="min-h-screen bg-gray-50 px-6 py-8 mx-auto">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}
        >
          Advocate Dashboard
        </h1>
        <DashboardStats />
        <OpenCasesTable />
      </main>
    </>
  );
}