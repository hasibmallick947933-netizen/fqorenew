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

        {/* 4 Core Pillars with Crisp White Surfaces for High Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {principles.map((item) => (
            <div
              key={item.num}
              className="bg-white text-slate-900 border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-headline-md text-headline-md text-amber-800 font-bold">
                  {item.num}
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-slate-600 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 font-semibold">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-slate-950 mb-3 group-hover:text-amber-800 transition-colors">
                {item.title}
              </h3>
              <p className="font-body-md text-body-md text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Executive Movement Banner: Crisp White Contrast */}
        <div className="rounded-3xl bg-white text-slate-900 border border-slate-200 p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-amber-800 block mb-3 font-bold">
            ACADEMIC CHARTER
          </span>
          <h2 className="font-headline-md sm:font-headline-lg text-headline-md sm:text-headline-lg text-slate-950 mb-4">
            Discover Our Educational Movement
          </h2>
          <p className="font-body-md text-body-md text-slate-600 max-w-xl mx-auto mb-8">
            Access institutional models, corporate balance sheet autopsies, and macroeconomic frameworks built with quantitative precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-[#0d1c32] text-secondary-container font-bold hover:bg-slate-900 shadow-xl transition-all"
            >
              Explore Courses &amp; Syllabi &rarr;
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 transition-all font-semibold"
            >
              Download Financial Models
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
