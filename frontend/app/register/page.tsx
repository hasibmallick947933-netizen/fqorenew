'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await register(name, email, password);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 min-h-[85vh] flex items-center justify-center relative overflow-hidden bg-[#040813] text-slate-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-container/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full mx-auto px-6 relative z-10">
        <div className="bg-primary-container/95 p-8 sm:p-10 rounded-2xl border border-surface-container-lowest/15 shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container/10 border border-secondary-container/30 text-secondary-container flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(254,222,178,0.2)]">
              <span className="material-symbols-outlined text-[28px]">person_add</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm text-surface-container-lowest tracking-tight uppercase">
              Create Student Profile
            </h1>
            <p className="font-body-sm text-body-sm text-on-primary-container mt-1.5">
              Join thousands of analysts mastering business models &amp; markets.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 mb-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-primary-container absolute left-3.5 top-1/2 -translate-y-1/2">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Vance"
                  className="w-full pl-11 pr-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-colors font-body-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-primary-container absolute left-3.5 top-1/2 -translate-y-1/2">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-11 pr-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-colors font-body-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-2">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-primary-container absolute left-3.5 top-1/2 -translate-y-1/2">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-colors font-body-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 shadow-[0_4px_20px_rgba(254,222,178,0.25)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
            </button>
          </form>

          <p className="text-center font-body-sm text-body-sm text-on-primary-container mt-6">
            Already have an active profile?{' '}
            <Link href="/login" className="text-secondary-container hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
