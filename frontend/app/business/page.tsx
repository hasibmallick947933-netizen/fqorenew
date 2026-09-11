import React from 'react';
import { HubLayout } from '@/components/content/HubLayout';
import { Content } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const FALLBACK_BUSINESS_CONTENT: Content[] = [
  {
    _id: 'biz-01',
    title: 'FQore Learning: Enterprise Unit Economics & Business Model Autopsy',
    slug: 'fqore-business-model-autopsy',
    description: 'Forensic breakdown of high-margin corporate business structures, SaaS gross margin architecture, capital efficiency, and strategic moat defense against commoditization.',
    content: 'Forensic breakdown of high-margin corporate business structures and SaaS economics.',
    contentType: 'pdf',
    difficulty: 'Advanced',
    category: {
      _id: 'cat-business',
      name: 'Business Models',
      slug: 'business-models',
      description: 'Corporate Architecture & Unit Economics',
      icon: 'business_center',
    },
    subcategory: 'SaaS Economics',
    tags: ['Unit Economics', 'Gross Margin', 'SaaS', 'Strategic Moats'],
    thumbnail: '/images/fqore-circle-logo.png',
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    readTimeMinutes: 35,
    views: 6420,
    isPremium: true,
  } as unknown as Content,
  {
    _id: 'biz-02',
    title: 'FQore Learning: Institutional Trading Blueprint & Business Execution Dossier',
    slug: 'fqore-trading-blueprint',
    description: 'The official 27-page manual on institutional market mechanics, order block detection, algorithmic execution framework, DCF valuation, and systematic risk management.',
    content: 'Full comprehensive trading and business execution syllabus.',
    contentType: 'pdf',
    difficulty: 'Institutional',
    category: {
      _id: 'cat-business',
      name: 'Business Models',
      slug: 'business-models',
      description: 'Corporate Architecture & Unit Economics',
      icon: 'business_center',
    },
    subcategory: 'Strategic Moats',
    tags: ['Trading Blueprint', 'Order Flow', 'Valuation', 'Risk Management'],
    thumbnail: '/images/fqore-circle-logo.png',
    mediaUrl: '/FQore_Trading_Blueprint.pdf',
    readTimeMinutes: 45,
    views: 8930,
    isPremium: true,
  } as unknown as Content,
];

async function getBusinessData() {
  try {
    const res = await fetch(`${API_BASE}/content?category=business-models`, { cache: 'no-store' });
    const data = await res.json();
    if (data.content && data.content.length > 0) {
      return data.content as Content[];
    }
    return FALLBACK_BUSINESS_CONTENT;
  } catch (err) {
    return FALLBACK_BUSINESS_CONTENT;
  }
}

export default async function BusinessPage() {
  const content = await getBusinessData();

  return (
    <HubLayout
      title="Business Models & Economic Engines"
      badge="Business Intelligence"
      description="Deconstructing how companies make money, scale operational capacity, structure gross margins, and defend their market position against commoditization."
      subcategories={['SaaS Economics', 'Marketplace', 'DTC & Retail', 'Manufacturing', 'Strategic Moats']}
      initialContent={content}
    />
  );
}
