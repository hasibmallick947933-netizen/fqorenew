'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/Button';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Image as ImageIcon,
  Users,
  Shield,
  CreditCard,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040711]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-cyan-400">Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040711] px-4">
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-red-500/30 text-center max-w-md w-full">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase text-white mb-2">Restricted Admin Area</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            You must be authenticated as an Administrator to access the content management system.
          </p>
          <div className="space-y-3">
            <Link href="/login" className="block w-full">
              <Button variant="chrome" className="w-full">
                Sign in with Admin Credentials
              </Button>
            </Link>
            <Link href="/" className="block text-xs font-mono text-slate-500 hover:text-white">
              Return to Public Platform
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { name: 'Analytics', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Courses Manager', href: '/admin/courses', icon: FileText },
    { name: 'Pricing Plans', href: '/admin/plans', icon: CreditCard },
    { name: 'Content Manager', href: '/admin/content', icon: FileText, exact: true },
    { name: 'Create Content', href: '/admin/content/create', icon: PlusCircle },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'User Directory', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#040711] flex flex-col">
      {/* Top Admin Sub-Header */}
      <div className="bg-[#070b16] border-b border-cyan-500/20 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md ring-1 ring-[#cba258]/50 bg-black flex items-center justify-center">
              <img src="/images/fqore-circle-logo.png" alt="FQore Logo" className="w-full h-full object-cover scale-105" />
            </div>
            <span className="text-sm font-bold text-white font-mono tracking-tight hidden md:inline">
              FQ<span className="text-amber-400">ore</span>
            </span>
          </Link>
          <div className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-400 text-[10px] font-mono font-bold uppercase text-cyan-300">
            Admin Suite
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-white">{user.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Site
          </Link>
        </div>
      </div>

      {/* Admin Horizontal Tab Bar */}
      <div className="bg-[#050813] border-b border-slate-800 px-4 sm:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex gap-1 sm:gap-2">
          {adminNav.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 sm:px-4 py-3 text-xs font-mono flex items-center gap-2 border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-500/5'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}
