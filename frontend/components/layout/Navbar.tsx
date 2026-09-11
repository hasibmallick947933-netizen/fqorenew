'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const coursesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (coursesRef.current && !coursesRef.current.contains(e.target as Node)) {
        setCoursesDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const courseModules = [
    {
      title: 'Unit Economics & Moats',
      desc: 'Recurring revenue engines, CAC payback, cohort retention models.',
      href: '/business',
      moduleNum: 'Module 01',
    },
    {
      title: 'Order Flow & Microstructure',
      desc: 'Institutional block prints, dark pools, volume profile auction mechanics.',
      href: '/stock-market',
      moduleNum: 'Module 02',
    },
    {
      title: 'Corporate Teardowns',
      desc: 'Off-balance sheet debt, revenue recognition forensics, cash burn autopsies.',
      href: '/companies',
      moduleNum: 'Module 03',
    },
    {
      title: 'DCF & Sensitivity Models',
      desc: 'Unlevered free cash flow, WACC derivation, terminal multiple stress tests.',
      href: '/investing',
      moduleNum: 'Module 04',
    },
    {
      title: 'Execution Mechanics',
      desc: 'Systematic trade protocols, Kelly criterion sizing, algorithmic setups.',
      href: '/trading',
      moduleNum: 'Module 05',
    },
    {
      title: 'Forensic Accounting Autopsies',
      desc: 'Beneish M-score fraud detection, short-seller reports, liquidity collapses.',
      href: '/case-studies',
      moduleNum: 'Module 06',
    },
  ];

  if (pathname === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-primary-container/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(13,28,50,0.25)] border-b border-surface-container-lowest/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop h-20 flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group select-none">
          <div className="w-9 h-9 rounded-lg bg-[#060d19] border border-surface-container-lowest/20 flex items-center justify-center p-1 shadow-md">
            <div className="flex items-center gap-0.5">
              <div className="w-1.5 h-5 bg-emerald-500 rounded-sm"></div>
              <div className="w-1.5 h-3.5 bg-red-500 rounded-sm"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-surface-container-lowest tracking-tight group-hover:text-secondary-container transition-colors leading-none">
              FQ<span className="text-secondary-container font-semibold">ore</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-on-primary-container uppercase mt-0.5 hidden sm:block">
              Core of Solutions
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-space-lg">
          <Link
            href="/about"
            className={`font-label-md text-label-md uppercase tracking-wider transition-colors ${
              pathname === '/about'
                ? 'text-secondary-container font-semibold'
                : 'text-on-primary-container hover:text-surface-container-lowest'
            }`}
          >
            ABOUT US
          </Link>

          <Link
            href="/#curriculum-breakdown"
            className="text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
          >
            HOW IT WORKS
          </Link>

          {/* Courses Mega Dropdown */}
          <div
            ref={coursesRef}
            className="relative py-space-sm"
            onMouseEnter={() => setCoursesDropdownOpen(true)}
            onMouseLeave={() => setCoursesDropdownOpen(false)}
          >
            <div className="flex items-center gap-0.5">
              <Link
                href="/courses"
                className={`font-label-md text-label-md uppercase tracking-wider transition-colors ${
                  pathname === '/courses' || courseModules.some((c) => pathname.startsWith(c.href))
                    ? 'text-secondary-container font-semibold'
                    : 'text-on-primary-container hover:text-surface-container-lowest'
                }`}
              >
                COURSES
              </Link>
              <button
                type="button"
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                className="text-on-primary-container hover:text-secondary-container p-0.5"
                aria-label="Toggle courses dropdown"
              >
                <span
                  className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                    coursesDropdownOpen ? 'rotate-180 text-secondary-container' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
            </div>

            {/* Dropdown Menu */}
            {coursesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-tertiary-container/95 backdrop-blur-2xl rounded-2xl p-space-lg shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-surface-container-lowest/15">
                  <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-lowest/10">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container">
                      EDUCATIONAL CURRICULUM
                    </span>
                    <Link
                      href="/courses"
                      onClick={() => setCoursesDropdownOpen(false)}
                      className="font-label-sm text-label-sm uppercase text-secondary-container hover:underline tracking-wider font-semibold"
                    >
                      View All Courses Catalog &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-x-space-lg gap-y-space-md">
                    {courseModules.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setCoursesDropdownOpen(false)}
                        className={`group/item flex flex-col p-3 rounded-xl transition-all ${
                          pathname.startsWith(item.href)
                            ? 'bg-surface-container-lowest/10 border border-secondary-container/30'
                            : 'hover:bg-surface-container-lowest/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-title-md text-title-md text-surface-container-lowest group-hover/item:text-secondary-container transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-lowest/10 text-secondary-container">
                            {item.moduleNum}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-tertiary-container line-clamp-2">
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/resources"
            className={`font-label-md text-label-md uppercase tracking-wider transition-colors ${
              pathname === '/resources'
                ? 'text-secondary-container font-semibold'
                : 'text-on-primary-container hover:text-surface-container-lowest'
            }`}
          >
            BUSINESS PDFS
          </Link>

          <Link
            href="/pricing"
            className={`font-label-md text-label-md uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              pathname === '/pricing'
                ? 'text-secondary-container font-semibold'
                : 'text-on-primary-container hover:text-surface-container-lowest'
            }`}
          >
            <span>PRICING</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-secondary-container/20 text-secondary-container border border-secondary-container/30">
              ₹59+
            </span>
          </Link>
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-space-md shrink-0">
          <Link
            href="/search"
            aria-label="Search Catalog"
            className="p-space-xs text-on-primary-container hover:text-surface-container-lowest transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </Link>

          {/* User Dropdown or Log In */}
          {user ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-tertiary-container border border-surface-container-lowest/15 text-xs text-surface-container-lowest hover:border-secondary-container/50 transition-all font-mono"
              >
                <div className="w-6 h-6 rounded-full bg-secondary-container/20 text-secondary-container flex items-center justify-center font-bold text-[11px]">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                <span className="material-symbols-outlined text-[16px] text-on-primary-container">
                  expand_more
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-tertiary-container border border-surface-container-lowest/15 shadow-2xl py-2 z-50 backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-surface-container-lowest/10">
                    <p className="text-xs font-semibold text-surface-container-lowest truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-on-primary-container truncate">{user.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-secondary-container hover:bg-surface-container-lowest/5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                      Admin CMS Suite
                    </Link>
                  )}

                  <Link
                    href="/bookmarks"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-surface-container-lowest hover:bg-surface-container-lowest/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark</span>
                    Saved Dossiers
                  </Link>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              LOG IN
            </Link>
          )}

          {/* Contact Us CTA Button */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-label-md text-label-md uppercase tracking-wider text-secondary-container hover:bg-secondary-container/10 transition-colors border border-secondary-container/30 hover:border-secondary-container"
          >
            <span className="font-label-md text-label-md">CONTACT US</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>

          {/* Admin quick icon */}
          <Link
            href="/admin"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:ring-2 hover:ring-secondary-container transition-all"
            title="Admin Portal"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-on-primary-container hover:text-surface-container-lowest"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-primary-container/98 border-t border-surface-container-lowest/10 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2">
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-label-md uppercase tracking-wider text-surface-container-lowest hover:text-secondary-container"
          >
            About Us
          </Link>
          <Link
            href="/#curriculum-breakdown"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-label-md uppercase tracking-wider text-on-primary-container hover:text-surface-container-lowest"
          >
            How It Works
          </Link>

          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-label-md uppercase tracking-wider text-secondary-container font-semibold"
          >
            All Courses Catalog &rarr;
          </Link>

          <div className="pt-2 border-t border-surface-container-lowest/10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-secondary-container block mb-2">
              Courses & Syllabi
            </span>
            <div className="space-y-2 pl-2">
              {courseModules.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-xs text-on-primary-container hover:text-surface-container-lowest"
                >
                  &bull; {c.title}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-label-md uppercase tracking-wider text-on-primary-container hover:text-surface-container-lowest"
          >
            Business PDFs
          </Link>

          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-label-md uppercase tracking-wider text-secondary-container"
          >
            Pricing (₹59+)
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-label-md uppercase tracking-wider text-secondary-container"
          >
            Contact Us &rarr;
          </Link>

          <div className="pt-4 border-t border-surface-container-lowest/10 flex flex-col gap-2">
            {user ? (
              <>
                <div className="text-xs text-on-primary-container">Signed in as {user.name}</div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-1.5 text-xs text-secondary-container flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    Admin CMS Suite
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-1.5 text-xs text-red-400 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-xs font-label-md uppercase tracking-wider border border-surface-container-lowest/20 rounded-xl text-surface-container-lowest"
                >
                  Log In
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-1/2 text-center py-2.5 text-xs font-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container rounded-xl font-bold"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
