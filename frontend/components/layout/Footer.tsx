'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <footer className="w-full bg-[#070e1a] text-on-primary-container border-t border-surface-container-lowest/10 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-surface-container-lowest/10">
          {/* Brand & Movement Slogan */}
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-md ring-1 ring-[#cba258]/50 bg-black flex items-center justify-center">
                <img src="/images/fqore-circle-logo.png" alt="FQore Logo" className="w-full h-full object-cover scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-surface-container-lowest uppercase tracking-tight group-hover:text-secondary-container transition-colors">
                  FQ<span className="text-secondary-container font-semibold">ore</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-on-primary-container uppercase -mt-1">
                  Core of Solutions
                </span>
              </div>
            </Link>

            <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest max-w-md pt-2">
              BUILD YOUR <span className="text-secondary-container">INSTITUTIONAL EDGE</span>
            </h3>
            <p className="font-body-sm text-body-sm text-on-primary-container max-w-md leading-relaxed">
              Practical trading education, quantitative order flow mechanics, corporate revenue autopsies, downloadable Excel models, and forensic PDF dossiers.
            </p>
            <p className="text-xs font-mono text-secondary-container">
              Advisory Desk &amp; Inquiries:{' '}
              <a href="mailto:fqorein@gmail.com" className="underline hover:text-surface-container-lowest">
                fqorein@gmail.com
              </a>
            </p>
          </div>

          {/* Quick Links, Contact, Syllabi */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-6 text-xs">
            <div>
              <h4 className="font-label-sm text-label-sm uppercase tracking-wider text-surface-container-lowest mb-4">
                Curriculum
              </h4>
              <ul className="space-y-2.5 font-body-sm text-on-primary-container">
                <li>
                  <Link href="/business" className="hover:text-secondary-container transition-colors">
                    Business Models
                  </Link>
                </li>
                <li>
                  <Link href="/stock-market" className="hover:text-secondary-container transition-colors">
                    Order Flow &amp; Tape
                  </Link>
                </li>
                <li>
                  <Link href="/companies" className="hover:text-secondary-container transition-colors">
                    Corporate Teardowns
                  </Link>
                </li>
                <li>
                  <Link href="/investing" className="hover:text-secondary-container transition-colors">
                    DCF Valuations
                  </Link>
                </li>
                <li>
                  <Link href="/trading" className="hover:text-secondary-container transition-colors">
                    Trading Systems
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-sm text-label-sm uppercase tracking-wider text-surface-container-lowest mb-4">
                Institutional
              </h4>
              <ul className="space-y-2.5 font-body-sm text-on-primary-container">
                <li>
                  <Link href="/pricing" className="hover:text-secondary-container transition-colors">
                    Tiered Pricing (₹59+)
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-secondary-container transition-colors">
                    Business PDFs &amp; Models
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-secondary-container transition-colors">
                    Strategic Mandate
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-secondary-container transition-colors">
                    Advisory Desk
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-secondary-container transition-colors">
                    Search Repository
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-sm text-label-sm uppercase tracking-wider text-surface-container-lowest mb-4">
                Security &amp; Portal
              </h4>
              <ul className="space-y-2.5 font-body-sm text-on-primary-container">
                <li>
                  <Link href="/login" className="hover:text-secondary-container transition-colors">
                    Learner Portal
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-secondary-container transition-colors">
                    Admin CMS Suite
                  </Link>
                </li>
                <li>
                  <span className="text-[11px] font-mono text-emerald-400 block mt-2">
                    &bull; 256-Bit SSL Secured
                  </span>
                </li>
                <li>
                  <span className="text-[11px] font-mono text-secondary-container block">
                    &bull; Razorpay Verified
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body-sm text-body-sm text-on-primary-container">
            &copy; {new Date().getFullYear()} FQore Executive Academy. All institutional rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-on-primary-container">
            <span>Core of Solutions</span>
            <span>&bull;</span>
            <Link href="/about" className="hover:text-secondary-container transition-colors">
              Terms &amp; Mandate
            </Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-secondary-container transition-colors">
              Advisory
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
