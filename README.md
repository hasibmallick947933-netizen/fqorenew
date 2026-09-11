# FQore — Trading & Business Education Platform

> **Core of Solutions &bull; Learn &bull; Plan &bull; Execute &bull; Build &bull; Scale**  
> *"Build Your Better Future — Practical Knowledge | Real Strategies | Lasting Growth"*

FQore is a full-stack educational and digital product platform engineered for mastering **Trading & Market Microstructure**, alongside **Business Strategies**, **E-Commerce Startups**, and **Financial Analysis**. 

Designed with a high-converting digital blueprint architecture inspired by GrowthCodesIn, elevated with **interactive 3D WebGL animations**, 3D perspective card physics, and a full-featured Admin CMS integrated with **Cloudinary** and **MongoDB Atlas**.

---

## Key Features

### 1. High-Converting Product & Academy Experience
* **3D Interactive WebGL Canvas**: Three.js candlestick chart simulation and financial order flow particle cloud responding to user scroll position.
* **3D Blueprint Mockup**: Perspective-tilted physical handbook mockup with holographic sheen and live page preview triggers.
* **Curriculum Syllabus Breakdown**: 6 core modules covering Trading Foundations, Price Action, 1% Risk Management, E-Commerce Startup Scaling (Zero to ₹10L/Mo), Corporate Moats, and the Downloadable Vault.
* **Interactive Blueprint Preview Reader**: In-browser document modal to preview excerpts of the official FQore Trading Blueprint PDF, candlestick cheat sheets, and Excel position sizing formulas.
* **Reality Check Comparison Grid**: "Retail Gambling vs. The FQore Institutional Edge".
* **Social Proof & Reviews**: Verified student and trader testimonials with rating breakdowns.
* **Sticky Bottom CTA Bar**: High-converting scroll-triggered purchase strip.

### 2. Admin Content Management System (`/admin`)
* **100% Dynamic — Zero Code Modification Required**: The administrator (`fqorein@gmail.com`) can create, edit, unpublish, and delete content directly from the web dashboard.
* **Direct Cloudinary Integration**: Upload PDFs, video masterclasses, images, and Excel spreadsheets (.xlsx, .csv) with automatic type recognition and Cloudinary storage.
* **Structured Data Support**: Dedicated fields for company analysis (tickers, moats, risks) and corporate case studies (problems, solutions, takeaways).
* **Category & User Management**: Organize content tracks and manage registered students.

### 3. Tech Stack & Architecture
* **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Three.js, Lucide Icons.
* **Backend**: Node.js, Express.js, REST API, Mongoose, JWT authentication, Helmet, Morgan.
* **Database**: MongoDB Atlas cloud cluster.
* **File Storage**: Cloudinary (Images, Videos, PDFs, Excel docs).
* **Payment/Checkout**: Razorpay integration with sandbox simulation mode.

---

## Getting Started Locally

### Prerequisites
* Node.js v18+
* npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5001`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

---

## Pre-Configured Admin Credentials
* **Email**: `fqorein@gmail.com`
* **Password**: `sunny005`
* **Admin Dashboard URL**: `http://localhost:3000/admin`

---

## Deployment Quick Links
For comprehensive instructions on deploying to **Render** and **Vercel**, refer to:
* [DEPLOYMENT.md](DEPLOYMENT.md)
