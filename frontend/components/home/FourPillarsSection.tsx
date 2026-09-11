'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Lightbulb, Award, Rocket, ArrowUpRight } from 'lucide-react';

const PILLARS = [
  {
    id: 'trading',
    title: 'Trading & Finance',
    tag: 'CORE DISCIPLINE',
    icon: TrendingUp,
    color: 'emerald',
    desc: 'Master price action mechanics, institutional candlestick footprints, 1% risk management, and market liquidity.',
    link: '/trading',
    stats: '50+ Setups • Live Video Breakdowns',
  },
  {
    id: 'business',
    title: 'Business Building',
    tag: 'REVENUE ENGINES',
    icon: Lightbulb,
    color: 'amber',
    desc: 'E-commerce startup blueprints, direct-to-consumer funnels, supplier negotiation, and unit economics that scale.',
    link: '/business',
    stats: 'Zero to ₹10L/Mo Roadmap',
  },
  {
    id: 'brand',
    title: 'Personal Brand',
    tag: 'DISTRIBUTION POWER',
    icon: Award,
    color: 'cyan',
    desc: 'Build asymmetric distribution and industry authority to attract opportunities, capital, and high-value clients.',
    link: '/case-studies',
    stats: 'Audience & Monetization Frameworks',
  },
  {
    id: 'growth',
    title: 'Execution & Growth',
    tag: 'COMPOUNDING RESULTS',
    icon: Rocket,
    color: 'amber',
    desc: 'Transform raw theoretical concepts into daily disciplined execution habits that compound long-term wealth.',
    link: '/resources',
    stats: 'Excel Models & Automated Journals',
  },
];

export const FourPillarsSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-black text-white overflow-hidden border-b border-white/10">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[11px] font-mono tracking-widest text-amber-400 uppercase mb-3">
            LEARN • PLAN • EXECUTE • BUILD • SCALE
          </div>

          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            THE FOUR PILLARS OF <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]">
              FQORE MASTERY
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light max-w-xl mx-auto">
            Practical Knowledge &bull; Real Strategies &bull; Lasting Growth
          </p>
        </div>

        {/* 4 Pillars Grid with 3D Perspective Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isAmber = pillar.color === 'amber';
            const isEmerald = pillar.color === 'emerald';

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative rounded-2xl bg-gradient-to-b from-[#111624]/90 to-[#080b12]/90 border border-white/10 hover:border-amber-500/50 p-6 flex flex-col justify-between group transition-all duration-300 shadow-xl backdrop-blur-xl"
              >
                {/* Glowing Top Accent Line */}
                <div
                  className={`absolute top-0 inset-x-6 h-[2px] rounded-full transition-opacity duration-300 ${
                    isAmber
                      ? 'bg-amber-400 opacity-30 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#f59e0b]'
                      : isEmerald
                      ? 'bg-emerald-400 opacity-30 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#10b981]'
                      : 'bg-cyan-400 opacity-30 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#06b6d4]'
                  }`}
                />

                <div>
                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-amber-500/40 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <Icon
                      className={`w-7 h-7 transition-colors ${
                        isAmber
                          ? 'text-amber-400'
                          : isEmerald
                          ? 'text-emerald-400'
                          : 'text-cyan-400'
                      }`}
                    />
                  </div>

                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
                    {pillar.tag}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                  <span className="text-[10px] font-mono text-amber-400/90 font-semibold">
                    {pillar.stats}
                  </span>
                  <Link
                    href={pillar.link}
                    className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-black transition-all"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Brand Mantra Banner matching page.jpeg */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 text-xs sm:text-sm font-mono tracking-widest text-slate-400">
            <span className="w-8 sm:w-16 h-[1px] bg-amber-500/40" />
            <span>NOT JUST KNOWLEDGE. <strong className="text-amber-400 font-bold">REAL SOLUTIONS.</strong></span>
            <span className="w-8 sm:w-16 h-[1px] bg-amber-500/40" />
          </div>
        </div>
      </div>
    </section>
  );
};
