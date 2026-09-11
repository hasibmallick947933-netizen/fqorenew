'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Trading3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 8, 26);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 3, 50);
    goldLight.position.set(10, 15, 10);
    scene.add(goldLight);

    const greenLight = new THREE.PointLight(0x10b981, 3, 50);
    greenLight.position.set(-10, 10, 5);
    scene.add(greenLight);

    const blueLight = new THREE.PointLight(0x06b6d4, 2, 40);
    blueLight.position.set(0, -5, 15);
    scene.add(blueLight);

    // 3. Create 3D Candlesticks Group
    const candlesGroup = new THREE.Group();
    const candleCount = 28;
    const candleSpacing = 1.4;
    const startX = -((candleCount * candleSpacing) / 2);

    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x059669,
      emissiveIntensity: 0.35,
    });

    const redMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xdc2626,
      emissiveIntensity: 0.25,
    });

    const wickMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });

    // Generate realistic upward trend with oscillations
    let currentPrice = 0;
    const candles: { mesh: THREE.Group; basePrice: number; speed: number }[] = [];

    for (let i = 0; i < candleCount; i++) {
      const isBullish = Math.random() > 0.4 || i < 4;
      const bodyHeight = 0.8 + Math.random() * 2.5;
      const wickHigh = bodyHeight + Math.random() * 1.5;
      const wickLow = bodyHeight + Math.random() * 1.5;

      const delta = isBullish ? (Math.random() * 0.8) : -(Math.random() * 0.5);
      currentPrice += delta;

      const singleCandle = new THREE.Group();

      // Body Box
      const bodyGeo = new THREE.BoxGeometry(0.75, bodyHeight, 0.75);
      const bodyMesh = new THREE.Mesh(bodyGeo, isBullish ? greenMat : redMat);
      bodyMesh.position.y = currentPrice;
      singleCandle.add(bodyMesh);

      // Upper & Lower Wick (Cylinder)
      const totalWickHeight = bodyHeight + wickHigh + wickLow;
      const wickGeo = new THREE.CylinderGeometry(0.04, 0.04, totalWickHeight, 8);
      const wickMesh = new THREE.Mesh(wickGeo, wickMat);
      wickMesh.position.y = currentPrice + (wickHigh - wickLow) * 0.25;
      singleCandle.add(wickMesh);

      singleCandle.position.x = startX + i * candleSpacing;
      singleCandle.position.z = (Math.random() - 0.5) * 2;

      candlesGroup.add(singleCandle);
      candles.push({
        mesh: singleCandle,
        basePrice: currentPrice,
        speed: 0.002 + Math.random() * 0.003,
      });
    }

    scene.add(candlesGroup);

    // 4. 3D Glowing Particle Cloud
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      // Mix gold and emerald colors
      if (Math.random() > 0.5) {
        colors[i * 3] = 0.96; // R (Gold)
        colors[i * 3 + 1] = 0.62; // G
        colors[i * 3 + 2] = 0.07; // B
      } else {
        colors[i * 3] = 0.06; // R (Emerald)
        colors[i * 3 + 1] = 0.72; // G
        colors[i * 3 + 2] = 0.5; // B
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. 3D Order Flow Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0xf59e0b, 0x1e293b);
    gridHelper.position.y = -8;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 6. Scroll & Mouse Tracking
    let scrollProgress = 0;
    let targetCameraY = 8;
    let targetCameraZ = 26;
    let targetRotationX = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1000);
      scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      // Camera swoops through 3D charts on scroll
      targetCameraY = 8 - scrollProgress * 10;
      targetCameraZ = 26 - scrollProgress * 12;
      targetRotationX = scrollProgress * 0.35;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.y += (targetCameraY + mouseY * 1.5 - camera.position.y) * 0.05;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
      camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;

      // Gentle floating oscillation for candles
      candlesGroup.rotation.y = Math.sin(elapsedTime * 0.25) * 0.08 + scrollProgress * 0.6;
      candlesGroup.position.y = Math.cos(elapsedTime * 0.5) * 0.3;

      // Slow particle rotation
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

      // Subtle light oscillation
      goldLight.position.x = 10 + Math.sin(elapsedTime * 0.8) * 4;
      greenLight.position.x = -10 + Math.cos(elapsedTime * 0.8) * 4;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      aria-hidden="true"
    />
  );
};
