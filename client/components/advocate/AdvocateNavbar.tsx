'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import LogoutButton from '@/components/login/LogoutButton';

const casesLinks = [
  { label: 'My Cases', href: '/advocate/cases' },
  { label: 'Received Requests', href: '/advocate/requests' },
  { label: 'New Case', href: '/advocate/cases/new' },
];

export default function AdvocateNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const casesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const username = useSelector((state: RootState) => state.auth.username);
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (casesRef.current && !casesRef.current.contains(e.target as Node)) {
        setCasesOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinkClass = 'text-white font-semibold hover:text-gray-200 transition-colors text-sm';
  const dropdownItemClass = 'block px-5 py-3 text-sm text-white hover:bg-white/10 transition-colors';

  return (
    <header className="relative z-50" style={{ backgroundColor: '#8B0000' }}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/advocate/dashboard" className="flex items-center">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded">
            <Image
              src="/images/lawconnect_logo.png"
              alt="LawConnect Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="font-bold text-base" style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}>
              LawConnect
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/advocate/dashboard" className={navLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
            Dashboard
          </Link>

          {/* Cases dropdown */}
          <div className="relative" ref={casesRef}>
            <button
              onClick={() => { setCasesOpen((p) => !p); setAccountOpen(false); }}
              className={`${navLinkClass} flex items-center gap-1`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              + Cases
              <svg className={`w-3 h-3 transition-transform ${casesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {casesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-xl shadow-xl overflow-hidden border border-white/10" style={{ backgroundColor: '#8B0000' }}>
                {casesLinks.map((link) => (
                  <Link key={link.label} href={link.href} className={dropdownItemClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setCasesOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/advocate/appointments" className={navLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
            Appointments
          </Link>

          <Link href="/advocate/bills" className={navLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
            Client Bills
          </Link>

          {/* Account avatar dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => { setAccountOpen((p) => !p); setCasesOpen(false); }}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity"
              style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
              aria-label="Account menu"
            >
              {initial}
            </button>
            {accountOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 rounded-xl shadow-xl overflow-hidden border border-white/10" style={{ backgroundColor: '#8B0000' }}>
                <Link href="/advocate/profile" className={dropdownItemClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setAccountOpen(false)}>
                  My Profile
                </Link>
                <div className="px-3 py-2">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/20 px-6 py-4 flex flex-col gap-4">
          <Link href="/advocate/dashboard" className={navLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <div className="flex flex-col gap-2">
            <span className="text-white/60 text-xs uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Cases</span>
            {casesLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-white text-sm pl-3 hover:text-gray-200 transition-colors" style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/advocate/chats" className={navLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>
            Chats
          </Link>
          <Link href="/advocate/bills" className={navLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>
            Client Bills
          </Link>
          <Link href="/advocate/profile" className={navLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>
            My Profile
          </Link>
          <LogoutButton />
        </nav>
      )}
    </header>
  );
}