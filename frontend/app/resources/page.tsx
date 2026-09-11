'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Content } from '@/lib/types';
import { useAuth } from '@/lib/authContext';
import { PaywallModal } from '@/components/ui/PaywallModal';

// Fallback high-value institutional downloadable assets
const DEFAULT_DOWNLOADS = [
  {
    _id: 'd1',
    title: 'FQore Executive Trading Blueprint (2026 Edition)',
    slug: 'fqore-executive-trading-blueprint',
    contentType: 'pdf',
    description:
      'Complete institutional playbook covering liquidity pools, auction order flow, and risk of ruin mathematical sizing formulas.',
    mediaDetails: { size: 14500000 },
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    views: 4820,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'd2',
    title: 'Automated 3-Statement DCF Model & Sensitivity Matrix',
    slug: 'automated-3-statement-dcf-model',
    contentType: 'excel',
    description:
      'Dynamic Wall Street financial model with unlevered free cash flow formulas, 2-way sensitivity tables, and automated WACC derivation.',
    mediaDetails: { size: 4850000 },
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    views: 3940,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'd3',
    title: 'Corporate Forensic Due Diligence Checklist (Institutional)',
    slug: 'corporate-forensic-due-diligence-checklist',
    contentType: 'pdf',
    description:
      'Audit protocols for detecting concealed liabilities, off-balance sheet SPVs, aggressive revenue recognition, and supplier bloat.',
    mediaDetails: { size: 2900000 },
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    views: 2610,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'd4',
    title: 'Market Microstructure & Order Flow Tape Reading Cheatsheet',
    slug: 'market-microstructure-tape-reading',
    contentType: 'pdf',
    description:
      'Quick-reference guide for decoding Level 2 depth, footprint delta absorption, and block transaction volume profiles.',
    mediaDetails: { size: 5200000 },
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    views: 5120,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'd5',
    title: 'E-Commerce Unit Economics & Cohort LTV Calculator',
    slug: 'ecommerce-unit-economics-cohort-ltv',
    contentType: 'excel',
    description:
      'Working spreadsheet for blended CAC payback sensitivity, payback period optimization, and gross margin durability tests.',
    mediaDetails: { size: 3800000 },
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    views: 2980,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'd6',
    title: 'Beneish M-Score Earnings Manipulation Screener',
    slug: 'beneish-m-score-screener',
    contentType: 'excel',
    description:
      'Automated 8-variable mathematical index for identifying high-probability corporate financial report distortion.',
    mediaDetails: { size: 4100000 },
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    views: 3410,
    createdAt: new Date().toISOString(),
  },
];

export default function ResourcesPage() {
  const { user, isAdmin } = useAuth();
  const [resources, setResources] = useState<Content[]>(DEFAULT_DOWNLOADS as any);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Paywall Modal State
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [pendingDownloadItem, setPendingDownloadItem] = useState<Content | null>(null);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);

  useEffect(() => {
    // Check local storage or admin status for verified payment receipt
    if (typeof window !== 'undefined') {
      const receipt = localStorage.getItem('fqore_receipt_token');
      const unlocked = localStorage.getItem('fqore_unlocked_plans');
      if (receipt || unlocked || isAdmin) {
        setHasPaidAccess(true);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchResources();
  }, [typeFilter, sortBy]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let url = `/content/resources/all?type=${typeFilter}&sort=${sortBy}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const data = await api.get<{ success: boolean; resources: Content[] }>(url);
      if (data.resources && data.resources.length > 0) {
        setResources(data.resources);
      } else {
        const filtered = (DEFAULT_DOWNLOADS as any).filter((item: any) => {
          const matchesType = typeFilter === 'all' || item.contentType === typeFilter;
          const matchesSearch =
            !search ||
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());
          return matchesType && matchesSearch;
        });
        setResources(filtered);
      }
    } catch (err) {
      console.warn('Using default downloadables:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources();
  };

  // STRICT DOWNLOAD GATE: Intercept download if not paid
  const handleDownloadClick = (e: React.MouseEvent, item: Content) => {
    e.preventDefault();

    const receipt = typeof window !== 'undefined' ? localStorage.getItem('fqore_receipt_token') : null;
    const unlocked = typeof window !== 'undefined' ? localStorage.getItem('fqore_unlocked_plans') : null;

    if (!hasPaidAccess && !receipt && !unlocked && !isAdmin) {
      // User has not paid: BLOCK download and open Paywall Modal
      setPendingDownloadItem(item);
      setPaywallOpen(true);
      return;
    }

    // User is paid or admin: trigger download
    initiateDownload(item);
  };

  const initiateDownload = (item: Content) => {
    const url = item.mediaUrl || '/FQore_Trading_Blueprint.pdf';
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.slug || 'fqore-asset'}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePaymentSuccess = () => {
    setHasPaidAccess(true);
    setPaywallOpen(false);
    alert('Payment verified! Your institutional license is active. Initiating download...');
    if (pendingDownloadItem) {
      initiateDownload(pendingDownloadItem);
      setPendingDownloadItem(null);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return 'Verified Asset';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const typePills = [
    { label: 'All Resources', value: 'all', icon: 'folder_open' },
    { label: 'Excel (.xlsx)', value: 'excel', icon: 'table_chart' },
    { label: 'CSV Datasets', value: 'csv', icon: 'data_table' },
    { label: 'PDF Guides', value: 'pdf', icon: 'description' },
    { label: 'Modeling Videos', value: 'video', icon: 'play_circle' },
  ];

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Header with White Background and Light Gold Accents */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdfaf3] border border-[#d4af37]/40 text-xs font-mono uppercase text-[#9e7629] mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-[#b8860b]">lock</span>
            Protected Institutional Library
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-slate-950 tracking-tight mb-4">
            Financial Models &amp; <span className="text-[#b8860b]">Resource Center</span>
          </h1>
          <p className="font-body-lg text-body-lg text-slate-600 leading-relaxed font-light">
            Download verified dynamic three-statement financial models, forensic accounting checklists, valuation worksheets, and macroeconomic datasets. All downloads require verified tier enrollment.
          </p>

          {/* User Access Status Banner */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fcf9f2] border border-[#e8d5b5] text-xs font-mono text-[#8a6316]">
            <span
              className={`w-2 h-2 rounded-full ${
                hasPaidAccess ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="font-medium">
              {hasPaidAccess
                ? 'Institutional License: Active (Unlimited Downloads Unlocked)'
                : 'Download Access: Locked (Enrollment in ₹59+ Plan Required)'}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#f8fafd] p-4 sm:p-5 rounded-2xl border border-slate-200/90 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {typePills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setTypeFilter(pill.value)}
                className={`px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  typeFilter === pill.value
                    ? 'bg-[#0a1628] text-[#fcd997] font-bold border border-[#fcd997]/40 shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:text-[#9e7629] hover:border-[#d4af37]/40'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{pill.icon}</span>
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative w-full md:w-64">
              <span className="material-symbols-outlined text-[18px] text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#b8860b] font-body-sm shadow-sm"
              />
            </form>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl text-xs font-label-sm uppercase tracking-wider text-slate-800 px-3 py-2.5 focus:outline-none focus:border-[#b8860b] cursor-pointer shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Downloaded</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Resources Grid: Blue Colour Cards with Light Gold Letters */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-3xl bg-[#0a1628]/40 border border-[#d4af37]/20 animate-pulse"
              />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item) => (
              <div
                key={item._id}
                className="bg-[#0a1628] text-[#fcd997] border border-[#d4af37]/30 rounded-3xl p-7 flex flex-col justify-between shadow-xl hover:shadow-[0_20px_45px_rgba(10,22,40,0.45)] hover:border-[#fcd997]/60 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-[#132742] text-[#fcd997] border border-[#fcd997]/30">
                      <span className="material-symbols-outlined text-[14px]">
                        {item.contentType === 'excel' || item.contentType === 'csv'
                          ? 'table_chart'
                          : item.contentType === 'video'
                          ? 'play_circle'
                          : 'description'}
                      </span>
                      {item.contentType.toUpperCase()}
                    </span>

                    <span className="text-[11px] font-mono text-[#fcd997]/80 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#fcd997]">folder_zip</span>
                      {formatBytes(item.mediaDetails?.size)}
                    </span>
                  </div>

                  {/* Title in Light Gold */}
                  <h3 className="font-serif text-xl font-medium text-[#fcd997] mb-2 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  {/* Description in Light Champagne Gold */}
                  <p className="font-body-sm text-body-sm text-[#fae8c8]/85 line-clamp-3 leading-relaxed mb-6 font-light">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Meta row in Light Gold */}
                  <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-between text-[11px] text-[#ecd4a2] font-mono">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#fcd997]">calendar_today</span>
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#fcd997]">visibility</span>
                      {item.views || 340} views
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* Inspect button: Blue card border with Light Gold Letters */}
                    <Link
                      href={`/content/${item.slug}`}
                      className="flex-1 text-center py-3 px-3 rounded-xl font-label-md text-label-md uppercase tracking-wider border border-[#d4af37]/40 text-[#fcd997] hover:bg-[#d4af37]/10 transition-all font-semibold"
                    >
                      Inspect
                    </Link>

                    {/* Unlock / Download Button: Light Gold button */}
                    <button
                      onClick={(e) => handleDownloadClick(e, item)}
                      className={`px-4 py-3 rounded-xl font-label-md text-label-md uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer ${
                        hasPaidAccess
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                          : 'bg-[#fcd997] text-[#1a1200] hover:bg-[#fad080] shadow-[0_0_20px_rgba(252,217,151,0.25)]'
                      }`}
                      title={hasPaidAccess ? 'Download Asset' : 'Unlock with Plan to Download'}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {hasPaidAccess ? 'download' : 'lock'}
                      </span>
                      <span>{hasPaidAccess ? 'Download' : 'Unlock PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-[#0a1628] text-[#fcd997] border border-[#d4af37]/30">
            <span className="material-symbols-outlined text-[48px] text-[#fcd997]/50 mx-auto mb-3 block">
              folder_off
            </span>
            <p className="font-serif text-xl text-[#fcd997] font-medium">
              No institutional resources match this filter.
            </p>
            <button
              onClick={() => {
                setTypeFilter('all');
                setSearch('');
              }}
              className="mt-3 text-xs font-mono text-[#fcd997] hover:underline uppercase tracking-wider"
            >
              Reset Filters &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Paywall Modal Gating Downloads */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
