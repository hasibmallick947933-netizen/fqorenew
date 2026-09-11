'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  FileSpreadsheet,
  Download,
  Lock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface BlueprintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlueprintPreviewModal: React.FC<BlueprintPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'excel' | 'cheatsheet'>('pdf');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
        {/* Modal Window with 3D Pop Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090d18] border border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(245,158,11,0.2)] overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#060810]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>FQore Trading & Business Blueprint</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                    SAMPLE PREVIEW
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Official Institutional Guidebook • PDF + Excel Datasets
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 px-6 bg-[#080b14] gap-4">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'pdf'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blueprint PDF Reader</span>
            </button>

            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'cheatsheet'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Candlestick Cheatsheet</span>
            </button>

            <button
              onClick={() => setActiveTab('excel')}
              className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'excel'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Position Sizing Simulator</span>
            </button>
          </div>

          {/* Body Viewer */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#04060d] space-y-6">
            {activeTab === 'pdf' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                  <span>Displaying executive excerpt from Chapter 2: The Institutional Order Flow & Liquidity Hunt.</span>
                  <a
                    href="/FQore_Trading_Blueprint.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold underline hover:text-white"
                  >
                    Open Full PDF <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Simulated Document Preview Page */}
                <div className="p-6 sm:p-8 rounded-xl bg-[#0a0f1d] border border-white/10 shadow-2xl space-y-4 font-sans text-sm text-slate-300 leading-relaxed">
                  <div className="flex justify-between border-b border-white/10 pb-4 text-xs font-mono text-slate-500">
                    <span>FQORE INSTITUTIONAL SERIES // 2026</span>
                    <span>SECTION: PRICE ACTION EXECUTION</span>
                  </div>

                  <h4 className="text-xl font-bold text-white tracking-tight">
                    Chapter 2.4: The 1% Asymmetric Risk Framework
                  </h4>

                  <p>
                    The difference between professional proprietary trading desks and the 90% of retail
                    traders who wipe out accounts lies entirely in risk allocation. Under no circumstance
                    should a single market idea risk more than <strong>1.0% of total equity</strong>.
                  </p>

                  <div className="p-4 rounded-lg bg-black/50 border border-white/10 font-mono text-xs text-emerald-400 space-y-1">
                    <div>Position Size (Shares) = Total Account Risk (\$) / [Entry Price - Stop Loss]</div>
                    <div>Target Profit = Minimum 3x Total Account Risk (1:3 Risk/Reward Ratio)</div>
                  </div>

                  <p>
                    By adhering strictly to a 1:3 ratio, even a trader with a modest <strong>35% win rate</strong> will
                    reliably compound positive net equity over a sequence of 100 executed trades.
                  </p>

                  {/* Blurred locked preview representing remainder of eBook */}
                  <div className="relative pt-6 border-t border-white/10">
                    <div className="filter blur-sm select-none opacity-40 space-y-3">
                      <p>
                        Institutions utilize liquidity voids to fill large buy blocks. When an aggressive market
                        maker sweeps the liquidity beneath previous swing lows, stops trigger instantaneously...
                      </p>
                      <p>
                        In the subsequent re-test of the Fair Value Gap (FVG), we place limit orders at the 50%
                        equilibrium level with our invalidation level placed 2 ticks below the lowest wick...
                      </p>
                    </div>

                    {/* Unlock Banner Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl p-4 text-center">
                      <Lock className="w-8 h-8 text-amber-400 mb-2" />
                      <h5 className="text-base font-bold text-white mb-1">
                        Unlock All 15 Modules & Full 100+ Pages
                      </h5>
                      <p className="text-xs text-slate-300 max-w-sm mb-4">
                        Get instant access to complete PDF blueprints, video lessons, and Excel models for just ₹99.
                      </p>
                      <Link href="/pricing" onClick={onClose}>
                        <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20">
                          <span>Get Full Access (₹99)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cheatsheet' && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white">
                  High-Probability Candlestick Edge Cheat Sheet
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#0e1322] border border-emerald-500/30">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Setup 01</span>
                    <h5 className="text-sm font-bold text-white mt-1">Bullish Liquidity Absorption Pin</h5>
                    <p className="text-xs text-slate-400 mt-1">
                      Lower wick 2.5x body length after a clean liquidity sweep. Confirms buyer dominance.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0e1322] border border-amber-500/30">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase">Setup 02</span>
                    <h5 className="text-sm font-bold text-white mt-1">Fair Value Gap (FVG) Retest</h5>
                    <p className="text-xs text-slate-400 mt-1">
                      Three-candle displacement leaving an unfilled price imbalance. Enter at 50% midpoint.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'excel' && (
              <div className="p-6 rounded-xl bg-[#0e1322] border border-white/10 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Interactive Position Sizer Preview</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Pre-configured Excel spreadsheet formulas calculating automated stop losses, lot sizing, and risk-to-reward ratios.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-black/60 text-slate-400 border-b border-white/10">
                        <th className="p-2 text-left">Metric</th>
                        <th className="p-2 text-right">Value</th>
                        <th className="p-2 text-left">Formula Logic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      <tr>
                        <td className="p-2 text-white">Account Capital</td>
                        <td className="p-2 text-right text-emerald-400">₹1,00,000</td>
                        <td className="p-2 text-slate-500">Base Capital Input</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-white">Risk Per Trade (1%)</td>
                        <td className="p-2 text-right text-amber-400">₹1,000</td>
                        <td className="p-2 text-slate-500">= Capital * 0.01</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-white">Target Profit (1:3)</td>
                        <td className="p-2 text-right text-emerald-400">₹3,000</td>
                        <td className="p-2 text-slate-500">= Risk * 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-[#060810] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Download upon Enrollment • Lifetime Updates</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close Preview
              </button>
              <Link href="/pricing" onClick={onClose}>
                <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-amber-500/20">
                  Get Full Blueprint (₹99)
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
