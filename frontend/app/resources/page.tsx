'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Content } from '@/lib/types';
import { useAuth } from '@/lib/authContext';
import { PaywallModal } from '@/components/ui/PaywallModal';

export default function ResourcesPage() {
  const { user, isAdmin } = useAuth();
  // Clean initialization with no mock business PDFs
  const [resources, setResources] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
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
      if (data.resources) {
        setResources(data.resources);
      } else {
        setResources([]);
      }
    } catch (err) {
      console.warn('Could not fetch resources:', err);
      setResources([]);
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
    { label: 'PDF Guides', value: 'pdf', icon: 'description' },
    { label: 'Excel (.xlsx)', value: 'excel', icon: 'table_chart' },
    { label: 'Photos / Charts', value: 'image', icon: 'image' },
    { label: 'Videos', value: 'video', icon: 'play_circle' },
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
            Download verified educational PDFs, video masterclasses, and photographic chart breakdowns published by the FQore editorial desk. All downloads require verified tier enrollment.
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
            {[1, 2, 3].map((n) => (
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
                          : item.contentType === 'image'
                          ? 'image'
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
                      {item.views || 1} views
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/content/${item.slug}`}
                      className="flex-1 text-center py-3 px-3 rounded-xl font-label-md text-label-md uppercase tracking-wider border border-[#d4af37]/40 text-[#fcd997] hover:bg-[#d4af37]/10 transition-all font-semibold"
                    >
                      Inspect
                    </Link>

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
          <div className="text-center py-16 px-6 rounded-3xl bg-[#0a1628] text-[#fcd997] border border-[#d4af37]/30 max-w-2xl mx-auto shadow-xl">
            <span className="material-symbols-outlined text-[56px] text-[#fcd997]/60 mx-auto mb-4 block">
              auto_stories
            </span>
            <h3 className="font-serif text-2xl font-semibold text-white mb-3">
              Institutional Business Dossiers
            </h3>
            <p className="text-sm text-[#fae8c8]/80 leading-relaxed mb-6 font-light max-w-lg mx-auto">
              All mock placeholder PDFs have been removed. The official 27-Page <strong>FQore Trading Blueprint</strong> is available directly within the <strong>Trading Course</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#fcd997] text-[#1a1200] font-bold text-xs uppercase tracking-wider hover:bg-[#fad080] transition-colors shadow-lg"
              >
                Access Trading Course &amp; Blueprint &rarr;
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/content/create"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#d4af37]/50 text-[#fcd997] font-semibold text-xs uppercase tracking-wider hover:bg-[#d4af37]/15 transition-colors"
                >
                  + Admin: Upload New PDF / Media
                </Link>
              )}
            </div>
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
