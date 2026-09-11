'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Shield,
  Bookmark,
  LogOut,
  Layers,
  TrendingUp,
  BarChart3,
  PieChart,
  BookOpen,
  Briefcase,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const coursesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
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

  const courseCategories = [
    {
      name: 'Business Models',
      desc: 'Unit economics, SaaS margins, corporate moats',
      href: '/business',
      icon: Briefcase,
    },
    {
      name: 'Stock Market',
      desc: 'Microstructure, order flow, liquidity pools',
      href: '/stock-market',
      icon: TrendingUp,
    },
    {
      name: 'Companies',
      desc: 'Corporate teardowns & revenue autopsies',
      href: '/companies',
      icon: BarChart3,
    },
    {
      name: 'Investing & DCF',
      desc: 'Valuation frameworks & sensitivity models',
      href: '/investing',
      icon: PieChart,
    },
    {
      name: 'Trading Systems',
      desc: 'Execution mechanics & algorithmic setups',
      href: '/trading',
      icon: Layers,
    },
    {
      name: 'Case Studies',
      desc: 'Forensic accounting & market autopsies',
      href: '/case-studies',
      icon: BookOpen,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#040711]/85 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Brand: FQore Logo Emblem matching page.jpeg */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <div className="w-full h-full rounded-xl bg-[#080b14] flex items-center justify-center font-black text-amber-400 text-xs tracking-tighter">
                FQ
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase">
                FQ<span className="text-amber-400">ore</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase -mt-1 hidden sm:block">
                Core of Solutions
              </span>
            </div>
          </Link>

          {/* Center Navigation Links: matching video frame_005.jpg & frame_020.jpg */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {/* [ About Us ] framed in wireframe box */}
            <Link
              href="/about"
              className={`px-3.5 py-1.5 rounded border text-xs font-mono uppercase tracking-wider transition-all ${
                pathname === '/about'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                  : 'border-white/35 text-white hover:border-cyan-400 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              About Us
            </Link>

            {/* How It Works */}
            <Link
              href="/#how-it-works"
              className="px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </Link>

            {/* Courses Dropdown */}
            <div
              ref={coursesRef}
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  coursesDropdownOpen || courseCategories.some((c) => pathname.startsWith(c.href))
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Courses
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    coursesDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {coursesDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="rounded-xl bg-[#080d1d]/95 backdrop-blur-2xl border border-cyan-500/30 p-2 shadow-2xl space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800">
                      Educational Curriculum
                    </div>
                    {courseCategories.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setCoursesDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                              : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white">{item.name}</p>
                            <p className="text-[11px] text-slate-400 leading-tight mt-0.5 font-light">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Business PDFs / Resources */}
            <Link
              href="/resources"
              className={`px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                pathname === '/resources' ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Business PDFs
            </Link>

            {/* Pricing */}
            <Link
              href="/pricing"
              className={`px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                pathname === '/pricing' ? 'text-cyan-300 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Pricing
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                ₹59+
              </span>
            </Link>
          </nav>

          {/* Right Action Icons & Buttons: matching video frame_005.jpg */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Minimal Search Button */}
            <Link
              href="/search"
              aria-label="Global Search"
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* User Dropdown / Login */}
            {user ? (
              <div ref={userRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-cyan-500/30 text-xs text-slate-200 hover:border-cyan-400 transition-all font-mono"
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  {isAdmin && (
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1 py-0.5 rounded uppercase font-mono font-bold">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#090e1d] border border-cyan-500/30 shadow-2xl py-2 z-50 backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-slate-800/60">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin CMS Suite
                      </Link>
                    )}

                    <Link
                      href="/bookmarks"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                      Saved & Bookmarks
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
            )}

            {/* [ Contact Us ↗ ] signature wireframe button matching frame_005.jpg */}
            <Link
              href="/contact"
              className="px-3.5 py-1.5 rounded border border-white/40 text-white hover:border-cyan-400 hover:text-cyan-300 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-black/40"
            >
              Contact Us
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/search" className="p-2 text-slate-400">
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 py-4 space-y-2">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-mono uppercase text-white hover:text-cyan-300"
            >
              [ About Us ]
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-mono uppercase text-slate-300 hover:text-white"
            >
              How It Works
            </Link>

            <div className="px-4 py-1 text-[11px] font-mono uppercase text-cyan-400 tracking-wider">
              Courses & Disciplines
            </div>
            {courseCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-7 pr-4 py-1.5 text-xs text-slate-300 hover:text-white"
              >
                • {item.name}
              </Link>
            ))}

            <Link
              href="/resources"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-mono uppercase text-slate-300 hover:text-white"
            >
              Business PDFs
            </Link>

            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-mono uppercase text-cyan-300 hover:text-cyan-200"
            >
              Pricing (₹59+)
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-sm font-mono uppercase text-white hover:text-cyan-300"
            >
              [ Contact Us ↗ ]
            </Link>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2 px-4">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-sm text-cyan-300 font-semibold"
                    >
                      <Shield className="w-4 h-4" /> Admin CMS
                    </Link>
                  )}
                  <Link
                    href="/bookmarks"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm text-slate-300"
                  >
                    <Bookmark className="w-4 h-4 text-cyan-400" /> Saved Content
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-sm text-red-400 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-1/2 text-center py-2 text-xs font-mono uppercase border border-white/30 rounded text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-1/2 text-center py-2 text-xs font-mono uppercase border border-cyan-400 text-cyan-300 rounded"
                  >
                    Contact ↗
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

