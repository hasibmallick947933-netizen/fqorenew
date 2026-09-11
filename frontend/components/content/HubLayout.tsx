'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Content } from '@/lib/types';

interface HubLayoutProps {
  title: string;
  badge: string;
  description: string;
  subcategories: string[];
  initialContent: Content[];
}

export const HubLayout: React.FC<HubLayoutProps> = ({
  title,
  badge,
  description,
  subcategories,
  initialContent,
}) => {
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = initialContent.filter((item) => {
    const matchesSubcat =
      selectedSubcat === 'all' ||
      (item.subcategory && item.subcategory.toLowerCase() === selectedSubcat.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubcat && matchesSearch;
  });

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Hub Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
            {badge}
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-surface-container-lowest tracking-tight mb-4">
            {title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-10 border-b border-surface-container-lowest/10">
          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedSubcat('all')}
              className={`px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all shrink-0 ${
                selectedSubcat === 'all'
                  ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md'
                  : 'bg-primary-container border border-surface-container-lowest/15 text-on-primary-container hover:text-surface-container-lowest'
              }`}
            >
              All Topics
            </button>
            {subcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => setSelectedSubcat(subcat)}
                className={`px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all shrink-0 ${
                  selectedSubcat.toLowerCase() === subcat.toLowerCase()
                    ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md'
                    : 'bg-primary-container border border-surface-container-lowest/15 text-on-primary-container hover:text-surface-container-lowest'
                }`}
              >
                {subcat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined text-[18px] text-on-primary-container absolute left-3.5 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              placeholder="Search track..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-primary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container font-body-sm"
            />
          </div>
        </div>

        {/* Content Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, idx) => (
              <Link key={item._id} href={`/content/${item.slug}`} className="group flex">
                <div className="w-full bg-primary-container/85 border border-surface-container-lowest/10 hover:border-secondary-container/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 relative">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-secondary-container/10 border border-secondary-container/30 text-secondary-container">
                        <span className="material-symbols-outlined text-[14px]">description</span>
                        {item.contentType.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-lowest/5 text-on-primary-container uppercase">
                        {item.difficulty || 'Institutional'}
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest group-hover:text-secondary-container transition-colors line-clamp-2 leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-primary-container line-clamp-3 leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-container-lowest/10 flex items-center justify-between text-[11px] text-on-primary-container font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      <span>{item.readTimeMinutes || 12} min read</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>{item.views || 240} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-dashed border-surface-container-lowest/15 bg-primary-container/40">
            <span className="material-symbols-outlined text-[48px] text-on-primary-container mx-auto mb-3 block">
              menu_book
            </span>
            <p className="font-headline-sm text-headline-sm text-surface-container-lowest font-medium">
              No educational modules match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
