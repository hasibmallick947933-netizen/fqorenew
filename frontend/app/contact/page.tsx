'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await api.post('/public/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to deliver communication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Header matching Executive Academy */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-xs font-mono uppercase text-secondary-container mb-4 shadow-[0_0_15px_rgba(254,222,178,0.15)]">
            <span className="material-symbols-outlined text-[15px]">mail</span>
            Advisory Desk
          </div>
          <h1 className="font-headline-lg text-headline-lg sm:text-display-lg text-surface-container-lowest tracking-tight mb-4">
            Contact &amp; Institutional Inquiries
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed font-light">
            Reach out to our curriculum editorial board regarding corporate case study collaborations, technical questions, or curriculum suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact form */}
          <div className="lg:col-span-7">
            <div className="bg-primary-container/90 p-8 sm:p-10 rounded-2xl border border-surface-container-lowest/15 backdrop-blur-xl shadow-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest">
                    Communication Dispatched
                  </h3>
                  <p className="font-body-md text-body-md text-on-primary-container max-w-sm mx-auto">
                    Our analytical committee has received your dossier and will reply within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono text-secondary-container hover:underline uppercase tracking-wider pt-2"
                  >
                    Send another communication &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Johnathan Doe"
                        className="w-full px-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-all font-body-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-2">
                        Institutional Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@organization.com"
                        className="w-full px-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-all font-body-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Valuation Model Clarification or Case Study Proposal"
                      className="w-full px-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-all font-body-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-2">
                      Message Body
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your inquiry or feedback..."
                      className="w-full px-4 py-3 text-body-sm bg-tertiary-container border border-surface-container-lowest/15 rounded-xl text-surface-container-lowest placeholder:text-on-primary-container/40 focus:outline-none focus:border-secondary-container focus:ring-1 focus:ring-secondary-container/30 transition-all font-body-sm leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-label-md text-label-md uppercase tracking-wider bg-secondary-container text-on-secondary-container font-bold hover:brightness-110 shadow-[0_4px_20px_rgba(254,222,178,0.25)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Transmitting...' : 'Submit Communication'}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-primary-container/70 border border-surface-container-lowest/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/30 text-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
                </div>
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-surface-container-lowest">
                  Operations Base
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
                Global Distributed Research Team &bull; Institutional Analytics &amp; Education Division.
              </p>
            </div>

            <div className="bg-primary-container/70 border border-surface-container-lowest/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/10 border border-secondary-container/30 text-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">schedule</span>
                </div>
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-surface-container-lowest">
                  Response SLA
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
                We review submissions daily. All educational and analytical queries are answered within 24&ndash;48 hours.
              </p>
            </div>

            {/* Direct Channel */}
            <div className="bg-tertiary-container/80 border border-secondary-container/25 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container block mb-2">
                DIRECT SECURE DISPATCH
              </span>
              <p className="font-body-sm text-body-sm text-on-primary-container mb-4">
                For urgent institutional inquiries or corporate bulk enrollments:
              </p>
              <a
                href="mailto:fqorein@gmail.com"
                className="inline-flex items-center gap-2 text-sm font-mono text-secondary-container hover:underline"
              >
                <span>fqorein@gmail.com</span>
                <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
