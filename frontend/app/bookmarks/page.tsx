'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { BookmarkItem, ProgressItem } from '@/lib/types';

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'progress'>('bookmarks');

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bmRes, progRes] = await Promise.all([
        api.get<{ success: boolean; bookmarks: BookmarkItem[] }>('/bookmarks'),
        api.get<{ success: boolean; progress: ProgressItem[] }>('/progress'),
      ]);
      setBookmarks(bmRes.bookmarks || []);
      setProgress(progRes.progress || []);
    } catch (err) {
      console.error('Error loading bookmarks/progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (contentId: string) => {
    try {
      await api.post(`/bookmarks/${contentId}`, {});
      setBookmarks((prev) => prev.filter((b) => b.content?._id !== contentId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  if (!user && !loading) {
    return (
      <div className="max-w-md mx-auto px-6 py-28 text-center bg-[#040813] text-slate-100 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary-container/10 border border-secondary-container/30 text-secondary-container flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[32px]">bookmark</span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-surface-container-lowest mb-2 uppercase">
          Sign In Required
        </h2>
        <p className="font-body-sm text-body-sm text-on-primary-container mb-6">
          You need an active learner account to save bookmarks and track learning progress.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 shadow-lg"
        >
          Sign In Now &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="material-symbols-outlined text-[15px]">bookmark</span>
            Personal Dashboard
          </div>
          <h1 className="font-headline-lg text-headline-lg text-surface-container-lowest tracking-tight mb-2 uppercase">
            Saved Content &amp; Learning Progress
          </h1>
          <p className="font-body-md text-body-md text-on-primary-container">
            Revisit your bookmarked case studies, valuation worksheets, and track module completions.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-3 mb-8 border-b border-surface-container-lowest/10 pb-4">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md'
                : 'text-on-primary-container hover:text-surface-container-lowest bg-primary-container border border-surface-container-lowest/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bookmark</span>
            Saved Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md'
                : 'text-on-primary-container hover:text-surface-container-lowest bg-primary-container border border-surface-container-lowest/10'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Module Progress ({progress.length})
          </button>
        </div>

        {/* Content list */}
        {activeTab === 'bookmarks' ? (
          bookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bm) => (
                <div
                  key={bm.bookmarkId}
                  className="bg-primary-container/85 border border-surface-container-lowest/10 hover:border-secondary-container/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-secondary-container/10 border border-secondary-container/30 text-secondary-container font-bold">
                        {bm.content?.contentType?.replace('_', ' ').toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleRemoveBookmark(bm.content?._id)}
                        className="text-on-primary-container hover:text-red-400 p-1"
                        title="Remove Bookmark"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>

                    <Link href={`/content/${bm.content?.slug}`}>
                      <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest hover:text-secondary-container transition-colors line-clamp-2 leading-snug mb-2">
                        {bm.content?.title}
                      </h3>
                    </Link>
                    <p className="font-body-sm text-body-sm text-on-primary-container line-clamp-2 mb-4">
                      {bm.content?.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-container-lowest/10 flex items-center justify-between text-xs font-mono text-on-primary-container">
                    <span>Saved {new Date(bm.savedAt).toLocaleDateString()}</span>
                    <Link
                      href={`/content/${bm.content?.slug}`}
                      className="text-secondary-container hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Study</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-dashed border-surface-container-lowest/15 bg-primary-container/40">
              <span className="material-symbols-outlined text-[48px] text-on-primary-container mx-auto mb-3 block">
                bookmark_border
              </span>
              <p className="font-headline-sm text-headline-sm text-surface-container-lowest">
                You haven&apos;t bookmarked any modules yet.
              </p>
              <Link
                href="/#curriculum-breakdown"
                className="mt-3 inline-block text-xs font-mono text-secondary-container hover:underline uppercase tracking-wider"
              >
                Browse Curriculum Tracks &rarr;
              </Link>
            </div>
          )
        ) : progress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.map((pr) => (
              <div
                key={pr._id}
                className="bg-primary-container/85 border border-surface-container-lowest/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        pr.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-secondary-container/10 text-secondary-container border border-secondary-container/30'
                      }`}
                    >
                      {pr.completed ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                    <span className="text-xs font-mono text-on-primary-container">
                      {pr.progressPercent}%
                    </span>
                  </div>

                  <Link href={`/content/${pr.contentId?.slug || ''}`}>
                    <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest hover:text-secondary-container transition-colors line-clamp-2 leading-snug mb-2">
                      {pr.contentId?.title || 'Course Module'}
                    </h3>
                  </Link>
                </div>

                <div className="pt-4 border-t border-surface-container-lowest/10">
                  <div className="w-full h-1.5 bg-tertiary-container rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-secondary-container transition-all"
                      style={{ width: `${pr.progressPercent}%` }}
                    />
                  </div>
                  <Link
                    href={`/content/${pr.contentId?.slug || ''}`}
                    className="text-xs font-mono text-secondary-container hover:underline flex items-center justify-between font-semibold"
                  >
                    <span>Resume Module</span>
                    <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border border-dashed border-surface-container-lowest/15 bg-primary-container/40">
            <span className="material-symbols-outlined text-[48px] text-on-primary-container mx-auto mb-3 block">
              history_edu
            </span>
            <p className="font-headline-sm text-headline-sm text-surface-container-lowest">
              No module progress tracked yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
