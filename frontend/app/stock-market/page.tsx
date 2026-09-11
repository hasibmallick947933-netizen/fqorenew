import React from 'react';
import { HubLayout } from '@/components/content/HubLayout';
import { Content } from '@/lib/types';
import { resolveApiUrl } from '@/lib/api';

async function getStockMarketData() {
  try {
    const res = await fetch(resolveApiUrl('/content?category=stock-market'), { cache: 'no-store' });
    const data = await res.json();
    return (data.content || []) as Content[];
  } catch (err) {
    return [];
  }
}

export default async function StockMarketPage() {
  const content = await getStockMarketData();

  return (
    <HubLayout
      title="Stock Market Mechanics & Microstructure"
      badge="Equity Markets"
      description="Fundamental education on market mechanics, clearing corporations, limit order books, bid-ask spread dynamics, and institutional participation."
      subcategories={['Market Basics', 'Order Books', 'Clearing & Settlement', 'Indexes & ETFs', 'Corporate Actions']}
      initialContent={content}
    />
  );
}
