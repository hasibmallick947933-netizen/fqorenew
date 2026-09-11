const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Content = require('../models/Content');
const Plan = require('../models/Plan');

dotenv.config();

const seedDatabase = async () => {
  try {
    const existingCount = await Content.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} content items. Skipping auto-seed.`);
      return;
    }

    console.log('--- Seeding Initial Educational & Financial Content ---');

    // 1. Seed Users
    let adminUser = await User.findOne({ email: 'fqorein@gmail.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'FQore Administrator',
        email: 'fqorein@gmail.com',
        password: 'sunny005',
        role: 'admin',
        bio: 'Platform founder, institutional equity analyst and educational director.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      console.log('Created Admin user: fqorein@gmail.com');
    }

    let studentUser = await User.findOne({ email: 'student@eduxchain.com' });
    if (!studentUser) {
      studentUser = await User.create({
        name: 'Elena Rostova',
        email: 'student@eduxchain.com',
        password: 'Student@123456',
        role: 'user',
        bio: 'Finance student & algorithmic trading enthusiast.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
      console.log('Created Student user: student@eduxchain.com');
    }

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Business & Models',
        slug: 'business-models',
        description: 'Deconstructing modern revenue engines, unit economics, startup scaling, and operational moats.',
        icon: 'Briefcase',
        order: 1,
      },
      {
        name: 'Stock Market',
        slug: 'stock-market',
        description: 'Core equity market mechanics, index structures, order books, and institutional market participation.',
        icon: 'TrendingUp',
        order: 2,
      },
      {
        name: 'Company Analysis',
        slug: 'company-analysis',
        description: 'Granular fundamental equity breakdowns, moat assessments, balance sheet forensics, and competitive dynamics.',
        icon: 'Building2',
        order: 3,
      },
      {
        name: 'Investing',
        slug: 'investing',
        description: 'Value investing principles, DCF modeling, asset allocation, dividend compounding, and margin of safety.',
        icon: 'Coins',
        order: 4,
      },
      {
        name: 'Trading',
        slug: 'trading',
        description: 'Price action methodology, candlestick setups, support/resistance liquidity pools, and trading psychology.',
        icon: 'LineChart',
        order: 5,
      },
      {
        name: 'Case Studies',
        slug: 'case-studies',
        description: 'Empirical retrospectives of historic corporate triumphs, strategic pivots, and disruptive failures.',
        icon: 'FileText',
        order: 6,
      },
      {
        name: 'Market Analysis',
        slug: 'market-analysis',
        description: 'Macroeconomics, Federal Reserve policy, bond yield curve inversions, and sector rotation cycles.',
        icon: 'BarChart3',
        order: 7,
      },
      {
        name: 'Resources',
        slug: 'resources',
        description: 'Downloadable financial models, Excel valuation templates, PDF guides, and analytical cheat sheets.',
        icon: 'DownloadCloud',
        order: 8,
      },
      {
        name: 'E-Commerce Startup',
        slug: 'ecommerce-startup',
        description: 'Launching, sourcing, scaling D2C brands, marketplace dynamics, and unit economics.',
        icon: 'ShoppingBag',
        order: 9,
      },
    ];

    const catMap = {};
    for (const cat of categoriesData) {
      let catDoc = await Category.findOne({ slug: cat.slug });
      if (!catDoc) {
        catDoc = await Category.create(cat);
      }
      catMap[cat.slug] = catDoc._id;
    }

    // 3. Seed Realistic Content Items
    const sampleContent = [
      {
        title: 'How a B2B SaaS Company Scales from $0 to $100M ARR: Unit Economics & Capital Efficiency',
        slug: 'b2b-saas-scaling-0-to-100m-arr',
        description: 'An executive breakdown of the Rule of 40, CAC payback cycles, Net Retention Rate (NDR), and product-led vs sales-led growth playbooks.',
        contentType: 'article',
        category: catMap['business-models'],
        subcategory: 'SaaS Economics',
        tags: ['SaaS', 'Unit Economics', 'ARR', 'Venture Capital', 'Business Models'],
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        author: adminUser._id,
        authorName: adminUser.name,
        featured: true,
        published: true,
        views: 3420,
        bookmarkCount: 284,
        readTimeMinutes: 8,
        difficulty: 'Intermediate',
        content: `
# Anatomy of Hyper-Scale B2B SaaS

Scaling an enterprise software organization from inception to a hundred million dollars in annual recurring revenue requires mastery of fundamental financial mechanics rather than sheer capital burning.

## 1. The Core Metrics Trinity

Every institutional investor and operator monitors three non-negotiable vectors:

* **Net Revenue Retention (NDR)**: Top-quartile SaaS engines operate above **120% NDR**. This means that even without signing a single new logo, the business expands 20% annually purely from seat expansions and feature tier upgrades.
* **CAC Payback Period**: The number of months required to recoup the gross margin dollars invested in customer acquisition. Best-in-class enterprise models achieve payback in under **12 to 14 months**.
* **The Rule of 40**: A benchmark stating that an enterprise software firm's year-over-year revenue growth rate plus its free cash flow margin should meet or exceed 40%.

### Benchmark Matrix

| Metric | Median SaaS | Elite (Top 10%) | Red Flag |
| :--- | :--- | :--- | :--- |
| **Gross Margin** | 72% | 82%+ | < 60% |
| **CAC Payback** | 18 mos | < 12 mos | > 24 mos |
| **Net Churn** | 5% / yr | -15% (Net Expansion) | > 10% / yr |
| **Magic Number** | 0.8x | > 1.2x | < 0.5x |

## 2. Product-Led vs. Sales-Led Transition

At early scale ($0-$10M ARR), product-led growth (PLG) minimizes sales overhead. However, crossing the $50M milestone almost invariably demands an enterprise sales force capable of executing 6-figure ACV contracts with Fortune 500 compliance and security divisions.
        `,
        seoTitle: 'B2B SaaS Scaling & Unit Economics Masterclass',
        seoDescription: 'Comprehensive guide to scaling enterprise SaaS, NDR, CAC payback, and the Rule of 40.',
      },
      {
        title: 'Company Deep Dive: NVIDIA (NVDA) - Moats, CUDA Ecosystem, and the AI Infrastructure Monopoly',
        slug: 'nvidia-moats-cuda-ai-infrastructure-deep-dive',
        description: 'A deep institutional equity analysis of NVIDIA’s software ecosystem lock-in, data center revenue acceleration, and semiconductor gross margin dynamics.',
        contentType: 'company_analysis',
        category: catMap['company-analysis'],
        subcategory: 'Semiconductors',
        tags: ['NVIDIA', 'NVDA', 'Semiconductors', 'Artificial Intelligence', 'Equity Research'],
        thumbnail: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop&q=80',
        author: adminUser._id,
        authorName: adminUser.name,
        featured: true,
        published: true,
        views: 8940,
        bookmarkCount: 812,
        readTimeMinutes: 12,
        difficulty: 'Advanced',
        structuredDetails: {
          companyName: 'NVIDIA Corporation',
          ticker: 'NVDA',
          sector: 'Technology',
          industry: 'Semiconductors & Compute',
          businessModel: 'Fabless chip design, accelerated computing architectures, proprietary software stack (CUDA), and end-to-end data center systems (DGX SuperPODs).',
          revenueSources: [
            'Compute & Networking (Data Center AI accelerators: Hopper, Blackwell)',
            'Graphics (GeForce Gaming GPUs and workstations)',
            'Automotive & Robotics (Drive Orin platform)',
            'Enterprise Software Licensing (NVIDIA AI Enterprise, Omniverse)'
          ],
          competitiveAdvantages: [
            'CUDA Software Moat: 4+ million developers trained on CUDA; code written for CUDA cannot natively execute on AMD or custom ASICs.',
            'High-Bandwidth Interconnect: Mellanox InfiniBand and NVLink networking technology creating distributed clusters with zero latency bottlenecks.',
            'Massive R&D Compounding: Over $8B annual R&D expenditure outpacing competitors.'
          ],
          risks: [
            'Hyperscaler internal silicon (Google TPU, AWS Trainium, Meta MTIA, Microsoft Maia).',
            'Geopolitical export restrictions to strategic foreign markets.',
            'Cyclicality in tech infrastructure capex.'
          ],
          financialHighlights: 'Gross margins expanded beyond 75% on unprecedented data center demand. Free cash flow generation exceeding 50% of top-line revenue.',
          lessonsLearned: [
            'Building a hardware monopoly requires owning the foundational software ecosystem.',
            'Ten-year forward conviction in accelerated computing rewarded patience.'
          ]
        },
        content: `
# Institutional Analysis: NVIDIA Corporation (NASDAQ: NVDA)

NVIDIA is not merely a semiconductor vendor; it is a full-stack computing platform provider. The cornerstone of its dominance is not just silicon performance, but the proprietary CUDA software abstraction layer developed over nearly two decades.

## The Dual Moat: Silicon + Software
Competitors like AMD and Intel produce competitive raw FLOPs per dollar on paper, yet hyperscalers continue paying premiums for NVIDIA accelerators because migrating millions of lines of optimized PyTorch/TensorFlow pipelines away from CUDA incurs massive engineering friction.
        `,
        seoTitle: 'NVIDIA Equity Research Deep Dive & CUDA Moat Analysis',
        seoDescription: 'Detailed institutional breakdown of NVIDIA business model, competitive moats, and financial metrics.',
      },
      {
        title: 'Mastering Candlestick Patterns & Institutional Price Action',
        slug: 'mastering-candlestick-patterns-price-action',
        description: 'Learn how to read high-probability candlestick configurations in context of support/resistance, market structure, and liquidity traps.',
        contentType: 'educational_note',
        category: catMap['trading'],
        subcategory: 'Technical Analysis',
        tags: ['Trading', 'Candlesticks', 'Price Action', 'Liquidity', 'Risk Management'],
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
        author: adminUser._id,
        authorName: adminUser.name,
        featured: false,
        published: true,
        views: 5210,
        bookmarkCount: 430,
        readTimeMinutes: 7,
        difficulty: 'Beginner',
        content: `
# Candlestick Anatomy and Market Dynamics

A candlestick displays four vital data points for any timeframe: **Open, High, Low, and Close (OHLC)**.

## Key Reversal Formations

### 1. The Pin Bar / Hammer
* Characterized by a long lower wick (at least 2x the body size) and little to no upper shadow.
* **Market Narrative**: Sellers aggressively forced prices lower during the session, but buyers stepped in forcefully, absorbing all supply and driving price back near the highs.

### 2. Bullish & Bearish Engulfing
* A 2-candle setup where the body of candle 2 completely envelops the body of candle 1.
* Indicates an overwhelming shift in market sentiment and order flow imbalance.
        `,
      },
      {
        title: 'Business Case Study: Netflix - From Mail-Order DVDs to Global Streaming Dominance',
        slug: 'case-study-netflix-dvd-to-streaming-titan',
        description: 'How Reed Hastings outmaneuvered Blockbuster, cannibalized his own profitable DVD rental business, and funded billions in original IP.',
        contentType: 'case_study',
        category: catMap['case-studies'],
        subcategory: 'Strategic Disruption',
        tags: ['Netflix', 'Disruption', 'Streaming', 'Business Strategy', 'Case Study'],
        thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
        author: adminUser._id,
        authorName: adminUser.name,
        featured: true,
        published: true,
        views: 6120,
        bookmarkCount: 512,
        readTimeMinutes: 10,
        difficulty: 'Intermediate',
        structuredDetails: {
          companyName: 'Netflix, Inc.',
          ticker: 'NFLX',
          industry: 'Entertainment & Digital Media',
          businessModel: 'Direct-to-consumer subscription video on demand (SVOD) with tiered ad-supported and premium plans.',
          problems: 'Blockbuster commanded 9,000 retail storefronts with massive brand recognition and cash flow derived from late fees.',
          solutions: 'Netflix eliminated late fees entirely, utilized algorithmic recommendation queues (Cinematch), and proactively migrated to streaming before broadband was mainstream.',
          lessonsLearned: [
            'Willingness to cannibalize your existing core business before a competitor does is the highest form of strategic fortitude.',
            'Own your distribution and own the underlying intellectual property (Originals).'
          ]
        },
        content: `
# Netflix Strategy Retrospective: The Art of Asymmetric Warfare

In the late 1990s, Blockbuster generated substantial revenue from predatory late fees. Netflix identified this customer friction point and designed a subscription mail-order DVD model with zero due dates.

## The Streaming Inflection
When streaming bandwidth became viable, Netflix invested aggressively in cloud streaming delivery and subsequent content production (House of Cards, Stranger Things), transforming from a content aggregator to one of the world's most valuable studio systems.
        `,
      },
      {
        title: 'Discounted Cash Flow (DCF) Valuation Masterclass: Interactive Modeling Video',
        slug: 'dcf-valuation-masterclass-video-guide',
        description: 'Watch step-by-step walkthrough of projecting unlevered free cash flows, estimating Terminal Value, and calculating WACC.',
        contentType: 'video',
        category: catMap['investing'],
        subcategory: 'Valuation',
        tags: ['DCF', 'Valuation', 'WACC', 'Financial Modeling', 'Corporate Finance'],
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        author: adminUser._id,
        authorName: adminUser.name,
        featured: false,
        published: true,
        views: 7420,
        bookmarkCount: 680,
        readTimeMinutes: 15,
        difficulty: 'Advanced',
        content: `
# Step-by-Step Discounted Cash Flow Modeling

This comprehensive video tutorial covers:
1. Historical revenue normalization
2. Operating working capital (NWC) projections
3. Capital expenditure (CapEx) schedules and depreciation
4. Calculating Weighted Average Cost of Capital (WACC) via Capital Asset Pricing Model (CAPM)
5. Gordon Growth Model vs. Exit Multiple Method for Terminal Value
        `,
      },
      {
        title: 'Institutional Financial Model & Valuation Template (Excel .xlsx)',
        slug: 'institutional-financial-model-valuation-template',
        description: 'Professional-grade 3-statement integrated financial model with DCF, LBO sensitivity matrices, and WACC calculator.',
        contentType: 'excel',
        category: catMap['resources'],
        subcategory: 'Financial Templates',
        tags: ['Excel', 'Financial Modeling', 'Templates', 'DCF', '3-Statement'],
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
        mediaUrl: 'https://raw.githubusercontent.com/datasets/gdp/master/data/gdp.csv',
        mediaDetails: {
          originalName: 'Institutional_Valuation_Model_v3.xlsx',
          format: 'xlsx',
          size: 245000,
        },
        author: adminUser._id,
        authorName: adminUser.name,
        featured: true,
        published: true,
        views: 9230,
        bookmarkCount: 1420,
        readTimeMinutes: 5,
        difficulty: 'Intermediate',
        content: `
# Downloadable Enterprise Model

This workbook includes fully dynamic formula architecture:
* Integrated Income Statement, Balance Sheet, and Cash Flow Statement
* Automated debt sweep mechanics and revolver interest calculations
* Scenario manager (Base, Bear, Bull cases)
* Sensitivity table heatmaps
        `,
      },
      {
        title: 'Complete Financial Statement Forensics & Ratio Checklist (PDF)',
        slug: 'financial-statement-forensics-checklist-pdf',
        description: 'Comprehensive 42-point audit checklist for detecting aggressive revenue recognition, off-balance-sheet liabilities, and inventory anomalies.',
        contentType: 'pdf',
        category: catMap['resources'],
        subcategory: 'PDF Guides',
        tags: ['PDF', 'Forensics', 'Accounting', 'Checklist', 'Ratios'],
        thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
        mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        mediaDetails: {
          originalName: 'Financial_Forensics_Checklist.pdf',
          format: 'pdf',
          size: 1420000,
        },
        author: adminUser._id,
        authorName: adminUser.name,
        featured: false,
        published: true,
        views: 4890,
        bookmarkCount: 780,
        readTimeMinutes: 6,
        difficulty: 'Intermediate',
        content: `
# Forensic Ratio Analysis Checklist

Key warning signals covered in this document:
* Days Sales Outstanding (DSO) accelerating faster than top-line revenue
* Capitalizing normal operating expenses as intangibles
* Frequent one-off restructuring charges adjusted out of non-GAAP EBITDA
* Discrepancies between Operating Cash Flow and Net Income
        `,
      },
      {
        title: 'Macro Market Outlook: Yield Curve Inversions, Federal Reserve Policy & Liquidity Cycles',
        slug: 'macro-market-outlook-yield-curves-liquidity',
        description: 'Understanding the mechanics of Treasury yields, reverse repo facility drain, and how global central bank balance sheets dictate risk asset performance.',
        contentType: 'market_analysis',
        category: catMap['market-analysis'],
        subcategory: 'Macroeconomics',
        tags: ['Macro', 'Federal Reserve', 'Yield Curve', 'Treasuries', 'Liquidity'],
        thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
        author: adminUser._id,
        authorName: adminUser.name,
        featured: false,
        published: true,
        views: 3100,
        bookmarkCount: 290,
        readTimeMinutes: 9,
        difficulty: 'Advanced',
        content: `
# Global Macro Liquidity Analysis

Asset prices over multi-quarter horizons correlate far more tightly with central bank net liquidity injections than with individual quarterly earnings surprises.

## The 2-Year / 10-Year Yield Spread
Historically, the inversion of the yield curve signals recession risk, but the steepening following an inversion typically precedes equity market volatility as central banks begin emergency easing cycles.
        `,
      },
      {
        title: 'Zero to ₹10L/Month E-Commerce Startup Blueprint: Sourcing, Unit Economics & Scaling',
        slug: 'zero-to-10l-ecommerce-startup-blueprint',
        description: 'Complete operational playbook for finding winning products, negotiating domestic supplier MOQs, building high-converting funnels, and managing ROAS.',
        contentType: 'article',
        category: catMap['ecommerce-startup'],
        subcategory: 'D2C Scaling',
        tags: ['E-Commerce', 'Startup', 'D2C', 'Unit Economics', 'Shopify', 'Marketing'],
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=800&auto=format&fit=crop&q=80',
        author: adminUser._id,
        authorName: adminUser.name,
        featured: true,
        published: true,
        views: 4520,
        bookmarkCount: 410,
        readTimeMinutes: 11,
        difficulty: 'Intermediate',
        content: `
# The Modern E-Commerce Startup Engine

Launching a direct-to-consumer (D2C) brand in the current market landscape requires ruthless focus on contribution margins rather than vanity top-line sales.

## 1. Unit Economics Matrix

Before spending a single rupee on Meta or Google Ads, your unit economic model must withstand returns and payment gateway charges:

* **Gross Selling Price (AOV)**: ₹1,499
* **COGS (Cost of Goods Sold)**: ₹350 (Target: ≤ 25% of AOV)
* **Packaging & Forward Shipping**: ₹120
* **RTO (Return to Origin) Buffer (15%)**: ₹90
* **Payment Gateway Fee (2%)**: ₹30
* **Target CPA (Cost Per Acquisition)**: ₹450
* **Net Contribution Margin**: ₹459 (~30.6%)

## 2. Supplier Negotiation & Quality Verification

Always order a production sample before placing a commercial batch. Request supplier trade references and negotiate a 30% advance, 70% post-inspection payment term.
        `,
        seoTitle: 'Zero to ₹10L/Month E-Commerce Startup Blueprint',
        seoDescription: 'Master D2C product sourcing, Shopify conversion funnels, unit economics, and paid customer acquisition.',
      },
    ];

    await Content.insertMany(sampleContent);
    console.log(`Successfully seeded ${sampleContent.length} educational items.`);

    // 4. Seed Dynamic Pricing Plans
    const existingPlans = await Plan.countDocuments();
    if (existingPlans === 0) {
      console.log('Seeding Pricing & Subscription Plans...');
      const plansData = [
        {
          name: 'Starter Plan',
          slug: 'starter',
          price: 59,
          currency: 'INR',
          description: 'Essential access to foundational business PDFs and educational breakdowns.',
          features: [
            'Access to Essential Business Model PDFs',
            'Stock Market Basics Cheat Sheets',
            'Full Web Reader Access',
            'Standard Resolution Charts & Figures',
            'Lifetime Revisions for Downloaded PDFs'
          ],
          badge: 'Basic Tier',
          popular: false,
          active: true,
          order: 1,
        },
        {
          name: 'Growth Plan',
          slug: 'growth',
          price: 99,
          currency: 'INR',
          description: 'Comprehensive access to all business PDFs, corporate case studies, and checklists.',
          features: [
            'Complete Library of All Business PDFs',
            'In-Depth Corporate Case Study Autopsies',
            'Forensic Accounting & Ratio Checklists',
            'Downloadable CSV Valuation Datasets',
            'Priority Email Delivery of New Reports',
            'Early Access to Upcoming Publications'
          ],
          badge: 'Most Popular',
          popular: true,
          active: true,
          order: 2,
        },
        {
          name: 'Premium Plan',
          slug: 'premium',
          price: 149,
          currency: 'INR',
          description: 'All-inclusive institutional intelligence suite including 3-statement dynamic Excel financial models.',
          features: [
            'All-Access Pass (PDFs + Excel Models + Video Lessons)',
            'Dynamic 3-Statement Institutional DCF Models (.xlsx)',
            'Full Scenario Sensitivity Tables & Debt Sweeps',
            'Technical Price Action Candlestick Masterclasses',
            'Direct Curriculum Editorial Q&A Privileges',
            'Unrestricted Commercial & Personal Usage'
          ],
          badge: 'Institutional All-Access',
          popular: false,
          active: true,
          order: 3,
        },
      ];
      await Plan.insertMany(plansData);
      console.log('Successfully seeded 3 default pricing plans (Starter ₹59, Growth ₹99, Premium ₹149).');
    }
  } catch (error) {
    console.error('Seed execution error:', error);
  }
};

if (require.main === module) {
  const { connectDB } = require('../config/db');
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}

module.exports = { seedDatabase };
