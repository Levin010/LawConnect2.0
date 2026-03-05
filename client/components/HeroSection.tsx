import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="relative flex items-center justify-center"
      style={{
        minHeight: '480px',
        backgroundImage: "url('/images/hero_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center text-white px-4">
        <h2
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Welcome to LawConnect
        </h2>
        <p className="text-lg mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Connecting clients with qualified advocates for legal assistance.
        </p>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 font-semibold text-white rounded transition-colors"
          style={{
            backgroundColor: '#8B0000',
            fontFamily: 'Georgia, serif',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              '#6B0000')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              '#8B0000')
          }
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
