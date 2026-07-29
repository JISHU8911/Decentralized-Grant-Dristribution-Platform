import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'TreasuryFlow Protocol | Decentralized Grant & Capital Infrastructure',
  description: 'Institutional-grade Decentralized Grant & Treasury Management Platform on Stellar Soroban featuring cross-contract escrow disbursements, role permissions, and real-time RPC event streaming.',
  keywords: ['Stellar', 'Soroban', 'Smart Contracts', 'Grant Platform', 'Decentralized Finance', 'Rust', 'XLM', 'TreasuryFlow'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
