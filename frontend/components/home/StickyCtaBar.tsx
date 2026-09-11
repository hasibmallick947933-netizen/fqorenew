'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowRight, Star } from 'lucide-react';

export const StickyCtaBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear after 500px scroll
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-[#090d18]/95 backdrop-blur-xl border-t border-amber-500/40 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 p-[1px] hidden sm:block shrink-0">
                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center font-black text-amber-400 text-sm">
                  FQ
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    FQore Trading & Business Blueprint
                  </h4>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    4.9/5
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                  Instant PDF & Video Access • Excel Models Included
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-base sm:text-xl font-black text-amber-400">₹99</span>
                  <span className="text-xs text-slate-500 line-through">₹499</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">
                  85% OFF
                </span>
              </div>

              <Link href="/pricing">
                <button className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all">
                  <span>Get Access</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black stroke-[3]" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
