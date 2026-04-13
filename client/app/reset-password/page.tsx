import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import ResetPasswordForm from '@/components/password-reset/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <section
        className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4"
        style={{
          backgroundImage: "url('/images/hero_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 w-full max-w-lg">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
