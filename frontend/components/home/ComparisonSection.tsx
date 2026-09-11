'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, AlertTriangle, Trophy } from 'lucide-react';
import Link from 'next/link';

export const ComparisonSection: React.FC = () => {
  const points = [
    {
      retail: 'Trading on emotional intuition, tips from Telegram groups, and random Twitter calls.',
      fqore: 'Data-backed price action setups with predefined institutional entry, stop, and take-profit targets.',
    },
    {
      retail: 'Risking 20% to 50% of account per trade, leading to guaranteed account blowouts.',
      fqore: 'Mathematical 1% risk limit per trade with asymmetric minimum 1:3 Risk/Reward ratio.',
    },
    {
      retail: 'Relying on lagging indicators (RSI, MACD crossovers) that signal entries after the move happened.',
      fqore: 'Reading raw candlestick footprints, order books, and liquidity traps before retail crowd reacts.',
    },
    {
      retail: 'Zero record keeping, making the same emotional mistakes repeatedly.',
      fqore: 'Automated Excel Trading Journal tracking win rate, drawdown curves, and emotional discipline.',
    },
    {
      retail: 'Treating trading like a gamble with zero understanding of business economics.',
      fqore: 'Full mastery of business models, startup unit economics, and capital allocation.',
    },
  ];

  return (
    <section className="relative py-24 bg-[#060810] text-white overflow-hidden border-b border-white/10">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[11px] font-mono tracking-widest text-amber-400 uppercase mb-3">
            THE REALITY CHECK
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4">
            WHY 90% OF TRADERS LOSE <br />
            <span className="text-amber-400">VS. THE FQORE ADVANTAGE</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light">
            Compare the typical retail gambling mindset with the systematic institutional methodology you master inside FQore.
          </p>
        </div>

        {/* 2-Column Comparison Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left: The Losing Retail Approach */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-red-950/20 border border-red-500/30 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                    THE GUESSWORK TRAP
                  </span>
                  <h3 className="text-lg font-bold text-white">Trading Without a System</h3>
                </div>
              </div>

              <div className="space-y-4">
                {points.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      {p.retail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-center font-mono">
              Result: Depleted capital, frustration, and blown accounts.
            </div>
          </motion.div>

          {/* Right: The FQore Institutional Blueprint */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-gradient-to-br from-[#0c1322] to-[#070b14] border-2 border-amber-500/50 p-6 sm:p-8 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_25px_rgba(245,158,11,0.15)] relative overflow-hidden"
          >
            {/* Top Recommended Tag */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-black font-extrabold text-[10px] font-mono px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              THE PROVEN EDGE
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    SYSTEMATIC EXECUTION
                  </span>
                  <h3 className="text-lg font-bold text-white">The FQore Blueprint</h3>
                </div>
              </div>

              <div className="space-y-4">
                {points.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-slate-200 font-normal leading-relaxed">
                      {p.fqore}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link href="/pricing">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all">
                  Get The Blueprint (₹99)
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
