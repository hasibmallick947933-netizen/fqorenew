'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Plan } from '@/lib/types';
import { PaywallModal } from '@/components/ui/PaywallModal';
import { DEFAULT_PLANS } from '@/lib/constants';

interface PricingCardData {
  tierTag: string;
  badgeTag: string;
  name: string;
  description: string;
  price: number;
  isPopular?: boolean;
  popularBadge?: string;
  headerTagLeft: string;
  headerTagRight: string;
  features: { isHeader?: boolean; text: string; strongText?: string }[];
  buttonText: string;
  cardStyle: 'white' | 'dark-blue';
}

const PRICING_TIERS: PricingCardData[] = [
  {
    tierTag: 'STARTER TIER',
    badgeTag: 'Instant PDF',
    name: 'Beginner Plan',
    description: 'Essential foundational knowledge for aspiring traders & operators.',
    price: 59,
    headerTagLeft: 'STARTER TIER',
    headerTagRight: 'Instant PDF',
    features: [
      { text: ' Startup Business Models & Market Basics', strongText: '2 Core Playbook PDFs:' },
      { text: 'Weekly Pre-Market Macro Briefings Digest' },
      { text: 'Standard Financial Glossary & Metric Formulas' },
      { text: 'Community Discussion Forum Access' },
      { text: 'Instant High-Resolution PDF Download' },
    ],
    buttonText: 'GET BEGINNER PLAN (₹59)',
    cardStyle: 'white',
  },
  {
    tierTag: 'OPERATOR & TRADER TRACK',
    badgeTag: 'Includes Video',
    name: 'Growth Plan',
    description: 'For active investors, operators & founders seeking execution blueprints.',
    price: 99,
    isPopular: true,
    popularBadge: 'MOST POPULAR / BEST VALUE',
    headerTagLeft: 'OPERATOR & TRADER TRACK',
    headerTagRight: 'Includes Video',
    features: [
      { text: '', strongText: 'Everything in Beginner, plus:', isHeader: true },
      { text: 'Complete Startup Playbook + Equity Fundraising Guide (300+ Pages)' },
      { text: '10-Slide Institutional Pitch Deck Templates & Cap Table Models' },
      { text: 'Video Masterclass Access (Core 4 Modules)' },
      { text: 'Forensic Company Case Studies & Teardowns' },
      { text: 'Priority Community Room Access' },
    ],
    buttonText: 'UNLOCK GROWTH PLAN (₹99)',
    cardStyle: 'dark-blue',
  },
  {
    tierTag: 'C-SUITE SUITE',
    badgeTag: 'Full Institutional',
    name: 'Premium All-Access',
    description: 'Full institutional suite for serious traders, quants, and executives.',
    price: 149,
    headerTagLeft: 'C-SUITE SUITE',
    headerTagRight: 'Full Institutional',
    features: [
      { text: '', strongText: 'Everything in Growth, plus:', isHeader: true },
      { text: 'Live Trading Room Stream with Daily Order Flow & Gamma Levels' },
      { text: 'DCF Valuation & M&A Due Diligence Models (Excel + Sheets)' },
      { text: 'Full Video Masterclass Library (All 12+ Cohort Sessions)' },
      { text: '1-on-1 Q&A Desk Pass & Direct Mentor Office Hours' },
      { text: 'Lifetime Updates & All Future Dossiers Free' },
    ],
    buttonText: 'CLAIM PREMIUM ALL-ACCESS (₹149)',
    cardStyle: 'white',
  },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('6aa3c900e4017433da625f4f');
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

  const handleSelectPlan = (tierIndex: number) => {
    const plan = plans[tierIndex] || plans[0];
    if (plan?._id) {
      setSelectedPlanId(plan._id);
    }
    setPaywallOpen(true);
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Top Header matching exact screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-body-lg text-body-lg text-slate-300 leading-relaxed font-light">
            Institutional knowledge at an accessible starting price. One-time payment, direct lifetime PDF downloads,
            and zero recurring surprises.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {PRICING_TIERS.map((tier, idx) => {
            const isDarkBlue = tier.cardStyle === 'dark-blue';

            return (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 sm:p-9 flex flex-col justify-between relative transition-all duration-300 ${
                  isDarkBlue
                    ? 'bg-[#06111e] text-white border-2 border-[#fcd997]/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)] md:-translate-y-3'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-xl'
                }`}
              >
                {/* Floating Top Badge for Growth Plan */}
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#fcd997] text-[#382001] shadow-lg text-center whitespace-nowrap">
                    {tier.popularBadge}
                  </div>
                )}

                <div>
                  {/* Top Tags Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[11px] font-mono font-bold tracking-wider uppercase ${
                        isDarkBlue ? 'text-[#fcd997]' : 'text-slate-500'
                      }`}
                    >
                      {tier.headerTagLeft}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-1 rounded-md font-medium ${
                        isDarkBlue
                          ? 'bg-white/10 text-slate-200 border border-white/10'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tier.headerTagRight}
                    </span>
                  </div>

                  {/* Plan Title */}
                  <h3
                    className={`font-serif text-3xl font-medium mb-2 ${
                      isDarkBlue ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {tier.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isDarkBlue ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {tier.description}
                  </p>

                  {/* Price Box */}
                  <div
                    className={`rounded-2xl p-5 mb-8 flex items-baseline gap-1.5 ${
                      isDarkBlue
                        ? 'bg-white/5 border border-white/10'
                        : 'bg-slate-50 border border-slate-100/80'
                    }`}
                  >
                    <span
                      className={`text-4xl sm:text-5xl font-serif font-bold ${
                        isDarkBlue ? 'text-[#fcd997]' : 'text-slate-950'
                      }`}
                    >
                      ₹{plans[idx]?.price || tier.price}
                    </span>
                    <span
                      className={`text-xs font-sans ${
                        isDarkBlue ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      / one-time investment
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-sm leading-snug">
                        <span
                          className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                            isDarkBlue ? 'text-[#fcd997]' : 'text-slate-500'
                          }`}
                        >
                          check_circle
                        </span>
                        <span className={isDarkBlue ? 'text-slate-200' : 'text-slate-700'}>
                          {feat.strongText && (
                            <strong
                              className={`font-semibold ${
                                isDarkBlue ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {feat.strongText}
                            </strong>
                          )}
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-6 border-t border-slate-100/20">
                  <button
                    onClick={() => handleSelectPlan(idx)}
                    className={`w-full py-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-md ${
                      isDarkBlue
                        ? 'bg-[#fcd997] hover:bg-[#fad080] text-slate-950 shadow-lg'
                        : idx === 0
                        ? 'bg-[#e2e5eb] hover:bg-[#d4d8e0] text-slate-800'
                        : 'bg-black hover:bg-slate-900 text-white'
                    }`}
                  >
                    {tier.buttonText.replace(
                      `₹${tier.price}`,
                      `₹${plans[idx]?.price || tier.price}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Verification Badges */}
        <div className="bg-white text-slate-900 p-8 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-around gap-6 text-center shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[24px]">verified_user</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-slate-900 font-bold">
              Razorpay Secure 256-Bit SSL
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-600 text-[24px]">bolt</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-slate-900 font-bold">
              Instant Cloud Unlocking
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-cyan-600 text-[24px]">download_for_offline</span>
            <span className="font-label-md text-label-md uppercase tracking-wider text-slate-900 font-bold">
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
