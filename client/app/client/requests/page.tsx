import Navbar from '@/components/Navbar';
import SentRequestsList from '@/components/client/requests/SentRequestsList';

export default function SentRequestsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 mx-auto">
        <div className='min-h-screen bg-gray-50 px-6 py-10 max-w-5xl mx-auto'>
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
            Sent Requests
          </h1>
          <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
            Track the status of your representation requests.
          </p>
        </div>
        <SentRequestsList />
        </div>
      </main>
    </>
  );
}