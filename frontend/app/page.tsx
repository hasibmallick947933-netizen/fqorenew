import React from 'react';
import { GrowthHeroSection } from '@/components/home/GrowthHeroSection';
import { FourPillarsSection } from '@/components/home/FourPillarsSection';
import { CurriculumSection } from '@/components/home/CurriculumSection';
import { ComparisonSection } from '@/components/home/ComparisonSection';
import { FeaturedGrid } from '@/components/home/FeaturedGrid';
import { HomePricingSection } from '@/components/home/HomePricingSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { StickyCtaBar } from '@/components/home/StickyCtaBar';
import { Content, Category, Plan } from '@/lib/types';
import { DEFAULT_PLANS } from '@/lib/constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function getData() {
  try {
    const [categoriesRes, featuredRes, latestRes, plansRes] = await Promise.all([
      fetch(`${API_BASE}/categories`, { cache: 'no-store' }).catch(() => null),
      fetch(`${API_BASE}/content?featured=true&limit=4`, { cache: 'no-store' }).catch(() => null),
      fetch(`${API_BASE}/content?limit=6&sortBy=newest`, { cache: 'no-store' }).catch(() => null),
      fetch(`${API_BASE}/plans`, { cache: 'no-store' }).catch(() => null),
    ]);

    const categoriesData = categoriesRes ? await categoriesRes.json().catch(() => ({})) : {};
    const featuredData = featuredRes ? await featuredRes.json().catch(() => ({})) : {};
    const latestData = latestRes ? await latestRes.json().catch(() => ({})) : {};
    const plansData = plansRes ? await plansRes.json().catch(() => ({})) : {};

    return {
      categories: (categoriesData.categories || []) as Category[],
      featured: (featuredData.content || []) as Content[],
      latest: (latestData.content || []) as Content[],
      plans: (plansData.plans && plansData.plans.length > 0 ? plansData.plans : DEFAULT_PLANS) as Plan[],
    };
  } catch (err) {
    console.warn('Using default home page data:', err);
    return {
      categories: [],
      featured: [],
      latest: [],
      plans: DEFAULT_PLANS,
    };
  }
}

export default async function HomePage() {
  const { featured, plans } = await getData();

  return (
    <div className="flex flex-col min-h-screen bg-[#04060c] text-white">
      {/* 1. GrowthCodesIn-Style Hero: 3D Canvas + 3D Interactive Blueprint Mockup + PDF Peek */}
      <GrowthHeroSection />

      {/* 2. Four Pillars Section: Matching page.jpeg (Trading & Finance, Business, Personal Brand, Execution) */}
      <FourPillarsSection />

      {/* 3. Comprehensive Curriculum Accordion: Modules 01 to 06 with exact lesson breakdowns */}
      <CurriculumSection />

      {/* 4. Comparison Section: Retail Guesswork vs FQore Institutional Edge */}
      <ComparisonSection />

      {/* 5. Dynamic Featured Blueprints & Resources from MongoDB */}
      <FeaturedGrid items={featured} />

      {/* 6. Pricing Section: Starter (₹59), Growth (₹99), Premium (₹149) with Razorpay Checkout */}
      <HomePricingSection initialPlans={plans} />

      {/* 7. Real Student & Trader Reviews / Testimonials */}
      <ReviewsSection />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Institutional Trust Marquee */}
      <BrandMarquee />

      {/* 10. Sticky Bottom Bar on Scroll */}
      <StickyCtaBar />
    </div>
  );
}
