'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await login(email, password);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      setEmail('fqorein@gmail.com');
      setPassword('sunny005');
    } else {
      setEmail('student@eduxchain.com');
      setPassword('Student@123456');
    }
  };

  return (
    <div className="py-16 sm:py-24 min-h-[85vh] flex items-center justify-center relative overflow-hidden bg-[#040813] text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-container/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full mx-auto px-6 relative z-10">
        <div className="bg-primary-container/95 p-8 sm:p-10 rounded-2xl border border-surface-container-lowest/15 shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container/10 border border-secondary-container/30 text-secondary-container flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(254,222,178,0.2)]">
              <span className="material-symbols-outlined text-[28px]">shield</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm text-surface-container-lowest tracking-tight uppercase">
              Learner &amp; Admin Portal
            </h1>
            <p className="font-body-sm text-body-sm text-on-primary-container mt-1.5">
              Sign in to manage curriculum or access your saved research repository.
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
                  placeholder="fqorein@gmail.com"
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
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-colors font-body-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 shadow-[0_4px_20px_rgba(254,222,178,0.25)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Platform'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-surface-container-lowest/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-on-primary-container block mb-2.5 text-center">
              Quick One-Click Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="px-3 py-2 text-[11px] font-mono rounded-xl bg-tertiary-container hover:bg-secondary-container/10 border border-secondary-container/30 text-secondary-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                Admin Mode
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="px-3 py-2 text-[11px] font-mono rounded-xl bg-tertiary-container hover:bg-surface-container-lowest/10 border border-surface-container-lowest/15 text-surface-container-lowest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">school</span>
                Student Mode
              </button>
            </div>
          </div>

          <p className="text-center font-body-sm text-body-sm text-on-primary-container mt-6">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-secondary-container hover:underline font-semibold">
              Create student profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
