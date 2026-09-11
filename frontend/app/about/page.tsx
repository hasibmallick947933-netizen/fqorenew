'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const principles = [
    {
      num: '01.',
      title: 'Decentralized & Open Knowledge',
      description:
        'Eliminating predatory paywalls and closed credentialing. Financial intelligence should be transparent, verifiable, and freely accessible to operators worldwide.',
      tag: 'Institutional Accessibility',
    },
    {
      num: '02.',
      title: 'Forensic Rigor Over Marketing Hype',
      description:
        'Every valuation model, company deep-dive, and price action case study is grounded in verifiable SEC filings, audited balance sheets, and empirical order flow data.',
      tag: 'Empirical Verification',
    },
    {
      num: '03.',
      title: 'Actionable Artifacts',
      description:
        'We believe in providing the actual raw tooling—dynamic three-statement financial models, Excel DCFs, and sensitivity tables—not just high-level theoretical prose.',
      tag: 'Production Tooling',
    },
    {
      num: '04.',
      title: 'Dynamic Continuous Evolution',
      description:
        'Powered by a modern database-driven architecture enabling ongoing expansion into new macro regimes, geopolitical cycles, and technology paradigms.',
      tag: 'Continuous Expansion',
    },
  ];

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Top Header matching Executive Academy */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
            Strategic Mandate
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-surface-container-lowest tracking-tight mb-6">
            Our Vision For The Future
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed font-light">
            FQore was founded to bridge the vast information asymmetry between institutional Wall Street trading desks and independent analysts, entrepreneurs, and students.
          </p>
        </div>

        {/* 4 Core Pillars with 01., 02. styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {principles.map((item) => (
            <div
              key={item.num}
              className="bg-primary-container/80 border border-surface-container-lowest/10 hover:border-secondary-container/40 rounded-2xl p-8 sm:p-10 shadow-xl backdrop-blur-xl transition-all duration-300 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-headline-md text-headline-md text-secondary-container font-bold">
                  {item.num}
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-primary-container px-2.5 py-1 rounded bg-surface-container-lowest/5 border border-surface-container-lowest/10">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest mb-3 group-hover:text-secondary-container transition-colors">
                {item.title}
              </h3>
              <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Executive Movement Banner */}
        <div className="rounded-3xl bg-tertiary-container/90 border border-secondary-container/30 p-8 sm:p-14 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-secondary-container/10 blur-[80px] pointer-events-none" />
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container block mb-3">
            ACADEMIC CHARTER
          </span>
          <h2 className="font-headline-md sm:font-headline-lg text-headline-md sm:text-headline-lg text-surface-container-lowest mb-4">
            Discover Our Educational Movement
          </h2>
          <p className="font-body-md text-body-md text-on-primary-container max-w-xl mx-auto mb-8">
            Access institutional models, corporate balance sheet autopsies, and macroeconomic frameworks built with quantitative precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#curriculum-breakdown"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 shadow-[0_4px_20px_rgba(254,222,178,0.25)] transition-all"
            >
              Explore Curriculum Syllabi &rarr;
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-primary-container border border-surface-container-lowest/20 text-surface-container-lowest hover:border-secondary-container transition-all"
            >
              Download Financial Models
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
