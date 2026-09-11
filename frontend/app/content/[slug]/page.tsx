'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { Content } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Eye,
  ArrowLeft,
  Share2,
  Download,
  FileSpreadsheet,
  FileText,
  Video as VideoIcon,
  Sparkles,
  Building2,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  Layers,
  Lock,
} from 'lucide-react';
import { PaywallModal } from '@/components/ui/PaywallModal';

export default function ContentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [content, setContent] = useState<Content | null>(null);
  const [related, setRelated] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    // Check if user has unlocked access via token or role
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('fqore_receipt_token') ||
        localStorage.getItem('fqore_unlocked_plans') ||
        localStorage.getItem('fqore_unlocked_token') ||
        localStorage.getItem('edux_unlocked_token');
      if (token || user?.role === 'admin') {
        setIsUnlocked(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (slug) {
      loadContent();
    }
  }, [slug]);

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await api.get<{
        success: boolean;
        content: Content;
        related: Content[];
      }>(`/content/${slug}`);
      setContent(data.content);
      setRelated(data.related || []);

      // Check if bookmarked in user profile
      if (user?.bookmarks?.includes(data.content._id)) {
        setBookmarked(true);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      alert('Please log in or register to bookmark content to your learning repository.');
      return;
    }
    if (!content) return;

    setBookmarkLoading(true);
    try {
      const res = await api.post<{ success: boolean; bookmarked: boolean }>(
        `/bookmarks/${content._id}`,
        {}
      );
      setBookmarked(res.bookmarked);
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!user) {
      alert('Please log in to track your course completions.');
      return;
    }
    if (!content) return;

    try {
      await api.post(`/progress/${content._id}`, {
        percent: 100,
        completed: true,
      });
      setCompleted(true);
    } catch (err) {
      console.error('Progress update failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-6 w-32 bg-slate-800 rounded mb-6" />
        <div className="h-12 w-3/4 bg-slate-800 rounded mb-4" />
        <div className="h-4 w-1/2 bg-slate-800 rounded mb-8" />
        <div className="h-96 bg-slate-900 rounded-2xl" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Content Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The requested publication could not be located.</p>
        <Link href="/">
          <Button variant="chrome">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={`/${content.category?.slug === 'business-models' ? 'business' : content.category?.slug || ''}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {content.category?.name || 'Curriculum'}
        </Link>

        {/* Content Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-md text-xs font-mono uppercase font-bold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              {content.contentType.replace('_', ' ')}
            </span>
            {content.subcategory && (
              <span className="px-2.5 py-0.5 rounded text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800">
                {content.subcategory}
              </span>
            )}
            <span className="text-xs font-mono text-cyan-400/80">
              {content.difficulty} Level
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight mb-6">
            {content.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 font-light">
            {content.description}
          </p>

          {/* Author, Stats & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-800 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">{content.authorName || 'Platform Research Desk'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {content.readTimeMinutes} min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                {content.views} views
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
                className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                  bookmarked
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Bookmark for later"
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                <span className="text-[11px]">{bookmarked ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleMarkCompleted}
                className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                  completed
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Mark track completed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px]">{completed ? 'Completed' : 'Complete'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Video Player (if video contentType) */}
        {content.contentType === 'video' && content.mediaUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-cyan-500/30 bg-black aspect-video relative shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <video
              src={content.mediaUrl}
              controls
              poster={content.thumbnail}
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video streaming.
            </video>
          </div>
        )}

        {/* Excel / CSV / PDF Download Card */}
        {['excel', 'csv', 'pdf'].includes(content.contentType) && (
          <div className="mb-12 p-6 sm:p-7 rounded-2xl glass-panel border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_25px_rgba(34,211,238,0.15)] relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shrink-0">
                {content.contentType === 'pdf' ? (
                  <FileText className="w-8 h-8" />
                ) : (
                  <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">
                    {content.contentType.toUpperCase()} Educational Asset
                  </span>
                  {!isUnlocked ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Premium Locked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked Access
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mt-0.5">
                  {content.mediaDetails?.originalName || content.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Format: {content.mediaDetails?.format || content.contentType} • Verified Institutional Material
                </p>
              </div>
            </div>

            {/* If unlocked, allow direct download. If locked, trigger Razorpay Paywall! */}
            {isUnlocked ? (
              <a
                href={content.mediaUrl || '/FQore_Trading_Blueprint.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn-chrome px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" /> Download Resource
              </a>
            ) : (
              <button
                onClick={() => setPaywallOpen(true)}
                className="btn-chrome px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                <Lock className="w-4 h-4 text-slate-900" />
                <span>Unlock PDF (from ₹59) ↗</span>
              </button>
            )}
          </div>
        )}

        {/* Structured Company Analysis Cards */}
        {content.contentType === 'company_analysis' && content.structuredDetails && (
          <div className="mb-12 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#080d1c] border border-cyan-500/20 font-mono text-xs">
              <div>
                <span className="text-slate-500 block">Company:</span>
                <span className="text-white font-bold">{content.structuredDetails.companyName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ticker:</span>
                <span className="text-cyan-400 font-bold">{content.structuredDetails.ticker || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sector:</span>
                <span className="text-white font-bold">{content.structuredDetails.sector || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Industry:</span>
                <span className="text-white font-bold">{content.structuredDetails.industry || 'N/A'}</span>
              </div>
            </div>

            {/* Moats */}
            {content.structuredDetails.competitiveAdvantages && content.structuredDetails.competitiveAdvantages.length > 0 && (
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-3">
                  <Sparkles className="w-4 h-4" /> Competitive Moats & Network Effects
                </div>
                <ul className="space-y-2">
                  {content.structuredDetails.competitiveAdvantages.map((moat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{moat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risks */}
            {content.structuredDetails.risks && content.structuredDetails.risks.length > 0 && (
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-wider mb-3">
                  <AlertTriangle className="w-4 h-4" /> Key Fundamental Risks
                </div>
                <ul className="space-y-2">
                  {content.structuredDetails.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-red-200 leading-relaxed">
                      <span className="text-red-400 font-mono">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Structured Case Study Cards */}
        {content.contentType === 'case_study' && content.structuredDetails && (
          <div className="mb-12 space-y-6">
            {content.structuredDetails.problems && (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" /> Strategic Dilemma & Challenge
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {content.structuredDetails.problems}
                </p>
              </div>
            )}

            {content.structuredDetails.solutions && (
              <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
                  <Lightbulb className="w-4 h-4" /> Tactical Execution & Pivot
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {content.structuredDetails.solutions}
                </p>
              </div>
            )}

            {content.structuredDetails.lessonsLearned && content.structuredDetails.lessonsLearned.length > 0 && (
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-3">
                  <Layers className="w-4 h-4" /> Core Strategic Lessons
                </div>
                <ul className="space-y-2">
                  {content.structuredDetails.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed text-sm sm:text-base border-b border-slate-800 pb-12 whitespace-pre-wrap font-sans">
          {content.content}
        </div>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <div className="py-6 border-b border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 mr-2">TAXONOMY:</span>
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Educational Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex items-center gap-3 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Content on this platform is for educational purposes only and should not be considered financial advice.
          </span>
        </div>

        {/* Related Content */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-800">
            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6">
              Related Research Modules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/content/${rel.slug}`}
                  className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                    {rel.contentType.replace('_', ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{rel.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{rel.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Paywall Checkout Modal */}
        <PaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onSuccess={(token) => {
            setIsUnlocked(true);
          }}
          targetTitle={content.title}
          contentId={content._id}
        />
      </div>
    </article>
  );
}
