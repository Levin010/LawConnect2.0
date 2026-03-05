import LogoutButton from '@/components/login/LogoutButton';

export default function AdvocateDashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}
        >
          Advocate Dashboard
        </h1>
        <p className="text-gray-500" style={{ fontFamily: 'Georgia, serif' }}>
          Welcome back. Your dashboard is under construction.
        </p>
        <LogoutButton />
      </div>
    </main>
  );
}