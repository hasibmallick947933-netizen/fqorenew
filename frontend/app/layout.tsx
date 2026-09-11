import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'FQore | Institutional Business & Market Intelligence',
  description:
    'Institutional-grade educational platform deconstructing business models, equity research, valuation frameworks, price action, and downloadable financial models.',
  openGraph: {
    title: 'FQore | Business & Stock Market Intelligence',
    description: 'Learn Business. Understand Markets. Advance Your Edge.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark font-sans">
      <body className="min-h-screen flex flex-col bg-[#040711] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
