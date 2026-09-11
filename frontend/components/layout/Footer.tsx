'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname === '/') {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-slate-400 border-t border-white/10 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & Movement Slogan */}
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <div className="w-full h-full bg-[#080b14] rounded-xl flex items-center justify-center font-black text-amber-400 text-xs">
                  FQ
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white uppercase group-hover:text-amber-400 transition-colors">
                  FQ<span className="text-amber-400">ore</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                  Core of Solutions
                </span>
              </div>
            </Link>

            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white max-w-md leading-tight pt-2">
              BUILD YOUR <span className="text-amber-400">BETTER FUTURE</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-md font-light leading-relaxed">
              Practical Knowledge &bull; Real Strategies &bull; Lasting Growth. Practical trading education, e-commerce startup scaling, downloadable PDF blueprints, and financial models.
            </p>
            <p className="text-xs font-mono text-amber-400/90">
              Admin & Inquiries: <a href="mailto:fqorein@gmail.com" className="underline hover:text-white">fqorein@gmail.com</a>
            </p>
          </div>

          {/* Quick Links, Contact Us, Follow Us (matching frame_160.jpg) */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-[11px] font-mono">
                Quick Links
              </h4>
              <ul className="space-y-2.5 font-light">
                <li>
                  <Link href="/about" className="hover:text-cyan-300 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-cyan-300 transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="/business" className="hover:text-cyan-300 transition-colors">
                    Business Models
                  </Link>
                </li>
                <li>
                  <Link href="/stock-market" className="hover:text-cyan-300 transition-colors">
                    Stock Market
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-cyan-300 transition-colors">
                    Downloadables
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-[11px] font-mono">
                Contact Us
              </h4>
              <ul className="space-y-2.5 font-light">
                <li>
                  <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                    Contact Advisory
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-cyan-300 transition-colors">
                    Admin CMS
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-[11px] font-mono">
                Follow Us
              </h4>
              <ul className="space-y-2.5 font-light">
                <li>
                  <a href="#" className="hover:text-cyan-300 transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-300 transition-colors">
                    X.com
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-300 transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-300 transition-colors">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* GIANT ARCHITECTURAL WATERMARK (matching frame_160.jpg "EDUXCHAIN" watermark) */}
        <div className="w-full py-8 text-center select-none pointer-events-none overflow-hidden">
          <div
            className="text-7xl sm:text-9xl md:text-[13rem] lg:text-[16rem] font-black uppercase tracking-tight text-white leading-none opacity-[0.06] hover:opacity-10 transition-opacity"
            style={{
              letterSpacing: '0.04em',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.15)',
            }}
          >
            FQORE
          </div>
        </div>

        {/* Bottom Legal & Copyright (matching frame_160.jpg) */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-light">
          <p>© {new Date().getFullYear()} FQore. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
