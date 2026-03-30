import Navbar from '@/components/Navbar';
import CasesList from '@/components/client/cases/CasesList';

export default function ClientCasesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 mx-auto">
        <div className="min-h-screen bg-gray-50 px-6 py-10 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>My Cases</h1>
            <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>All your active and closed cases.</p>
          </div>
          <CasesList />
        </div>
      </main>
    </>
  );
}