'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { label: 'Advocate Listing', href: '/advocates' },
  { label: 'Sign Up', href: '/signup' },
  { label: 'Login', href: '/login' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative" style={{ backgroundColor: '#8B0000' }}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded">
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

        {/* Desktop nav */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white font-semibold hover:text-gray-200 transition-colors"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-4 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white font-semibold hover:text-gray-200 transition-colors"
                  style={{ fontFamily: 'Georgia, serif' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}