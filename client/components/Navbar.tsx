'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import LogoutButton from '@/components/login/LogoutButton';
import { CircleUser, FileUser, Home, LayoutDashboard, LogIn, Mails, MessageCircleCheck, Receipt, Scale, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [casesOpen, setCasesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const casesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, role, username } = useSelector((state: RootState) => state.auth);
  const isClient = isAuthenticated && role === 'ROLE_CLIENT';
  const initial = username ? username.charAt(0).toUpperCase() : '?';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (casesRef.current && !casesRef.current.contains(e.target as Node)) setCasesOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinkClass = 'text-white font-semibold hover:text-gray-200 transition-colors text-sm';
  const dropdownItemClass = 'block px-5 py-3 text-sm text-white hover:bg-white/10 transition-colors';
  const mobileLinkClass = `${navLinkClass} block`;
  const mobileSectionLabelClass = 'text-white text-xs font-semibold uppercase tracking-wider';
  const desktopLinkClass = `${navLinkClass} flex items-center gap-2`;
  const desktopDropdownItemClass = `${dropdownItemClass} flex items-center gap-2`;

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: '#8B0000' }}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href={isClient ? '/client/dashboard' : '/'} className="flex items-center">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded">
            <Image src="/images/lawconnect_logo.png" alt="LawConnect Logo" width={28} height={28} className="object-contain" />
            <span className="font-bold text-base" style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}>LawConnect</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Shared links */}
          {isClient && (
            <Link href="/client/dashboard" className={desktopLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </Link>
          )}
          {!isClient && !isAuthenticated && (
            <Link href="/" className={desktopLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
              <Home className="h-4 w-4 shrink-0" />
              <span>Home</span>
            </Link>
          )}

          <Link href="/advocates" className={desktopLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
            <FileUser className="h-4 w-4 shrink-0" />
            <span>Advocate Listing</span>
          </Link>

          {/* Client-only links */}
          {isClient && (
            <>
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
                    <Link href="/client/cases" className={desktopDropdownItemClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setCasesOpen(false)}>
                      <Scale className="h-4 w-4 shrink-0" />
                      <span>My Cases</span>
                    </Link>
                    <Link href="/client/requests" className={desktopDropdownItemClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setCasesOpen(false)}>
                      <Mails className="h-4 w-4 shrink-0" />
                      <span>Sent Requests</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/client/chats" className={desktopLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
                <MessageCircleCheck className="h-4 w-4 shrink-0" />
                <span>Chats</span>
              </Link>
              <Link href="/client/bills" className={desktopLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
                <Receipt className="h-4 w-4 shrink-0" />
                <span>My Bills</span>
              </Link>
            </>
          )}

          {/* Guest-only links */}
          {!isAuthenticated && (
            <>
              <Link href="/signup" className={desktopLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
                <UserPlus className="h-4 w-4 shrink-0" />
                <span>Sign Up</span>
              </Link>
              <Link href="/login" className={desktopLinkClass} style={{ fontFamily: 'Georgia, serif' }}>
                <LogIn className="h-4 w-4 shrink-0" />
                <span>Login</span>
              </Link>
            </>
          )}

          {/* Account avatar — authenticated users */}
          {isAuthenticated && (
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
                  <Link
                    href={isClient ? '/client/profile' : '/advocate/profile'}
                    className={desktopDropdownItemClass}
                    style={{ fontFamily: 'Georgia, serif' }}
                    onClick={() => setAccountOpen(false)}
                  >
                    <CircleUser className="h-4 w-4 shrink-0" />
                    <span>My Profile</span>
                  </Link>
                  <div className="px-5 pb-1 text-sm text-white hover:bg-white/10 transition-colors">
                    <LogoutButton
                      className="w-full rounded-none px-0 py-0 text-left text-sm font-semibold hover:text-gray-200"
                      showIcon
                    />
                  </div>
                </div>
              )}
            </div>
          )}
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
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={!menuOpen}
      >
        <button
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu overlay"
        />
        <nav
          className={`absolute right-0 top-0 flex h-full w-[60vw] flex-col gap-4 overflow-y-auto border-l border-white/20 px-6 py-24 shadow-2xl transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ backgroundColor: '#8B0000' }}
        >
          {isClient && (
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 shrink-0 text-white" />
              <Link href="/client/dashboard" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            </div>
          )}
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 shrink-0 text-white" />
              <Link href="/" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>Home</Link>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FileUser className="h-4 w-4 shrink-0 text-white" />
            <Link href="/advocates" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>Advocate Listing</Link>
          </div>

          {isClient && (
            <>
              <div className="flex flex-col gap-2 border-t border-white/15 pt-4">
                <span className={mobileSectionLabelClass} style={{ fontFamily: 'Georgia, serif' }}>Cases</span>
                <div className="pl-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 shrink-0 text-white" />
                    <Link href="/client/cases" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>
                      My Cases
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mails className="h-4 w-4 shrink-0 text-white" />
                    <Link href="/client/requests" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>
                      Sent Requests
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircleCheck className="h-4 w-4 shrink-0 text-white" />
                <Link href="/client/chats" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>Chats</Link>
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 shrink-0 text-white" />
              <Link href="/client/bills" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>My Bills</Link>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <>
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 shrink-0 text-white" />
                <Link href="/signup" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4 shrink-0 text-white" />
                <Link href="/login" className={mobileLinkClass} style={{ fontFamily: 'Georgia, serif' }} onClick={() => setMenuOpen(false)}>Login</Link>
              </div>
            </>
          )}

          {isAuthenticated && (
            <>
            <div className="flex items-center gap-2">
              <CircleUser className="h-4 w-4 shrink-0 text-white" />
              <Link
                href="/client/profile"
                className={mobileLinkClass}
                style={{ fontFamily: 'Georgia, serif' }}
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </Link>
              </div>
              <div className="mt-auto border-t border-white/15 pt-6">
                <LogoutButton
                  className="w-full rounded-none px-0 py-0 text-left text-sm font-semibold hover:text-gray-200"
                  showIcon
                />
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
