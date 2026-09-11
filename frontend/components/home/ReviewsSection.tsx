'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Aarav Patel',
    role: 'Full-Time Equity Trader, Mumbai',
    rating: 5,
    highlight: 'Shifted from losing ₹40,000/month to consistent profitability.',
    text: 'The 1% risk management chapter and the automated Excel journal alone are worth 100x the price. I stopped blowing accounts because the entry rules are completely objective. FQore is legit.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tag: 'Verified Trader',
  },
  {
    name: 'Vikram Sengupta',
    role: 'E-Commerce Founder & Marketer, Bangalore',
    rating: 5,
    highlight: 'The E-Com Unit Economics sheet saved my D2C brand.',
    text: 'Most courses teach hype. FQore gave me the raw supplier negotiation templates, CAC payback formulas, and ROAS benchmarks. We scaled to ₹6.5L/month while staying net profitable.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tag: 'Verified Founder',
  },
  {
    name: 'Sneha Kulkarni',
    role: 'Financial Analyst & Swing Trader, Pune',
    rating: 5,
    highlight: 'Cleanest explanation of liquidity grabs and Fair Value Gaps.',
    text: 'I have read dozens of trading books, but FQore breaks down order flow mechanics with zero fluff. Being able to download the PDF blueprint and watch the video breakdowns made everything click.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    tag: 'Verified Student',
  },
  {
    name: 'Rohan Mehta',
    role: 'Software Engineer & Crypto Trader, Delhi',
    rating: 5,
    highlight: 'Trading psychology module cured my FOMO.',
    text: 'My biggest enemy was greed and over-leveraging. The drawdown mathematics table in Module 3 opened my eyes. Highly recommended for anyone serious about capital preservation.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tag: 'Verified Trader',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#05070e] text-white overflow-hidden border-b border-white/10">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>STUDENT SUCCESS STORIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4">
            REAL RESULTS FROM <br />
            <span className="text-amber-400">SERIOUS OPERATORS</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light">
            Read how traders and founders are using FQore frameworks to protect capital and build sustainable businesses.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl bg-[#0a0e19] border border-white/10 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{review.tag}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mb-2 text-slate-100">
                  &ldquo;{review.highlight}&rdquo;
                </h4>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mb-6">
                  {review.text}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                />
                <div>
                  <h5 className="text-sm font-bold text-white">{review.name}</h5>
                  <p className="text-[11px] text-slate-400 font-mono">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
