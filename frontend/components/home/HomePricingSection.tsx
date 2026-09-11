'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plan } from '@/lib/types';
import { DEFAULT_PLANS } from '@/lib/constants';
import { PaywallModal } from '@/components/ui/PaywallModal';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';

interface HomePricingSectionProps {
  initialPlans?: Plan[];
}

export const HomePricingSection: React.FC<HomePricingSectionProps> = ({ initialPlans }) => {
  const plans = initialPlans && initialPlans.length > 0 ? initialPlans : DEFAULT_PLANS;
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('6aa3c900e4017433da625f4f');

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setPaywallOpen(true);
  };

  return (
    <section className="py-24 lg:py-32 border-b border-white/10 relative overflow-hidden bg-[#04060c]" id="pricing">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Scroll InView */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-xs font-mono uppercase text-amber-300 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Simple Transparent Access
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            UNLOCK THE <span className="text-amber-400">BLUEPRINT</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Zero recurring subscription traps. Pay once per tier and get immediate, permanent access to downloadable trading blueprints, business guides, and Excel models.
          </p>
        </motion.div>

        {/* 3 Pricing Cards (Starter ₹59, Growth ₹99, Premium ₹149) with Staggered Scroll Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-14">
          {plans.map((plan, idx) => {
            const isPopular = plan.popular || idx === 1;

            return (
              <motion.div
                key={plan._id || idx}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'border-2 border-amber-400 bg-gradient-to-b from-amber-950/30 via-[#0d121f] to-[#070b14] shadow-[0_0_40px_rgba(245,158,11,0.25)] md:-translate-y-2'
                    : 'border border-white/10 bg-[#0a0e19]/80 hover:border-white/20'
                }`}
              >
                {/* Most Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)] tracking-wider">
                    {plan.badge || 'Most Popular'}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                      Tier 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      Lifetime Access
                    </span>
                  </div>

                  <h3 className="text-2xl font-black uppercase text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-slate-800/80">
                    <span className="text-5xl font-black text-white font-mono">₹{plan.price}</span>
                    <span className="text-xs text-slate-400 font-mono">/ one-time</span>
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                      Included With This Tier:
                    </span>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <button
                    onClick={() => handleSelectPlan(plan._id)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isPopular
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:brightness-110'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-amber-500/50'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Get {plan.name} (₹{plan.price})</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Razorpay Trust Indicator Footer */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-around gap-6 text-center text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Razorpay 256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Instant Access Unlocked Upon Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Macro-Free Clean Excel & PDF Files</span>
          </div>
        </div>
      </div>

      {/* Paywall Checkout Modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onSuccess={() => {
          alert('Access confirmed! Your plan is now unlocked.');
        }}
      />
    </section>
  );
};
