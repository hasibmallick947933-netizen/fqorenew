'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Link from 'next/link';
import { PaywallModal } from '@/components/ui/PaywallModal';

interface CourseTab {
  id: string;
  moduleNum: string;
  title: string;
  description: string;
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  deliverables: string[];
  planTier: string;
  planPrice: number;
}

const COURSE_TABS: Record<string, CourseTab> = {
  'tab-business': {
    id: 'tab-business',
    moduleNum: 'Core Module 01',
    title: 'Unit Economics, SaaS Margins & Durable Moats',
    description:
      'Examine the anatomical breakdown of recurring revenue engines. Master the mathematics of customer lifetime value (LTV), payback period optimization, and switching-cost moats that protect margins during macroeconomic contraction.',
    card1Title: 'CAC Payback Formulas',
    card1Desc: 'Blended vs Paid acquisition sensitivity models.',
    card2Title: 'Gross Margin Durability',
    card2Desc: 'COGS allocation & infrastructure cost amortizations.',
    deliverables: [
      '114-page Executive Dossier PDF',
      'Dynamic Cohort Retention Calculator (.xlsx)',
      '3 Real-World Startup Unit Teardowns',
      'Video Lecture: Scaling from 0 to ₹10Cr ARR',
    ],
    planTier: 'Beginner Plan (₹59)',
    planPrice: 59,
  },
  'tab-stock': {
    id: 'tab-stock',
    moduleNum: 'Core Module 02',
    title: 'Microstructure, Order Flow & Institutional Liquidity Pools',
    description:
      'Unpack how Tier-1 institutions conceal high-volume orders. Learn how to decode the consolidated tape, identify gamma squeezes, and trade along high-probability auction volume profiles without falling victim to retail stop hunts.',
    card1Title: 'Footprint & Heatmaps',
    card1Desc: 'Identify absorption patterns at key liquidity inflection zones.',
    card2Title: 'Dark Pool Dynamics',
    card2Desc: 'Block trade prints and institutional inventory rebalancing.',
    deliverables: [
      'Market Microstructure Primer (PDF)',
      'Volume Profile & Level 2 Cheatsheet',
      'Live Pre-Market Execution Rules',
      'Video Lecture: Institutional Tape Reading',
    ],
    planTier: 'Beginner Plan (₹59)',
    planPrice: 59,
  },
  'tab-companies': {
    id: 'tab-companies',
    moduleNum: 'Core Module 03',
    title: 'Corporate Teardowns & Forensic Revenue Autopsies',
    description:
      'Go behind glossy investor relations slide decks. We execute rigorous teardowns of top conglomerate balance sheets, analyzing concealed liabilities, off-balance sheet SPVs, and real operating cash yields.',
    card1Title: 'Cash Conversion Cycles',
    card1Desc: 'Detect supplier strain and inventory bloat ahead of market drops.',
    card2Title: 'Cap Table Mechanics',
    card2Desc: 'Liquidation preferences, anti-dilution, and waterfall charts.',
    deliverables: [
      '8 Enterprise Case Studies (PDF Teardowns)',
      'Working Capital Analyzer Spreadsheet',
      'Due Diligence Checklist (Institutional Grade)',
      'Video Lecture: Spotting Accounting Gimmicks',
    ],
    planTier: 'Growth Plan (₹99)',
    planPrice: 99,
  },
  'tab-dcf': {
    id: 'tab-dcf',
    moduleNum: 'Core Module 04',
    title: 'Discounted Cash Flow (DCF) & Sensitivity Valuation',
    description:
      'Build industrial-grade valuation models from raw financial statements. Master dynamic WACC calculations, terminal multiple assumptions, and Monte Carlo sensitivity ranges for both public equities and early-stage ventures.',
    card1Title: 'Unlevered Free Cash Flow',
    card1Desc: 'Clean adjustments for operating leases and capital expenditures.',
    card2Title: 'Terminal Value Stress Tests',
    card2Desc: 'Gordon Growth Model versus exit multiple matrix benchmarking.',
    deliverables: [
      'Automated 3-Statement Financial Model',
      'WACC & Beta Derivation Template',
      '2-Way Data Table Sensitivity Guide',
      'Video Lecture: Wall Street DCF Walkthrough',
    ],
    planTier: 'Growth Plan (₹99)',
    planPrice: 99,
  },
  'tab-trading': {
    id: 'tab-trading',
    moduleNum: 'Core Module 05',
    title: 'Execution Mechanics & Algorithmic Setups',
    description:
      'Transition from discretionary guessing to high-expectancy algorithmic rules. Structure systematic risk protocols, Kelly criterion position sizing, and maximum drawdown circuit breakers.',
    card1Title: 'R-Multiple Risk Management',
    card1Desc: 'Exact fractional position sizing based on portfolio volatility.',
    card2Title: 'Execution Playbooks',
    card2Desc: 'Opening range breakouts, mean-reversion, and trend continuity.',
    deliverables: [
      'Daily Trading Journal & Metrics Sheet',
      'Algorithmic Ruleset Playbook PDF',
      'Risk of Ruin & Monte Carlo Simulators',
      'Video Lecture: The Systematic Trader Mindset',
    ],
    planTier: 'Premium Plan (₹149)',
    planPrice: 149,
  },
  'tab-cases': {
    id: 'tab-cases',
    moduleNum: 'Core Module 06',
    title: 'Forensic Accounting & Market Autopsies',
    description:
      'Post-mortem examinations of high-profile corporate failures and miraculous turnarounds. Discover the early-warning operational indicators that conventional equity analysts missed completely.',
    card1Title: 'Beneish M-Score Framework',
    card1Desc: 'Mathematical detection of aggressive earnings manipulation.',
    card2Title: 'Liquidity Collapse Anatomy',
    card2Desc: 'Tracing short-seller reports and bank covenant violations.',
    deliverables: [
      '6 Complete Corporate Autopsy Briefs',
      'Red-Flag Forensic Audit Checklist',
      'Insider Trading & Buyback Tracker',
      'Video Lecture: The Anatomy of a Collapse',
    ],
    planTier: 'Premium Plan (₹149)',
    planPrice: 149,
  },
};

export const ExecutiveAcademyHome: React.FC = () => {
  // Navigation & Dropdown State
  const [courseFlyoutOpen, setCourseFlyoutOpen] = useState(false);
  const [activeCourseTab, setActiveCourseTab] = useState('tab-business');

  // Masterclass Video Sound State (Enabled by default for one playthrough)
  const [masterclassSound, setMasterclassSound] = useState(true);
  const masterclassVideoRef = useRef<HTMLVideoElement>(null);
  const hasAudioPlayedOnceRef = useRef(false);

  // Stop audio after first playthrough, then let video loop silently
  const handleVideoEnded = () => {
    const video = masterclassVideoRef.current;
    if (!video) return;
    hasAudioPlayedOnceRef.current = true;
    video.muted = true;
    setMasterclassSound(false);
    // Continue playing video silently in background
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const handleTimeUpdate = () => {
    const video = masterclassVideoRef.current;
    if (!video || hasAudioPlayedOnceRef.current) return;
    // Guard: detect end of first playthrough and mute audio immediately
    if (video.duration > 0 && video.currentTime >= video.duration - 0.4) {
      hasAudioPlayedOnceRef.current = true;
      video.muted = true;
      setMasterclassSound(false);
    }
  };

  useEffect(() => {
    const video = masterclassVideoRef.current;
    if (!video) return;

    // Set audio on by default for the initial play
    video.muted = false;
    video.volume = 0.85;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If modern browser autoplay policy blocks unmuted audio before user interaction,
        // start playback and unmute on the very first user click/scroll
        video.muted = true;
        video.play().catch(() => {});
        const enableSoundOnGesture = () => {
          if (masterclassVideoRef.current && !hasAudioPlayedOnceRef.current) {
            masterclassVideoRef.current.muted = false;
            setMasterclassSound(true);
          }
          window.removeEventListener('click', enableSoundOnGesture);
          window.removeEventListener('scroll', enableSoundOnGesture);
          window.removeEventListener('touchstart', enableSoundOnGesture);
        };
        window.addEventListener('click', enableSoundOnGesture, { once: true });
        window.addEventListener('scroll', enableSoundOnGesture, { once: true });
        window.addEventListener('touchstart', enableSoundOnGesture, { once: true });
      });
    }
  }, []);


  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Checkout Modal State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'beginner' | 'growth' | 'premium'>('growth');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [payRail, setPayRail] = useState('gpay');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState(false);

  // References for Three.js
  const bookCanvasRef = useRef<HTMLCanvasElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  const isAutoRotatingRef = useRef(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // ==========================================
  // Three.js 360-Degree Executive 3D Book Setup
  // ==========================================
  useEffect(() => {
    const canvas = bookCanvasRef.current;
    const container = bookContainerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3db, 1.35);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x72a0c1, 0.7);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const goldFillLight = new THREE.PointLight(0xfedeb2, 1.2, 15);
    goldFillLight.position.set(2, 2, 3);
    scene.add(goldFillLight);

    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    // Procedural Front Cover Texture
    function createFrontCoverTexture() {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 1440;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);

      const bgGrad = ctx.createRadialGradient(512, 720, 80, 512, 720, 800);
      bgGrad.addColorStop(0, '#112240');
      bgGrad.addColorStop(1, '#060d19');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1440);

      ctx.fillStyle = 'rgba(255,255,255,0.015)';
      for (let i = 0; i < 28000; i++) {
        const rx = Math.random() * 1024;
        const ry = Math.random() * 1440;
        ctx.fillRect(rx, ry, 1.5, 1.5);
      }

      ctx.strokeStyle = '#dfb875';
      ctx.lineWidth = 6;
      ctx.strokeRect(48, 48, 928, 1344);

      ctx.strokeStyle = 'rgba(223, 184, 117, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(62, 62, 900, 1316);

      const corners = [
        [62, 62],
        [962, 62],
        [62, 1378],
        [962, 1378],
      ];
      ctx.fillStyle = '#dfb875';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#dfb875';
      ctx.textAlign = 'center';
      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('FQORE EXECUTIVE SERIES', 512, 170);

      ctx.strokeStyle = '#dfb875';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(312, 210);
      ctx.lineTo(712, 210);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(512, 202);
      ctx.lineTo(520, 210);
      ctx.lineTo(512, 218);
      ctx.lineTo(504, 210);
      ctx.closePath();
      ctx.fillStyle = '#fedeb2';
      ctx.fill();

      ctx.fillStyle = '#fedeb2';
      ctx.font = 'bold 84px "Playfair Display", serif';
      ctx.fillText('FQORE', 512, 360);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 76px "Playfair Display", serif';
      ctx.fillText('LEARNING', 512, 455);

      ctx.fillStyle = '#dfb875';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('INSTITUTIONAL TRADING & BUSINESS BLUEPRINT', 512, 530);

      // Candlestick Emblem
      ctx.save();
      ctx.translate(512, 820);
      ctx.strokeStyle = '#dfb875';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 160, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(223, 184, 117, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 176, 0, Math.PI * 2);
      ctx.stroke();

      // Candle 1: Emerald Bullish
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-60, -90);
      ctx.lineTo(-60, 90);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-76, -40, 32, 100);

      // Candle 2: Crimson Bearish
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -110);
      ctx.lineTo(0, 80);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-16, -60, 32, 110);

      // Candle 3: Emerald Bullish Breakout
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, -130);
      ctx.lineTo(60, 70);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.fillRect(44, -90, 32, 130);

      ctx.restore();

      ctx.fillStyle = '#dfb875';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('FIRST EDITION • CURRICULUM SYLLABUS 2026', 512, 1260);

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('DISCOUNTED CASH FLOW • FOOTPRINT HEATMAPS • MOATS', 512, 1305);

      return new THREE.CanvasTexture(c);
    }

    // Procedural Spine Texture
    function createSpineTexture() {
      const c = document.createElement('canvas');
      c.width = 300;
      c.height = 1440;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);

      ctx.fillStyle = '#0a1424';
      ctx.fillRect(0, 0, 300, 1440);

      ctx.strokeStyle = '#dfb875';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 260, 1400);

      [220, 240, 700, 720, 1200, 1220].forEach((y) => {
        ctx.fillStyle = '#dfb875';
        ctx.fillRect(20, y, 260, 6);
      });

      ctx.save();
      ctx.translate(150, 720);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fce5c8';
      ctx.font = 'bold 36px "Playfair Display", serif';
      ctx.fillText('FQORE • FQORE LEARNING', 0, 12);
      ctx.restore();

      return new THREE.CanvasTexture(c);
    }

    // Procedural Back Cover Texture
    function createBackCoverTexture() {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 1440;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);

      ctx.fillStyle = '#08111d';
      ctx.fillRect(0, 0, 1024, 1440);

      ctx.strokeStyle = 'rgba(223, 184, 117, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(48, 48, 928, 1344);

      ctx.fillStyle = '#dfb875';
      ctx.textAlign = 'center';
      ctx.font = 'bold 34px "Playfair Display", serif';
      ctx.fillText('FQORE LEARNING', 512, 220);

      ctx.fillStyle = '#a9bacc';
      ctx.font = '24px "Inter", sans-serif';
      const blurb = [
        'Engineered for portfolio managers, quants, and founders.',
        'Unit economics teardowns, institutional order flow microstructure,',
        'and hedge-fund grade DCF valuation formulas.',
        'Enrolling with verified access starting at ₹59.',
      ];
      blurb.forEach((line, idx) => {
        ctx.fillText(line, 512, 320 + idx * 42);
      });

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(362, 1150, 300, 100);
      ctx.fillStyle = '#000000';
      for (let i = 380; i < 644; i += 7) {
        const w = i % 3 === 0 ? 3 : 1.5;
        ctx.fillRect(i, 1165, w, 70);
      }

      return new THREE.CanvasTexture(c);
    }

    // Procedural Paper Page Edge Texture
    function createPageEdgeTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      ctx.fillStyle = '#f5f0e6';
      ctx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 3) {
        ctx.fillStyle = y % 6 === 0 ? '#e5decb' : '#ede5d4';
        ctx.fillRect(0, y, 512, 1.5);
      }
      return new THREE.CanvasTexture(c);
    }

    const bookWidth = 2.1;
    const bookHeight = 2.95;
    const bookDepth = 0.45;

    const frontCoverTex = createFrontCoverTexture();
    const spineTex = createSpineTexture();
    const backCoverTex = createBackCoverTexture();
    const pageEdgeTex = createPageEdgeTexture();

    const spineMaterial = new THREE.MeshStandardMaterial({
      map: spineTex,
      roughness: 0.45,
      metalness: 0.2,
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontCoverTex,
      roughness: 0.4,
      metalness: 0.25,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backCoverTex,
      roughness: 0.45,
      metalness: 0.2,
    });

    const pageEdgeMaterial = new THREE.MeshStandardMaterial({
      map: pageEdgeTex,
      roughness: 0.8,
      metalness: 0.05,
    });

    const materials = [
      pageEdgeMaterial, // right
      spineMaterial, // left (spine)
      pageEdgeMaterial, // top
      pageEdgeMaterial, // bottom
      frontMaterial, // front
      backMaterial, // back
    ];

    const bookGeometry = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
    const bookMesh = new THREE.Mesh(bookGeometry, materials);
    bookMesh.castShadow = true;
    bookMesh.receiveShadow = true;
    bookGroup.add(bookMesh);

    // Ribbon Bookmark
    const ribbonGeo = new THREE.PlaneGeometry(0.12, 0.7);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xdfb875,
      side: THREE.DoubleSide,
      roughness: 0.3,
      metalness: 0.4,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0.3, -bookHeight / 2 - 0.25, 0.02);
    ribbon.rotation.z = 0.08;
    ribbon.rotation.x = 0.15;
    bookGroup.add(ribbon);

    // Initial Pose
    bookGroup.rotation.x = 0.18;
    bookGroup.rotation.y = -0.65;
    bookGroup.rotation.z = 0.04;
    bookGroup.position.set(0, 0.12, 0);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 3.2;
    controls.maxDistance = 7.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;
    controls.target.set(0, 0.12, 0);
    controlsRef.current = controls;

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (controls) {
        controls.update();
      } else if (isAutoRotatingRef.current) {
        bookGroup.rotation.y += 0.01;
      }

      bookGroup.position.y = 0.12 + Math.sin(elapsedTime * 1.5) * 0.04;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const toggleAutoRotate = () => {
    const next = !isAutoRotating;
    setIsAutoRotating(next);
    isAutoRotatingRef.current = next;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = next;
    }
  };

  const resetBookView = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 0.4, 5.2);
      controlsRef.current.target.set(0, 0.12, 0);
      controlsRef.current.reset();
    }
  };

  const handleOpenCheckout = (tier: 'beginner' | 'growth' | 'premium') => {
    setSelectedPlan(tier);
    setCheckoutModalOpen(true);
    setEnrolledSuccess(false);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrolling(true);
    setTimeout(() => {
      setEnrolling(false);
      setEnrolledSuccess(true);
    }, 1200);
  };

  // Plan Pricing details
  const planInfo = {
    beginner: {
      title: 'Beginner Plan (Starter Tier)',
      originalPrice: '₹499',
      price: 59,
      savings: 'Save ₹440 Today',
      deliverables: [
        'Startup Business Models & Stock Market Basics (PDF)',
        'Weekly Pre-Market Macro Briefings Digest',
        'Standard Financial Glossary & Metric Formulas',
        'Community Discussion Forum Access',
      ],
    },
    growth: {
      title: 'Growth Plan (Operator & Trader Track)',
      originalPrice: '₹1,398',
      price: 99,
      savings: 'Save ₹1,299 Today',
      deliverables: [
        'Complete Startup Playbook + Equity Guide (300+ Pages)',
        '10-Slide Pitch Deck Templates & Cap Table Models',
        'Core 4 Video Masterclasses (1080p Full HD)',
        'Forensic Case Studies & Financial Teardowns',
      ],
    },
    premium: {
      title: 'Premium All-Access (Institutional C-Suite)',
      originalPrice: '₹2,499',
      price: 149,
      savings: 'Save ₹2,350 Today',
      deliverables: [
        'Live Trading Room Stream with Order Flow & Gamma Levels',
        'DCF Valuation & M&A Due Diligence Models (Excel)',
        'Full Video Masterclass Library (All 12+ Cohort Sessions)',
        '1-on-1 Q&A Desk Pass & Direct Mentor Office Hours',
      ],
    },
  }[selectedPlan];

  const currentCourse = COURSE_TABS[activeCourseTab];

  return (
    <div className="w-full bg-surface text-on-surface font-body-md text-body-md antialiased selection:bg-secondary-container selection:text-primary">
      {/* 1. TOP SHELL HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-primary-container/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(13,28,50,0.25)] border-b border-surface-container-lowest/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop h-20 flex items-center justify-between gap-space-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-space-md shrink-0 group">
            {/* Official FQore Circular Golden Monogram Emblem */}
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-md ring-1 ring-[#cba258]/50 bg-black flex items-center justify-center">
              <img src="/images/fqore-circle-logo.png" alt="FQore Logo" className="w-full h-full object-cover scale-105" />
            </div>
            <span className="font-headline-sm text-headline-sm text-surface-container-lowest tracking-tight group-hover:text-secondary-container transition-colors">
              FQ<span className="text-secondary-container font-semibold">ore</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-space-lg">
            <Link
              href="/about"
              className="text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              ABOUT US
            </Link>
            <Link
              href="/#curriculum-breakdown"
              className="text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              HOW IT WORKS
            </Link>

            {/* Courses Dropdown */}
            <div className="relative group py-space-sm flex items-center gap-1">
              <Link
                href="/courses"
                className="text-secondary-container font-label-md text-label-md uppercase tracking-wider transition-colors hover:underline"
              >
                COURSES
              </Link>
              <button
                type="button"
                onClick={() => setCourseFlyoutOpen(!courseFlyoutOpen)}
                className="flex items-center text-secondary-container font-label-md text-label-md uppercase tracking-wider transition-colors p-0.5"
                aria-label="Toggle courses dropdown"
              >
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:rotate-180">
                  expand_more
                </span>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] pt-space-xs hidden group-hover:block transition-all">
                <div className="bg-tertiary-container/95 backdrop-blur-2xl rounded-xl p-space-lg shadow-[0_16px_40px_rgba(0,0,0,0.45)] border border-surface-container-lowest/10">
                  <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-lowest/10">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container">
                      EDUCATIONAL CURRICULUM
                    </span>
                    <Link
                      href="/courses"
                      className="font-label-sm text-label-sm uppercase text-secondary-container hover:underline tracking-wider font-semibold"
                    >
                      View All Courses &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-x-space-lg gap-y-space-md">
                    {Object.values(COURSE_TABS).map((tab) => (
                      <a
                        key={tab.id}
                        href="#curriculum-breakdown"
                        onClick={() => setActiveCourseTab(tab.id)}
                        className="group/item flex flex-col p-space-sm rounded-lg hover:bg-surface-container-lowest/5 transition-colors"
                      >
                        <span className="font-title-md text-title-md text-surface-container-lowest group-hover/item:text-secondary-container transition-colors">
                          {tab.title.split('&')[0].trim()}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-tertiary-container mt-space-xs line-clamp-2">
                          {tab.description}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/resources"
              className="text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              BUSINESS PDFS
            </Link>
            <a
              href="#pricing-matrix"
              className="text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              PRICING ₹59+
            </a>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-space-md shrink-0">
            <Link
              href="/search"
              aria-label="Search"
              className="p-space-xs text-on-primary-container hover:text-surface-container-lowest transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </Link>

            <Link
              href="/login"
              className="hidden sm:inline-flex text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
            >
              LOG IN
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-lg font-label-md text-label-md uppercase tracking-wider text-secondary-container hover:bg-secondary-container/10 transition-colors"
            >
              <span className="font-label-md text-label-md">CONTACT US</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>

            <Link
              href="/admin"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:ring-2 hover:ring-secondary-container transition-all"
              title="Admin Portal"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN BODY CONTAINER */}
      <main className="w-full pt-20 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* 1. CINEMATIC VIDEO HERO BACKGROUND */}
          <section className="relative w-full h-[90vh] min-h-[640px] max-h-[960px] overflow-hidden bg-black flex items-center justify-center">
            {/* Full-bleed Static Background Video */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
              <video
                ref={masterclassVideoRef}
                autoPlay
                muted={!masterclassSound}
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center brightness-75 contrast-110"
              >
                <source src="https://res.cloudinary.com/xbvjx6qb/video/upload/v1789135767/video.mp4" type="video/mp4" />
                <source src="/video.mp4" type="video/mp4" />
              </video>
              {/* Cinematic Vignette, Dark Gradients & Lighting */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040813] via-black/30 to-black/70 pointer-events-none" />
              <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/85 pointer-events-none" />
            </div>

            {/* Foreground Cinematic Hero Branding */}
            <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
              {/* Circular Logo Monogram */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-[0_0_50px_rgba(252,217,151,0.6)] ring-2 ring-[#fcd997]/70 bg-black flex items-center justify-center mb-1">
                <img src="/images/fqore-circle-logo.png" alt="FQore Logo" className="w-full h-full object-cover scale-105" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fcd997]/15 backdrop-blur-md border border-[#fcd997]/40 text-xs font-mono uppercase tracking-widest text-[#fcd997] shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#fcd997] animate-ping" />
                The FQore Education Series
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] uppercase leading-none">
                Not Just Knowledge. <br />
                <span className="bg-gradient-to-r from-[#fcd997] via-[#f7d79b] to-[#cba258] bg-clip-text text-transparent">
                  Real Solutions.
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-light leading-relaxed drop-shadow-md">
                From Beginner to Disciplined Trader &bull; Institutional Price Action &bull; Financial Modeling &bull; Business Autopsies
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                {/* Sound Toggle Button */}
                <button
                  onClick={() => {
                    const next = !masterclassSound;
                    setMasterclassSound(next);
                    if (masterclassVideoRef.current) {
                      masterclassVideoRef.current.muted = !next;
                      if (next) {
                        masterclassVideoRef.current.volume = 0.9;
                        masterclassVideoRef.current.play();
                      }
                    }
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md border shadow-lg ${
                    masterclassSound
                      ? 'bg-[#fcd997] text-[#1a1200] border-[#fcd997] shadow-[0_0_20px_rgba(252,217,151,0.3)]'
                      : 'bg-black/60 text-white border-white/30 hover:bg-black/80'
                  }`}
                  title={masterclassSound ? 'Sound is playing (Click to mute)' : 'Click to enable audio'}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {masterclassSound ? 'volume_up' : 'volume_off'}
                  </span>
                  <span>{masterclassSound ? 'Sound ON' : 'Audio Muted'}</span>
                </button>

                <a
                  href="#hero-curriculum"
                  className="px-6 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>Explore Curriculum</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                </a>
              </div>

              {/* Scroll Indicator */}
              <div className="pt-6 flex flex-col items-center gap-1 text-slate-400 text-[11px] font-mono uppercase tracking-widest animate-bounce">
                <span>Scroll Down</span>
                <span className="material-symbols-outlined text-[18px] text-[#fcd997]">expand_more</span>
              </div>
            </div>
          </section>

          {/* 2. TOP NAVIGATION VISUAL MIRROR WITH INTERACTIVE COURSE FLYOUT (Second Image in Prompt) */}
          <section id="hero-curriculum" className="relative w-full bg-primary-container text-surface-container-lowest overflow-hidden">
            <div className="absolute -top-40 left-1/4 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-20 right-10 w-[30rem] h-[30rem] bg-surface-tint/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop py-space-md">
              <div className="relative flex flex-wrap items-center justify-between gap-4 py-space-sm bg-tertiary-container/80 backdrop-blur-md rounded-xl px-6 border border-surface-container-lowest/10">
                <div className="flex items-center gap-space-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/10 font-label-sm text-label-sm text-secondary-container uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                    FQore Masterclass Live
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCourseFlyoutOpen(!courseFlyoutOpen)}
                    type="button"
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest/10 hover:bg-secondary-container hover:text-primary-container transition-all font-label-md text-label-md uppercase tracking-wider text-surface-container-lowest"
                  >
                    <span className="font-label-md text-label-md">Explore Curriculum</span>
                    <span
                      className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${
                        courseFlyoutOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  <a
                    href="#pricing-matrix"
                    className="px-3 py-2 rounded-lg text-on-primary-container hover:text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider transition-colors"
                  >
                    Access Plans
                  </a>
                  <span className="px-2.5 py-1 rounded-md bg-secondary/30 text-secondary-container font-label-sm text-label-sm font-semibold">
                    ₹59+
                  </span>
                </div>
              </div>

              {/* Flyout Menu */}
              {courseFlyoutOpen && (
                <div className="relative z-30 mt-4 transition-all duration-300 max-w-xl mx-auto lg:mx-0 animate-in fade-in duration-200">
                  <div className="bg-tertiary-container/95 backdrop-blur-2xl rounded-2xl p-space-lg shadow-2xl border border-surface-container-lowest/10">
                    <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-lowest/10">
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary-container">
                        EDUCATIONAL CURRICULUM
                      </span>
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Institutional Syllabi
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      {Object.values(COURSE_TABS).map((tab) => (
                        <a
                          key={tab.id}
                          href="#curriculum-breakdown"
                          onClick={() => {
                            setActiveCourseTab(tab.id);
                            setCourseFlyoutOpen(false);
                          }}
                          className="group flex items-start gap-3 p-space-sm rounded-lg hover:bg-surface-container-lowest/10 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/5 flex items-center justify-center text-secondary-container group-hover:scale-110 transition-transform shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              {tab.id === 'tab-business'
                                ? 'business_center'
                                : tab.id === 'tab-stock'
                                ? 'trending_up'
                                : tab.id === 'tab-companies'
                                ? 'bar_chart'
                                : tab.id === 'tab-dcf'
                                ? 'pie_chart'
                                : tab.id === 'tab-trading'
                                ? 'layers'
                                : 'auto_stories'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-title-md text-title-md text-surface-container-lowest group-hover:text-secondary-container transition-colors">
                              {tab.title.split('&')[0].trim()}
                            </span>
                            <span className="font-body-sm text-body-sm text-on-tertiary-container mt-0.5 line-clamp-1">
                              {tab.description}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. MAIN HERO BODY WITH THREE.JS 360° INTERACTIVE BOOK */}
            <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop pt-space-md pb-space-xl relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                {/* Hero Text */}
                <div className="lg:col-span-7 flex flex-col items-start">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/20 text-secondary-container font-label-sm text-label-sm uppercase tracking-widest mb-space-md">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container">
                      verified
                    </span>
                    INSTITUTIONAL BUSINESS &amp; MARKET INTELLIGENCE
                  </div>

                  <h1 className="font-headline-lg text-headline-lg text-surface-container-lowest tracking-tight mb-space-md leading-tight">
                    Grow Your Market Alpha &amp; Master Enterprise Finance
                  </h1>

                  <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mb-space-lg">
                    Discover the future of education with FQore. Dive into verified business models, real-world
                    stock market mechanics, and hedge fund-grade financial blueprints.
                  </p>

                  <div className="flex flex-wrap items-center gap-space-md">
                    <a
                      href="#curriculum-breakdown"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-secondary-container text-primary-container font-label-md text-label-md uppercase tracking-wider font-bold shadow-lg hover:bg-secondary-fixed transition-all hover:scale-105 group"
                    >
                      <span>Explore Curriculum</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>

                    <a
                      href="#pricing-matrix"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-lowest/10 text-surface-container-lowest font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-lowest/20 transition-all"
                    >
                      <span>View Pricing (From ₹59)</span>
                      <span className="material-symbols-outlined text-[18px]">loyalty</span>
                    </a>
                  </div>

                  {/* Proof Metrics Bar */}
                  <div className="grid grid-cols-3 gap-6 pt-space-xl mt-space-lg w-full max-w-lg">
                    <div className="flex flex-col">
                      <span className="font-headline-md text-headline-md text-secondary-container font-bold">
                        14,200+
                      </span>
                      <span className="font-body-sm text-body-sm text-on-primary-container">
                        Executive Alumni
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-headline-md text-surface-container-lowest font-bold">
                        98.4%
                      </span>
                      <span className="font-body-sm text-body-sm text-on-primary-container">
                        Dossier Utility Rate
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-md text-headline-md text-secondary-container font-bold">
                        ₹59
                      </span>
                      <span className="font-body-sm text-body-sm text-on-primary-container">
                        Entry Starting Tier
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hero Graphic: Three.js 360-degree Rotating 3D Executive Book */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-tertiary-container border border-surface-container-lowest/10">
                    <div
                      ref={bookContainerRef}
                      className="relative h-[440px] w-full cursor-grab active:cursor-grabbing"
                    >
                      <canvas ref={bookCanvasRef} className="w-full h-full block" />

                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary-container/70 via-transparent to-transparent" />

                      {/* Controls */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                        <button
                          onClick={toggleAutoRotate}
                          className={`w-8 h-8 rounded-lg bg-tertiary-container/90 backdrop-blur-md border border-surface-container-lowest/20 flex items-center justify-center transition-all ${
                            isAutoRotating ? 'text-secondary-container' : 'text-slate-400'
                          }`}
                          title="Toggle Auto-Rotation"
                        >
                          <span className="material-symbols-outlined text-[18px]">sync</span>
                        </button>
                        <button
                          onClick={resetBookView}
                          className="w-8 h-8 rounded-lg bg-tertiary-container/90 backdrop-blur-md border border-surface-container-lowest/20 flex items-center justify-center text-surface-container-lowest hover:bg-surface-container-lowest/20 transition-all"
                          title="Reset View"
                        >
                          <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
                        </button>
                      </div>

                      {/* Terminal Overlay Card */}
                      <div className="absolute bottom-3 inset-x-3 p-space-md rounded-xl bg-primary-container/95 backdrop-blur-lg shadow-xl border border-surface-container-lowest/10 z-10 pointer-events-auto">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-lowest/10">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary-container text-[20px]">
                              candlestick_chart
                            </span>
                            <span className="font-title-md text-title-md text-surface-container-lowest">
                              FQore Learning
                            </span>
                          </div>
                          <span className="font-label-sm text-label-sm text-secondary-container font-semibold">
                            v4.2 PRO
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-on-primary-container">
                          <div className="flex flex-col">
                            <span className="font-label-sm text-label-sm text-on-primary-container">
                              WACC Benchmark
                            </span>
                            <span className="font-title-md text-title-md text-surface-container-lowest">
                              8.42%
                            </span>
                          </div>
                          <svg className="w-24 h-7 text-secondary-container" fill="none" viewBox="0 0 120 30">
                            <path
                              d="M0 25 L20 18 L40 22 L60 10 L80 14 L100 4 L120 8"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                            />
                            <path
                              d="M0 25 L20 18 L40 22 L60 10 L80 14 L100 4 L120 8 L120 30 L0 30 Z"
                              fill="currentColor"
                              fillOpacity="0.1"
                            />
                          </svg>
                          <div className="flex flex-col items-end">
                            <span className="font-label-sm text-label-sm text-on-primary-container">
                              Sensitivity Moat
                            </span>
                            <span className="font-title-md text-title-md text-secondary-container font-semibold">
                              +34.8% LTV
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* 5. INTERACTIVE CURRICULUM BREAKDOWN */}
          <section className="w-full py-space-xl bg-surface border-b border-surface-container-high" id="curriculum-breakdown">
            <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
              <div className="text-center max-w-3xl mx-auto mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                  Systematic Syllabus
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-1 mb-2">
                  Deconstruct Wall Street &amp; Silicon Valley Logic
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Select any specialization below to examine the specific models, Excel sheets, and case study teardowns
                  covered within the academy.
                </p>
              </div>

              {/* Tab Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-space-xl">
                {Object.values(COURSE_TABS).map((tab) => {
                  const isActive = activeCourseTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCourseTab(tab.id)}
                      className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all shadow-sm ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {tab.title.split('&')[0].trim()}
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Pane */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl shadow-md border border-surface-container-high">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary-container/30 text-on-secondary-container font-label-sm text-label-sm uppercase font-semibold">
                      {currentCourse.moduleNum}
                    </div>

                    <h3 className="font-headline-md text-headline-md text-primary">
                      {currentCourse.title}
                    </h3>

                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {currentCourse.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high">
                        <span className="font-title-md text-title-md text-primary block mb-1">
                          {currentCourse.card1Title}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {currentCourse.card1Desc}
                        </span>
                      </div>
                      <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high">
                        <span className="font-title-md text-title-md text-primary block mb-1">
                          {currentCourse.card2Title}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {currentCourse.card2Desc}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-primary-container text-surface-container-lowest p-6 rounded-xl border border-surface-container-lowest/10">
                    <span className="font-label-sm text-label-sm text-secondary-container uppercase tracking-widest block mb-3 font-semibold">
                      Included Deliverables
                    </span>
                    <ul className="space-y-3 font-body-sm text-body-sm">
                      {currentCourse.deliverables.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary-container text-[18px]">
                            check_circle
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() =>
                        handleOpenCheckout(
                          currentCourse.planPrice === 59
                            ? 'beginner'
                            : currentCourse.planPrice === 99
                            ? 'growth'
                            : 'premium'
                        )
                      }
                      className="mt-6 w-full text-center py-2.5 rounded-lg bg-secondary-container text-primary font-label-md text-label-md uppercase tracking-wider font-bold hover:bg-secondary-fixed transition-colors block"
                    >
                      Access via {currentCourse.planTier}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. THREE-TIER PRICING MATRIX SECTION (₹59, ₹99, ₹149) */}
          <section className="w-full py-space-xl bg-surface-container-low border-b border-surface-container-high" id="pricing-matrix">
            <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop">
              <div className="text-center max-w-3xl mx-auto mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                  Predictable Investment
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-1 mb-2">
                  Predictable Investment in Lifelong Mastery
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Institutional knowledge at an accessible starting price. One-time payment, direct lifetime PDF downloads,
                  and zero recurring surprises.
                </p>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg items-stretch">
                {/* Plan 1: Beginner ₹59 */}
                <div className="flex flex-col justify-between bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-surface-container-high">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">
                        Starter Tier
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">
                        Instant PDF
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1">Beginner Plan</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                      Essential foundational knowledge for aspiring traders &amp; operators.
                    </p>

                    <div className="flex items-baseline gap-1 mb-6 pb-6 bg-surface-container-low/50 p-4 rounded-xl">
                      <span className="font-headline-lg text-headline-lg text-primary font-bold">₹59</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        / one-time investment
                      </span>
                    </div>

                    <ul className="space-y-3 font-body-sm text-body-sm text-on-surface mb-8">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>
                          <strong>2 Core Playbook PDFs:</strong> Startup Business Models &amp; Market Basics
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Weekly Pre-Market Macro Briefings Digest</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Standard Financial Glossary &amp; Metric Formulas</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Community Discussion Forum Access</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Instant High-Resolution PDF Download</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout('beginner')}
                    className="w-full text-center py-3 rounded-lg bg-surface-container-highest hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md uppercase tracking-wider font-semibold transition-all"
                  >
                    Get Beginner Plan (₹59)
                  </button>
                </div>

                {/* Plan 2: Growth ₹99 (Most Popular) */}
                <div className="relative flex flex-col justify-between bg-primary-container text-surface-container-lowest p-space-lg rounded-2xl shadow-xl scale-105 z-10 border-2 border-secondary-container">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm uppercase tracking-widest font-bold shadow-md">
                    MOST POPULAR / BEST VALUE
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <span className="font-label-sm text-label-sm uppercase font-bold text-secondary-container">
                        Operator &amp; Trader Track
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-surface-container-lowest/10 text-secondary-container font-label-sm text-label-sm">
                        Includes Video
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest mb-1">
                      Growth Plan
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-primary-container mb-6">
                      For active investors, operators &amp; founders seeking execution blueprints.
                    </p>

                    <div className="flex items-baseline gap-1 mb-6 pb-6 bg-tertiary-container p-4 rounded-xl border border-surface-container-lowest/10">
                      <span className="font-headline-lg text-headline-lg text-secondary-container font-bold">
                        ₹99
                      </span>
                      <span className="font-body-sm text-body-sm text-on-primary-container">
                        / one-time investment
                      </span>
                    </div>

                    <ul className="space-y-3 font-body-sm text-body-sm text-surface-container-lowest mb-8">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">
                          verified
                        </span>
                        <span>
                          <strong>Everything in Beginner, plus:</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Complete Startup Playbook + Equity Fundraising Guide (300+ Pages)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>10-Slide Institutional Pitch Deck Templates &amp; Cap Table Models</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Video Masterclass Access (Core 4 Modules)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Forensic Company Case Studies &amp; Teardowns</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary-container text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Priority Community Room Access</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout('growth')}
                    className="w-full text-center py-3.5 rounded-lg bg-secondary-container hover:bg-secondary-fixed text-primary font-label-md text-label-md uppercase tracking-wider font-bold transition-all shadow-md hover:scale-105"
                  >
                    Unlock Growth Plan (₹99)
                  </button>
                </div>

                {/* Plan 3: Premium ₹149 */}
                <div className="flex flex-col justify-between bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-surface-container-high">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-label-sm text-label-sm uppercase font-bold text-secondary">
                        C-Suite Suite
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">
                        Full Institutional
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                      Premium All-Access
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                      Full institutional suite for serious traders, quants, and executives.
                    </p>

                    <div className="flex items-baseline gap-1 mb-6 pb-6 bg-surface-container-low/50 p-4 rounded-xl">
                      <span className="font-headline-lg text-headline-lg text-primary font-bold">₹149</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        / one-time investment
                      </span>
                    </div>

                    <ul className="space-y-3 font-body-sm text-body-sm text-on-surface mb-8">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          verified
                        </span>
                        <span>
                          <strong>Everything in Growth, plus:</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Live Trading Room Stream with Daily Order Flow &amp; Gamma Levels</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>DCF Valuation &amp; M&amp;A Due Diligence Models (Excel + Sheets)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Full Video Masterclass Library (All 12+ Cohort Sessions)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>1-on-1 Q&amp;A Desk Pass &amp; Direct Mentor Office Hours</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">
                          check_circle
                        </span>
                        <span>Lifetime Updates &amp; All Future Dossiers Free</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenCheckout('premium')}
                    className="w-full text-center py-3 rounded-lg bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md uppercase tracking-wider font-semibold transition-all"
                  >
                    Claim Premium All-Access (₹149)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 7. EXECUTIVE FAQ ACCORDION */}
          <section className="w-full py-space-xl bg-surface border-b border-surface-container-high">
            <div className="max-w-4xl mx-auto px-6 lg:px-margin-desktop">
              <div className="text-center mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                  Frequently Clarified
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-1 mb-2">
                  Questions Before You Begin
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Complete clarity regarding licensing, access delivery, and format integrity.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: 'How quickly do I get access to the materials after paying ₹59, ₹99, or ₹149?',
                    a: 'Access is 100% automated and instantaneous. As soon as your UPI, card, or net banking transaction succeeds, you are redirected to the encrypted download console and receive a permanent backup delivery link directly to your registered email address.',
                  },
                  {
                    q: 'What format are the curriculum playbooks and financial models in?',
                    a: 'All curriculum texts are rendered in crisp, print-ready vector PDF format, optimized for iPad, tablet, e-reader, and desktop viewing. Financial models are provided in unlocked Microsoft Excel (.xlsx) and Google Sheets format with zero locked cell restrictions.',
                  },
                  {
                    q: 'Are these blueprints beginner-friendly or strictly for seasoned quants?',
                    a: 'The curriculum follows a graduated pedagogy. The Beginner Tier starts from core fundamentals without dumbing down institutional rigor. By Module 3 and 4, you are working through the exact same forensic models used by hedge fund analysts and private equity associates.',
                  },
                  {
                    q: 'Is there any recurring monthly subscription or hidden charge?',
                    a: 'Zero recurring fees. All tier options (₹59, ₹99, ₹149) represent a single, one-time payment. Once enrolled, your access token remains active permanently, including any incremental edition updates released for that respective module.',
                  },
                ].map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div key={idx} className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container-high">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left group"
                      >
                        <span className="font-title-md text-title-md text-primary group-hover:text-secondary transition-colors">
                          {item.q}
                        </span>
                        <span
                          className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pt-3 mt-3 text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container-high">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Trust Badges */}
              <div className="mt-space-xl p-6 bg-surface-container-low rounded-2xl flex flex-wrap items-center justify-around gap-6 text-center border border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">lock</span>
                  <div className="flex flex-col text-left">
                    <span className="font-title-md text-title-md text-primary font-bold">256-Bit SSL</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Bank-Grade Encryption
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">download_done</span>
                  <div className="flex flex-col text-left">
                    <span className="font-title-md text-title-md text-primary font-bold">Instant Delivery</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Direct Cloud Link</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">stars</span>
                  <div className="flex flex-col text-left">
                    <span className="font-title-md text-title-md text-primary font-bold">4.9 / 5 Rating</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Over 14,000+ Enrolled</span>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="mt-space-xl text-center">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
                  Ready to Upgrade Your Strategic Intelligence?
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Join ambitious operators, quants, and founders inside FQore today.
                </p>
                <a
                  href="#pricing-matrix"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider font-bold shadow-lg hover:bg-on-surface transition-all"
                >
                  <span>Get Instant Access Now (₹59+)</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 8. FOOTER */}
      <footer className="w-full bg-surface-container-low border-t border-surface-container-high">
        <div className="max-w-7xl mx-auto px-6 lg:px-margin-desktop py-space-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm ring-1 ring-[#cba258]/50 bg-black flex items-center justify-center">
                <img src="/images/fqore-circle-logo.png" alt="FQore Logo" className="w-full h-full object-cover scale-105" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                &copy; 2026 FQore Executive Trading Academy. Institutional Discretion Reserved.
              </p>
            </div>

            <div className="flex items-center gap-space-lg">
              <Link
                href="/about"
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase tracking-wider"
              >
                About
              </Link>
              <a
                href="#curriculum-breakdown"
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase tracking-wider"
              >
                Curriculum
              </a>
              <a
                href="#pricing-matrix"
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase tracking-wider"
              >
                Institutional Access
              </a>
              <Link
                href="/contact"
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface uppercase tracking-wider"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. INTERACTIVE CHECKOUT MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-2xl bg-tertiary-container border border-secondary-container/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-surface-container-lowest">
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-container-lowest/10 bg-primary-container/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-secondary-container/10 border border-secondary-container/30 flex items-center justify-center text-secondary-container">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-headline-sm text-surface-container-lowest tracking-tight">
                      Secure Executive Enrollment
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-secondary-container/20 text-secondary-container border border-secondary-container/30">
                      256-Bit SSL
                    </span>
                  </div>
                  <p className="text-on-primary-container text-body-sm font-body-sm">
                    Instant cloud vault delivery &amp; permanent archive pass
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary-container hover:text-surface-container-lowest flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {enrolledSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">check_circle</span>
                  </div>
                  <h4 className="text-2xl font-bold font-headline-sm text-white">
                    Enrollment Confirmed!
                  </h4>
                  <p className="text-on-primary-container text-body-md max-w-md mx-auto">
                    Welcome to FQore, {fullName || 'Trader'}. Your access pass for the{' '}
                    <span className="text-secondary-container font-semibold">{planInfo.title}</span> has been
                    unlocked. Download credentials have been dispatched to {email || 'your email'}.
                  </p>
                  <a
                    href="/FQore_Trading_Blueprint.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary-container text-primary font-label-md uppercase font-bold"
                  >
                    <span>Download Blueprint (PDF)</span>
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </a>
                </div>
              ) : (
                <>
                  {/* Select Access Tier */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-container font-semibold">
                        Select Your Access Tier
                      </label>
                      <span className="font-label-sm text-label-sm text-on-primary-container">
                        One-Time Investment • No Recurring Fees
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Beginner */}
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('beginner')}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                          selectedPlan === 'beginner'
                            ? 'border-2 border-secondary-container bg-secondary-container/10 shadow-lg'
                            : 'border-surface-container-lowest/15 bg-surface-container-lowest/5 hover:bg-surface-container-lowest/10'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className="font-title-md text-title-md text-surface-container-lowest">
                            Beginner
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full border border-secondary-container flex items-center justify-center">
                            {selectedPlan === 'beginner' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                            )}
                          </span>
                        </div>
                        <span className="font-headline-sm text-headline-sm text-surface-container-lowest font-bold">
                          ₹59
                        </span>
                        <span className="text-[11px] text-on-primary-container mt-1 line-clamp-1">
                          2 Core Playbooks
                        </span>
                      </button>

                      {/* Growth */}
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('growth')}
                        className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                          selectedPlan === 'growth'
                            ? 'border-2 border-secondary-container bg-secondary-container/10 shadow-lg'
                            : 'border-surface-container-lowest/15 bg-surface-container-lowest/5 hover:bg-surface-container-lowest/10'
                        }`}
                      >
                        <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-[9px] font-bold uppercase tracking-wider">
                          BEST VALUE
                        </span>
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className="font-title-md text-title-md text-secondary-container font-semibold">
                            Growth
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full border border-secondary-container flex items-center justify-center">
                            {selectedPlan === 'growth' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                            )}
                          </span>
                        </div>
                        <span className="font-headline-sm text-headline-sm text-secondary-container font-bold">
                          ₹99
                        </span>
                        <span className="text-[11px] text-surface-container-lowest/80 mt-1 line-clamp-1">
                          Founder Bundle + Video
                        </span>
                      </button>

                      {/* Premium */}
                      <button
                        type="button"
                        onClick={() => setSelectedPlan('premium')}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                          selectedPlan === 'premium'
                            ? 'border-2 border-secondary-container bg-secondary-container/10 shadow-lg'
                            : 'border-surface-container-lowest/15 bg-surface-container-lowest/5 hover:bg-surface-container-lowest/10'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <span className="font-title-md text-title-md text-surface-container-lowest">
                            Premium
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full border border-secondary-container flex items-center justify-center">
                            {selectedPlan === 'premium' && (
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                            )}
                          </span>
                        </div>
                        <span className="font-headline-sm text-headline-sm text-surface-container-lowest font-bold">
                          ₹149
                        </span>
                        <span className="text-[11px] text-on-primary-container mt-1 line-clamp-1">
                          Institutional C-Suite
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-primary-container/90 border border-surface-container-lowest/10 space-y-3">
                    <div className="flex items-baseline justify-between border-b border-surface-container-lowest/10 pb-3">
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md text-surface-container-lowest font-bold">
                          {planInfo.title}
                        </span>
                        <span className="text-body-sm font-body-sm text-on-primary-container">
                          Immediate digital entitlement &amp; download pass
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-body-sm font-body-sm text-on-primary-container line-through">
                          {planInfo.originalPrice}
                        </span>
                        <span className="font-headline-md text-headline-md text-secondary-container font-bold">
                          ₹{planInfo.price}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-secondary-container bg-secondary-container/10 px-3 py-1.5 rounded-lg">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span> Instant Institutional Discount Applied
                      </span>
                      <span className="font-bold">{planInfo.savings}</span>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-sm font-body-sm text-surface-container-lowest pt-1">
                      {planInfo.deliverables.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-[13px]">
                          <span className="material-symbols-outlined text-secondary-container text-[16px]">
                            check_circle
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleEnrollSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                          Executive Full Name *
                        </label>
                        <input
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Arjun Mehta"
                          type="text"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest/5 border border-surface-container-lowest/15 text-surface-container-lowest placeholder-on-primary-container focus:outline-none focus:border-secondary-container transition-colors text-body-sm font-body-sm"
                        />
                      </div>
                      <div>
                        <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                          Work or Primary Email *
                        </label>
                        <input
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="arjun@capitalpartners.in"
                          type="email"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest/5 border border-surface-container-lowest/15 text-surface-container-lowest placeholder-on-primary-container focus:outline-none focus:border-secondary-container transition-colors text-body-sm font-body-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container mb-1.5">
                        WhatsApp / Contact Number (For Instant PDF Dispatch) *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg bg-surface-container-lowest/10 border border-r-0 border-surface-container-lowest/15 text-on-primary-container font-mono text-body-sm">
                          +91
                        </span>
                        <input
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          type="tel"
                          className="w-full px-3.5 py-2.5 rounded-r-lg bg-surface-container-lowest/5 border border-surface-container-lowest/15 text-surface-container-lowest placeholder-on-primary-container focus:outline-none focus:border-secondary-container transition-colors text-body-sm font-body-sm"
                        />
                      </div>
                    </div>

                    {/* Payment Rails */}
                    <div className="space-y-2 pt-1">
                      <label className="block font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container">
                        Preferred Payment Rail
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'gpay', label: 'Google Pay' },
                          { id: 'phonepe', label: 'PhonePe' },
                          { id: 'paytm', label: 'Paytm / UPI' },
                          { id: 'card', label: 'Cards & Net' },
                        ].map((rail) => (
                          <label
                            key={rail.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-body-sm font-body-sm ${
                              payRail === rail.id
                                ? 'bg-secondary-container/15 border-secondary-container text-white'
                                : 'bg-surface-container-lowest/5 border-surface-container-lowest/15 text-on-primary-container hover:bg-surface-container-lowest/10'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment_rail"
                              value={rail.id}
                              checked={payRail === rail.id}
                              onChange={() => setPayRail(rail.id)}
                              className="text-secondary-container focus:ring-0"
                            />
                            <span className="font-semibold text-[12px]">{rail.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={enrolling}
                      className="w-full py-3.5 px-6 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-primary font-label-md text-label-md uppercase tracking-wider font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                    >
                      <span>
                        {enrolling
                          ? 'Processing Secure Order...'
                          : `Complete Enrollment & Unlock ${planInfo.title.split('(')[0].trim()} (₹${planInfo.price})`}
                      </span>
                      <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-on-primary-container pt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-secondary-container text-[14px]">
                          verified
                        </span>
                        14,200+ Enrolled
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-secondary-container text-[14px]">
                          cloud_download
                        </span>
                        Instant Cloud Link
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-secondary-container text-[14px]">
                          shield
                        </span>
                        Encrypted Checkout
                      </span>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
