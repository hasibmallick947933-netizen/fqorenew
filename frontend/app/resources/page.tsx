'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Content } from '@/lib/types';

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
  const [resources, setResources] = useState<Content[]>(DEFAULT_DOWNLOADS as any);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

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
        // Filter default downloads if API returns empty
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
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="material-symbols-outlined text-[15px]">cloud_download</span>
            Institutional Library
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-surface-container-lowest tracking-tight mb-4">
            Financial Models &amp; Resource Center
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed font-light">
            Download verified dynamic three-statement financial models, forensic accounting checklists, valuation worksheets, and macroeconomic datasets.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-primary-container/90 p-4 sm:p-5 rounded-2xl border border-surface-container-lowest/15 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {typePills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setTypeFilter(pill.value)}
                className={`px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
                  typeFilter === pill.value
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md'
                    : 'bg-tertiary-container border border-surface-container-lowest/10 text-on-primary-container hover:text-surface-container-lowest'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{pill.icon}</span>
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative w-full md:w-64">
              <span className="material-symbols-outlined text-[18px] text-on-primary-container absolute left-3.5 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container font-body-sm"
              />
            </form>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-xs font-label-sm uppercase tracking-wider text-surface-container-lowest px-3 py-2.5 focus:outline-none focus:border-secondary-container cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Downloaded</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-primary-container/40 border border-surface-container-lowest/10 animate-pulse"
              />
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item, idx) => (
              <div
                key={item._id}
                className="bg-primary-container/85 border border-surface-container-lowest/10 hover:border-secondary-container/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-secondary-container/10 border border-secondary-container/30 text-secondary-container">
                      <span className="material-symbols-outlined text-[14px]">
                        {item.contentType === 'excel' || item.contentType === 'csv'
                          ? 'table_chart'
                          : item.contentType === 'video'
                          ? 'play_circle'
                          : 'description'}
                      </span>
                      {item.contentType.toUpperCase()}
                    </span>

                    <span className="text-[11px] font-mono text-on-primary-container flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">folder_zip</span>
                      {formatBytes(item.mediaDetails?.size)}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest mb-2 leading-snug line-clamp-2 group-hover:text-secondary-container transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-primary-container line-clamp-3 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="pt-3 border-t border-surface-container-lowest/10 flex items-center justify-between text-[11px] text-on-primary-container font-mono">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      {item.views || 340} views
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/content/${item.slug}`}
                      className="flex-1 text-center py-2.5 px-3 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-tertiary-container border border-surface-container-lowest/15 text-surface-container-lowest hover:border-secondary-container transition-all"
                    >
                      Inspect Details
                    </Link>
                    {item.mediaUrl && (
                      <a
                        href={item.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="px-4 py-2.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-dashed border-surface-container-lowest/15 bg-primary-container/40">
            <span className="material-symbols-outlined text-[48px] text-on-primary-container mx-auto mb-3 block">
              folder_off
            </span>
            <p className="font-headline-sm text-headline-sm text-surface-container-lowest font-medium">
              No institutional resources match this filter.
            </p>
            <button
              onClick={() => {
                setTypeFilter('all');
                setSearch('');
              }}
              className="mt-3 text-xs font-mono text-secondary-container hover:underline uppercase tracking-wider"
            >
              Reset Filters &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
