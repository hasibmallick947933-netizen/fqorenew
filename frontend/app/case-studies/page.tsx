import React from 'react';
import { HubLayout } from '@/components/content/HubLayout';
import { Content } from '@/lib/types';
import { resolveApiUrl } from '@/lib/api';

async function getCaseStudiesData() {
  try {
    const res = await fetch(resolveApiUrl('/content?category=case-studies'), { cache: 'no-store' });
    const data = await res.json();
    return (data.content || []) as Content[];
  } catch (err) {
    return [];
  }
}

export default async function CaseStudiesPage() {
  const content = await getCaseStudiesData();

  return (
    <HubLayout
      title="Empirical Business Case Studies"
      badge="Strategic Retrospectives"
      description="Deep forensic autopsies of real-world corporate turning points: disruptive attacks, platform cannibalization, pricing power tests, and operational failure modes."
      subcategories={['Strategic Disruption', 'Turnaround Playbooks', 'Platform Pivots', 'Network Effects', 'Failed Strategies']}
      initialContent={content}
    />
  );
}
