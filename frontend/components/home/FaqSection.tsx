'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'What exactly do I get when I get the FQore Blueprint?',
    a: 'You get instant lifetime access to the complete 15-module curriculum, the 100+ page high-resolution PDF Blueprint, downloadable Excel models (automated trade journal, position sizing calculators, e-commerce unit economics), video walkthroughs, and all future content additions added by our analysts.',
  },
  {
    q: 'I am a complete beginner in trading. Will this work for me?',
    a: 'Yes! Module 1 starts from absolute ground zero: market structure, order books, and price delivery. We do not use confusing jargon without clear definitions. You will build a rock-solid foundation before moving into advanced price action formations.',
  },
  {
    q: 'Can I download the PDFs and Excel files to my phone and laptop?',
    a: 'Absolutely. All blueprints, checklists, and Excel spreadsheets (.xlsx, .csv) are 100% DRM-free and can be downloaded to any of your devices for offline study and daily market use.',
  },
  {
    q: 'Why are E-Commerce Startup and Business Strategies included alongside Trading?',
    a: 'Real wealth creation involves two engines: high-income business cash flow and disciplined capital allocation. Mastering business models and e-commerce gives you cash to invest, while trading ensures you manage and compound that capital with mathematical precision.',
  },
  {
    q: 'How do I access the materials after purchase?',
    a: 'Immediately upon checkout, your account receives instant access. You can view all content through our web reader or download the files with a single click. You will also receive an email confirmation with direct access links.',
  },
  {
    q: 'Is there any financial advice provided on FQore?',
    a: 'No. FQore is strictly an educational research platform. We provide methodologies, statistical frameworks, and analytical tools. We never provide stock tips, buy/sell recommendations, or guaranteed return claims.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative py-24 bg-black text-white overflow-hidden border-b border-white/10">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-bold uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
            EVERYTHING YOU NEED <span className="text-amber-400">TO KNOW</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Got questions? We have got transparent answers.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#090d18] border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? 'rotate-180 bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/10 px-5 sm:px-6 py-4 bg-[#060810]"
                    >
                      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
