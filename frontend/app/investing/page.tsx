import React from 'react';
import { HubLayout } from '@/components/content/HubLayout';
import { Content } from '@/lib/types';
import { resolveApiUrl } from '@/lib/api';

async function getInvestingData() {
  try {
    const res = await fetch(resolveApiUrl('/content?category=investing'), { cache: 'no-store' });
    const data = await res.json();
    return (data.content || []) as Content[];
  } catch (err) {
    return [];
  }
}

export default async function InvestingPage() {
  const content = await getInvestingData();

  return (
    <HubLayout
      title="Investing Principles & Valuation Frameworks"
      badge="Value & Capital Allocation"
      description="Learn discounted cash flows (DCF), cost of capital (WACC), return on invested capital (ROIC), margin of safety, and portfolio diversification theory."
      subcategories={['Valuation', 'DCF Modeling', 'Dividend Compounding', 'Capital Allocation', 'Forensics']}
      initialContent={content}
    />
  );
}
