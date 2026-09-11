'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PaywallModal } from '@/components/ui/PaywallModal';

interface CoursePricingTier {
  price: number;
  features: string[];
}

interface CourseItem {
  _id: string;
  title: string;
  slug: string;
  moduleNum: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  deliverables: string[];
  pricing: {
    starter: CoursePricingTier;
    growth: CoursePricingTier;
    premium: CoursePricingTier;
  };
}

const FALLBACK_COURSES: CourseItem[] = [
  {
    _id: 'c1',
    title: 'Unit Economics, SaaS Margins & Durable Moats',
    slug: 'unit-economics-saas-margins-moats',
    moduleNum: 'Core Module 01',
    description:
      'Examine the anatomical breakdown of recurring revenue engines. Master the mathematics of customer lifetime value (LTV), payback period optimization, and switching-cost moats.',
    category: 'Business Models',
    level: 'Executive',
    duration: '6.5 Hours Masterclass',
    deliverables: [
      '114-page Executive Dossier PDF',
      'Dynamic Cohort Retention Calculator (.xlsx)',
      '3 Real-World Startup Unit Teardowns',
      'Video Lecture: Scaling from 0 to ₹10Cr ARR',
    ],
    pricing: {
      starter: { price: 59, features: ['114-page Executive Dossier PDF', 'Web Reader Access'] },
      growth: { price: 99, features: ['Dossier PDF + Dynamic Cohort XLSX', 'Startup Unit Teardowns', 'Priority Email Support'] },
      premium: { price: 149, features: ['All Dossiers + Cohort XLSX + Video Lecture', 'Direct Editorial Q&A', 'Lifetime Revisions'] },
    },
  },
  {
    _id: 'c2',
    title: 'Microstructure, Order Flow & Institutional Liquidity Pools',
    slug: 'order-flow-microstructure-liquidity',
    moduleNum: 'Core Module 02',
    description:
      'Unpack how Tier-1 institutions conceal high-volume orders. Learn how to decode the consolidated tape, identify gamma squeezes, and trade along high-probability auction volume profiles.',
    category: 'Stock Market',
    level: 'Executive',
    duration: '8.0 Hours Masterclass',
    deliverables: [
      'Market Microstructure Primer (PDF)',
      'Volume Profile & Level 2 Cheatsheet',
      'Live Pre-Market Execution Rules',
      'Video Lecture: Institutional Tape Reading',
    ],
    pricing: {
      starter: { price: 59, features: ['Microstructure Primer PDF', 'Level 2 Cheatsheet'] },
      growth: { price: 99, features: ['Primer PDF + Tape Reading Guide', 'Volume Profile Templates', 'Trade Rules'] },
      premium: { price: 149, features: ['Complete Suite + Tape Reading Video Masterclass', 'Execution Playbook', 'Direct Q&A'] },
    },
  },
  {
    _id: 'c3',
    title: 'Corporate Teardowns & Forensic Revenue Autopsies',
    slug: 'corporate-teardowns-revenue-autopsies',
    moduleNum: 'Core Module 03',
    description:
      'Go behind glossy investor relations slide decks. We execute rigorous teardowns of conglomerate balance sheets, analyzing concealed liabilities, off-balance sheet SPVs, and real cash yields.',
    category: 'Companies',
    level: 'Executive',
    duration: '7.0 Hours Masterclass',
    deliverables: [
      '8 Enterprise Case Studies (PDF Teardowns)',
      'Working Capital Analyzer Spreadsheet',
      'Due Diligence Checklist (Institutional Grade)',
      'Video Lecture: Spotting Accounting Gimmicks',
    ],
    pricing: {
      starter: { price: 59, features: ['8 Enterprise Case Study Briefs (PDF)', 'Web Reader Access'] },
      growth: { price: 99, features: ['8 Case Studies + Working Capital Analyzer XLSX', 'Forensic Audit Checklist'] },
      premium: { price: 149, features: ['Full Case Studies + Working Capital XLSX + Video Lecture', 'Direct Advisory Access'] },
    },
  },
  {
    _id: 'c4',
    title: 'Discounted Cash Flow (DCF) & Sensitivity Valuation',
    slug: 'dcf-valuation-sensitivity-models',
    moduleNum: 'Core Module 04',
    description:
      'Build industrial-grade valuation models from raw financial statements. Master dynamic WACC calculations, terminal multiple assumptions, and Monte Carlo sensitivity ranges.',
    category: 'Investing & DCF',
    level: 'Executive',
    duration: '9.0 Hours Masterclass',
    deliverables: [
      'Automated 3-Statement Financial Model',
      'WACC & Beta Derivation Template',
      '2-Way Data Table Sensitivity Guide',
      'Video Lecture: Wall Street DCF Walkthrough',
    ],
    pricing: {
      starter: { price: 59, features: ['DCF Valuation Primer PDF', 'Beta Formula Guide'] },
      growth: { price: 99, features: ['Automated 3-Statement Model (.xlsx)', 'WACC Calculator', '2-Way Sensitivity Table'] },
      premium: { price: 149, features: ['Complete Financial Model Suite + Wall Street Walkthrough Video', 'Unrestricted Commercial Use'] },
    },
  },
  {
    _id: 'c5',
    title: 'Execution Mechanics & Algorithmic Setups',
    slug: 'execution-mechanics-algorithmic-setups',
    moduleNum: 'Core Module 05',
    description:
      'Transition from discretionary guessing to high-expectancy algorithmic rules. Structure systematic risk protocols, Kelly criterion position sizing, and maximum drawdown circuit breakers.',
    category: 'Trading Systems',
    level: 'Executive',
    duration: '7.5 Hours Masterclass',
    deliverables: [
      'Daily Trading Journal & Metrics Sheet',
      'Algorithmic Ruleset Playbook PDF',
      'Risk of Ruin & Monte Carlo Simulators',
      'Video Lecture: The Systematic Trader Mindset',
    ],
    pricing: {
      starter: { price: 59, features: ['Algorithmic Ruleset Playbook PDF', 'Position Sizing Rules'] },
      growth: { price: 99, features: ['Playbook PDF + Daily Trading Journal XLSX', 'Monte Carlo Simulators'] },
      premium: { price: 149, features: ['Complete Playbook + Journal + Mindset Video Masterclass', 'Direct Strategy Review'] },
    },
  },
  {
    _id: 'c6',
    title: 'Forensic Accounting & Corporate Failure Autopsies',
    slug: 'forensic-accounting-market-autopsies',
    moduleNum: 'Core Module 06',
    description:
      'Post-mortem examinations of high-profile corporate collapses and miraculous turnarounds. Discover the early-warning operational indicators that conventional equity analysts missed completely.',
    category: 'Case Studies',
    level: 'Executive',
    duration: '6.0 Hours Masterclass',
    deliverables: [
      '6 Complete Corporate Autopsy Briefs',
      'Red-Flag Forensic Audit Checklist',
      'Insider Trading & Buyback Tracker',
      'Video Lecture: The Anatomy of a Collapse',
    ],
    pricing: {
      starter: { price: 59, features: ['6 Corporate Autopsy Briefs (PDF)', 'Web Reader Access'] },
      growth: { price: 99, features: ['6 Autopsies + Red-Flag Forensic Audit Checklist', 'Insider Tracker Spreadsheet'] },
      premium: { price: 149, features: ['All 6 Autopsies + Audit Checklist + Anatomy of Collapse Video', 'Direct Case Q&A'] },
    },
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(FALLBACK_COURSES);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<CourseItem | null>(null);

  const categories = [
    'All',
    'Business Models',
    'Stock Market',
    'Companies',
    'Investing & DCF',
    'Trading Systems',
    'Case Studies',
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; courses: CourseItem[] }>('/courses');
      if (res.courses && res.courses.length > 0) {
        setCourses(res.courses);
      }
    } catch (err) {
      console.warn('Using default institutional courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleEnrollClick = (course: CourseItem) => {
    setActiveCourse(course);
    setCheckoutModalOpen(true);
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Header with High-Contrast Text */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="material-symbols-outlined text-[15px]">school</span>
            Executive Curriculum Catalog
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-surface-container-lowest tracking-tight mb-4">
            Institutional Syllabi &amp; Courses
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed font-light">
            Master the quantitative mechanics of equity markets, corporate balance sheet forensics, and recurring revenue models. Each syllabus features a comprehensive 3-tier access matrix.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-label-md uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md'
                  : 'bg-primary-container border border-surface-container-lowest/15 text-on-primary-container hover:text-surface-container-lowest'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid: White Dossier Cards for Crisp Contrast */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-stretch">
          {filteredCourses.map((course) => (
            <div
              key={course._id || course.slug}
              className="rounded-3xl bg-white text-slate-900 border border-slate-200/90 shadow-2xl p-8 sm:p-10 flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 relative group"
            >
              <div>
                {/* Module Badge & Level */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono uppercase font-bold bg-[#0d1c32] text-secondary-container">
                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                    {course.moduleNum}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">schedule</span>
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Course Title */}
                <h3 className="font-headline-sm text-headline-sm text-slate-950 mb-3 group-hover:text-amber-800 transition-colors">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="font-body-md text-body-md text-slate-600 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Deliverables Section */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-slate-500 block mb-3 font-bold">
                    Included Institutional Deliverables:
                  </span>
                  <div className="space-y-2">
                    {course.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3-Tier Pricing Preview Pills */}
                <div className="border-t border-slate-100 pt-5 mb-6">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-slate-500 block mb-3 font-bold">
                    Tiered Enrollment Options:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                      <div className="text-[10px] uppercase text-slate-500 font-bold">Starter</div>
                      <div className="text-base font-bold text-slate-900">
                        ₹{course.pricing?.starter?.price || 59}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300">
                      <div className="text-[10px] uppercase text-amber-800 font-bold">Growth (★)</div>
                      <div className="text-base font-bold text-amber-900">
                        ₹{course.pricing?.growth?.price || 99}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800">
                      <div className="text-[10px] uppercase text-amber-300 font-bold">Premium</div>
                      <div className="text-base font-bold text-white">
                        ₹{course.pricing?.premium?.price || 149}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => handleEnrollClick(course)}
                  className="flex-1 py-3.5 px-4 rounded-xl font-label-md text-label-md uppercase tracking-wider font-bold bg-[#0d1c32] text-secondary-container hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg"
                >
                  <span>Enroll in Course</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </button>
                <Link
                  href="/resources"
                  className="py-3.5 px-4 rounded-xl font-label-md text-label-md uppercase tracking-wider font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  View Dossiers
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-3xl bg-white text-slate-900 border border-slate-200 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-amber-800 block mb-2 font-bold">
            CURRICULUM ASSURANCE
          </span>
          <h2 className="font-headline-md sm:font-headline-lg text-headline-md sm:text-headline-lg text-slate-950 mb-4">
            Zero Recurring Subscriptions. Permanent Vault Access.
          </h2>
          <p className="font-body-md text-body-md text-slate-600 max-w-xl mx-auto mb-8">
            Every enrolled course grants permanent access to future module updates, forensic reports, and working Excel models.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-[#0d1c32] text-secondary-container font-bold hover:bg-slate-900 shadow-lg transition-all"
            >
              Compare All Access Plans &rarr;
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors font-semibold"
            >
              Institutional Inquiries
            </Link>
          </div>
        </div>
      </div>

      {/* 3-Tier Course Enrollment Paywall Modal */}
      <PaywallModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onSuccess={() => {
          alert('Enrollment confirmed! Your course access is now unlocked.');
        }}
      />
    </div>
  );
}
