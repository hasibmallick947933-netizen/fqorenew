'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Category, Content, ContentType } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Video,
  Image as ImageIcon,
  Sparkles,
  Save,
  ArrowLeft,
  Link2,
} from 'lucide-react';

interface ContentEditorFormProps {
  initialData?: Partial<Content>;
  isEdit?: boolean;
}

export const ContentEditorForm: React.FC<ContentEditorFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    contentType: (initialData?.contentType || 'article') as ContentType,
    category: (initialData?.category as any)?._id || (initialData?.category as any) || '',
    subcategory: initialData?.subcategory || '',
    tags: initialData?.tags ? initialData.tags.join(', ') : '',
    thumbnail: initialData?.thumbnail || '',
    mediaUrl: initialData?.mediaUrl || '',
    mediaDetails: initialData?.mediaDetails || {},
    externalUrl: initialData?.externalUrl || '',
    difficulty: initialData?.difficulty || 'Beginner',
    featured: initialData?.featured || false,
    published: initialData?.published !== undefined ? initialData.published : true,
    // Structured Company Analysis fields
    companyName: initialData?.structuredDetails?.companyName || '',
    ticker: initialData?.structuredDetails?.ticker || '',
    sector: initialData?.structuredDetails?.sector || '',
    industry: initialData?.structuredDetails?.industry || '',
    moats: initialData?.structuredDetails?.competitiveAdvantages?.join('\n') || '',
    risks: initialData?.structuredDetails?.risks?.join('\n') || '',
    // Structured Case Study fields
    problems: initialData?.structuredDetails?.problems || '',
    solutions: initialData?.structuredDetails?.solutions || '',
    lessonsLearned: initialData?.structuredDetails?.lessonsLearned?.join('\n') || '',
    // SEO
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
  });

  useEffect(() => {
    api.get<{ success: boolean; categories: Category[] }>('/categories')
      .then((res) => {
        setCategories(res.categories || []);
        if (!formData.category && res.categories?.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.categories[0]._id }));
        }
      })
      .catch(console.error);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setUploadProgress(`Uploading ${file.name} to Cloudinary...`);
    setErrorMsg('');

    try {
      const res = await api.uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        mediaUrl: res.media.secureUrl,
        mediaDetails: {
          originalName: res.media.originalName,
          cloudinaryPublicId: res.media.cloudinaryPublicId,
          format: res.media.format,
          size: res.media.size,
          mimeType: res.media.mimeType,
        },
      }));
      setUploadProgress('File uploaded successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'File upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setErrorMsg('');
    try {
      const res = await api.uploadFile(file);
      setFormData((prev) => ({ ...prev, thumbnail: res.media.secureUrl }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Thumbnail upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      contentType: formData.contentType,
      category: formData.category,
      subcategory: formData.subcategory,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      thumbnail: formData.thumbnail,
      mediaUrl: formData.mediaUrl,
      mediaDetails: formData.mediaDetails,
      externalUrl: formData.externalUrl,
      difficulty: formData.difficulty,
      featured: formData.featured,
      published: formData.published,
      structuredDetails: {
        companyName: formData.companyName,
        ticker: formData.ticker,
        sector: formData.sector,
        industry: formData.industry,
        competitiveAdvantages: formData.moats.split('\n').map((m) => m.trim()).filter(Boolean),
        risks: formData.risks.split('\n').map((r) => r.trim()).filter(Boolean),
        problems: formData.problems,
        solutions: formData.solutions,
        lessonsLearned: formData.lessonsLearned.split('\n').map((l) => l.trim()).filter(Boolean),
      },
      seoTitle: formData.seoTitle || formData.title,
      seoDescription: formData.seoDescription || formData.description,
    };

    try {
      if (isEdit && initialData?._id) {
        await api.put(`/content/id/${initialData._id}`, payload);
        setSuccessMsg('Educational material updated successfully!');
      } else {
        await api.post('/content', payload);
        setSuccessMsg('Educational material published to MongoDB successfully!');
      }

      setTimeout(() => {
        router.push('/admin/content');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Saving failed. Please check form inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Banner Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Core Format & Discipline */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold uppercase font-mono text-cyan-400">
          01. Publication Format & Classification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Content Format Type *
            </label>
            <select
              required
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value as ContentType })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="pdf">📄 PDF Document / E-Book Guide (.pdf)</option>
              <option value="video">🎥 Video Masterclass / Recording (.mp4 / Stream)</option>
              <option value="image">🖼️ Photo / Infographic / Chart (.png, .jpg, .webp)</option>
              <option value="excel">📊 Excel Financial Model (.xlsx / .xls)</option>
              <option value="article">📝 Written Article / Research Note</option>
              <option value="company_analysis">🏢 Company Equity Analysis</option>
              <option value="case_study">💼 Business Case Study</option>
              <option value="educational_note">📌 Educational Note / Cheatsheet</option>
              <option value="csv">📑 CSV Quantitative Dataset</option>
              <option value="market_analysis">📈 Market Analysis Report</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Taxonomy Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Subcategory / Topic Track
            </label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              placeholder="e.g. SaaS Economics, Semiconductors, Candlesticks"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Difficulty Tier
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced / Institutional</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Core Metadata */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold uppercase font-mono text-cyan-400">
          02. Title & Descriptions
        </h3>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
            Material Headline / Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. How Costco's Membership Model Generates Profit"
            className="w-full px-4 py-3 text-sm bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
            Executive Summary / Short Description *
          </label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Concise overview summarizing key takeaways and financial metrics..."
            className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
            Taxonomy Tags (Comma-separated)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="SaaS, Valuation, DCF, Price Action, Liquidity"
            className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* 3. Cloudinary File & Media Attachments */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase font-mono text-cyan-400">
            03. Cloudinary Uploads & Attachments
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            PDFs, Videos, Excels, CSVs, Images
          </span>
        </div>

        {/* Upload Button */}
        <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 text-center transition-colors bg-slate-950/40">
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <p className="text-xs text-slate-300 font-medium">
            Upload attachment to Cloudinary / Server (up to 50MB)
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-4">
            Supports PDF Documents (.pdf), Videos (.mp4, .mov), Photos &amp; Charts (.png, .jpg, .webp), and Excel Spreadsheets (.xlsx)
          </p>

          <label className="btn-chrome px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5">
            <span>Select File to Upload</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploadingFile}
            />
          </label>

          {uploadProgress && (
            <div className="mt-3 text-xs font-mono text-cyan-300">
              {uploadProgress}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Attached Media URL
            </label>
            <input
              type="text"
              value={formData.mediaUrl}
              onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
              placeholder="https://res.cloudinary.com/... or uploaded link"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Thumbnail Cover Image URL
            </label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/... or Cloudinary URL"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
            />
          </div>
        </div>
      </div>

      {/* 4. Structured Fields for Company Analysis */}
      {formData.contentType === 'company_analysis' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-5">
          <h3 className="text-sm font-bold uppercase font-mono text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> 04. Institutional Company Scorecard
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="NVIDIA Corporation"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Ticker Symbol
              </label>
              <input
                type="text"
                value={formData.ticker}
                onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
                placeholder="NVDA"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Sector
              </label>
              <input
                type="text"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                placeholder="Technology"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Semiconductors"
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Competitive Moats & Advantages (1 per line)
            </label>
            <textarea
              rows={3}
              value={formData.moats}
              onChange={(e) => setFormData({ ...formData, moats: e.target.value })}
              placeholder="CUDA developer lock-in&#10;Proprietary NVLink high-bandwidth interconnect&#10;Scale economies in datacenter DGX clusters"
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Key Risks (1 per line)
            </label>
            <textarea
              rows={3}
              value={formData.risks}
              onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
              placeholder="Custom hyperscaler ASICs (Google TPU, AWS Trainium)&#10;Geopolitical export restrictions"
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-[11px]"
            />
          </div>
        </div>
      )}

      {/* 5. Structured Fields for Case Study */}
      {formData.contentType === 'case_study' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-5">
          <h3 className="text-sm font-bold uppercase font-mono text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> 04. Case Study Retrospective Breakdown
          </h3>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Core Strategic Problem / Challenge
            </label>
            <textarea
              rows={2}
              value={formData.problems}
              onChange={(e) => setFormData({ ...formData, problems: e.target.value })}
              placeholder="Describe the initial threat, competition, or market disruption..."
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Strategic Pivot / Tactical Solution
            </label>
            <textarea
              rows={2}
              value={formData.solutions}
              onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
              placeholder="How the organization executed its turnaround or counter-attack..."
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Key Strategic Lessons (1 per line)
            </label>
            <textarea
              rows={3}
              value={formData.lessonsLearned}
              onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
              placeholder="Cannibalize your business before competitors do&#10;Own direct customer distribution relationships"
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-[11px]"
            />
          </div>
        </div>
      )}

      {/* 6. Body Content / Markdown Article */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase font-mono text-cyan-400">
            05. Full Body Educational Content (Markdown Supported)
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Headings, Lists, Quotes, Tables, Code Blocks
          </span>
        </div>

        <textarea
          rows={14}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="# Write educational analysis here...&#10;&#10;## Key Concept&#10;* Unit economics overview...&#10;* Margin analysis..."
          className="w-full px-4 py-3 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-[12px] leading-relaxed"
        />
      </div>

      {/* 7. Publishing & Visibility Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-800"
            />
            <span>Publish Immediately</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-800"
            />
            <span>Feature on Homepage Hero & Cards</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/content')}
            className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <Button type="submit" variant="chrome" size="md" loading={loading} showArrow>
            {isEdit ? 'Save Changes' : 'Publish Content to Platform'}
          </Button>
        </div>
      </div>
    </form>
  );
};
