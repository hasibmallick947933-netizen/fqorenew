'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, Eye, Download, BookOpen, ShieldCheck, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface Blueprint3DMockupProps {
  onOpenPreview?: () => void;
}

export const Blueprint3DMockup: React.FC<Blueprint3DMockupProps> = ({ onOpenPreview }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt physics using Framer Motion springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-22, 22]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="relative w-full max-w-md mx-auto py-8 select-none flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Ambient Backlight Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-cyan-500/20 blur-3xl rounded-full scale-110 pointer-events-none" />

      {/* 3D Floating Interactive Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onOpenPreview}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.2 }}
        className="relative w-[300px] sm:w-[340px] h-[460px] sm:h-[500px] rounded-2xl bg-gradient-to-br from-[#121622] via-[#0b0e17] to-[#05070d] border-2 border-amber-500/40 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.25)] cursor-pointer group"
      >
        {/* Holographic Sheen Layer */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ transform: 'translateZ(30px)' }}
        />

        {/* 3D Book Spine Effect on Left */}
        <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-2xl bg-gradient-to-r from-amber-600/60 to-transparent border-r border-amber-500/30" />

        {/* Top Floating Badge */}
        <div
          className="flex items-center justify-between gap-2"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-[10px] font-mono font-bold tracking-wider text-amber-300">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>INSTITUTIONAL EDITION</span>
          </div>

          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            ★ 4.9/5
          </span>
        </div>

        {/* Center FQore Emblem & Title */}
        <div
          className="flex flex-col items-center justify-center my-6 text-center"
          style={{ transform: 'translateZ(50px)' }}
        >
          {/* Circular Logo Mark */}
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-[0_0_25px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/60 bg-black flex items-center justify-center mb-3">
            <img src="/images/fqore-circle-logo.png" alt="FQore Logo" className="w-full h-full object-cover scale-105" />
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tight text-white font-sans">
            FQ<span className="text-amber-400">ore</span>
          </h3>
          <p className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">
            Core of Solutions
          </p>

          <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3" />

          <div className="text-2xl font-black uppercase tracking-tight text-white leading-tight">
            TRADING <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">BLUEPRINT</span>
          </div>
          <p className="text-xs text-amber-300/90 mt-1 font-semibold tracking-wide uppercase">
            From Beginner to Disciplined Trader (27-Page Master Guide)
          </p>
        </div>

        {/* Feature Checkpoints */}
        <div
          className="space-y-1.5 text-[11px] text-slate-300 border-t border-b border-white/10 py-3 my-2"
          style={{ transform: 'translateZ(35px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>50+ High-Probability Trade Formations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Interactive Risk/Reward Calculators (.XLSX)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>From Zero to ₹10L/Mo E-Commerce Playbook</span>
          </div>
        </div>

        {/* Bottom Interactive Trigger Banner */}
        <div
          className="mt-auto flex items-center justify-between pt-2"
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 group-hover:text-amber-200 transition-colors">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Click to Preview Blueprint</span>
          </div>

          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all text-amber-300">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>

      {/* Floating 3D Satellite Badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3 -right-2 sm:-right-6 z-20 px-3.5 py-1.5 rounded-xl bg-[#0d121f]/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>INSTANT PDF ACCESS</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-4 -left-2 sm:-left-6 z-20 px-3.5 py-1.5 rounded-xl bg-[#0d121f]/90 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md"
      >
        <ShieldCheck className="w-4 h-4 text-amber-400" />
        <span>100% PRACTICAL KNOWLEDGE</span>
      </motion.div>
    </div>
  );
};
