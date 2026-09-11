'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Download, Star, Eye, Zap } from 'lucide-react';
import { Blueprint3DMockup } from './Blueprint3DMockup';
import { BlueprintPreviewModal } from './BlueprintPreviewModal';
import { Trading3DCanvas } from './Trading3DCanvas';

export const GrowthHeroSection: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-[#04060c] text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      {/* 1. 3D WebGL Canvas in Background responding to scroll */}
      <Trading3DCanvas />

      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,rgba(16,185,129,0.06)_45%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(4,6,12,0.85)_80%,#04060c_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Top Urgency Pill Banner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-emerald-500/15 border border-amber-500/35 backdrop-blur-md text-[11px] sm:text-xs font-mono text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="font-bold">FLASH SALE:</span>
            <span className="text-slate-300">Get Complete Blueprint at ₹99</span>
            <span className="bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded font-sans">
              85% OFF
            </span>
          </div>
        </motion.div>

        {/* Hero Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            {/* Social Proof Stars */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9/5</span>
              <span className="text-slate-400">&bull; Trusted by 2,800+ Active Traders & Founders</span>
            </div>

            {/* Main Headline styled like page.jpeg */}
            <div className="space-y-1 select-none">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]">
                BUILD YOUR <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]">
                  BETTER FUTURE
                  <span className="absolute -bottom-2 left-0 right-0 h-[4px] bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-80" />
                </span>
              </h1>
              <p className="text-sm sm:text-base font-mono tracking-widest text-amber-400/90 pt-3 uppercase">
                Practical Knowledge &bull; Real Strategies &bull; Lasting Growth
              </p>
            </div>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl leading-relaxed">
              Stop guessing market entries or blowing trading accounts. Learn the institutional price action
              setups, 1% risk management rules, and scalable e-commerce business engines used by top operators.
              Includes direct downloadable PDFs, Excel models, and video tutorials.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300 pt-2 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>50+ Price Action Formations</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero to ₹10L/Mo E-Com Blueprint</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Excel Risk Calculators</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant PDF & Video Downloads</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/pricing">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_10px_35px_rgba(245,158,11,0.35)] hover:scale-105 transition-all">
                  <span>Get Trading Blueprint (₹99)</span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[3]" />
                </button>
              </Link>

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-6 py-4 rounded-xl bg-[#0c101c] hover:bg-[#12182b] text-slate-200 border border-amber-500/30 hover:border-amber-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-black/40"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Preview Blueprint</span>
              </button>
            </div>

            {/* Assurance Note */}
            <p className="text-[11px] font-mono text-slate-400 pt-1">
              ⚡ Instant Download & Web Access &bull; 100% Risk-Free &bull; Educational Content Only
            </p>
          </motion.div>

          {/* Right Column: 3D Interactive Blueprint Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <Blueprint3DMockup onOpenPreview={() => setIsPreviewOpen(true)} />
          </motion.div>
        </div>
      </div>

      {/* Interactive Modal Preview */}
      <BlueprintPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
