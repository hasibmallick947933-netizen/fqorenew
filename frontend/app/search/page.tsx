'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Content, Category } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [contentType, setContentType] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(1);

  const [results, setResults] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get<{ success: boolean; categories: Category[] }>('/categories')
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    executeSearch();
  }, [category, contentType, sortBy, page]);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append('search', query.trim());
      if (category) params.append('category', category);
      if (contentType) params.append('contentType', contentType);
      if (sortBy) params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', '9');

      const data = await api.get<{
        success: boolean;
        content: Content[];
        total: number;
        pages: number;
      }>(`/content?${params.toString()}`);

      setResults(data.content || []);
      setTotal(data.total || 0);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    executeSearch();
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setContentType('');
    setSortBy('popular');
    setPage(1);
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="material-symbols-outlined text-[15px]">search</span>
            Global Repository
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-surface-container-lowest tracking-tight mb-4 uppercase">
            Search The Ecosystem
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed font-light">
            Query across business models, company equity analyses, candlestick mechanics, and quantitative datasets.
          </p>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="relative">
            <span className="material-symbols-outlined text-[20px] text-secondary-container absolute left-4 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search keywords (e.g. 'Unit Economics', 'Order Flow', 'DCF', 'Microstructure')..."
              className="w-full pl-12 pr-32 py-4 bg-primary-container border border-surface-container-lowest/15 rounded-2xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 shadow-xl transition-all font-body-sm"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              Search
            </button>
          </div>
        </form>

        {/* Faceted Filter Bar */}
        <div className="bg-primary-container/90 p-4 rounded-2xl border border-surface-container-lowest/15 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category select */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-xs font-label-sm uppercase tracking-wider text-surface-container-lowest px-3 py-2.5 focus:outline-none focus:border-secondary-container cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Content Type select */}
            <select
              value={contentType}
              onChange={(e) => {
                setContentType(e.target.value);
                setPage(1);
              }}
              className="bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-xs font-label-sm uppercase tracking-wider text-surface-container-lowest px-3 py-2.5 focus:outline-none focus:border-secondary-container cursor-pointer"
            >
              <option value="">All Content Formats</option>
              <option value="article">Written Article</option>
              <option value="company_analysis">Company Analysis</option>
              <option value="case_study">Business Case Study</option>
              <option value="educational_note">Educational Note</option>
              <option value="video">Video Masterclass</option>
              <option value="excel">Excel Model</option>
              <option value="pdf">PDF Guide</option>
            </select>

            {/* Sort select */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-xs font-label-sm uppercase tracking-wider text-surface-container-lowest px-3 py-2.5 focus:outline-none focus:border-secondary-container cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Published</option>
              <option value="title">Title (A-Z)</option>
            </select>

            {(query || category || contentType) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-mono text-secondary-container hover:underline px-2 py-1 uppercase tracking-wider cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                Clear filters
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-on-primary-container">
            Found <span className="text-secondary-container font-bold">{total}</span> matching dossiers
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-60 rounded-2xl bg-primary-container/40 animate-pulse border border-surface-container-lowest/10"
              />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <Link key={item._id} href={`/content/${item.slug}`} className="group flex">
                  <div className="w-full bg-primary-container/85 border border-surface-container-lowest/10 hover:border-secondary-container/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold bg-secondary-container/10 border border-secondary-container/30 text-secondary-container">
                          {item.contentType.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-[11px] font-mono text-on-primary-container">
                          {item.category?.name}
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest group-hover:text-secondary-container transition-colors line-clamp-2 leading-snug mb-2">
                        {item.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-primary-container line-clamp-3 leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-surface-container-lowest/10 flex items-center justify-between text-[11px] text-on-primary-container font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{item.readTimeMinutes || 10} min read</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        <span>{item.views || 180} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider bg-primary-container border border-surface-container-lowest/15 text-surface-container-lowest disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs font-mono text-on-primary-container px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider bg-primary-container border border-surface-container-lowest/15 text-surface-container-lowest disabled:opacity-30 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-dashed border-surface-container-lowest/15 bg-primary-container/40">
            <span className="material-symbols-outlined text-[48px] text-on-primary-container mx-auto mb-3 block">
              search_off
            </span>
            <p className="font-headline-sm text-headline-sm text-surface-container-lowest">
              No dossiers match your search query.
            </p>
            <p className="font-body-sm text-body-sm text-on-primary-container mt-1">
              Try broadening your keywords or resetting search filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2.5 rounded-xl text-xs font-label-md uppercase tracking-wider text-secondary-container border border-secondary-container/30 hover:bg-secondary-container/10 transition-colors cursor-pointer"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
