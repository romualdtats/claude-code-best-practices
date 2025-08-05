import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Killer Code - AI-Powered Programming Revolution',
    template: '%s | Killer Code'
  },
  description: '我学了一辈子的技能，被屠杀了，claude code 已经是远超人类 99% 程序员的编程能力了。Learn the killer techniques of AI-assisted programming with Claude Code.',
  keywords: 'Claude Code, AI Programming, Vibe Coding, AI Development, Programming Tools, Anthropic, Code Generation',
  authors: [{ name: 'Killer Code Team' }],
  creator: 'Killer Code',
  publisher: 'Killer Code',
  robots: 'index, follow',
  openGraph: {
    title: 'Killer Code - AI-Powered Programming Revolution',
    description: '我学了一辈子的技能，被屠杀了，claude code 已经是远超人类 99% 程序员的编程能力了。Learn the killer techniques of AI-assisted programming.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Killer Code',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Killer Code - AI-Powered Programming Revolution',
    description: '我学了一辈子的技能，被屠杀了，claude code 已经是远超人类 99% 程序员的编程能力了。Learn the killer techniques of AI-assisted programming.',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
