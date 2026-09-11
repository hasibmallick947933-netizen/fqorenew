import React from 'react';
import { HubLayout } from '@/components/content/HubLayout';
import { Content } from '@/lib/types';
import { resolveApiUrl } from '@/lib/api';

async function getTradingData() {
  try {
    const res = await fetch(resolveApiUrl('/content?category=trading'), { cache: 'no-store' });
    const data = await res.json();
    return (data.content || []) as Content[];
  } catch (err) {
    return [];
  }
}

export default async function TradingPage() {
  const content = await getTradingData();

  return (
    <HubLayout
      title="Trading Concepts, Technicals & Psychology"
      badge="Technical Analysis"
      description="Systematic studies of price action, candlestick geometries, liquidity sweeps, multi-timeframe order flow, and cognitive bias mitigation in financial risk environments."
      subcategories={['Technical Analysis', 'Price Action', 'Candlesticks', 'Risk Management', 'Trading Psychology']}
      initialContent={content}
    />
  );
}
