import AdvocateNavbar from '@/components/advocate/AdvocateNavbar';
import StandaloneCaseForm from '@/components/advocate/cases/StandaloneCaseForm';
import Footer from '@/components/Footer';

export default function NewCasePage() {
  return (
    <>
      <AdvocateNavbar />
      <main className="min-h-screen bg-gray-50 px-6 py-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
            New Case
          </h1>
          <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
            Create a new case directly. You can optionally link an existing client.
          </p>
        </div>
        <StandaloneCaseForm />
      </main>
    </>
  );
}