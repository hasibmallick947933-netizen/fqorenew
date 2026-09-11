'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  LineChart,
  ShieldCheck,
  ShoppingBag,
  Briefcase,
  FileSpreadsheet,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Video,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ModuleItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  duration: string;
  resources: string;
  lessons: {
    title: string;
    type: 'pdf' | 'video' | 'excel' | 'article';
    desc: string;
  }[];
}

const MODULES: ModuleItem[] = [
  {
    id: 'mod-1',
    badge: 'MODULE 01',
    title: 'Institutional Trading Foundations & Market Microstructure',
    subtitle: 'Understanding how markets truly work, order books, and institutional footprints.',
    icon: TrendingUp,
    color: 'emerald',
    duration: '2.5 Hours',
    resources: '3 PDF Cheatsheets + 1 Video Breakdown',
    lessons: [
      {
        title: 'Market Participants: Retail Traders vs. Institutional Market Makers',
        type: 'pdf',
        desc: 'Why 90% of retail traders lose money and how institutions manipulate order book liquidity.',
      },
      {
        title: 'Order Books, Level 2 Depth & Bid-Ask Spreads Explained',
        type: 'video',
        desc: 'Watch real order flow mechanics and understand where big volume clusters accumulate.',
      },
      {
        title: 'Market Structure: Higher Highs, Lower Lows & Shift in Character (CHoCH)',
        type: 'pdf',
        desc: 'Learn to define genuine trend changes without relying on lagging moving average crossovers.',
      },
    ],
  },
  {
    id: 'mod-2',
    badge: 'MODULE 02',
    title: 'Price Action Mastery, Candlestick Setups & Liquidity Sweeps',
    subtitle: 'The non-lagging visual framework for timing surgical entries and exits.',
    icon: LineChart,
    color: 'amber',
    duration: '3.5 Hours',
    resources: '1 Comprehensive PDF Guide + 5 Video Setups',
    lessons: [
      {
        title: 'High-Probability Candlestick Formations: Rejections, Hammers & Engulfing',
        type: 'pdf',
        desc: 'How to read buyer/seller aggression through candle wicks and body volume imbalances.',
      },
      {
        title: 'Liquidity Pools & Stop Hunt Recognition',
        type: 'video',
        desc: 'Identifying where retail stops cluster and how to enter right AFTER the trap occurs.',
      },
      {
        title: 'Fair Value Gaps (FVG) and Order Blocks Demystified',
        type: 'pdf',
        desc: 'Locate institutional footprints on any timeframe and execute high Risk/Reward setups.',
      },
    ],
  },
  {
    id: 'mod-3',
    badge: 'MODULE 03',
    title: 'Risk Management Protocols & Elite Trading Psychology',
    subtitle: 'The mathematical rules that guarantee longevity and emotional discipline in trading.',
    icon: ShieldCheck,
    color: 'emerald',
    duration: '2 Hours',
    resources: 'Interactive Excel Position Sizer + Psychology PDF',
    lessons: [
      {
        title: 'The Non-Negotiable 1% Rule and Asymmetric Risk/Reward (1:3+)',
        type: 'excel',
        desc: 'Interactive spreadsheet calculator: calculate exact lot/share size based on dollar risk.',
      },
      {
        title: 'Drawdown Math: Why Losing 50% Requires 100% Gain to Break Even',
        type: 'pdf',
        desc: 'Portfolio capital preservation protocols and maximum daily stop limits.',
      },
      {
        title: 'Overcoming FOMO, Revenge Trading, and Premature Profit Taking',
        type: 'pdf',
        desc: 'Tactical mental routines to execute with zero hesitation and complete emotional control.',
      },
    ],
  },
  {
    id: 'mod-4',
    badge: 'MODULE 04',
    title: 'E-Commerce Startup Playbook: From Zero to ₹10L/Month',
    subtitle: 'Step-by-step roadmap to launch, validate, and scale high-margin online brands.',
    icon: ShoppingBag,
    color: 'amber',
    duration: '4 Hours',
    resources: 'Supplier Database + P&L Financial Model (.XLSX)',
    lessons: [
      {
        title: 'Winning Product Selection & Demand Validation Framework',
        type: 'pdf',
        desc: 'Spotting high-margin problem-solving products before competitors saturate the niche.',
      },
      {
        title: 'Domestic & Global Sourcing, Negotiation, and Quality Control',
        type: 'video',
        desc: 'Direct supplier contact templates, MOQ reduction strategies, and shipment logistics.',
      },
      {
        title: 'High-Converting Store Architecture & Paid Acquisition Funnels',
        type: 'excel',
        desc: 'Shopify conversion rate optimization checklist, ROAS calculator, and unit economic spreadsheet.',
      },
    ],
  },
  {
    id: 'mod-5',
    badge: 'MODULE 05',
    title: 'Modern Business Strategies, Unit Economics & Corporate Moats',
    subtitle: 'How enduring companies build defensible revenue engines and scale sustainably.',
    icon: Briefcase,
    color: 'emerald',
    duration: '3 Hours',
    resources: 'Executive Strategy Workbook + Case Study Vault',
    lessons: [
      {
        title: 'Unit Economics Forensic: CAC, LTV, Gross Margin, and Payback Velocity',
        type: 'pdf',
        desc: 'Master the metrics venture capital firms scrutinize before backing any business.',
      },
      {
        title: 'The 5 Economic Moats: Network Effects, Switching Costs & Cost Advantages',
        type: 'pdf',
        desc: 'Case studies analyzing Apple, Amazon, and Nvidia competitive defenses.',
      },
      {
        title: 'Pricing Power & Asymmetric Pricing Strategies',
        type: 'article',
        desc: 'How to increase prices without alienating customers by engineering perceived value.',
      },
    ],
  },
  {
    id: 'mod-6',
    badge: 'MODULE 06',
    title: 'Resource Vault: Downloadable PDFs, Excel Calculators & Trade Journals',
    subtitle: 'Lifetime access to tools, templates, and reference materials you can use daily.',
    icon: FileSpreadsheet,
    color: 'amber',
    duration: 'Lifetime',
    resources: 'Instant Download of All Workbooks',
    lessons: [
      {
        title: 'Official FQore Trading Blueprint (High-Resolution 100+ Page PDF)',
        type: 'pdf',
        desc: 'Full offline handbook with visual candlestick setups, flowcharts, and trade rules.',
      },
      {
        title: 'Automated Trade Journal & Performance Analytics (.XLSX)',
        type: 'excel',
        desc: 'Log entries, win rate, profit factor, risk/reward ratios, and emotional notes automatically.',
      },
      {
        title: 'E-Commerce Unit Economics & Cash Flow Projection Model',
        type: 'excel',
        desc: 'Pre-built formulas for tracking ad spend, COGS, returns, gateway fees, and net profit margins.',
      },
    ],
  },
];

export const CurriculumSection: React.FC = () => {
  const [openModule, setOpenModule] = useState<string>('mod-1');

  const toggleModule = (id: string) => {
    setOpenModule(openModule === id ? '' : id);
  };

  return (
    <section className="relative py-20 bg-[#05070d] text-white overflow-hidden border-b border-white/10">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>STEP-BY-STEP ACADEMY CURRICULUM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4">
            WHAT YOU WILL <span className="text-amber-400">MASTER</span> INSIDE
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            No vague theory or unverified tips. Each module gives you exact tactical playbooks,
            downloadable tools, and institutional methodologies you can apply immediately.
          </p>
        </div>

        {/* Modules Accordion List */}
        <div className="space-y-4">
          {MODULES.map((mod, idx) => {
            const isOpen = openModule === mod.id;
            const Icon = mod.icon;
            const isAmber = mod.color === 'amber';

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0b0f19] border-amber-500/50 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.15)]'
                    : 'bg-[#080b14]/70 border-white/10 hover:border-white/20 hover:bg-[#0b0e1a]'
                }`}
              >
                {/* Header / Clickable Bar */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Icon Box */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        isAmber
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-400">
                          {mod.badge}
                        </span>
                        <span className="text-slate-600 text-xs">•</span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {mod.duration}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 hidden sm:block">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 mt-1 sm:mt-0">
                    <span className="text-[11px] font-mono text-slate-400 hidden md:block">
                      {mod.resources}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 px-5 sm:px-6 py-5 bg-[#070a13]"
                    >
                      <div className="space-y-3">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3 hover:bg-white/[0.05] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                              {lesson.type === 'pdf' && <FileText className="w-4 h-4" />}
                              {lesson.type === 'video' && <Video className="w-4 h-4" />}
                              {lesson.type === 'excel' && <FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                              {lesson.type === 'article' && <CheckCircle2 className="w-4 h-4" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                                  {lesson.title}
                                </span>
                                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                                  {lesson.type.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {lesson.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
