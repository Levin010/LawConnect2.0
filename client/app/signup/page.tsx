import SignupForm from '@/components/signup/SignUpForm';
import Navbar from '@/components/Navbar';

export default function SignupPage() {
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
        <SignupForm />
      </div>
    </section>  
    </>
  );
}