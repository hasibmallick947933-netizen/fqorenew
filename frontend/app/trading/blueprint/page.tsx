'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { PaywallModal } from '@/components/ui/PaywallModal';

interface Chapter {
  id: number;
  title: string;
  page: string;
  category: string;
  summary: string;
  points: string[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Trading Fundamentals',
    page: '04',
    category: 'Foundations',
    summary: 'Understanding the stock market as an organized marketplace where buyers and sellers interact.',
    points: ['What is the Stock Market?', 'How Buyers and Sellers Interact', 'Exchanges: NSE, BSE', 'Investing vs Trading distinctions'],
  },
  {
    id: 2,
    title: 'Market Structure',
    page: '05',
    category: 'Price Action',
    summary: 'Reading market direction through swing highs and swing lows.',
    points: ['Uptrend: Higher Highs (HH) & Higher Lows (HL)', 'Downtrend: Lower Highs (LH) & Lower Lows (LL)', 'Sideways: Range-bound consolidation', 'Reading key swing inflection points'],
  },
  {
    id: 3,
    title: 'Candlestick Mastery',
    page: '06-07',
    category: 'Price Action',
    summary: 'Single-candle and multi-candle reversal signatures showing shifts in institutional control.',
    points: ['Anatomy of a candle (Open, High, Low, Close, Wick)', 'Single-candle signals: Hammer, Inverted Hammer, Shooting Star, Hanging Man, Doji', 'Multi-candle reversals: Bullish Engulfing, Bearish Engulfing, Morning Star, Evening Star, Harami'],
  },
  {
    id: 4,
    title: 'Support & Resistance',
    page: '08',
    category: 'Key Zones',
    summary: 'Price zones where buying or selling pressure has historically paused or reversed moves.',
    points: ['Resistance (Supply Zone) vs Support (Demand Zone)', 'Breakout mechanics', 'Retest confirmation (Old resistance becomes new support)', 'False Breakouts & Bull/Bear traps'],
  },
  {
    id: 5,
    title: 'Chart Patterns',
    page: '09-10',
    category: 'Patterns',
    summary: 'Recurring geometric price shapes formed by the ongoing battle between buyers and sellers.',
    points: ['Reversal Patterns: Head & Shoulders, Inverse H&S, Double Top, Double Bottom', 'Continuation Patterns: Ascending & Descending Triangles, Bullish & Bearish Flags, Wedges', '5-step rules for trading any pattern'],
  },
  {
    id: 6,
    title: 'Moving Averages',
    page: '11',
    category: 'Indicators',
    summary: 'Smoothing price into a single flowing trendline to identify directional momentum.',
    points: ['SMA (Simple Moving Average) vs EMA (Exponential Moving Average)', 'The MA Stack: 10 MA (Fast), 20 MA (Trend), 50 MA (Foundation)', 'Trend alignment protocols: "Trend is your friend — trade with it, not against it."'],
  },
  {
    id: 7,
    title: 'Volume Analysis',
    page: '12',
    category: 'Order Flow',
    summary: 'Volume measures conviction and institutional fuel behind price moves.',
    points: ['Volume contracts before expansion', 'Breakout + high volume validation', 'Reading Price + Volume together: 4 key matrix states', 'Volume absorption and climactic exhaustion'],
  },
  {
    id: 8,
    title: 'Technical Indicators',
    page: '13',
    category: 'Indicators',
    summary: 'Translating price and volume into simplified secondary confirmations.',
    points: ['RSI (Relative Strength Index): 70 overbought / 30 oversold calibration', 'MACD: EMA signal line crossovers & momentum histogram shifts', 'Bollinger Bands: Volatility squeezes preceding explosive expansion'],
  },
  {
    id: 9,
    title: 'Trading Strategy Framework',
    page: '14',
    category: 'Execution',
    summary: 'A repeatable 6-step sequence that turns trading from guesswork into a disciplined process.',
    points: ['1. Trend Direction -> 2. Pullback -> 3. Reference Level', '4. Confirmation Signal -> 5. Entry Trigger -> 6. Stop Loss & Target'],
  },
  {
    id: 10,
    title: 'Breakout Setup',
    page: '15',
    category: 'Setups',
    summary: 'Entering as price clears a well-defined level with strong institutional participation.',
    points: ['Clear resistance level with multiple prior touches', 'Tight consolidation forming just beneath the level', 'Volume expansion accompanying the breakout candle', 'Strong close near the high of the breakout candle'],
  },
  {
    id: 11,
    title: 'Pullback Setup',
    page: '16',
    category: 'Setups',
    summary: 'Joining an established trend at a favorable risk-reward price point.',
    points: ['Strong, established trend already in place', 'Controlled retracement — not a sharp reversal', 'Retracement lands near support zone or 20/50 MA', 'Confirmation candle signaling buyers stepping back in'],
  },
  {
    id: 12,
    title: 'Risk Management',
    page: '17',
    category: 'Capital Protection',
    summary: 'The true foundation of a trading career. Preserving capital to stay in the game.',
    points: ['Risk Per Trade: 1-2% of total capital maximum', 'Position Sizing Formula: Position Size = Risk Amount / Risk Per Share', 'Mandatory hard Stop-Loss without exception', 'Maximum Daily & Weekly loss circuit breakers'],
  },
  {
    id: 13,
    title: 'Risk / Reward & Expectancy',
    page: '18',
    category: 'Mathematics',
    summary: 'Why you do not need to win every trade to compound wealth over time.',
    points: ['Expectancy Formula: Expectancy = (Win% * Avg Win) - (Loss% * Avg Loss)', 'How a 40% win rate with 1:3 R:R yields +6R net profit over 10 trades', 'Consistency in process over outcome bias'],
  },
  {
    id: 14,
    title: 'Trading Psychology',
    page: '19',
    category: 'Mindset',
    summary: 'Mastering the 6 emotional traps: Fear, Greed, FOMO, Revenge Trading, Overconfidence, Impatience.',
    points: ['Why most trading losses trace to emotional errors, not bad setups', 'Patience: Waiting for setups to fully qualify', 'Discipline: Following the plan regardless of emotion', 'Loss Acceptance: Treating losses as a routine cost of doing business'],
  },
  {
    id: 15,
    title: 'Trading Journal',
    page: '20',
    category: 'Systems',
    summary: 'Turning raw market experience into structured, compounding learning.',
    points: ['Standard Journal Template: Date, Stock, Setup, Entry, Stop, Target, Size, Result, Emotion', 'Logging mistakes and identifying execution errors', 'Capturing the single golden lesson per trade'],
  },
  {
    id: 16,
    title: 'Backtesting & Practice',
    page: '21',
    category: 'Validation',
    summary: 'Testing strategies against historical data and paper trading before risking real capital.',
    points: ['Sample Size: Minimum 30-50 trades before drawing conclusions', 'Metrics: Win Rate, Average R, Maximum Drawdown', 'Forward testing on demo accounts for 2-4 weeks', 'Scaling up position sizing only after proven consistency'],
  },
  {
    id: 17,
    title: '30-Day Learning Roadmap',
    page: '22',
    category: 'Roadmap',
    summary: 'A structured 4-week month to build genuine trading competence.',
    points: ['Week 1: Market Structure, Candlestick Basics & Psychology', 'Week 2: Technical Analysis, Moving Averages & Volume', 'Week 3: Strategy Framework, Position Sizing & Backtesting', 'Week 4: Execution, Demo Testing & Daily Journaling'],
  },
  {
    id: 18,
    title: 'Trader Operating System',
    page: '23',
    category: 'Systems',
    summary: 'A repeatable daily rhythm that keeps execution consistent and emotion-free.',
    points: ['Before Market: Check sentiment, review watchlist, set daily loss limit', 'During Trade: Follow entry rules, set stop immediately, do not widen stops', 'After Trade: Log immediately, record emotional state, avoid revenge trades', 'Weekly Review: Calculate win rate and average R, refine one specific habit'],
  },
  {
    id: 19,
    title: 'Common Trader Problems & Solutions',
    page: '24',
    category: 'Troubleshooting',
    summary: '8 common trading pitfalls paired with their proven mechanical solutions.',
    points: ['Overtrading -> Set hard daily trade limits', 'No stop loss -> Define invalidation before entering, always', 'FOMO entries -> Wait for full candle close and setup confirmation', 'Revenge trading -> Immediate cool-down lockout after predefined loss'],
  },
  {
    id: 20,
    title: 'Personal Trading Plan',
    page: '25',
    category: 'Templates',
    summary: 'The fillable anchor that keeps decisions consistent when emotions run high.',
    points: ['Trading style & markets traded', 'Specific setups traded (Breakout vs Pullback)', 'Entry, stop-loss and target rules', 'Risk per trade & maximum daily loss limits'],
  },
  {
    id: 21,
    title: 'Master Trading Checklist',
    page: '26',
    category: 'Checklists',
    summary: 'The one-page executive reference to audit before every single trade.',
    points: ['Market structure and trend direction verified', 'Proper position sizing and stop-loss placed', 'Risk-reward ratio satisfies minimum 1:2', 'Emotions controlled and trading journal updated'],
  },
  {
    id: 22,
    title: 'The Final Word: Trade Smart. Grow Strong.',
    page: '27',
    category: 'Conclusion',
    summary: '“Trading is not about predicting every move. It is about managing risk, following a repeatable process, and improving over time.”',
    points: ['Learn -> Plan -> Execute -> Review -> Improve', 'FQore Core of Solutions graduation protocol', 'Educational reference and disciplined trading mindset'],
  },
];

export default function TradingBlueprintPage() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'syllabus' | 'viewer'>('syllabus');
  const [selectedChapter, setSelectedChapter] = useState<Chapter>(CHAPTERS[0]);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const receipt = localStorage.getItem('fqore_receipt_token');
      const unlocked = localStorage.getItem('fqore_unlocked_plans');
      if (receipt || unlocked || isAdmin) {
        setHasPaidAccess(true);
      }
    }
  }, [isAdmin]);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const receipt = typeof window !== 'undefined' ? localStorage.getItem('fqore_receipt_token') : null;
    const unlocked = typeof window !== 'undefined' ? localStorage.getItem('fqore_unlocked_plans') : null;

    if (!hasPaidAccess && !receipt && !unlocked && !isAdmin) {
      setPaywallOpen(true);
      return;
    }

    const link = document.createElement('a');
    link.href = '/FQore_Trading_Blueprint.pdf';
    link.setAttribute('download', 'FQore_Trading_Blueprint_2026.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-16 sm:py-24 min-h-screen bg-[#040813] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8">
          <Link href="/courses" className="hover:text-amber-400 transition-colors">
            Courses
          </Link>
          <span>/</span>
          <span className="text-[#fcd997]">Trading Blueprint</span>
        </div>

        {/* Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 pb-12 border-b border-white/10">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcd997]/15 border border-[#fcd997]/30 text-xs font-mono uppercase text-[#fcd997] shadow-sm">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              The FQore Education Series
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">
              TRADING BLUEPRINT
              <span className="block text-xl sm:text-2xl font-sans font-light text-slate-300 mt-2">
                From Beginner to Disciplined Trader (27-Page Master Guide)
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-slate-300 leading-relaxed font-light">
              A premium educational guide to technical analysis, risk management, and disciplined execution.
              Master the full 22-chapter curriculum: market structure, candlestick signatures, moving average stacks,
              expectancy mathematics, and the trader operating system.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleDownload}
                className="px-6 py-3.5 rounded-xl bg-[#fcd997] hover:bg-[#fad080] text-[#1a1200] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {hasPaidAccess ? 'download' : 'lock'}
                </span>
                <span>{hasPaidAccess ? 'Download 27-Page PDF' : 'Unlock & Download PDF (₹59)'}</span>
              </button>

              <button
                onClick={() => setActiveTab(activeTab === 'viewer' ? 'syllabus' : 'viewer')}
                className="px-6 py-3.5 rounded-xl border border-white/20 hover:border-[#fcd997] text-white hover:text-[#fcd997] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>{activeTab === 'viewer' ? 'View 22-Chapter Syllabus' : 'Interactive PDF Viewer'}</span>
              </button>
            </div>
          </div>

          {/* Book / PDF Cover Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl p-6 bg-gradient-to-br from-[#0c192c] to-[#060c18] border-2 border-[#fcd997]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-mono text-[#fcd997] mb-6">
                <span>FQore CORE OF SOLUTIONS</span>
                <span>27 PAGES</span>
              </div>

              <div className="space-y-3 py-6 text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto shadow-md ring-2 ring-[#fcd997]/40 bg-black flex items-center justify-center mb-4">
                  <img src="/images/fqore-circle-logo.png" alt="FQore Logo" className="w-full h-full object-cover scale-105" />
                </div>
                <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase block">
                  The FQore Education Series
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#fcd997] uppercase tracking-wider">
                  TRADING BLUEPRINT
                </h3>
                <p className="text-xs text-slate-300 font-light">
                  From Beginner to Disciplined Trader
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-mono text-slate-300 mt-4">
                  LEARN &bull; PLAN &bull; EXECUTE &bull; REVIEW &bull; IMPROVE
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Educational Reference Only</span>
                <span className="text-emerald-400">2026 Edition</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher: Interactive PDF Viewer vs 22-Chapter Study Guide */}
        {activeTab === 'viewer' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold text-white">
                Official PDF Document Viewer
              </h2>
              <button
                onClick={() => setActiveTab('syllabus')}
                className="text-xs font-mono text-[#fcd997] hover:underline"
              >
                &larr; Back to Chapter Syllabus
              </button>
            </div>

            <div className="w-full h-[800px] rounded-3xl overflow-hidden border border-white/15 bg-[#091222] shadow-2xl">
              <iframe
                src="/FQore_Trading_Blueprint.pdf#toolbar=1"
                className="w-full h-full border-none"
                title="FQore Trading Blueprint PDF"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-white">
                  22-Chapter Curriculum Breakdown
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Click any chapter to review its core tenets and mathematical framework.
                </p>
              </div>

              <div className="text-xs font-mono text-[#fcd997] hidden sm:block">
                22 Modules &bull; Complete PDF Ready
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chapters List */}
              <div className="lg:col-span-5 space-y-2 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {CHAPTERS.map((ch) => {
                  const isSelected = selectedChapter.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChapter(ch)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0d1e38] border-[#fcd997]/60 shadow-lg text-white'
                          : 'bg-[#060e1c] border-white/5 text-slate-300 hover:bg-[#0a172c] hover:border-white/10'
                      }`}
                    >
                      <span
                        className={`text-xs font-mono font-bold px-2 py-1 rounded-md shrink-0 ${
                          isSelected
                            ? 'bg-[#fcd997] text-slate-950'
                            : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        CH {ch.id < 10 ? `0${ch.id}` : ch.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-medium text-sm truncate">{ch.title}</h4>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            p. {ch.page}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{ch.summary}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Chapter Detail View */}
              <div className="lg:col-span-7 bg-[#091527] border border-[#fcd997]/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="px-3 py-1 rounded-md text-xs font-mono uppercase bg-[#fcd997]/15 text-[#fcd997] border border-[#fcd997]/30 font-bold">
                      Chapter {selectedChapter.id < 10 ? `0${selectedChapter.id}` : selectedChapter.id} &bull; Page {selectedChapter.page}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase">
                      Category: {selectedChapter.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-semibold text-white mb-4">
                    {selectedChapter.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-8 font-light">
                    {selectedChapter.summary}
                  </p>

                  <div className="space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#fcd997] block font-bold">
                      Key Concepts Covered:
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedChapter.points.map((pt, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200"
                        >
                          <span className="material-symbols-outlined text-[#fcd997] text-[18px] shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-8 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-mono text-slate-400">
                    Included in FQore Trading Blueprint (PDF)
                  </span>

                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 rounded-xl bg-[#fcd997] text-[#1a1200] font-bold text-xs uppercase tracking-wider hover:bg-[#fad080] transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {hasPaidAccess ? 'download' : 'lock'}
                    </span>
                    <span>{hasPaidAccess ? 'Download Full PDF' : 'Unlock PDF Pass'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onSuccess={() => {
          setHasPaidAccess(true);
          setPaywallOpen(false);
          alert('Payment confirmed! Initiating Trading Blueprint PDF download...');
          const link = document.createElement('a');
          link.href = '/FQore_Trading_Blueprint.pdf';
          link.setAttribute('download', 'FQore_Trading_Blueprint_2026.pdf');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      />
    </div>
  );
}
