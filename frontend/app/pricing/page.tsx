'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plan } from '@/lib/types';
import { PaywallModal } from '@/components/ui/PaywallModal';
import { DEFAULT_PLANS } from '@/lib/constants';

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [loading, setLoading] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get<{ success: boolean; plans: Plan[] }>('/plans');
      if (res.plans && res.plans.length > 0) {
        setPlans(res.plans);
      }
    } catch (err) {
      console.warn('Using default pricing tiers:', err);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanForModal(planId);
    setPaywallOpen(true);
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Header matching Executive Academy */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="material-symbols-outlined text-[15px]">lock</span>
            Direct Razorpay Access
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-surface-container-lowest tracking-tight mb-4 uppercase">
            Institutional Intelligence Tiers
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed font-light">
            Unlock verified business model breakdowns, downloadable forensic PDFs, and dynamic 3-statement Excel valuation sheets. Zero recurring subscription traps&mdash;pay once per tier.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-primary-container/40 border border-surface-container-lowest/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
            {plans.map((plan, idx) => (
              <div
                key={plan._id}
                className={`rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative transition-all duration-300 backdrop-blur-xl ${
                  plan.popular
                    ? 'bg-primary-container border-2 border-secondary-container shadow-[0_12px_40px_rgba(254,222,178,0.2)] md:-translate-y-2'
                    : 'bg-primary-container/80 border border-surface-container-lowest/15 hover:border-secondary-container/40 shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-label-sm uppercase tracking-wider font-bold bg-secondary-container text-on-secondary-container shadow-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    <span>{plan.badge || 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container block mb-2">
                    TIER 0{idx + 1}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest mb-2 uppercase">
                    {plan.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-surface-container-lowest/10">
                    <span className="text-4xl sm:text-5xl font-bold font-headline-lg text-surface-container-lowest">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs font-mono text-on-primary-container">
                      / one-time access
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container block mb-2">
                      Included Assets:
                    </span>
                    {plan.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 font-body-sm text-body-sm text-surface-container-lowest leading-relaxed"
                      >
                        <span className="material-symbols-outlined text-[18px] text-emerald-400 shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-container-lowest/10">
                  <button
                    onClick={() => handleSelectPlan(plan._id)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer ${
                      plan.popular
                        ? 'bg-secondary-container text-on-secondary-container hover:brightness-110 shadow-[0_4px_20px_rgba(254,222,178,0.25)]'
                        : 'bg-tertiary-container border border-surface-container-lowest/20 text-surface-container-lowest hover:border-secondary-container hover:bg-secondary-container/10'
                    }`}
                  >
                    <span>Unlock Plan for ₹{plan.price}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security & Verification Badges */}
        <div className="bg-primary-container/80 p-8 rounded-2xl border border-surface-container-lowest/15 flex flex-wrap items-center justify-around gap-6 text-center backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-400 text-[24px]">verified_user</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-surface-container-lowest">
              Razorpay Secure 256-Bit SSL
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary-container text-[24px]">bolt</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-surface-container-lowest">
              Instant Cloud Unlocking
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-cyan-400 text-[24px]">download_for_offline</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-surface-container-lowest">
              Verified Macro-Free Downloads
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Paywall Modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onSuccess={() => {
          alert('Payment confirmed! Your plan access is now active.');
        }}
      />
    </div>
  );
}
