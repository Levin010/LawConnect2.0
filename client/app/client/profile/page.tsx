import ClientNavbar from '@/components/client/ClientNavbar';
import ProfileForm from '@/components/client/profile/ProfileForm';

export default function ClientProfilePage() {
  return (
    <>
      <ClientNavbar />
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}
            >
              My Profile
            </h1>
            <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Georgia, serif' }}>
              Manage your public client profile and account details.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <ProfileForm />
          </div>
        </div>
      </main>
    </>
  );
}