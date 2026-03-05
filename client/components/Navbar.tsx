import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header
      className="flex items-center justify-between px-6 py-3"
      style={{ backgroundColor: '#8B0000' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div
          className="flex items-center gap-2 bg-white px-3 py-2 rounded"
          style={{ minWidth: '160px' }}
        >
          <Image
            src="/images/lawconnect_logo.png"
            alt="LawConnect Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span
            className="font-bold text-lg"
            style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
          >
            LawConnect
          </span>
        </div>
      </Link>

      {/* Nav links */}
      <nav>
        <ul className="flex items-center gap-8 list-none m-0 p-0">
          <li>
            <Link
              href="/advocates"
              className="text-white font-semibold hover:text-gray-200 transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Advocate Listing
            </Link>
          </li>
          <li>
            <Link
              href="/signup"
              className="text-white font-semibold hover:text-gray-200 transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="text-white font-semibold hover:text-gray-200 transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
